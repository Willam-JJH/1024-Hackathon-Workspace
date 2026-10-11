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
      kicker: "AI-assisted making",
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
