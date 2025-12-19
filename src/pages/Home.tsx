import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

/**
 * BALANCE CIPHER V2 — Social Conversion Landing Page
 * Goal: reduce busy-ness, move to "one clear move" quickly.
 *
 * Notes:
 * - No placeholder pages required. CTAs can point to "/" for now if desired.
 * - If you later add routes (/overview, /reversal, /vit-react), update ROUTES.
 */

const ROUTES = {
  start: "/",
  overview: "/overview",
  reversal: "/reversal",
  vitReact: "/vit-react",
} as const;

type GoalKey = "raise" | "approve" | "lower" | "calm";
type TimelineKey = "fast" | "steady";
type FrictionKey = "confused" | "overwhelmed" | "noPlan" | "noFollowThrough";

const LABELS = {
  goal: {
    raise: "Raise my score",
    approve: "Get approved",
    lower: "Lower my rate",
    calm: "Stop the chaos",
  } as const satisfies Record<GoalKey, string>,
  timeline: {
    fast: "Fast",
    steady: "Steady",
  } as const satisfies Record<TimelineKey, string>,
  friction: {
    confused: "Confused",
    overwhelmed: "Overwhelmed",
    noPlan: "No plan",
    noFollowThrough: "No follow-through",
  } as const satisfies Record<FrictionKey, string>,
} as const;

const COPY = {
  brand: {
    productName: "BALANCE Cipher",
    kicker: "Cipher + Co-Pilot",
  },

  hero: {
    headline: "Are you ready to start decoding?",
    benefitLine: "One clear move—today. No hype. No shame.",
    subhead:
      "The Cipher is the map. Your AI Co-Pilot is the decoder—translating credit complexity into plain language and a next best move you can actually finish.",
    primaryCta: "Start decoding",
    secondaryCta: "Try the 10-second decode",
    microTrust: "Built for clarity, not overwhelm.",
  },

  proof: {
    kicker: "What you get first",
    title: "Clarity in minutes",
    bullets: [
      "What matters most right now (the lever).",
      "One next best move you can do today.",
      "What to ignore for now (noise removed).",
    ],
  },

  decode: {
    kicker: "10-second decode",
    title: "Pick 3 things. Get 1 move.",
    subtitle:
      "Choose what you want, how fast you want it, and what keeps getting in the way. Your Co-Pilot returns a decoded truth and one next best move.",
    outputTitle: "Your decode",
    decodedLabel: "Decoded truth",
    nextLabel: "Next best move",
    safetyLine: "No hype. No shame. One clear step at a time.",
    cta: "Use this decode",
  },

  mechanism: {
    kicker: "How it works",
    title: "The linkage is the product",
    subtitle:
      "The Cipher is a sophisticated map. The Co-Pilot decodes it through the BALANCE Formula—so your steps stay simple.",
    equation: ["AI Co-Pilot", "BALANCE Cipher", "BALANCE Formula", "Solutions"] as const,
  },

  close: {
    title: "Ready to start decoding?",
    subtitle: "Get the next move. Do it. Repeat. Momentum holds.",
    primaryCta: "Start decoding",
    secondaryCta: "Try the 10-second decode",
  },

  footer: {
    line:
      "The Cipher gives you the map. The Co-Pilot has the goods to decode it—through the BALANCE Formula—into simple steps.",
  },
} as const;

function getGoalRoute(goal: GoalKey): string {
  // For now, keep everything on home (/) since you said placeholders = no.
  // When you add real pages later, route by goal.
  switch (goal) {
    default:
      return ROUTES.start;
  }
}

