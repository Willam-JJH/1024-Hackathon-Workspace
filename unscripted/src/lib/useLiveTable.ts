import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "./supabase";

export type TableName = "participants" | "volunteers" | "projects";

interface UseLiveTableResult<T> {
  rows: T[];
  loading: boolean;
  error: string;
  /** 最近一次收到实时推送的时间戳，用于给界面一个"刚刚更新"的提示 */
  lastSyncAt: number | null;
  refresh: () => Promise<void>;
}

/**
 * 读一张表，并订阅它的实时变更。
 *
 * 有人提交报名时，筹备组的页面会自动刷新，不用手动点。
 * 任何变更都触发一次重新拉取 —— 比在客户端增量合并更不容易出错，
 * 这个量级（几十到几百行）完全够用。
 */
export function useLiveTable<T>(
  table: TableName,
  fetcher: () => Promise<T[]>
): UseLiveTableResult<T> {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastSyncAt, setLastSyncAt] = useState<number | null>(null);

  // 用 ref 存 fetcher，避免调用方传入新函数引用时反复重建订阅
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const refresh = useCallback(async () => {
    try {
      const data = await fetcherRef.current();
      setRows(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "读取失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel(`staff-${table}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => {
          setLastSyncAt(Date.now());
          void refresh();
        }
      )
      .subscribe();

    return () => {
      void supabase?.removeChannel(channel);
    };
  }, [table, refresh]);

  return { rows, loading, error, lastSyncAt, refresh };
}
