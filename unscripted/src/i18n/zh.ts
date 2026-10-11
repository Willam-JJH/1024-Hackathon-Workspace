/**
 * 中文词典 —— 这是基准。
 *
 * en.ts 的类型来自这里（`typeof zh`），所以两边结构必须完全一致：
 * 英文漏了哪个键、多了哪个键、类型不对，`tsc` 都会直接报错。
 * 这能防住最常见的坑 —— "切到英文之后某几处还显示中文"。
 *
 * 句子里的 **双星号** 表示要高亮的部分，渲染时由 <RichText> 解析。
 * 需要插变量时写 {name}，配合 fill() 使用。
 * 需要强制换行时写 \n，RichText 会把它当真正的换行。
 */

const zh = {
  /* ------------------------------------------------------ 品牌与标语 */
  brand: {
    tagline: "做自己的项目，讲别人的作品。",
  },

  /* ------------------------------------------------------------ 通用 */
  common: {
    tbd: "待确认",
    date: "日期",
    venue: "场地",
    deadline: "报名截止",
    contact: "咨询",
    loading: "加载中…",
    refresh: "重新加载",
    backHome: "回到主页",
  },

  /* ------------------------------------------------------------ 顶层导航 */
  nav: {
    home: "主页",
    register: "报名",
    submit: "参赛",
    projects: "作品",
    openMenu: "打开菜单",
    switchToZh: "切换到中文",
    switchToEn: "切换到英文",
  },

  /* ------------------------------------------------------------ 页脚 */
  footer: {
    sections: "板块",
    info: "活动信息",
    copyright: "© {year} {parent} · {name}",
    motto: "做自己的项目，讲别人的作品",
  },

  /* ------------------------------------------------------------ 首页 */
  home: {
    hero: {
      kicker: "%%AI%% 辅助创作",
      desc: "带一个想法来，或者把做了一半的项目继续做下去。用 %%AI%% 辅助制作，推进你自己选定的项目。",
      ctaRegister: "我要报名",
      ctaSubmit: "提交作品",
    },

    s01: {
      title: "选择一个问题，做出可能的解法",
      p1: "Unscripted 是 **{parent}** 中的 %%AI%% 辅助创作与交流活动。参加者自选一个在意、值得做成产品的问题，做出解决方案，让别人实际体验，再用 pitch 说明它为什么可能奏效。",
      p2: "问题可以来自**学习、个人生活、社团或校园社区**，范围可以很小，意义由参加者自己说明。",
      p3: "参加者会经历从发现问题、形成想法到制作和表达的完整过程；制作中遇到的困难、试用者的理解和反馈，也一并带进讨论。",
      cardKicker: "WHY UNSCRIPTED",
      cardText:
        "不是照着题目做作业，而是你自己选一个问题，\n再证明它值得被解决。",
    },

    s02: {
      title: "个人、团队和社团都可以参加",
      cards: [
        {
          label: "从想法开始",
          body: "有想试的小工具或没做完的游戏，都可以带来。尚未确定方向的，可参考筹备组提供的可选题目。",
        },
        {
          label: "继续已有项目",
          body: "手里已经有 CS Project、个人项目或未完成作品的，可以带着原有工作继续完善。",
        },
        {
          label: "社团组队",
          body: "社团可以围绕自身关注的问题组织成员参加，把一个方向做成可体验的作品。",
        },
      ],
      footnote:
        "同一项目中可以包含问题梳理、编程、设计、内容制作、试用和展示等工作，**不同兴趣和技能的同学可以共同完成作品**。",
    },

    s03: {
      title: "%%AI%% 是工具，但作品得你自己讲明白",
      points: [
        "%%AI%% 可以协助构思、编程、制作内容和测试，把想法做成可用的作品。",
        "最终产品不必内置 %%AI%% 模型，也不要求完全零代码。",
        "但参加者需要理解自己做的东西，并能解释它如何回应所选的问题。",
        "成果可以是网站、小工具、小游戏、交互作品，或其他能够演示关键过程的原型。",
        "作品可以处于早期阶段，重点是让别人能够尝试其中的核心想法，并据此展开讨论。",
      ],
      exampleKicker: "举个例子",
      exampleBody:
        "一个社团想减少寻找共同活动时间的麻烦，可以尝试做一个**收集可用时段、呈现重合时间**的小工具。现场让其他同学输入时间、查看结果，再说明这个方案能帮助解决哪一步、目前仍有哪些限制。",
      exampleNote: "这个例子只展示从问题到作品的关系，选题由参加者自己决定。",
    },

    s04: {
      title: "一个周末，两个部分",
      day1Title: "周六 · 集中制作",
      day1: [
        "到场登记与活动说明",
        "自由制作，筹备组提供工具帮助与现场支持",
        "整理作品入口、必要操作说明",
        "确认次日体验所需的设备与材料，完成人员与物品交接",
      ],
      day2Title: "周日 · 交换与评议",
      day2: [
        { t: "抽签交换", d: "每队接手另一队的作品，取得必要的操作说明。" },
        { t: "独立体验", d: "接手者亲手尝试作品，形成自己的理解。" },
        {
          t: "接手方介绍",
          d: "介绍作品能做什么、哪里有意思、自己会如何使用 —— 无需复述作者原意。",
        },
        {
          t: "作者补充",
          d: "补充项目背景、实现过程和制作中遇到的问题，回应交流中的疑问。",
        },
        {
          t: "评委评议",
          d: "结合试用、介绍和作者回应，进行提问、讨论与反馈。",
        },
      ],
      note: "具体日期、时段与场地以学校确认为准。评分与奖项安排另行讨论，本页不作承诺。",
    },

    s05: {
      title: "用 pitch 说明它为什么可能奏效",
      intro:
        "Pitch 把演示与说明结合起来，让其他参加者和老师理解问题、思路和当前成果。可围绕四个方面组织：",
      cards: [
        { n: "01", t: "问题", d: "你关注什么问题，谁可能遇到它，为什么认为它值得解决。" },
        { n: "02", t: "方案", d: "你做了什么、如何使用；用作品展示关键过程。" },
        {
          n: "03",
          t: "理由",
          d: "哪些功能、演示结果或实际体验支持这个方案可能有用，别人的试用又带来了什么反馈。",
        },
        {
          n: "04",
          t: "后续",
          d: "当前版本还有哪些未完成之处，下一步希望继续改进或尝试什么。",
        },
      ],
      note: "表达方式可以结合现场演示、图示、短视频或口头讲述。",
    },

    s06: {
      title: "Unscripted：没有预先写好的剧本",
      p1: "参加者自选问题、自行探索解法；作品进入他人体验后，会产生**创作者没有预先安排的理解和反馈**。",
      p2: "活动为这些发现留出空间，让创作与交流共同推动项目发展。",
    },

    cta: {
      title: "把一个周末，留给你自己的项目",
      body: "只有一个想法也可以报名，已有项目可以继续做。请写下创作方向、参加成员和两天可来的时段，设备或工具需求一并告知。",
    },
  },

  /* ------------------------------------------------ 存进数据库的那几组值 */
  /* 键是稳定的英文标识，值是给人看的显示名。数据库里存的是键。 */
  enums: {
    participation: {
      individual: "个人",
      team: "团队",
      club: "社团",
    },
    participationDesc: {
      individual: "自己一个人做一个项目，也可以带着已有的作品来。",
      team: "和几个同学一起，报名时写清团队名称和大致人数。",
      club: "社团组织成员围绕自身方向一起做，后续可另谈协办。",
    },
    wallVisibility: {
      named: "公开 · 署名",
      group_only: "公开 · 只显示团体名",
      anonymous: "公开 · 不署名",
      hidden: "不上墙",
    },
    volunteerRole: {
      reception: "到场接待",
      swap: "作品交换与展示",
      setup: "布场与收场",
      tools: "工具帮助",
    },
    demoFormat: {
      live: "现场演示",
      diagram: "图示",
      video: "短视频",
      spoken: "口头讲述",
    },
  },

  /* ------------------------------------------------------------ 表单 */
  forms: {
    shared: {
      name: "姓名",
      contact: "联系方式",
      contactHint: "微信号或手机号",
      email: "邮箱",
      optional: "选填",
      days: "两天能到场的时段",
      daysHint: "两天都可选，按实际情况勾",
      day1: "周六 · 集中制作",
      day2: "周日 · 交换与评议",
      timeNote: "时段补充说明",
      timeNotePlaceholder: "比如周六只能下午到。",
      more: "其他想告诉我们的",
      errName: "请填写姓名",
      errContact: "请留一个能联系到你的方式",
      errDays: "至少选一天能到场的时段",
    },

    participant: {
      namePlaceholder: "你的名字",
      contactPlaceholder: "方便我们联系你",
      emailPlaceholder: "用于接收活动通知",
      identity: "以什么身份参加",
      groupNameTeam: "团队名称",
      groupNameClub: "社团名称",
      groupNameTeamPlaceholder: "你们的队名",
      groupNameClubPlaceholder: "你的社团",
      memberCount: "大致人数",
      memberCountPlaceholder: "包括你自己",
      direction: "创作方向或已有内容",
      directionHint: "可以只是几句话",
      directionPlaceholder: "比如：想做一个小工具，帮社团找大家都有空的时间。",
      hasExisting: "我是带着已有项目或未完成的作品来的",
      existingDetail: "已有的是什么",
      existingDetailPlaceholder: "项目做到哪一步了，现在缺什么。",
      equipment: "设备或工具需求",
      equipmentPlaceholder:
        "需要借用电脑、网络、投屏，或者希望提前拿到某个工具的权限。",
      errDirection: "写一句你的创作方向或已有的内容",
      errGroupName: "请填写团队或社团名称",
      errExistingDetail: "简单说一下已有的是什么",
    },

    volunteer: {
      roles: "愿意做哪些工作",
      rolesHint: "可多选",
      experience: "熟悉的工具或相关经验",
      experiencePlaceholder: "比如用过某种编程语言、做过视频、熟悉投影设备。",
      submit: "提交志愿者报名",
      errRoles: "至少选一项你愿意做的工作",
    },

    project: {
      identityLegend: "先确认这份作品是你交的",
      identityBody:
        "填你报名时用的姓名和联系方式，我们会去报名记录里核对。对不上就提交不了 —— 这样能防止别人往你的作品上乱加东西。",
      namePlaceholder: "和报名时填的一致",
      contactHint: "报名时填的那个",
      contactPlaceholder: "微信号或手机号",
      errContact: "填报名时用的那个联系方式，用来确认这份作品是你交的",

      title: "项目名",
      titlePlaceholder: "给你的作品起个名字",
      errTitle: "请填写项目名",
      summary: "一句话简介",
      summaryPlaceholder: "比如：帮社团找大家都有空的时间。",
      errSummary: "用一句话说清这个作品是做什么的",

      problem: "你关注的问题",
      problemPlaceholder: "什么问题，谁可能遇到它，为什么值得解决。",
      groupName: "团队／社团",
      groupNamePlaceholder: "个人参加可以留空",
      members: "参与成员",
      membersPlaceholder: "用逗号分开",
      direction: "创作方向",
      directionPlaceholder: "来自学习、个人生活、社团还是校园社区",

      link: "作品链接或入口",
      linkHint: "选填，但强烈建议填",
      instructions: "必要操作说明",
      instructionsHint: "周日会交给另一队，他们要能自己打开",
      instructionsPlaceholder: "怎么打开、需要装什么、第一步做什么、哪里容易卡住。",
      equipment: "需要的设备或材料",
      equipmentPlaceholder: "比如需要一台能联网的电脑、要投影、需要音箱。",
      demo: "打算怎么展示",

      files: "作品文件",
      filesHint: "选填 · 单个文件不超过 50MB · 图片会自动压缩",
      dropPre: "把文件拖到这里，或者",
      dropAction: "点击选择",
      dropNote:
        "实体作品拍照片、本地作品录屏截图都可以。视频和特别大的文件建议直接放外链。",
      remove: "移除",
      errFiles: "这些文件超过 50MB，没有加入：{names}。大文件建议改成放外链。",

      visibilityLegend: "这件作品要不要公开",
      visibilityBody:
        "作品墙是公开网页，任何人都能看。**这一项必须选，没有默认值**，选「不上墙」作品就只在周日现场使用。不管选哪个，你的联系方式都不会出现在作品墙上。",
      errVisibility: "请选一项",
      visibilityOptions: {
        named: { label: "公开 + 署名", desc: "放上作品墙，显示署名和成员名单。" },
        group_only: {
          label: "公开 + 只显示社团／团队名",
          desc: "放上作品墙，只挂着团体名，不列成员姓名。",
        },
        anonymous: { label: "公开 + 不署名", desc: "放上作品墙，但署名和成员名单都不显示。" },
        hidden: { label: "不上墙", desc: "作品只在周日现场使用，不放到公开网页上。" },
      },

      submit: "提交作品",
      progressVerify: "正在核对报名记录…",
      progressCompress: "正在压缩并上传 {count} 个文件…",
      progressUpload: "正在上传 {count} 个文件（约 {size}MB）…",
      progressUploading: "正在上传…… {done}/{total}",
    },
  },

  /* ------------------------------------------------------------ 各页面 */
  pages: {
    register: {
      index: "[ 02 ]",
      title: "报名",
      intro:
        "只有一个想法也可以报名，已有项目可以继续做。请写下创作方向、参加成员和两天可来的时段，设备或工具需求一并告知。",
      roles: {
        participant: {
          label: "我要参加",
          blurb: "带着想法或已有项目来做作品，周日交换体验、上台 pitch。",
        },
        volunteer: {
          label: "我要做志愿者",
          blurb: "到场接待、准备作品交换、布场收场、工具帮助，按你能来的时段排班。",
        },
      },
      privacy:
        "你填写的信息只有筹备组成员登录后可以查看，不会公开展示。活动日期、场地与时段以学校确认为准，确定后会通过你留下的联系方式通知。",
    },

    submit: {
      index: "[ 03 ]",
      title: "参赛",
      intro:
        "请写清作品入口、操作说明和材料需求。周日这件作品会交给另一队，他们需要自行打开、独立体验，再按自己的理解介绍。",
      checklistTitle: "提交前先看一眼",
      checklist: [
        "没在「报名」板块报过名的提交不了 —— 我们要先知道你是谁，才能把作品算在你头上。",
        "作品可以还在早期阶段，重点是让别人能试到核心想法。",
        "用同一个项目名再交一次，会覆盖上一次的内容，不会产生两条记录。",
      ],
    },

    projects: {
      index: "[ 04 ]",
      title: "作品墙",
      intro:
        "本届 Unscripted 已提交的作品。作品可以还在早期阶段，重点是让别人能试到核心想法。",
      count: "共 {count} 件",
      refresh: "刷新",
      empty: "还没有作品提交。",
      emptyCta: "提交第一件作品",
      noImage: "NO IMAGE",
      uncredited: "未署名",
      problemLabel: "关注的问题",
      directionLabel: "方向",
      membersLabel: "成员",
      open: "打开作品",
      imageAlt: "查看第 {n} 张图",
      errLoad: "读取失败",
      footnote:
        "署名由作者在提交时自己选择，没同意的作品只展示作品本身。作品墙上不出现任何联系方式。",
    },
  },

  /* ------------------------------------------------------ 筹备组看板 */
  staff: {
    signIn: {
      badge: "STAFF ONLY",
      title: "筹备组登录",
      intro: "报名信息包含学生个人信息，只有筹备组成员可以查看。",
      email: "邮箱",
      password: "密码",
      submit: "登录",
      submitting: "登录中…",
      errCredentials: "邮箱或密码不对。",
      accountNote:
        "账号由技术负责人（William）在 Supabase 后台创建。忘记密码或需要新账号，找他。",
    },

    index: "[ STAFF ]",
    title: "筹备组看板",
    subtitle: "报名实时同步，有人提交这里会自动刷新。",
    lastSync: "最近更新 {time}",
    reload: "重新加载",
    exportCsv: "导出 CSV",
    signOut: "退出",

    tabs: {
      participants: "参加者",
      volunteers: "志愿者",
      projects: "作品",
    },
    empty: {
      participants: "还没有人报名。",
      volunteers: "还没有志愿者报名。",
      projects: "还没有作品提交。",
    },

    /** CSV 表头和列名共用这些文案 */
    columns: {
      createdAt: "提交时间",
      name: "姓名",
      contact: "联系方式",
      email: "邮箱",
      participationType: "身份",
      groupName: "团队／社团",
      memberCount: "人数",
      direction: "创作方向／已有内容",
      hasExisting: "已有项目",
      day1: "周六",
      day2: "周日",
      timeNote: "时段说明",
      equipmentNeeds: "设备需求",
      notes: "备注",
      roles: "岗位意愿",
      experience: "经验",
      projectTitle: "项目名",
      projectSummary: "一句话简介",
      problem: "关注的问题",
      members: "成员",
      link: "作品入口",
      instructions: "操作说明",
      demoFormat: "演示形式",
      wallVisibility: "作品墙",
      files: "文件",
    },

    bool: {
      yes: "是",
      no: "否",
      canAttend: "可到",
      cannotAttend: "不可",
    },
    notStated: "未表态",
    hasExistingPrefix: "是：",

    footer: "当前查看的是「{label}」，共 {count} 条。导出 CSV 会把当前这一栏的全部字段带上。",
    allowlistNote:
      "只有被加进筹备组名单的账号能看到数据。如果你能登录但三栏都是空的，说明账号还没加入名单 —— 让 William 在 Supabase 的 SQL Editor 里执行 select public.add_staff('你的邮箱');",

    notConfiguredTitle: "筹备组看板",
    notConfiguredBody:
      "数据库还没接上。先配置 .env.local，再执行 supabase/migrations/0001_init.sql。",
  },

  /* ------------------------------------------------------------ 报错文案 */
  errors: {
    notRegistered:
      "没有找到对应的报名记录。请确认姓名和联系方式和你报名时填的完全一致；如果还没报名，先去「报名」板块报个名。",
    notOwner: "这份作品不是你提交的，无法修改。",
    nameOrContactRequired: "请填写姓名和报名时用的联系方式，用来确认作品归属。",
    titleOrSummaryRequired: "项目名和一句话简介都要填。",
    visibilityRequired: "请选择作品要不要公开、要不要署名。",
    permissionDenied:
      "没有读取权限。多半是登录状态失效了，请退出后重新登录；如果重新登录后仍然如此，说明这个账号还没被加入筹备组名单。",
    policyRejected: "提交被数据库策略拒绝，请检查填写内容是否完整。",
    duplicateFile: "同名文件已经传过了，换个文件名再试。",
    fileTooLarge: "文件超过 50MB 上限，大文件建议改成放外链。",
    storageMissing: "存储还没初始化，请先在 Supabase 里执行建表 SQL。",
    network: "网络连接失败，请检查网络后重试。",
    unknown: "提交失败，请稍后重试。",
  },

  /* ------------------------------------------------------------ 数据库未连接 */
  notConfigured: {
    badge: "NOT CONNECTED",
    body: "数据库还没接上，表单现在提交不了。把项目根目录的 .env.example 复制成 .env.local，填好 Supabase 的 URL 和 anon key，重启开发服务器即可。",
  },

  /* ------------------------------------------------------------ 提交反馈 */
  submitBlock: {
    badge: "SUBMITTED",
    successTitle: "提交成功，我们已经收到了。",
    successBody: "筹备组会跟进你的信息。活动日期、场地确定后会通知你。",
    again: "再填一份",
    submitting: "提交中…",
    defaultLabel: "提交报名",
  },

  /* ------------------------------------------------------------ 404 */
  notFound: {
    code: "ERROR 404",
    title: "这个页面没有剧本",
    body: "你访问的地址不存在，或者还没开工。",
  },
};

export type Dict = typeof zh;
export default zh;
