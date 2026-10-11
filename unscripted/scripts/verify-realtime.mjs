/**
 * 验证 Supabase Realtime 是否真的会把新报名推给筹备组。
 *
 * 做的事：用筹备组身份订阅 participants 的变化 → 从另一个"会话"插入一行
 *        → 看 WebSocket 上收不收得到推送。
 *
 * 用法：node scripts/verify-realtime.mjs
 * 这是临时验证脚本，验完可以删。
 */

const URL_BASE = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_KEY;
const EMAIL = process.env.STAFF_EMAIL;
const PASSWORD = process.env.STAFF_PASSWORD;

if (!URL_BASE || !KEY || !EMAIL || !PASSWORD) {
  console.error("缺少环境变量：SUPABASE_URL / SUPABASE_KEY / STAFF_EMAIL / STAFF_PASSWORD");
  process.exit(1);
}

const rest = (path, init = {}) =>
  fetch(`${URL_BASE}${path}`, {
    ...init,
    headers: {
      apikey: KEY,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

// ---------- 1. 拿筹备组的 token ----------
const authRes = await rest("/auth/v1/token?grant_type=password", {
  method: "POST",
  body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
});
const auth = await authRes.json();
if (!auth.access_token) {
  console.error("登录失败：", auth.error_code, auth.msg);
  process.exit(1);
}
const token = auth.access_token;
console.log("✓ 已取得筹备组 token");

// ---------- 2. 连 Realtime ----------
const wsUrl = `${URL_BASE.replace("https://", "wss://")}/realtime/v1/websocket?apikey=${KEY}&vsn=1.0.0`;
const ws = new WebSocket(wsUrl);

const TOPIC = "realtime:verify";
let joined = false;
let received = null;

const done = (code) => {
  try {
    ws.close();
  } catch {
    /* 忽略 */
  }
  process.exit(code);
};

ws.addEventListener("open", () => {
  console.log("✓ WebSocket 已连接，发送 join…");
  ws.send(
    JSON.stringify({
      topic: TOPIC,
      event: "phx_join",
      payload: {
        config: {
          postgres_changes: [
            { event: "INSERT", schema: "public", table: "participants" },
          ],
        },
        access_token: token,
      },
      ref: "1",
    })
  );
});

ws.addEventListener("message", async (event) => {
  let msg;
  try {
    msg = JSON.parse(event.data);
  } catch {
    return;
  }

  if (msg.event === "phx_reply" && msg.ref === "1") {
    console.log("  join 应答:", JSON.stringify(msg.payload));
    if (msg.payload?.status !== "ok") {
      console.error("✗ join 失败：", JSON.stringify(msg.payload));
      done(1);
    }
    joined = true;
    console.log("✓ 已订阅 participants 的 INSERT");

    // ---------- 3. 模拟另一个访客提交报名 ----------
    const marker = `【实时验证-可删】${Date.now()}`;
    console.log(`→ 从另一个会话插入一行：${marker}`);
    const insertRes = await rest("/rest/v1/participants", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        name: marker,
        contact: "realtime-verify",
        direction: "Realtime 验证用，可删",
      }),
    });
    console.log(`  插入返回 HTTP ${insertRes.status}`);
    return;
  }

  if (msg.event === "postgres_changes") {
    const data = msg.payload?.data ?? {};
    // Supabase Realtime 用 record / old_record，不是 new / old
    const row = data.record ?? {};
    received = row;
    console.log("✓ 收到实时推送！");
    console.log("  表:", data.table, "| 事件:", data.type);
    console.log("  新数据:", JSON.stringify({ name: row.name, contact: row.contact }));
    done(0);
  }
});

ws.addEventListener("error", (e) => {
  console.error("✗ WebSocket 出错：", e.message ?? e);
  done(1);
});

// 超时保护
setTimeout(() => {
  if (!joined) {
    console.error("✗ 15 秒内没有 join 成功");
  } else if (!received) {
    console.error("✗ 已订阅但 15 秒内没收到推送 —— Realtime 可能没生效");
  }
  done(1);
}, 15000);
