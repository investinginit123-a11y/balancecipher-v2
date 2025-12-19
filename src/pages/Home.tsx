import React, { useMemo, useState } from "react";
impoimport React, { useMemo, useRef, useState } from "react";

/**
 * BALANCE Cipher V2 — Social Conversion Landing (Clean)
 * Design goals:
 * - Less “busy”: fewer boxes, fewer borders, more breathing room
 * - One obvious action: Get your next move
 * - Mobile-first: reads clean from TikTok/IG traffic
 * - 8th-grade clarity: short lines, plain language
 */

type GoalKey = "raise" | "approve" | "lower" | "calm";
type TimelineKey = "fast" | "steady";
type BlockerKey = "confused" | "overwhelmed" | "noPlan" | "noFollowThrough";

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
  blocker: {
    confused: "I’m confused",
    overwhelmed: "I’m overwhelmed",
    noPlan: "I don’t have a plan",
    noFollowThrough: "I don’t follow through",
  } as const satisfies Record<BlockerKey, string>,
} as const;

function buildResult(goal: GoalKey, timeline: TimelineKey, blocker: BlockerKey) {
  // Keep it short. Clean. Credible.
  const goalTruth: Record<GoalKey, string> = {
    raise:
      "Your score usually moves from two levers: paying on time and keeping card balances low vs. limits.",
    approve:
      "Approval is a clean story: stable income, manageable payments, and no surprises in your report.",
    lower:
      "Lower rates come when you look less risky: stronger score, lower debt pressure, cleaner history.",
    calm:
      "The chaos stops when you stop guessing and start doing one small move that you can finish.",
  };

  const timelineTruth =
    timeline === "fast"
      ? "We prioritize the highest-impact move you can do now."
      : "We build a steady path you can repeat without burnout.";

  const blockerFix: Record<BlockerKey, string> = {
    confused: "We remove jargon and focus on one lever only.",
    overwhelmed: "We shrink the step until it fits into 10 minutes.",
    noPlan: "We turn the mess into a simple 3-step map.",
    noFollowThrough: "We choose a step you can finish today, then repeat tomorrow.",
  };

  const moveToday: Record<GoalKey, string> = {
    raise: "Today: pick one card and set a target balance that’s lower than it is now. Then make one payment.",
    approve:
      "Today: choose what you want approval for. Then gather two facts: your income and your current monthly debt payments.",
    lower:
      "Today: write down your current rate and balance. Then choose one risk-reducing move (pay down, clean errors, or stabilize payments).",
    calm:
      "Today: name the one thing causing the most stress. Then do one small cleanup step that takes less than 10 minutes.",
  };

  const nextStep: Record<GoalKey, string> = {
    raise: "Next: we’ll map which lever matters most for you and give you one next best move.",
    approve: "Next: we’ll map your approval path and what to fix first (without guessing).",
    lower: "Next: we’ll map the quickest path to a lower rate and the order that works best.",
    calm: "Next: we’ll turn the noise into a plan you can actually follow.",
  };

  return {
    title: `${LABELS.goal[goal]} · ${LABELS.timeline[timeline]} · ${LABELS.blocker[blocker]}`,
    truth: `${goalTruth[goal]} ${timelineTruth} ${blockerFix[blocker]}`,
    today: moveToday[goal],
    next: nextStep[goal],
  };
}

