import type { Dict } from "./zh";

/**
 * English dictionary.
 *
 * Typed as `Dict`, which comes from zh.ts — so a missing key, an extra key,
 * or a wrong type is a compile error, not something you discover by clicking
 * around the site in English.
 *
 * **double asterisks** mark the highlighted part of a sentence; <RichText>
 * renders them. {braces} are filled in by fill(). \n forces a line break.
 */
const en: Dict = {
  /* ------------------------------------------------------------- brand */
  brand: {
    tagline: "Build your own project. Present someone else's.",
    summary:
      "An AI-assisted making event within 1024 Challenge. Bring an idea, or pick up the project you never finished.",
  },

  /* ------------------------------------------------------------- common */
  common: {
    tbd: "To be confirmed",
    date: "Date",
    venue: "Venue",
    deadline: "Registration closes",
    contact: "Contact",
    loading: "Loading…",
    refresh: "Reload",
    backHome: "Back to home",
  },

  /* ---------------------------------------------------------------- nav */
  nav: {
    home: "Home",
    register: "Sign up",
    submit: "Submit",
    projects: "Gallery",
    openMenu: "Open menu",
    switchToZh: "Switch to Chinese",
    switchToEn: "Switch to English",
  },

  /* ------------------------------------------------------------- footer */
  footer: {
    sections: "Sections",
    info: "Event details",
    copyright: "© {year} {parent} · {name}",
    motto: "Build your own project. Present someone else's.",
  },

  /* --------------------------------------------------------------- home */
  home: {
    hero: {
      kicker: "%%AI%%-assisted making",
      desc: "Bring an idea, or take the project you never finished and keep going. Use AI to build it, and push your own project forward.",
      ctaRegister: "Sign up",
      ctaSubmit: "Submit work",
    },

    s01: {
      title: "Pick a problem. Build a possible answer.",
      p1: "Unscripted is an AI-assisted making and exchange event within **{parent}**. You choose a problem you care about and think is worth turning into a product, build a possible solution, let other people try it, then pitch why it might work.",
      p2: "Problems can come from **study, personal life, a club, or campus life**. They can be small. You decide what makes yours worth solving.",
      p3: "The event is about the whole arc — noticing a problem, forming an idea, making it, and explaining it — and bringing the difficulties you hit, along with what users understood and fed back, into the conversation.",
      cardKicker: "WHY UNSCRIPTED",
      cardText:
        "Not homework set by someone else.\nYou pick the problem, then make the case that it matters.",
    },

    s02: {
      title: "Individuals, teams, and clubs are all welcome",
      cards: [
        {
          label: "Start from an idea",
          body: "A small tool you've wanted to try, or a game you never finished — bring it. If you don't have a direction yet, you can choose from the prompts the organising team has put together.",
        },
        {
          label: "Continue something already started",
          body: "If you already have a CS project, a personal project, or something unfinished, bring it and keep working on it.",
        },
        {
          label: "Come as a club",
          body: "A club can gather its members around a problem it cares about and turn that direction into something people can try.",
        },
      ],
      footnote:
        "One project can involve working out the problem, coding, design, making content, testing, and presenting — **students with different interests and skills can build it together**.",
    },

    s03: {
      title: "AI is a tool — but you have to explain the work yourself",
      points: [
        "AI can help with ideation, coding, making content, and testing — it helps you get an idea into a working state.",
        "Your final product doesn't have to contain an AI model, and it doesn't have to be entirely code-free.",
        "You need to understand what you made, and be able to explain how it answers the problem you chose.",
        "It can be a website, a small tool, a game, an interactive piece, or any other prototype that shows the key part working.",
        "It can be early and rough. What matters is that other people can try the core idea and talk about it.",
      ],
      exampleKicker: "For example",
      exampleBody:
        "A club wants to make it less painful to find a time everyone is free. They could build a small tool that **collects available slots and shows where they overlap**. At the event, other students enter their times and see the result; the team then explains which part of the problem this solves, and what it still doesn't.",
      exampleNote:
        "The example only shows how a problem turns into a project. You choose your own.",
    },

    s04: {
      title: "One weekend, two halves",
      day1Title: "Saturday · Make",
      day1: [
        "Arrive, register, and hear how the weekend works",
        "Build freely, with tools and help from the organising team on hand",
        "Get your project's entry point and instructions in order",
        "Confirm the equipment and materials you'll need tomorrow, and hand over people and things",
      ],
      day2Title: "Sunday · Exchange and discuss",
      day2: [
        { t: "Draw lots", d: "Each team takes on another team's project and gets the instructions it needs." },
        { t: "Try it first-hand", d: "The receiving team uses the work themselves and forms their own understanding." },
        {
          t: "They present it",
          d: "They explain what it does, what's interesting, and how they'd use it — no need to restate the author's intent.",
        },
        {
          t: "The authors respond",
          d: "They add the background, how it was built, what went wrong along the way, and answer questions.",
        },
        {
          t: "Judges respond",
          d: "Questions, discussion, and feedback based on the trial, the presentation, and the authors' answers.",
        },
      ],
      note: "Dates, times, and venue are subject to confirmation by the school. Scoring and awards are still being discussed — nothing on this page is a commitment.",
    },

    s05: {
      title: "Pitch why it might work",
      intro:
        "A pitch pairs a demo with an explanation, so other participants and teachers can follow the problem, the approach, and where you have got to. Four things to cover:",
      cards: [
        { n: "01", t: "Problem", d: "What you care about, who runs into it, and why you think it's worth solving." },
        { n: "02", t: "Approach", d: "What you made and how to use it. Show the key part working." },
        {
          n: "03",
          t: "Evidence",
          d: "Which features, results, or hands-on experiences suggest this could work — and what other people found when they tried it.",
        },
        {
          n: "04",
          t: "Next",
          d: "What's unfinished in this version, and what you'd improve or try next.",
        },
      ],
      note: "You can present with a live demo, diagrams, a short video, or just by talking it through.",
    },

    s06: {
      title: "Unscripted: no script written in advance",
      p1: "You choose the problem and work out your own approach. And once your work is in someone else's hands, it produces **understandings and reactions you didn't plan for**.",
      p2: "The event leaves room for those discoveries, so that making and talking move the project forward together.",
    },

    cta: {
      title: "Give a weekend to your own project",
      body: "An idea on its own is enough to sign up, and an unfinished project can carry on. Write down your direction, who's taking part, which of the two days you can make, and any equipment or tools you need.",
    },
  },

  /* ------------------------------------------- values stored in the database */
  /* Keys are stable identifiers; the values are display names. The database
     stores the keys, so switching language never rewrites stored data. */
  enums: {
    participation: {
      individual: "Individual",
      team: "Team",
      club: "Club",
    },
    participationDesc: {
      individual: "One person, one project. You can also bring something you've already made.",
      team: "A few classmates together. Give your team a name and a rough headcount when you sign up.",
      club: "A club organises its members around a direction it cares about. Co-organising can be discussed separately.",
    },
    wallVisibility: {
      named: "Public · credited",
      group_only: "Public · club name only",
      anonymous: "Public · no credit",
      hidden: "Not published",
    },
    volunteerRole: {
      reception: "Front desk",
      swap: "Project swap & showcase",
      setup: "Setup & pack-down",
      tools: "Tool support",
    },
    demoFormat: {
      live: "Live demo",
      diagram: "Diagrams",
      video: "Short video",
      spoken: "Talk it through",
    },
  },

  /* -------------------------------------------------------------- forms */
  forms: {
    shared: {
      name: "Name",
      contact: "Contact",
      contactHint: "WeChat ID or phone number",
      email: "Email",
      optional: "Optional",
      days: "Which days you can attend",
      daysHint: "Tick whichever apply — both is fine",
      day1: "Saturday · Make",
      day2: "Sunday · Exchange and discuss",
      timeNote: "Anything to add about timing",
      timeNotePlaceholder: "E.g. I can only make Saturday afternoon.",
      more: "Anything else we should know",
      errName: "Please enter your name",
      errContact: "Please leave a way for us to reach you",
      errDays: "Pick at least one day you can attend",
    },

    participant: {
      namePlaceholder: "Your name",
      contactPlaceholder: "So we can get in touch",
      emailPlaceholder: "For event updates",
      identity: "How are you taking part?",
      groupNameTeam: "Team name",
      groupNameClub: "Club name",
      groupNameTeamPlaceholder: "Your team's name",
      groupNameClubPlaceholder: "Your club",
      memberCount: "Rough headcount",
      memberCountPlaceholder: "Including you",
      direction: "Your direction, or what you already have",
      directionHint: "A few sentences is plenty",
      directionPlaceholder:
        "E.g. a small tool that helps a club find a time everyone is free.",
      hasExisting: "I'm bringing a project I've already started",
      existingDetail: "What you already have",
      existingDetailPlaceholder: "How far along it is, and what's still missing.",
      equipment: "Equipment or tool needs",
      equipmentPlaceholder:
        "A laptop to borrow, wifi, a projector — or early access to a particular tool.",
      errDirection: "Say a sentence about your direction or what you already have",
      errGroupName: "Please enter a team or club name",
      errExistingDetail: "Tell us briefly what you already have",
    },

    volunteer: {
      roles: "What would you like to help with?",
      rolesHint: "Choose any",
      experience: "Tools you know, or relevant experience",
      experiencePlaceholder:
        "E.g. you've used a programming language, edited video, or run a projector before.",
      submit: "Submit volunteer sign-up",
      errRoles: "Pick at least one thing you'd like to do",
    },

    project: {
      identityLegend: "First, confirm this project is yours",
      identityBody:
        "Enter the name and contact details you used when you signed up — we check them against the registration list. If they don't match, the submission won't go through, which is what stops someone else adding things to your project.",
      namePlaceholder: "Exactly as you signed up",
      contactHint: "The one you signed up with",
      contactPlaceholder: "WeChat ID or phone number",
      errContact: "Use the contact details from your sign-up, so we can confirm the project is yours",

      title: "Project name",
      titlePlaceholder: "Give your project a name",
      errTitle: "Please enter a project name",
      summary: "One-line summary",
      summaryPlaceholder: "E.g. helps a club find a time everyone is free.",
      errSummary: "Sum up what the project does in one sentence",

      problem: "The problem you're working on",
      problemPlaceholder: "What it is, who runs into it, and why it's worth solving.",
      groupName: "Team / club",
      groupNamePlaceholder: "Leave blank if you're taking part alone",
      members: "Members",
      membersPlaceholder: "Separate with commas",
      direction: "Direction",
      directionPlaceholder: "Study, personal life, a club, or campus life",

      link: "Link or entry point",
      linkHint: "Optional, but strongly recommended",
      instructions: "What someone needs to know to use it",
      instructionsHint: "Another team gets this on Sunday — they need to open it themselves",
      instructionsPlaceholder:
        "How to open it, what to install, what to do first, where people get stuck.",
      equipment: "Equipment or materials needed",
      equipmentPlaceholder: "E.g. a laptop with wifi, a projector, a speaker.",
      demo: "How you plan to present it",

      files: "Project files",
      filesHint: "Optional · up to 50MB each · images are compressed automatically",
      dropPre: "Drag files here, or",
      dropAction: "choose files",
      dropNote:
        "Photos of a physical build, screenshots or recordings of something running locally — all fine. For video and anything large, link out instead.",
      remove: "Remove",
      errFiles: "These files are over 50MB and weren't added: {names}. For large files, link out instead.",

      visibilityLegend: "Should this project be published?",
      visibilityBody:
        "The gallery is a public page anyone can open. **You have to choose — there's no default.** Pick \"not published\" and the project is only used at the event on Sunday. Whichever you pick, your contact details never appear on the gallery.",
      errVisibility: "Please choose one",
      visibilityOptions: {
        named: { label: "Public + credited", desc: "Goes on the gallery with your credit line and member list." },
        group_only: {
          label: "Public + club name only",
          desc: "Goes on the gallery under the group name, with no member names listed.",
        },
        anonymous: { label: "Public + no credit", desc: "Goes on the gallery with no credit line and no member list." },
        hidden: { label: "Not published", desc: "Only used at the event on Sunday, never put on a public page." },
      },

      submit: "Submit project",
      progressVerify: "Checking your sign-up…",
      progressCompress: "Compressing and uploading {count} files…",
      progressUpload: "Uploading {count} files (about {size}MB)…",
      progressUploading: "Uploading… {done}/{total}",
    },
  },

  /* ------------------------------------------------------------- pages */
  pages: {
    register: {
      index: "[ 02 ]",
      title: "Sign up",
      intro:
        "An idea on its own is enough, and an unfinished project can carry on. Tell us your direction, who's taking part, which of the two days you can make, and any equipment or tools you need.",
      roles: {
        participant: {
          label: "I want to take part",
          blurb:
            "Bring an idea or a project you've started, make something, then swap and pitch on Sunday.",
        },
        volunteer: {
          label: "I want to volunteer",
          blurb:
            "Front desk, preparing the swap, setup and pack-down, tool support — shifts around the hours you can make.",
        },
      },
      privacy:
        "What you enter is only visible to the organising team once they sign in, and is never shown publicly. Dates, venue, and timings are subject to confirmation by the school; we'll get in touch using the contact details you leave.",
    },

    submit: {
      index: "[ 03 ]",
      title: "Submit",
      intro:
        "Set out where your project lives, the instructions someone needs, and what materials it takes. On Sunday this project goes to another team — they have to be able to open it, try it, and explain it in their own words.",
      checklistTitle: "Before you submit",
      checklist: [
        "You can't submit without signing up first — we need to know who you are before a project can be credited to you.",
        "It's fine for the project to be early. What matters is that someone else can try the core idea.",
        "Submitting again with the same project name overwrites the previous entry rather than creating a second one.",
      ],
    },

    projects: {
      index: "[ 04 ]",
      title: "Gallery",
      intro:
        "Projects submitted to Unscripted so far. They can be early and rough — what matters is that someone else can try the core idea.",
      count: "{count} projects",
      refresh: "Reload",
      empty: "No projects submitted yet.",
      emptyCta: "Submit the first project",
      noImage: "NO IMAGE",
      uncredited: "Uncredited",
      problemLabel: "Problem",
      directionLabel: "Direction",
      membersLabel: "Members",
      open: "Open project",
      imageAlt: "View image {n}",
      errLoad: "Couldn't load",
      footnote:
        "Authors choose their own credit when they submit; projects that opted out show the work alone. No contact details ever appear on the gallery.",
    },
  },

  /* ------------------------------------------------------- staff console */
  staff: {
    signIn: {
      badge: "STAFF ONLY",
      title: "Organising team sign-in",
      intro:
        "Registration data contains students' personal details and is only visible to the organising team.",
      email: "Email",
      password: "Password",
      submit: "Sign in",
      submitting: "Signing in…",
      errCredentials: "That email or password isn't right.",
      accountNote:
        "Accounts are created by William in the Supabase dashboard. Ask him if you've forgotten your password or need a new account.",
    },

    index: "[ STAFF ]",
    title: "Organising console",
    subtitle: "Registrations sync live — new submissions appear here on their own.",
    lastSync: "Updated {time}",
    reload: "Reload",
    exportCsv: "Export CSV",
    signOut: "Sign out",

    tabs: {
      participants: "Participants",
      volunteers: "Volunteers",
      projects: "Projects",
    },
    empty: {
      participants: "No sign-ups yet.",
      volunteers: "No volunteer sign-ups yet.",
      projects: "No projects submitted yet.",
    },

    columns: {
      createdAt: "Submitted",
      name: "Name",
      contact: "Contact",
      email: "Email",
      participationType: "Type",
      groupName: "Team / club",
      memberCount: "Size",
      direction: "Direction / existing work",
      hasExisting: "Existing project",
      day1: "Sat",
      day2: "Sun",
      timeNote: "Timing notes",
      equipmentNeeds: "Equipment",
      notes: "Notes",
      roles: "Roles",
      experience: "Experience",
      projectTitle: "Project",
      projectSummary: "Summary",
      problem: "Problem",
      members: "Members",
      link: "Link",
      instructions: "Instructions",
      demoFormat: "Presentation",
      wallVisibility: "Gallery",
      files: "Files",
    },

    bool: {
      yes: "Yes",
      no: "No",
      canAttend: "Available",
      cannotAttend: "Not available",
    },
    notStated: "Not stated",
    hasExistingPrefix: "Yes: ",

    footer: "Showing {label} — {count} in total. Exporting the CSV includes every field in this tab.",
    allowlistNote:
      "Only accounts on the staff list can see this data. If you can sign in but all three tabs are empty, your account hasn't been added yet — ask William to run select public.add_staff('your@email') in the Supabase SQL editor.",

    notConfiguredTitle: "Organising console",
    notConfiguredBody:
      "The database isn't connected. Set up .env.local, then run supabase/migrations/0001_init.sql.",
  },

  /* ------------------------------------------------------------ errors */
  errors: {
    notRegistered:
      "No matching sign-up was found. Check that the name and contact details match exactly what you signed up with — and if you haven't signed up yet, do that first.",
    notOwner: "That project was submitted by someone else, so it can't be changed here.",
    nameOrContactRequired:
      "Enter your name and the contact details from your sign-up, so the project can be credited to you.",
    titleOrSummaryRequired: "Both a project name and a one-line summary are needed.",
    visibilityRequired: "Choose whether the project is published, and whether it's credited.",
    permissionDenied:
      "No read permission. Your sign-in has probably expired — sign out and back in. If it still fails, your account hasn't been added to the staff list yet.",
    policyRejected: "The database rejected this submission. Check that all the fields are filled in.",
    duplicateFile: "A file with that name has already been uploaded — rename it and try again.",
    fileTooLarge: "That file is over the 50MB limit. For large files, link out instead.",
    storageMissing: "Storage isn't set up yet. Run the migration SQL in Supabase first.",
    network: "Couldn't reach the network. Check your connection and try again.",
    unknown: "That didn't go through. Please try again in a moment.",
  },

  /* ----------------------------------------------------- not configured */
  notConfigured: {
    badge: "NOT CONNECTED",
    body: "The database isn't connected yet, so forms can't be submitted. Copy .env.example to .env.local in the project root, fill in the Supabase URL and anon key, then restart the dev server.",
  },

  /* --------------------------------------------------------- submission */
  submitBlock: {
    badge: "SUBMITTED",
    successTitle: "Submitted — we've got it.",
    successBody:
      "The organising team will follow up with you. We'll be in touch once the dates and venue are confirmed.",
    again: "Submit another",
    submitting: "Submitting…",
    defaultLabel: "Submit",
  },

  /* -------------------------------------------------------------- 404 */
  notFound: {
    code: "ERROR 404",
    title: "This page has no script",
    body: "The address you're looking for doesn't exist, or hasn't been built yet.",
  },
};

export default en;