function buildDecodeOutput(goal: GoalKey, timeline: TimelineKey, friction: FrictionKey): {
  decoded: string;
  next: string;
} {
  let baseDecoded = "";
  let baseNext = "";

  switch (goal) {
    case "raise":
      baseDecoded =
        "Raising your score is usually one or two levers: on-time payments and how much of your available credit you are using.";
      baseNext = "Pick one lever to focus on first. Then do one clean step today that moves that lever.";
      break;
    case "approve":
      baseDecoded =
        "Approval is not luck. It is proof. Lenders want a clean story: stability, ability to pay, and no hidden risks.";
      baseNext = "Name what you want approval for. Then we map one realistic path based on your timeline.";
      break;
    case "lower":
      baseDecoded =
        "Lower rates come when your profile looks less risky: stronger score, lower debt pressure, and cleaner history.";
      baseNext = "Identify what you owe and your current rate. Then take one step that improves leverage.";
      break;
    case "calm":
    default:
      baseDecoded =
        "The chaos stops when you have one clear plan and one next move you can actually finish—today.";
      baseNext = "Name what feels loudest. Then take one small action that reduces noise and creates momentum.";
      break;
  }

  const timelineAdd =
    timeline === "fast"
      ? "We prioritize the highest-impact move you can do now."
      : "We build a steady path you can repeat without burnout.";

  let frictionAdd = "";
  let frictionNext = "";

  switch (friction) {
    case "confused":
      frictionAdd = "If you feel confused, we remove jargon and focus on one lever only.";
      frictionNext = "Keep it simple: one lever, one move, done.";
      break;
    case "overwhelmed":
      frictionAdd = "If you feel overwhelmed, we shrink the step until it fits into 10 minutes.";
      frictionNext = "Make it small enough to finish today.";
      break;
    case "noPlan":
      frictionAdd = "If you have no plan, we turn the mess into a clean 3-step map.";
      frictionNext = "You do not need perfect. You need next.";
      break;
    case "noFollowThrough":
    default:
      frictionAdd = "If follow-through breaks, we choose a smaller step and a simple check-in.";
      frictionNext = "Choose a step you can finish today. Repeat tomorrow.";
      break;
  }

  return {
    decoded: `${baseDecoded} ${timelineAdd} ${frictionAdd}`,
    next: `${baseNext} ${frictionNext}`,
  };
}

export default function Home() {
  const [goal, setGoal] = useState<GoalKey>("raise");
  const [timeline, setTimeline] = useState<TimelineKey>("fast");
  const [friction, setFriction] = useState<FrictionKey>("overwhelmed");

  const decodeOut = useMemo(() => buildDecodeOutput(goal, timeline, friction), [goal, timeline, friction]);
  const goalRoute = useMemo(() => getGoalRoute(goal), [goal]);

  return (
    <main className="bc2-page">
      <style>{CSS}</style>
      <div className="bc2-bg" aria-hidden="true" />

      <div className="bc2-container">
        {/* HERO */}
        <header className="bc2-hero" aria-label="BALANCE Cipher V2 Hero">
          <div className="bc2-card">
            <div className="bc2-badgeRow">
              <span className="bc2-badge">{COPY.brand.productName}</span>
              <span className="bc2-badgeMuted">{COPY.brand.kicker}</span>
            </div>

            <h1 className="bc2-h1">{COPY.hero.headline}</h1>

            <div className="bc2-benefit" aria-label="Immediate benefit">
              {COPY.hero.benefitLine}
            </div>

            <p className="bc2-lead">{COPY.hero.subhead}</p>

            <div className="bc2-ctaRow" aria-label="Primary actions">
              <PrimaryLink to={ROUTES.start}>{COPY.hero.primaryCta}</PrimaryLink>
              <a className="bc2-btn bc2-btnSecondary" href="#decode">
                {COPY.hero.secondaryCta}
              </a>
            </div>

            <div className="bc2-microTrust">{COPY.hero.microTrust}</div>
          </div>
        </header>

        {/* PROOF / FIRST BENEFITS */}
        <section className="bc2-section" aria-labelledby="proof-title">
          <div className="bc2-sectionHeader">
            <div className="bc2-kicker">{COPY.proof.kicker}</div>
            <h2 className="bc2-h2" id="proof-title">
              {COPY.proof.title}
            </h2>
          </div>

          <div className="bc2-bulletGrid" role="list" aria-label="Immediate benefits">
            {COPY.proof.bullets.map((b) => (
              <div className="bc2-bullet" role="listitem" key={b}>
                <span className="bc2-bulletDot" aria-hidden="true" />
                <span className="bc2-bulletText">{b}</span>
              </div>
            ))}
          </div>
        </section>

        {/* DECODE */}
        <section
