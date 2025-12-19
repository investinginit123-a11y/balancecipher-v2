import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

/**
 * BALANCE CIPHER — Landing Page (Stable + Creation Mode)
 *
 * Key behavior change:
 * - "Start decoding" = in-page scroll to Decode Preview (does NOT navigate).
 * - "See how it works" = in-page scroll to How it works (does NOT navigate).
 * - "Apply this decode" = safe link:
 *    - if BALANCE_APP.baseUrl is set, opens app with query params
 *    - otherwise falls back to internal route (no breaking)
 *
 * Important:
 * - This file does not depend on App.tsx or the emblem.
 * - If something goes wrong, roll back Home.tsx only. Do not edit App.tsx to “fix” Home.
 */

const ROUTES = {
  overview: "/overview",
  reversal: "/reversal",
  vitReact: "/vit-react",
} as const;

/**
 * Optional: deep-link to the BALANCE App.
 * Leave baseUrl blank for now to keep everything internal and stable.
 */
const BALANCE_APP = {
  baseUrl: "", // e.g. "https://your-balance-app.vercel.app" (leave blank for now)
  demoPath: "/?demo=1&level=1&stop=1",
  applyPath: "/?start=decode",
} as const;

const ANCHORS = {
  first3: "bc-first3",
  decode: "bc-decode",
  how: "bc-how",
} as const;

type GoalKey = "raise" | "approve" | "lower" | "calm";
type TimelineKey = "fast" | "steady";
type FrictionKey = "confused" | "overwhelmed" | "noPlan" | "noFollowThrough";

type Pillar = { title: string; body: string };
type Card = { title: string; body: string };

const LABELS: {
  goal: Record<GoalKey, string>;
  timeline: Record<TimelineKey, string>;
  friction: Record<FrictionKey, string>;
} = {
  goal: {
    raise: "Raise my score",
    approve: "Get approved",
    lower: "Lower my rate",
    calm: "Stop the chaos",
  },
  timeline: { fast: "Fast", steady: "Steady" },
  friction: {
    confused: "Confused",
    overwhelmed: "Overwhelmed",
    noPlan: "No plan",
    noFollowThrough: "No follow-through",
  },
};

const COPY = {
  brand: { productName: "BALANCE Cipher", kicker: "Cipher + Co-Pilot" },

  hero: {
    headline: "Are you ready to start decoding?",
    benefitLine: "Decode your credit into one clear next move—today.",
    subhead:
      "You’re not broken. You were never given a map. The BALANCE Cipher is the map—and your AI Co-Pilot is the only guide that has the goods to decode it through the BALANCE Formula into plain language and a next best move you can actually do.",
    primaryCta: "Start decoding",
    secondaryCta: "See how it works",
    spine: "Solve it. Do the next move. Repeat.",
    seal: "The Cipher is the map. The Co-Pilot decodes it—through the BALANCE Formula—into steps.",
  },

  contrast: {
    title: "Why this feels different",
    leftTitle: "Yesterday",
    leftBody: "Random tips, confusion, drift. You start… then life happens.",
    rightTitle: "Today",
    rightBody:
      "The Co-Pilot decodes the Cipher through the BALANCE Formula—so clarity shows up fast and momentum holds.",
    acceleration:
      "Without the Cipher, decoding stays slow and frustrating. With the Cipher plus your AI Co-Pilot, what used to take days or weeks to figure out can become minutes to clarity.",
  },

  firstThree: {
    kicker: "First 3 minutes",
    title: "What you get immediately",
    subtitle: "No long lesson. No overwhelm. Clarity first—then momentum.",
    bullets: [
      { title: "Your biggest lever right now", body: "The factor that matters most today, in plain language." },
      { title: "Your next best move", body: "One clean action you can do now to create measurable progress." },
      { title: "What to ignore for now", body: "Noise gets removed so you don’t waste energy on low-impact moves." },
    ] as Pillar[],
  },

  decodePreview: {
    kicker: "Decode preview",
    title: "Try a 10-second decode",
    subtitle:
      "Pick what you want, how fast you want it, and what keeps getting in the way. Your Co-Pilot translates that into clarity and a next best move.",
    outputTitle: "Decoded output",
    decodedLabel: "Decoded truth",
    nextLabel: "Next best move",
    safetyLine: "Adult. Calm. No hype. No shame. One clear move at a time.",
    ctaPrimary: "Apply this decode",
    ctaSecondary: "Start with the basics",
    codeTitle: "Free trial access (Levels 1–40)",
    codeSubtitle:
      "Generate a code and carry it into the app later. This page only generates and passes it forward.",
    codeCta: "Generate access code",
    codeCopy: "Copy code",
  },

  mechanism: {
    kicker: "How it works",
    title: "The linkage is the product",
    subtitle:
      "A cipher is sophisticated. That’s the point. The magic is that it unlocks simple concepts and simple wording—when the right decoder is present.",
    equation: { left: "AI Co-Pilot", plus1: "BALANCE Cipher", plus2: "BALANCE Formula", equals: "Solutions" },
    pillars: [
      { title: "Cipher", body: "A sophisticated map that unlocks simple, usable truth." },
      { title: "Co-Pilot", body: "The only guide that has the goods to decode the Cipher into plain language and a next best move." },
      { title: "Formula", body: "Turns what you already know into a realistic plan you can execute." },
    ] as Pillar[],
  },

  outcomes: {
    title: "What changes today",
    subtitle:
      "Most people don’t fail because they don’t care. They fail because clarity disappears and follow-through breaks.",
    cards: [
      { title: "Minutes to clarity", body: "Stop guessing what matters and what to do first." },
      { title: "One next best move", body: "No overload. One clean action at a time." },
      { title: "Momentum that holds", body: "The plan stays alive after day one, even when life gets busy." },
    ] as Card[],
  },

  footer: {
    line: "The Cipher gives you the map. The Co-Pilot has the goods to decode it—through the BALANCE Formula—into simple steps.",
  },
} as const;

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function safeJoinUrl(baseUrl: string, pathWithQuery: string): string {
  const base = baseUrl.trim();
  if (!base) return "";
  const baseNoSlash = base.endsWith("/") ? base.slice(0, -1) : base;
  const path = pathWithQuery.startsWith("/") ? pathWithQuery : `/${pathWithQuery}`;
  return `${baseNoSlash}${path}`;
}

