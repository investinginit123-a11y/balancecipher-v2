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
        <section className="bc2-section" id="decode" aria-labelledby="decode-title">
          <div className="bc2-sectionHeader">
            <div className="bc2-kicker">{COPY.decode.kicker}</div>
            <h2 className="bc2-h2" id="decode-title">
              {COPY.decode.title}
            </h2>
            <p className="bc2-p">{COPY.decode.subtitle}</p>
          </div>

          <div className="bc2-split">
            {/* Controls */}
            <div className="bc2-panel" aria-label="Decode controls">
              <div className="bc2-panelTitle">Pick your 3 inputs</div>

              <Field label="Goal">
                <div className="bc2-chipGrid" role="radiogroup" aria-label="Choose a goal">
                  {(Object.keys(LABELS.goal) as GoalKey[]).map((k) => (
                    <Chip
                      key={k}
                      label={LABELS.goal[k]}
                      active={goal === k}
                      onClick={() => setGoal(k)}
                    />
                  ))}
                </div>
              </Field>

              <Field label="Timeline">
                <div className="bc2-chipRow" role="radiogroup" aria-label="Choose a timeline">
                  {(Object.keys(LABELS.timeline) as TimelineKey[]).map((k) => (
                    <Chip
                      key={k}
                      label={LABELS.timeline[k]}
                      active={timeline === k}
                      onClick={() => setTimeline(k)}
                    />
                  ))}
                </div>
              </Field>

              <Field label="What gets in the way">
                <div className="bc2-chipGrid" role="radiogroup" aria-label="Choose friction">
                  {(Object.keys(LABELS.friction) as FrictionKey[]).map((k) => (
                    <Chip
                      key={k}
                      label={LABELS.friction[k]}
                      active={friction === k}
                      onClick={() => setFriction(k)}
                    />
                  ))}
                </div>
              </Field>

              <div className="bc2-fine">{COPY.decode.safetyLine}</div>
            </div>

            {/* Output */}
            <div className="bc2-output" aria-label="Decode output">
              <div className="bc2-outputTop">
                <div className="bc2-outputKicker">{COPY.decode.outputTitle}</div>
                <div className="bc2-outputSummary">
                  {LABELS.goal[goal]} · {LABELS.timeline[timeline]} · {LABELS.friction[friction]}
                </div>
              </div>

              <div className="bc2-outBlock" role="group" aria-label="Decoded truth">
                <div className="bc2-outLabel">{COPY.decode.decodedLabel}</div>
                <div className="bc2-outText">{decodeOut.decoded}</div>
              </div>

              <div className="bc2-outBlock" role="group" aria-label="Next best move">
                <div className="bc2-outLabel">{COPY.decode.nextLabel}</div>
                <div className="bc2-outText">{decodeOut.next}</div>
              </div>

              <div className="bc2-ctaRow" aria-label="Decode actions">
                <PrimaryLink to={goalRoute}>{COPY.decode.cta}</PrimaryLink>
                <SecondaryLink to={ROUTES.start}>Back to top</SecondaryLink>
              </div>
            </div>
          </div>
        </section>

        {/* MECHANISM */}
        <section className="bc2-section" aria-labelledby="mech-title">
          <div className="bc2-sectionHeader">
            <div className="bc2-kicker">{COPY.mechanism.kicker}</div>
            <h2 className="bc2-h2" id="mech-title">
              {COPY.mechanism.title}
            </h2>
            <p className="bc2-p">{COPY.mechanism.subtitle}</p>
          </div>

          <div className="bc2-eq" aria-label="Mechanism equation">
            <EqPill>{COPY.mechanism.equation[0]}</EqPill>
            <EqOp>+</EqOp>
            <EqPill>{COPY.mechanism.equation[1]}</EqPill>
            <EqOp>+</EqOp>
            <EqPill>{COPY.mechanism.equation[2]}</EqPill>
            <EqOp>=</EqOp>
            <EqResult>{COPY.mechanism.equation[3]}</EqResult>
          </div>
        </section>

        {/* CLOSE */}
        <section className="bc2-section bc2-close" aria-labelledby="close-title">
          <div>
            <h2 className="bc2-h2" id="close-title">
              {COPY.close.title}
            </h2>
            <p className="bc2-p">{COPY.close.subtitle}</p>

            <div className="bc2-ctaRow">
              <PrimaryLink to={ROUTES.start}>{COPY.close.primaryCta}</PrimaryLink>
              <a className="bc2-btn bc2-btnSecondary" href="#decode">
                {COPY.close.secondaryCta}
              </a>
            </div>
          </div>
        </section>

        <footer className="bc2-footer">
          <div className="bc2-footerLine">{COPY.footer.line}</div>
          <div className="bc2-footerSmall">© {new Date().getFullYear()} BALANCE Cipher</div>
        </footer>
      </div>
    </main>
  );
}

/* UI components */