function scrollTo(ref: React.RefObject<HTMLElement>) {
  if (!ref.current) return;
  ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const decodeRef = useRef<HTMLElement>(null);

  const [goal, setGoal] = useState<GoalKey>("raise");
  const [timeline, setTimeline] = useState<TimelineKey>("fast");
  const [blocker, setBlocker] = useState<BlockerKey>("overwhelmed");

  // Stepper keeps the page from showing “everything at once”
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);

  const result = useMemo(() => buildResult(goal, timeline, blocker), [goal, timeline, blocker]);

  const question = useMemo(() => {
    switch (step) {
      case 0:
        return { label: "What do you want right now?", options: Object.keys(LABELS.goal) as GoalKey[] };
      case 1:
        return { label: "How fast do you want progress?", options: Object.keys(LABELS.timeline) as TimelineKey[] };
      case 2:
        return { label: "What gets in the way most?", options: Object.keys(LABELS.blocker) as BlockerKey[] };
      default:
        return null;
    }
  }, [step]);

  const progressText = useMemo(() => {
    if (step === 3) return "Result";
    return `Step ${step + 1} of 3`;
  }, [step]);

  async function copyNextMove() {
    const text = `BALANCE Cipher — Next Move\n\n${result.title}\n\nDecoded truth:\n${result.truth}\n\nToday:\n${result.today}\n\nNext:\n${result.next}`;
    try {
      await navigator.clipboard.writeText(text);
      // Minimal feedback without popups
      const el = document.getElementById("copy-status");
      if (el) el.textContent = "Copied.";
      setTimeout(() => {
        const el2 = document.getElementById("copy-status");
        if (el2) el2.textContent = "";
      }, 1500);
    } catch {
      // If clipboard fails, do nothing (no alerts)
    }
  }

  return (
    <main className="v2">
      <style>{CSS}</style>

      <div className="bg" aria-hidden="true" />

      <header className="top">
        <div className="brand">
          <div className="mark" aria-hidden="true" />
          <div className="brandText">
            <div className="brandName">BALANCE Cipher</div>
            <div className="brandSub">V2 • Cipher + Co-Pilot</div>
          </div>
        </div>

        <button className="ghost" type="button" onClick={() => scrollTo(decodeRef)}>
          Get my next move
        </button>
      </header>

      <section className="hero" aria-label="Hero">
        <div className="heroInner">
          <div className="tag">One clear move — today.</div>

          <h1 className="h1">Decode your credit into a simple next step.</h1>

          <p className="lead">
            No hype. No shame. Just clarity you can use right now.
            <span className="leadBreak" />
            The Cipher is the map. Your Co-Pilot does the decoding.
          </p>

          <div className="heroActions">
            <button
              className="primary"
              type="button"
              onClick={() => {
                scrollTo(decodeRef);
                setStep(0);
              }}
            >
              Start decoding
            </button>

            <a className="link" href="#how">
              How it works
            </a>
          </div>

          <div className="micro">
            <div className="microItem">
              <div className="microTitle">Fast clarity</div>
              <div className="microBody">One lever. One move.</div>
            </div>
            <div className="microItem">
              <div className="microTitle">Adult tone</div>
              <div className="microBody">Plain language only.</div>
            </div>
            <div className="microItem">
              <div className="microTitle">Built for real life</div>
              <div className="microBody">Small steps that hold.</div>
            </div>
          </div>

          <div className="cornerstone">Are you ready to start decoding?</div>
        </div>
      </section>

      <section className="decode" ref={decodeRef} aria-label="Decode">
        <div className="panel">
          <div className="panelTop">
            <div className="panelLabel">Decode (20 seconds)</div>
            <div className="panelProgress">{progressText}</div>
          </div>

          {step !== 3 && question && (
            <>
              <div className="q">{question.label}</div>

              <div className="options" role="group" aria-label={question.label}>
                {step === 0 &&
                  (question.options as GoalKey[]).map((k) => (
                    <button
                      key={k}
                      type="button"
                      className={`opt ${goal === k ? "on" : ""}`}
                      onClick={() => setGoal(k)}
                    >
                      {LABELS.goal[k]}
                    </button>
                  ))}

                {step === 1 &&
                  (question.options as TimelineKey[]).map((k) => (
                    <button
                      key={k}
                      type="button"
                      className={`opt ${timeline === k ? "on" : ""}`}
                      onClick={() => setTimeline(k)}
                    >
                      {LABELS.timeline[k]}
                    </button>
                  ))}

                {step === 2 &&
                  (question.options as BlockerKey[]).map((k) => (
                    <button
                      key={k}
                      type="button"
                      className={`opt ${blocker === k ? "on" : ""}`}
                      onClick={() => setBlocker(k)}
                    >
                      {LABELS.blocker[k]}
                    </button>
                  ))}
              </div>

              <div className="nav">
                <button
                  className="ghost"
                  type="button"
                  onClick={() => setStep((s) => (s === 0 ? 0 : ((s - 1) as 0 | 1 | 2)))}
                  disabled={step === 0}
                >
                  Back
                </button>

                <button
                  className="primary"
                  type="button"
                  onClick={() => setStep((s) => (s === 2 ? 3 : ((s + 1) as 1 | 2 | 3)))}
                >
                  {step === 2 ? "Show my next move" : "Next"}
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="resultTitle">Your next move</div>
              <div className="resultSub">{result.title}</div>

              <div className="resultBlock">
                <div className="rbLabel">Decoded truth</div>
                <div className="rbText">{result.truth}</div>
              </div>

              <div className="resultBlock">
                <div className="rbLabel">Today</div>
                <div className="rbText">{result.today}</div>
              </div>

              <div className="resultBlock">
                <div className="rbLabel">Next</div>
                <div className="rbText">{result.next}</div>
              </div>

              <div className="nav">
                <button className="ghost" type="button" onClick={() => setStep(0)}>
                  Start over
                </button>

                <button className="primary" type="button" onClick={copyNextMove}>
                  Copy my next move
                </button>
              </div>

              <div className="copyStatus" id="copy-status" aria-live="polite" />
            </>
          )}
        </div>

        {/* Sticky bottom CTA (mobile conversion helper) */}
        <div className="sticky">
          <button
            className="primary wide"
            type="button"
            onClick={() => {
              scrollTo(decodeRef);
              setStep(0);
            }}
          >
            Get my next move
          </button>
        </div>
      </section>

      <section className="how" id="how" aria-label="How it works">
        <div className="howInner">
          <h2 className="h2">How it works</h2>
          <p className="p">
            You pick what you want and what’s in the way. The Co-Pilot translates the Cipher into plain language and one
            next best move.
          </p>

          <div className="three">
            <div className="tile">
              <div className="tileTitle">1) Pick your lane</div>
              <div className="tileBody">Raise score, get approved, lower rate, or stop the chaos.</div>
            </div>
            <div className="tile">
              <div className="tileTitle">2) Make it realistic</div>
              <div className="tileBody">Fast or steady. Either way, we keep it doable.</div>
            </div>
            <div className="tile">
              <div className="tileTitle">3) Get one move</div>
              <div className="tileBody">One step you can finish today. That’s how momentum starts.</div>
            </div>
          </div>

          <div className="faq">
            <details>
              <summary>Is this a lecture?</summary>
              <div className="faqBody">No. It’s a decode: clear wording, then one action.</div>
            </details>
            <details>
              <summary>Do I need to understand credit math?</summary>
              <div className="faqBody">No. We translate it into plain language and priorities.</div>
            </details>
            <details>
              <summary>What if I’m overwhelmed?</summary>
              <div className="faqBody">Then we shrink the step until it fits into 10 minutes.</div>
            </details>
          </div>

          <footer className="footer">
            <div className="footLine">
              The Cipher gives the map. The Co-Pilot has the goods to decode it into simple steps.
            </div>
            <div className="footSmall">© {new Date().getFullYear()} BALANCE Cipher</div>
          </footer>
        </div>
      </section>
    </main>
  );
}