function buildAppApplyHref(args: { goal: GoalKey; timeline: TimelineKey; friction: FrictionKey; trialCode?: string }): string {
  const urlBase = safeJoinUrl(BALANCE_APP.baseUrl, BALANCE_APP.applyPath);
  if (!urlBase) return "";
  const qp = new URLSearchParams();
  qp.set("goal", args.goal);
  qp.set("timeline", args.timeline);
  qp.set("friction", args.friction);
  if (args.trialCode) qp.set("trial", args.trialCode);
  return `${urlBase}${urlBase.includes("?") ? "&" : "?"}${qp.toString()}`;
}

function randomBase32(length: number): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(length);
  const c = (globalThis as unknown as { crypto?: { getRandomValues?: (arr: Uint8Array) => Uint8Array } }).crypto;

  if (c?.getRandomValues) c.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);

  let out = "";
  for (let i = 0; i < bytes.length; i += 1) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

function generateTrialCode(): string {
  return `BC-${randomBase32(6)}-${randomBase32(4)}`;
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallback below
  }

  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.left = "-9999px";
    el.style.top = "-9999px";
    document.body.appendChild(el);
    el.focus();
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

function getGoalRoute(goal: GoalKey): string {
  switch (goal) {
    case "approve":
      return ROUTES.overview;
    case "lower":
      return ROUTES.reversal;
    case "calm":
      return ROUTES.vitReact;
    case "raise":
    default:
      return ROUTES.overview;
  }
}