function PrimaryLink(props: { to: string; children: React.ReactNode }) {
  return (
    <Link className="bc2-btn bc2-btnPrimary" to={props.to}>
      {props.children}
    </Link>
  );
}

function SecondaryLink(props: { to: string; children: React.ReactNode }) {
  return (
    <Link className="bc2-btn bc2-btnSecondary" to={props.to}>
      {props.children}
    </Link>
  );
}

function Field(props: { label: string; children: React.ReactNode }) {
  return (
    <div className="bc2-field">
      <div className="bc2-fieldLabel">{props.label}</div>
      {props.children}
    </div>
  );
}

function Chip(props: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`bc2-chip ${props.active ? "isActive" : ""}`}
      role="radio"
      aria-checked={props.active}
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
}

function EqPill(props: { children: React.ReactNode }) {
  return <span className="bc2-eqPill">{props.children}</span>;
}

function EqOp(props: { children: React.ReactNode }) {
  return (
    <span className="bc2-eqOp" aria-hidden="true">
      {props.children}
    </span>
  );
}

function EqResult(props: { children: React.ReactNode }) {
  return <span className="bc2-eqResult">{props.children}</span>;
}

/* CSS — deliberately leaner than V1 to reduce “busy” */

const CSS = `
:root{
  --bg:#050B18;
  --panel: rgba(255,255,255,0.04);
  --panel2: rgba(0,0,0,0.22);
  --border: rgba(255,255,255,0.10);
  --teal: rgba(0,255,220,0.92);
  --teal2: rgba(0,190,255,0.82);
  --text: rgba(255,255,255,0.92);
  --muted: rgba(255,255,255,0.74);
  --shadow: 0 18px 50px rgba(0,0,0,0.35);
  --r16: 16px;
  --r18: 18px;
  --r20: 20px;
}

.bc2-page{
  min-height:100vh;
  background: var(--bg);
  color: var(--text);
  position:relative;
  overflow-x:hidden;
}

.bc2-bg{
  position:absolute;
  inset:0;
  pointer-events:none;
  background:
    radial-gradient(900px 520px at 18% 10%, rgba(0,255,220,0.16), transparent 55%),
    radial-gradient(780px 520px at 86% 18%, rgba(0,190,255,0.10), transparent 55%),
    radial-gradient(900px 760px at 50% 96%, rgba(255,180,70,0.05), transparent 55%);
}

.bc2-container{
  position:relative;
  max-width: 1020px;
  margin:0 auto;
  padding: 24px 16px 40px;
}

.bc2-card{
  border-radius: var(--r20);
  background: var(--panel);
  border: 1px solid var(--border);
  padding: 18px;
  box-shadow: var(--shadow);
}

.bc2-badgeRow{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  align-items:center;
  margin-bottom:10px;
}
.bc2-badge{
  font-size:12px;
  letter-spacing:0.10em;
  text-transform:uppercase;
  padding:7px 10px;
  border-radius:999px;
  background: rgba(0,255,220,0.10);
  border:1px solid rgba(0,255,220,0.25);
}
.bc2-badgeMuted{ font-size:12px; color: rgba(255,255,255,0.70); }

.bc2-h1{
  font-size: clamp(28px, 4vw, 44px);
  line-height:1.08;
  margin: 10px 0 8px;
  letter-spacing:-0.02em;
}

.bc2-benefit{
  display:inline-block;
  font-size: 14px;
  font-weight: 900;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(0,255,220,0.08);
  border: 1px solid rgba(0,255,220,0.18);
  margin-bottom: 10px;
}

.bc2-lead{
  margin: 0 0 12px;
  font-size: 15px;
  line-height: 1.6;
  color: rgba(255,255,255,0.80);
  max-width: 880px;
}

.bc2-ctaRow{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  align-items:center;
  margin-top: 10px;
}

.bc2-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding: 12px 14px;
  border-radius: 14px;
  text-decoration:none;
  font-weight: 900;
  border: 1px solid transparent;
  transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;
}
.bc2-btn:focus-visible{
  outline: 2px solid rgba(0,255,220,0.65);
  outline-offset: 3px;
}
.bc2-btn:hover{ transform: translateY(-1px); }

.bc2-btnPrimary{
  color: rgba(0,0,0,0.92);
  background: linear-gradient(180deg, var(--teal), var(--teal2));
  box-shadow: 0 12px 28px rgba(0,255,220,0.16);
}
.bc2-btnSecondary{
  color: rgba(255,255,255,0.90);
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.12);
}

.bc2-microTrust{
  margin-top:10px;
  font-size: 12px;
  color: rgba(255,255,255,0.66);
}

.bc2-section{
  margin-top: 14px;
  border-radius: var(--r20);
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border);
  padding: 18px;
  box-shadow: 0 18px 50px rgba(0,0,0,0.22);
}

.bc2-sectionHeader{
  max-width: 900px;
  margin-bottom: 12px;
}

.bc2-kicker{
  font-size: 12px;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: rgba(0,255,220,0.75);
  margin-bottom: 10px;
}

.bc2-h2{
  margin: 0 0 8px;
  font-size: 22px;
  letter-spacing: -0.01em;
}

.bc2-p{
  margin: 0;
  font-size: 14px;
  line-height: 1.65;
  color: var(--muted);
}

.bc2-bulletGrid{
  display:grid;
  gap:10px;
  margin-top: 10px;
}
.bc2-bullet{
  display:flex;
  gap:10px;
  align-items:flex-start;
  padding: 12px;
  border-radius: var(--r16);
  background: var(--panel2);
  border: 1px solid rgba(255,255,255,0.10);
}
.bc2-bulletDot{
  width: 9px; height: 9px;
  border-radius: 999px;
  background: rgba(0,255,220,0.85);
  box-shadow: 0 0 18px rgba(0,255,220,0.24);
  margin-top: 5px;
  flex: 0 0 auto;
}
.bc2-bulletText{
  font-size: 13px;
  line-height: 1.55;
  color: rgba(255,255,255,0.80);
}

.bc2-split{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-items:start;
  margin-top: 12px;
}

.bc2-panel{
  border-radius: var(--r18);
  padding: 14px;
  background: var(--panel2);
  border: 1px solid rgba(255,255,255,0.12);
}
.bc2-panelTitle{
  font-size: 14px;
  font-weight: 900;
  margin-bottom: 10px;
}

.bc2-field{ margin-bottom: 12px; }
.bc2-fieldLabel{
  font-size: 12px;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.70);
  margin-bottom: 10px;
}

.bc2-chipRow{ display:flex; flex-wrap:wrap; gap:10px; }
.bc2-chipGrid{
  display:grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap:10px;
}

.bc2-chip{
  width:100%;
  border-radius: 14px;
  padding: 12px 12px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.90);
  font-weight: 900;
  cursor:pointer;
  text-align:left;
  transition: transform 120ms ease, border-color 120ms ease, box-shadow 120ms ease;
}
.bc2-chip:hover{ transform: translateY(-1px); }
.bc2-chip:focus-visible{
  outline: 2px solid rgba(0,255,220,0.65);
  outline-offset: 3px;
}
.bc2-chip.isActive{
  background: rgba(0,255,220,0.10);
  border: 1px solid rgba(0,255,220,0.26);
  box-shadow: 0 14px 30px rgba(0,255,220,0.10);
}

.bc2-fine{
  margin-top: 8px;
  font-size: 12px;
  color: rgba(255,255,255,0.62);
}

.bc2-output{
  border-radius: var(--r18);
  padding: 14px;
  background: radial-gradient(520px 320px at 30% 20%, rgba(0,255,220,0.10), transparent 55%),
              rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.12);
}

.bc2-outputTop{ margin-bottom: 10px; }
.bc2-outputKicker{
  font-size: 12px;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.65);
  margin-bottom: 8px;
}
.bc2-outputSummary{
  font-size: 13px;
  font-weight: 900;
  color: rgba(255,255,255,0.86);
}

.bc2-outBlock{
  border-radius: 16px;
  padding: 12px;
  background: rgba(0,0,0,0.20);
  border: 1px solid rgba(255,255,255,0.10);
  margin-top: 10px;
}
.bc2-outLabel{
  font-size: 11px;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.65);
  margin-bottom: 8px;
}
.bc2-outText{
  font-size: 13px;
  line-height: 1.6;
  color: rgba(255,255,255,0.82);
}

.bc2-eq{
  border-radius: var(--r18);
  padding: 14px;
  background: var(--panel2);
  border: 1px solid rgba(255,255,255,0.12);
  display:flex;
  flex-wrap:wrap;
  align-items:center;
  gap:10px;
  margin-top: 10px;
}
.bc2-eqPill{
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  font-weight: 900;
  font-size: 13px;
}
.bc2-eqOp{
  font-size: 16px;
  font-weight: 900;
  color: rgba(255,255,255,0.75);
}
.bc2-eqResult{
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(0,255,220,0.10);
  border: 1px solid rgba(0,255,220,0.22);
  font-weight: 950;
  font-size: 13px;
}

.bc2-close{
  background: rgba(0,255,220,0.06);
  border: 1px solid rgba(0,255,220,0.16);
}

.bc2-footer{
  margin-top: 14px;
  padding: 10px 4px 2px;
  display:flex;
  justify-content:space-between;
  gap:12px;
  flex-wrap:wrap;
  color: rgba(255,255,255,0.60);
}
.bc2-footerLine{ font-size: 12px; }
.bc2-footerSmall{ font-size: 12px; }

@media (max-width: 880px){
  .bc2-split{ grid-template-columns: 1fr; }
  .bc2-chipGrid{ grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce){
  .bc2-btn, .bc2-chip{ transition:none; }
  .bc2-btn:hover, .bc2-chip:hover{ transform:none; }
}
`;