const CSS = `
:root{
  --bg:#050B18;
  --text: rgba(255,255,255,0.92);
  --muted: rgba(255,255,255,0.72);
  --soft: rgba(255,255,255,0.06);
  --soft2: rgba(0,0,0,0.22);
  --border: rgba(255,255,255,0.10);
  --teal: rgba(0,255,220,0.88);
  --teal2: rgba(0,190,255,0.75);
  --shadow: 0 18px 50px rgba(0,0,0,0.35);
  --r: 18px;
  --r2: 14px;
}

*{ box-sizing: border-box; }
html,body{ height:100%; }
.v2{
  min-height:100vh;
  background: var(--bg);
  color: var(--text);
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  position: relative;
  overflow-x: hidden;
}

.bg{
  position:absolute;
  inset:0;
  pointer-events:none;
  background:
    radial-gradient(900px 520px at 18% 10%, rgba(0,255,220,0.12), transparent 60%),
    radial-gradient(880px 620px at 86% 16%, rgba(0,190,255,0.10), transparent 62%),
    radial-gradient(900px 760px at 50% 96%, rgba(255,180,70,0.06), transparent 60%);
}

.top{
  position: relative;
  z-index: 1;
  max-width: 980px;
  margin: 0 auto;
  padding: 18px 18px 6px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 12px;
}

.brand{
  display:flex;
  align-items:center;
  gap: 12px;
  min-width: 0;
}
.mark{
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background:
    radial-gradient(circle at 30% 30%, rgba(0,255,220,0.35), transparent 55%),
    radial-gradient(circle at 70% 70%, rgba(255,180,70,0.18), transparent 55%),
    radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12), rgba(0,0,0,0.25));
  border: 1px solid rgba(0,255,220,0.20);
  box-shadow: 0 0 24px rgba(0,255,220,0.10);
  flex: 0 0 auto;
}
.brandText{ min-width:0; }
.brandName{
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.brandSub{
  font-size: 12px;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hero{
  position: relative;
  z-index: 1;
  max-width: 980px;
  margin: 0 auto;
  padding: 10px 18px 10px;
}
.heroInner{
  border-radius: var(--r);
  padding: 22px;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.tag{
  display:inline-block;
  padding: 8px 10px;
  border-radius: 999px;
  background: rgba(0,255,220,0.10);
  border: 1px solid rgba(0,255,220,0.18);
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 0.02em;
  color: rgba(255,255,255,0.88);
}

.h1{
  margin: 12px 0 10px;
  letter-spacing: -0.02em;
  line-height: 1.06;
  font-size: clamp(28px, 4.5vw, 44px);
}

.lead{
  margin: 0;
  color: rgba(255,255,255,0.78);
  line-height: 1.6;
  font-size: 15px;
  max-width: 64ch;
}
.leadBreak{ display:block; height: 8px; }

.heroActions{
  margin-top: 14px;
  display:flex;
  align-items:center;
  gap: 14px;
  flex-wrap: wrap;
}

.primary{
  appearance:none;
  border: 0;
  cursor:pointer;
  border-radius: 999px;
  padding: 12px 16px;
  font-weight: 900;
  color: rgba(0,0,0,0.90);
  background: linear-gradient(180deg, var(--teal), var(--teal2));
  box-shadow: 0 14px 34px rgba(0,255,220,0.14);
}
.primary:focus-visible{
  outline: 2px solid rgba(0,255,220,0.65);
  outline-offset: 3px;
}
.link{
  color: rgba(255,255,255,0.82);
  text-decoration: none;
  font-weight: 800;
  border-bottom: 1px solid rgba(255,255,255,0.18);
  padding-bottom: 2px;
}
.link:hover{ border-bottom-color: rgba(0,255,220,0.35); }

.ghost{
  appearance:none;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.88);
  border-radius: 999px;
  padding: 10px 12px;
  font-weight: 900;
  cursor:pointer;
}
.ghost:disabled{ opacity: 0.45; cursor: default; }

.micro{
  margin-top: 16px;
  display:grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap: 10px;
}
.microItem{
  border-radius: var(--r2);
  padding: 12px;
  background: rgba(0,0,0,0.18);
  border: 1px solid rgba(255,255,255,0.08);
}
.microTitle{
  font-weight: 900;
  font-size: 13px;
  margin-bottom: 4px;
}
.microBody{
  font-size: 12px;
  color: var(--muted);
  line-height: 1.35;
}

.cornerstone{
  margin-top: 14px;
  font-size: 12px;
  color: rgba(255,255,255,0.70);
  letter-spacing: 0.02em;
}

.decode{
  position: relative;
  z-index: 1;
  max-width: 980px;
  margin: 0 auto;
  padding: 12px 18px 28px;
}

.panel{
  border-radius: var(--r);
  padding: 18px;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.panelTop{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap: 10px;
  margin-bottom: 10px;
}
.panelLabel{
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.70);
}
.panelProgress{
  font-size: 12px;
  color: rgba(255,255,255,0.70);
}

.q{
  margin-top: 6px;
  font-size: 20px;
  font-weight: 950;
  letter-spacing: -0.01em;
}

.options{
  margin-top: 12px;
  display:grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.opt{
  text-align:left;
  border-radius: 14px;
  padding: 14px 14px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(0,0,0,0.18);
  color: rgba(255,255,255,0.90);
  font-weight: 900;
  cursor:pointer;
}
.opt.on{
  border-color: rgba(0,255,220,0.26);
  background: rgba(0,255,220,0.08);
}

.nav{
  margin-top: 14px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap: 12px;
}

.resultTitle{
  font-size: 22px;
  font-weight: 950;
  letter-spacing: -0.01em;
  margin-top: 4px;
}
.resultSub{
  margin-top: 6px;
  color: rgba(255,255,255,0.72);
  font-size: 13px;
}

.resultBlock{
  margin-top: 12px;
  border-radius: 14px;
  padding: 12px;
  background: rgba(0,0,0,0.18);
  border: 1px solid rgba(255,255,255,0.10);
}
.rbLabel{
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.64);
  margin-bottom: 6px;
}
.rbText{
  font-size: 13px;
  color: rgba(255,255,255,0.80);
  line-height: 1.6;
}

.copyStatus{
  margin-top: 10px;
  font-size: 12px;
  color: rgba(0,255,220,0.80);
  min-height: 16px;
}

.sticky{
  position: sticky;
  bottom: 10px;
  padding-top: 12px;
  display:flex;
  justify-content:center;
  pointer-events: none;
}
.wide{
  width: 100%;
  max-width: 520px;
  pointer-events: auto;
}

.how{
  position: relative;
  z-index: 1;
  max-width: 980px;
  margin: 0 auto;
  padding: 0 18px 40px;
}
.howInner{
  border-radius: var(--r);
  padding: 22px;
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border);
}

.h2{
  margin: 0 0 8px;
  font-size: 22px;
  letter-spacing: -0.01em;
}
.p{
  margin: 0;
  font-size: 14px;
  line-height: 1.65;
  color: var(--muted);
  max-width: 72ch;
}

.three{
  margin-top: 14px;
  display:grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap: 10px;
}
.tile{
  border-radius: 14px;
  padding: 12px;
  background: rgba(0,0,0,0.18);
  border: 1px solid rgba(255,255,255,0.08);
}
.tileTitle{
  font-weight: 950;
  font-size: 13px;
  margin-bottom: 6px;
}
.tileBody{
  font-size: 12px;
  color: var(--muted);
  line-height: 1.45;
}

.faq{
  margin-top: 14px;
  display:grid;
  gap: 10px;
}
details{
  border-radius: 14px;
  padding: 12px;
  background: rgba(0,0,0,0.18);
  border: 1px solid rgba(255,255,255,0.08);
}
summary{
  cursor:pointer;
  font-weight: 900;
  color: rgba(255,255,255,0.88);
}
.faqBody{
  margin-top: 8px;
  font-size: 12px;
  color: var(--muted);
  line-height: 1.55;
}

.footer{
  margin-top: 16px;
  padding-top: 8px;
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  gap: 10px;
  flex-wrap: wrap;
  color: rgba(255,255,255,0.60);
}
.footLine{ font-size: 12px; max-width: 72ch; }
.footSmall{ font-size: 12px; }

@media (max-width: 820px){
  .micro{ grid-template-columns: 1fr; }
  .three{ grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce){
  *{ scroll-behavior: auto !important; }
}
`;
rt { Link } from "react-router-dom";

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