function buildDecodeOutput(goal: GoalKey, timeline: TimelineKey, friction: FrictionKey): { decoded: string; next: string } {
  let decoded = "";
  let next = "";

  switch (goal) {
    case "raise":
      decoded =
        "Raising your score is not a mystery. It is usually one or two levers: on-time payments and how much of your available credit you are using.";
      next = "Pick one lever first. Then do one clean step today that moves that lever forward.";
      break;
    case "approve":
      decoded =
        "Approval is not luck. It is proof. Lenders want a clean story: stability, ability to pay, and no hidden risks.";
      next = "Choose what you want approval for and your timeline. Then answer a few simple questions so your Co-Pilot can map the path.";
      break;
    case "lower":
      decoded =
        "Lower rates come when your profile looks less risky. That usually means a stronger score, lower pressure, and cleaner history.";
      next = "Identify your current rate and what you owe. Then do one step that reduces risk and improves your leverage.";
      break;
    case "calm":
    default:
      decoded =
        "The chaos does not stop when you try harder. It stops when you have one clear plan and one next move you can actually finish.";
      next = "Name the loudest pressure point. Then let the Co-Pilot decode it into one short plan and one action you can complete today.";
      break;
  }

  const timelineAdd =
    timeline === "fast"
      ? "We prioritize the highest-impact move you can do now—fast clarity, fast momentum."
      : "We build a steady path you can repeat—clarity first, then consistency.";

  let frictionAdd = "";
  let frictionNext = "";

  switch (friction) {
    case "confused":
      frictionAdd = "If you feel confused, we remove jargon and focus on one lever only.";
      frictionNext = "Keep it simple: one lever, one next move. That is the win.";
      break;
    case "overwhelmed":
      frictionAdd = "If you feel overwhelmed, we shrink the problem until it fits into 10 minutes.";
      frictionNext = "Make it small enough to finish. Done creates confidence.";
      break;
    case "noPlan":
      frictionAdd = "If you have no plan, we turn the mess into a clean 3-step map you can follow.";
      frictionNext = "You do not need a perfect plan. You need the next best move.";
      break;
    case "noFollowThrough":
    default:
      frictionAdd = "If follow-through breaks, we set a small step and a simple check-in so momentum holds.";
      frictionNext = "Choose a step you can finish today. Then repeat tomorrow.";
      break;
  }

  return { decoded: `${decoded} ${timelineAdd} ${frictionAdd}`, next: `${next} ${frictionNext}` };
}

export default function Home() {
  const [goal, setGoal] = useState<GoalKey>("raise");
  const [timeline, setTimeline] = useState<TimelineKey>("fast");
  const [friction, setFriction] = useState<FrictionKey>("overwhelmed");

  const [trialCode, setTrialCode] = useState<string>("");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");

  const goalRoute = useMemo(() => getGoalRoute(goal), [goal]);
  const decodeOut = useMemo(() => buildDecodeOutput(goal, timeline, friction), [goal, timeline, friction]);

  const applyDecodeHref = useMemo(
    () => buildAppApplyHref({ goal, timeline, friction, trialCode: trialCode || undefined }),
    [goal, timeline, friction, trialCode]
  );

  const onGenerateCode = () => {
    const code = generateTrialCode();
    setTrialCode(code);
    setCopyStatus("idle");
  };

  const onCopyCode = async () => {
    if (!trialCode) return;
    const ok = await copyToClipboard(trialCode);
    setCopyStatus(ok ? "copied" : "failed");
    window.setTimeout(() => setCopyStatus("idle"), 1600);
  };

  const goalKeys: GoalKey[] = ["raise", "approve", "lower", "calm"];
  const timelineKeys: TimelineKey[] = ["fast", "steady"];
  const frictionKeys: FrictionKey[] = ["confused", "overwhelmed", "noPlan", "noFollowThrough"];

  return (
    <main className="bc-page">
      <style>{CSS}</style>
      <div className="bc-bg" aria-hidden="true" />

      <div className="bc-container">
        {/* HERO */}
        <header className="bc-hero">
          <div className="bc-heroCard">
            <div className="bc-badgeRow">
              <span className="bc-badge">{COPY.brand.productName}</span>
              <span className="bc-badgeMuted">{COPY.brand.kicker}</span>
            </div>

            <h1 className="bc-h1">{COPY.hero.headline}</h1>

            <div className="bc-benefitLine" aria-label="Immediate benefit">
              {COPY.hero.benefitLine}
            </div>

            <p className="bc-lead">{COPY.hero.subhead}</p>

            <div className="bc-seal" aria-label="Cipher and Co-Pilot linkage">
              {COPY.hero.seal}
            </div>

            <div className="bc-contrastHeader">
              <div className="bc-kickerInline">{COPY.contrast.title}</div>
            </div>

            <div className="bc-contrastGrid" role="list" aria-label="Yesterday versus Today">
              <div className="bc-contrastCard" role="listitem">
                <div className="bc-contrastTitle">{COPY.contrast.leftTitle}</div>
                <div className="bc-contrastBody">{COPY.contrast.leftBody}</div>
              </div>

              <div className="bc-contrastCard bc-contrastToday" role="listitem">
                <div className="bc-contrastTitle">{COPY.contrast.rightTitle}</div>
                <div className="bc-contrastBody">{COPY.contrast.rightBody}</div>
              </div>
            </div>

            <div className="bc-callout" role="note" aria-label="Decoding acceleration">
              <span className="bc-dot" aria-hidden="true" />
              <span className="bc-calloutText">{COPY.contrast.acceleration}</span>
            </div>

            <div className="bc-ctaRow" aria-label="Primary actions">
              <ActionButton
                variant="primary"
                onClick={() => scrollToId(ANCHORS.decode)}
                title="Start decoding (scroll to the decode preview)"
              >
                {COPY.hero.primaryCta}
              </ActionButton>

              <ActionButton
                variant="secondary"
                onClick={() => scrollToId(ANCHORS.how)}
                title="See how it works (scroll)"
              >
                {COPY.hero.secondaryCta}
              </ActionButton>
            </div>

            <div className="bc-support">{COPY.hero.spine}</div>
          </div>
        </header>

        {/* First 3 minutes */}
        <section className="bc-section" id={ANCHORS.first3} aria-labelledby="first3-title">
          <div className="bc-sectionHeader">
            <div className="bc-kicker">{COPY.firstThree.kicker}</div>
            <h2 className="bc-h2" id="first3-title">
              {COPY.firstThree.title}
            </h2>
            <p className="bc-p">{COPY.firstThree.subtitle}</p>
          </div>

          <div className="bc-grid3" role="list" aria-label="First three minutes deliverables">
            {COPY.firstThree.bullets.map((b: Pillar) => (
              <div className="bc-stepCard" key={b.title} role="listitem">
                <div className="bc-stepTitle">{b.title}</div>
                <div className="bc-stepBody">{b.body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Decode Preview */}
        <section className="bc-section" id={ANCHORS.decode} aria-labelledby="decode-title">
          <div className="bc-sectionHeader">
            <div className="bc-kicker">{COPY.decodePreview.kicker}</div>
            <h2 className="bc-h2" id="decode-title">
              {COPY.decodePreview.title}
            </h2>
            <p className="bc-p">{COPY.decodePreview.subtitle}</p>
          </div>

          <div className="bc-split">
            <div className="bc-previewControls" aria-label="Decode preview controls">
              <div className="bc-controlBlock">
                <div className="bc-controlLabel">Goal</div>
                <div className="bc-chipGrid" role="radiogroup" aria-label="Choose a goal">
                  {goalKeys.map((k: GoalKey) => (
                    <ChipRadio key={k} label={LABELS.goal[k]} checked={goal === k} onClick={() => setGoal(k)} />
                  ))}
                </div>
              </div>

              <div className="bc-controlRow">
                <div className="bc-controlBlock">
                  <div className="bc-controlLabel">Timeline</div>
                  <div className="bc-chipRow" role="radiogroup" aria-label="Choose a timeline">
                    {timelineKeys.map((k: TimelineKey) => (
                      <ChipRadio key={k} label={LABELS.timeline[k]} checked={timeline === k} onClick={() => setTimeline(k)} />
                    ))}
                  </div>
                </div>

                <div className="bc-controlBlock">
                  <div className="bc-controlLabel">What gets in the way</div>
                  <div className="bc-chipGrid" role="radiogroup" aria-label="Choose a friction">
                    {frictionKeys.map((k: FrictionKey) => (
                      <ChipRadio key={k} label={LABELS.friction[k]} checked={friction === k} onClick={() => setFriction(k)} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="bc-finePrint">{COPY.decodePreview.safetyLine}</div>
            </div>

            <div className="bc-panel" aria-label="Decode preview output">
              <div className="bc-panelLabel">{COPY.decodePreview.outputTitle}</div>
              <div className="bc-panelTitle">
                {LABELS.goal[goal]} · {LABELS.timeline[timeline]} · {LABELS.friction[friction]}
              </div>

              <div className="bc-outputBlock" role="group" aria-label="Decoded output">
                <div className="bc-outputLabel">{COPY.decodePreview.decodedLabel}</div>
                <div className="bc-outputText">{decodeOut.decoded}</div>
              </div>

              <div className="bc-outputBlock" role="group" aria-label="Next best move">
                <div className="bc-outputLabel">{COPY.decodePreview.nextLabel}</div>
                <div className="bc-outputText">{decodeOut.next}</div>
              </div>

              <div className="bc-codeBlock" role="group" aria-label="Free trial access code">
                <div className="bc-codeTitle">{COPY.decodePreview.codeTitle}</div>
                <div className="bc-codeSub">{COPY.decodePreview.codeSubtitle}</div>

                <div className="bc-codeRow">
                  <div className={`bc-codePill ${trialCode ? "hasCode" : ""}`}>{trialCode || "No code generated yet"}</div>

                  <button type="button" className="bc-miniBtn" onClick={onGenerateCode}>
                    {COPY.decodePreview.codeCta}
                  </button>

                  <button type="button" className="bc-miniBtn" onClick={onCopyCode} disabled={!trialCode} aria-disabled={!trialCode}>
                    {COPY.decodePreview.codeCopy}
                  </button>
                </div>

                {copyStatus !== "idle" && (
                  <div className={`bc-codeStatus ${copyStatus}`}>
                    {copyStatus === "copied" ? "Code copied." : "Copy failed. You can still select and copy it."}
                  </div>
                )}
              </div>

              <div className="bc-ctaRow" aria-label="Decode preview actions">
                <ActionLink
                  variant="primary"
                  external
                  href={applyDecodeHref}
                  fallbackTo={goalRoute}
                  title="Apply this decode (deep-link optional, internal fallback)"
                >
                  {COPY.decodePreview.ctaPrimary}
                </ActionLink>

                <ActionLink variant="secondary" to={ROUTES.reversal}>
                  {COPY.decodePreview.ctaSecondary}
                </ActionLink>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bc-section" id={ANCHORS.how} aria-labelledby="how-title">
          <div className="bc-sectionHeader">
            <div className="bc-kicker">{COPY.mechanism.kicker}</div>
            <h2 className="bc-h2" id="how-title">
              {COPY.mechanism.title}
            </h2>
            <p className="bc-p">{COPY.mechanism.subtitle}</p>
          </div>

          <div className="bc-equation" aria-label="Mechanism equation">
            <span className="bc-eqItem">{COPY.mechanism.equation.left}</span>
            <span className="bc-eqOp" aria-hidden="true">+</span>
            <span className="bc-eqItem">{COPY.mechanism.equation.plus1}</span>
            <span className="bc-eqOp" aria-hidden="true">+</span>
            <span className="bc-eqItem">{COPY.mechanism.equation.plus2}</span>
            <span className="bc-eqEq" aria-hidden="true">=</span>
            <span className="bc-eqResult">{COPY.mechanism.equation.equals}</span>
          </div>

          <div className="bc-grid3" role="list" aria-label="Cipher, Co-Pilot, Formula">
            {COPY.mechanism.pillars.map((p: Pillar) => (
              <div className="bc-stepCard" key={p.title} role="listitem">
                <div className="bc-stepTitle">{p.title}</div>
                <div className="bc-stepBody">{p.body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Outcomes */}
        <section className="bc-section" aria-labelledby="outcomes-title">
          <div className="bc-sectionHeader">
            <h2 className="bc-h2" id="outcomes-title">{COPY.outcomes.title}</h2>
            <p className="bc-p">{COPY.outcomes.subtitle}</p>
          </div>

          <div className="bc-grid3" role="list" aria-label="What changes today">
            {COPY.outcomes.cards.map((c: Card) => (
              <div className="bc-card" key={c.title} role="listitem">
                <div className="bc-cardTitle">{c.title}</div>
                <div className="bc-cardBody">{c.body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="bc-footer">
          <div className="bc-footerLine">{COPY.footer.line}</div>
          <div className="bc-footerSmall">© {new Date().getFullYear()} BALANCE Cipher</div>
        </footer>
      </div>
    </main>
  );
}

/* UI components */

function ActionButton(props: { variant: "primary" | "secondary"; onClick: () => void; title?: string; children: ReactNode }) {
  const className = props.variant === "primary" ? "bc-btn bc-btnPrimary" : "bc-btn bc-btnSecondary";
  return (
    <button type="button" className={className} onClick={props.onClick} title={props.title}>
      {props.children}
    </button>
  );
}

function ActionLink(props: {
  variant: "primary" | "secondary";
  to?: string;
  external?: boolean;
  href?: string;
  fallbackTo?: string;
  title?: string;
  children: ReactNode;
}) {
  const className = props.variant === "primary" ? "bc-btn bc-btnPrimary" : "bc-btn bc-btnSecondary";

  if (props.external) {
    const href = (props.href || "").trim();
    if (href) {
      return (
        <a className={className} href={href} target="_blank" rel="noopener noreferrer" title={props.title}>
          {props.children}
        </a>
      );
    }
    const fallback = props.fallbackTo || props.to || "/";
    return (
      <Link className={className} to={fallback} title="Fallback route (app URL not configured yet)">
        {props.children}
      </Link>
    );
  }

  return (
    <Link className={className} to={props.to || "/"} title={props.title}>
      {props.children}
    </Link>
  );
}

function ChipRadio(props: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`bc-chip ${props.checked ? "isActive" : ""}`}
      role="radio"
      aria-checked={props.checked}
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
}

/* CSS */

const CSS = `
:root{
  --bg:#050B18;
  --panel: rgba(255,255,255,0.04);
  --panel2: rgba(0,0,0,0.22);
  --border: rgba(255,255,255,0.10);
  --border2: rgba(0,255,220,0.18);
  --text: rgba(255,255,255,0.92);
  --muted: rgba(255,255,255,0.74);
  --teal: rgba(0,255,220,0.92);
  --teal2: rgba(0,190,255,0.82);
  --shadow: 0 18px 50px rgba(0,0,0,0.35);
  --r16: 16px;
  --r18: 18px;
  --r20: 20px;
}

.bc-page{ min-height:100vh; background: var(--bg); color: var(--text); position:relative; overflow-x:hidden; }
.bc-bg{
  position:absolute; inset:0; pointer-events:none;
  background:
    radial-gradient(900px 520px at 14% 10%, rgba(0,255,220,0.18), transparent 55%),
    radial-gradient(780px 520px at 86% 18%, rgba(0,190,255,0.12), transparent 55%),
    radial-gradient(900px 760px at 50% 96%, rgba(255,180,70,0.06), transparent 55%);
}
.bc-container{ position:relative; max-width:1120px; margin:0 auto; padding: 28px 18px 40px; }

.bc-hero{ padding-top:10px; padding-bottom:10px; }
.bc-heroCard{
  border-radius: var(--r20);
  background: var(--panel);
  border: 1px solid var(--border);
  padding: 22px;
  box-shadow: var(--shadow);
}

.bc-badgeRow{ display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin-bottom:10px; }
.bc-badge{
  font-size:12px; letter-spacing:0.10em; text-transform:uppercase;
  padding:7px 10px; border-radius:999px;
  background: rgba(0,255,220,0.10);
  border:1px solid rgba(0,255,220,0.25);
}
.bc-badgeMuted{ font-size:12px; color: rgba(255,255,255,0.70); }

.bc-h1{ font-size: clamp(28px, 4vw, 44px); line-height:1.08; margin: 10px 0 8px; letter-spacing:-0.02em; }

.bc-benefitLine{
  font-size: 15px; line-height: 1.45; font-weight: 900;
  color: rgba(255,255,255,0.86);
  padding: 10px 12px; border-radius: 14px;
  background: rgba(0,255,220,0.08);
  border: 1px solid var(--border2);
  display: inline-block;
  margin-bottom: 10px;
}

.bc-lead{ font-size: 16px; line-height:1.6; color: rgba(255,255,255,0.80); margin: 0 0 10px; max-width: 980px; }

.bc-seal{ font-size: 13px; color: rgba(255,255,255,0.72); margin-bottom: 10px; }
.bc-contrastHeader{ margin-top: 12px; }
.bc-kickerInline{ font-size:12px; letter-spacing:0.10em; text-transform:uppercase; color: rgba(0,255,220,0.75); }

.bc-contrastGrid{
  display:grid; grid-template-columns: repeat(2, minmax(0,1fr));
  gap:12px; margin-top:12px; margin-bottom:12px;
}
.bc-contrastCard{ border-radius: var(--r18); padding: 14px; background: var(--panel2); border:1px solid var(--border); }
.bc-contrastToday{ background: rgba(0,255,220,0.08); border: 1px solid var(--border2); }
.bc-contrastTitle{ font-size:12px; letter-spacing:0.10em; text-transform:uppercase; color: rgba(255,255,255,0.70); margin-bottom:8px; }
.bc-contrastBody{ font-size:13px; line-height:1.5; color: rgba(255,255,255,0.82); }

.bc-callout{
  display:flex; gap:10px; align-items:flex-start;
  padding: 12px 12px; border-radius: var(--r16);
  background: var(--panel2); border: 1px solid var(--border2);
  margin-bottom: 10px;
}
.bc-dot{ width:10px; height:10px; border-radius:50%; background: rgba(0,255,220,0.85); box-shadow: 0 0 18px rgba(0,255,220,0.28); margin-top:4px; flex:0 0 auto; }
.bc-calloutText{ font-size:13px; line-height:1.45; color: rgba(255,255,255,0.80); }

.bc-ctaRow{ display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin-top:10px; margin-bottom:10px; }

.bc-btn{
  display:inline-flex; align-items:center; justify-content:center;
  padding: 12px 14px; border-radius: 14px;
  text-decoration:none; font-weight: 900;
  border: 1px solid transparent;
  transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;
  cursor:pointer;
}
.bc-btn:focus-visible{ outline: 2px solid rgba(0,255,220,0.65); outline-offset: 3px; }
.bc-btn:hover{ transform: translateY(-1px); }
.bc-btnPrimary{
  color: rgba(0,0,0,0.92);
  background: linear-gradient(180deg, var(--teal), var(--teal2));
  box-shadow: 0 12px 28px rgba(0,255,220,0.18);
}
.bc-btnSecondary{
  color: rgba(255,255,255,0.90);
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.12);
}

.bc-support{ margin-top: 6px; font-size: 13px; color: rgba(255,255,255,0.72); }

.bc-section{
  margin-top:18px; border-radius: var(--r20);
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border);
  padding: 22px;
  box-shadow: 0 18px 50px rgba(0,0,0,0.25);
}
.bc-sectionHeader{ margin-bottom: 14px; max-width: 980px; }
.bc-kicker{ font-size:12px; letter-spacing:0.10em; text-transform:uppercase; color: rgba(0,255,220,0.75); margin-bottom:10px; }
.bc-h2{ font-size: 24px; margin:0 0 8px; letter-spacing:-0.01em; }
.bc-p{ margin:0; font-size:14px; line-height:1.65; color: var(--muted); }

.bc-grid3{ display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap:12px; margin-top:12px; }
.bc-stepCard{
  border-radius: var(--r18);
  padding: 16px;
  background: linear-gradient(180deg, rgba(0,255,220,0.06), rgba(0,0,0,0.22));
  border: 1px solid rgba(0,255,220,0.14);
}
.bc-stepTitle{ font-size:14px; font-weight: 950; margin-bottom:8px; }
.bc-stepBody{ font-size:13px; line-height:1.55; color: rgba(255,255,255,0.74); }

.bc-split{ display:grid; grid-template-columns: 1.15fr 0.85fr; gap:14px; align-items:start; }

.bc-previewControls{
  border-radius: var(--r18);
  padding: 16px;
  background: var(--panel2);
  border: 1px solid var(--border);
}
.bc-controlBlock{ margin-bottom: 14px; }
.bc-controlRow{ display:grid; grid-template-columns: 1fr; gap: 12px; }
.bc-controlLabel{
  font-size: 12px; letter-spacing: 0.10em; text-transform: uppercase;
  color: rgba(255,255,255,0.70);
  margin-bottom: 10px;
}
.bc-chipRow{ display:flex; flex-wrap:wrap; gap:10px; }
.bc-chipGrid{ display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:10px; }

.bc-chip{
  width: 100%;
  border-radius: 14px;
  padding: 12px 12px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.90);
  font-weight: 950;
  text-align: left;
  transition: transform 120ms ease, border-color 120ms ease, box-shadow 120ms ease;
}
.bc-chip:hover{ transform: translateY(-1px); }
.bc-chip:focus-visible{ outline: 2px solid rgba(0,255,220,0.65); outline-offset: 3px; }
.bc-chip.isActive{
  background: rgba(0,255,220,0.10);
  border: 1px solid rgba(0,255,220,0.26);
  box-shadow: 0 14px 30px rgba(0,255,220,0.10);
}

.bc-panel{
  border-radius: var(--r18);
  padding: 16px;
  background: radial-gradient(520px 320px at 30% 20%, rgba(0,255,220,0.10), transparent 55%),
              rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.12);
  min-height: 220px;
}
.bc-panelLabel{
  font-size:12px; letter-spacing:0.10em; text-transform:uppercase;
  color: rgba(255,255,255,0.65);
  margin-bottom:10px;
}
.bc-panelTitle{ font-size:16px; font-weight: 950; margin-bottom:10px; }

.bc-outputBlock{
  border-radius: 16px;
  padding: 12px;
  background: rgba(0,0,0,0.20);
  border: 1px solid rgba(255,255,255,0.10);
  margin-top: 10px;
}
.bc-outputLabel{
  font-size: 11px; letter-spacing: 0.10em; text-transform: uppercase;
  color: rgba(255,255,255,0.65);
  margin-bottom: 8px;
}
.bc-outputText{ font-size: 13px; line-height: 1.6; color: rgba(255,255,255,0.80); }

.bc-codeBlock{
  margin-top: 12px;
  border-radius: 16px;
  padding: 12px;
  background: rgba(0,0,0,0.18);
  border: 1px solid rgba(255,255,255,0.10);
}
.bc-codeTitle{ font-size: 13px; font-weight: 950; margin-bottom: 6px; }
.bc-codeSub{ font-size: 12px; color: rgba(255,255,255,0.68); line-height: 1.45; margin-bottom: 10px; }

.bc-codeRow{ display:flex; flex-wrap:wrap; gap:10px; align-items:center; }
.bc-codePill{
  flex: 1 1 220px;
  border-radius: 14px;
  padding: 10px 12px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.10);
  font-weight: 950;
  color: rgba(255,255,255,0.78);
}
.bc-codePill.hasCode{
  background: rgba(0,255,220,0.08);
  border: 1px solid rgba(0,255,220,0.18);
  color: rgba(255,255,255,0.88);
}
.bc-miniBtn{
  border-radius: 14px;
  padding: 10px 12px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.90);
  font-weight: 950;
  cursor: pointer;
}
.bc-miniBtn:disabled{ opacity: 0.55; cursor: not-allowed; }
.bc-miniBtn:focus-visible{ outline: 2px solid rgba(0,255,220,0.65); outline-offset: 3px; }

.bc-codeStatus{
  margin-top: 10px;
  font-size: 12px;
  color: rgba(255,255,255,0.72);
}
.bc-codeStatus.copied{ color: rgba(0,255,220,0.85); }
.bc-codeStatus.failed{ color: rgba(255,180,70,0.85); }

.bc-equation{
  border-radius: var(--r18);
  padding: 16px;
  background: var(--panel2);
  border: 1px solid var(--border);
  display:flex; flex-wrap:wrap; align-items:center; gap:10px;
  margin-top:14px;
}
.bc-eqItem{
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  font-weight: 950;
  font-size: 13px;
}
.bc-eqOp{ font-size:16px; font-weight: 950; color: rgba(255,255,255,0.75); }
.bc-eqEq{ font-size:16px; font-weight: 950; color: rgba(0,255,220,0.85); }
.bc-eqResult{
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(0,255,220,0.10);
  border: 1px solid rgba(0,255,220,0.22);
  font-weight: 980;
  font-size: 13px;
}

.bc-card{ border-radius: var(--r18); padding: 16px; background: var(--panel2); border: 1px solid var(--border); }
.bc-cardTitle{ font-size:14px; font-weight: 950; margin-bottom:8px; }
.bc-cardBody{ font-size:13px; line-height:1.55; color: rgba(255,255,255,0.72); }

.bc-footer{
  margin-top:18px;
  padding: 14px 4px 2px;
  display:flex;
  justify-content:space-between;
  gap:12px;
  flex-wrap:wrap;
  color: rgba(255,255,255,0.60);
}
.bc-footerLine{ font-size:12px; }
.bc-footerSmall{ font-size:12px; }

@media (max-width: 880px){
  .bc-grid3{ grid-template-columns: 1fr; }
  .bc-contrastGrid{ grid-template-columns: 1fr; }
  .bc-split{ grid-template-columns: 1fr; }
  .bc-chipGrid{ grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce){
  .bc-btn, .bc-chip{ transition:none; }
  .bc-btn:hover, .bc-chip:hover{ transform:none; }
}
`;
