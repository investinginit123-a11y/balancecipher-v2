import React, { useMemo, useState } from "react";

type Direction = 1 | -1;
type StepIndex = 0 | 1 | 2;

type Step = {
  key: "hero" | "ten-second" | "apply";
  chapter?: string;
  title: string;
  subtitle?: string;
  body: React.ReactNode;
  primaryCta: string;
  onPrimary: () => void;
  secondaryCta?: string;
  onSecondary?: () => void;
};

export default function App() {
  const [stepIndex, setStepIndex] = useState<StepIndex>(0);
  const [direction, setDirection] = useState<Direction>(1);

  const goTo = (nextIndex: StepIndex) => {
    if (nextIndex === stepIndex) return;
    setDirection(nextIndex > stepIndex ? 1 : -1);
    setStepIndex(nextIndex);
  };

  const next = () => goTo((stepIndex === 2 ? 2 : ((stepIndex + 1) as StepIndex)) as StepIndex);
  const prev = () => goTo((stepIndex === 0 ? 0 : ((stepIndex - 1) as StepIndex)) as StepIndex);

  const steps = useMemo(() => {
    const s: [Step, Step, Step] = [
      {
        key: "hero",
        chapter: "CHAPTER 1 — POWER SOURCE",
        title: "A cipher is a superpower you can hold.",
        subtitle:
          "Tony Stark wasn’t Iron Man without the arc reactor. This is that idea applied to your decisions: the Cipher is the core, and the AI Co-Pilot is the intelligence that decodes it.",
        body: (
          <>
            <div style={styles.powerCard}>
              <div style={styles.powerLabel}>WHAT YOU’RE ACTUALLY GETTING</div>

              <div style={styles.powerLine}>
                The BALANCE Cipher is not a “tip.” It’s a <strong>power source</strong>.
              </div>

              <div style={styles.powerLine}>
                It turns overwhelming money problems into one clear handle —{" "}
                <strong>the next decision that matters most.</strong>
              </div>

              <div style={styles.powerPunch}>
                When you have the Cipher, you can do what you could not do before:
                <br />
                <strong>you can decode uncertainty into action.</strong>
              </div>
            </div>

            <div style={styles.storyCard}>
              <div style={styles.storyTitle}>The real promise</div>

              <p style={styles.p}>
                You’re not here to “fix everything.” You’re here to stop guessing.
              </p>

              <p style={styles.p}>
                Fix the next decision, and you start fixing your credit and yourself along the way — or fix your credit
                and yourself along the way because you can finally make decisions that used to feel impossible.
              </p>

              <p style={styles.p}>
                The power isn’t loud. It’s accurate. It’s the difference between spinning and moving.
              </p>
            </div>

            <div style={styles.linkCard}>
              <div style={styles.linkTitle}>Co-Pilot + Cipher (linked)</div>

              <div style={styles.linkRow}>
                <div style={styles.linkCol}>
                  <div style={styles.linkHead}>The Cipher</div>
                  <div style={styles.linkText}>
                    The structure. The core. The pattern that reveals what matters.
                  </div>
                </div>

                <div style={styles.linkCol}>
                  <div style={styles.linkHead}>The AI Co-Pilot</div>
                  <div style={styles.linkText}>
                    The decoder. The one that has the goods to translate the Cipher into simple actions — via the BALANCE
                    Formula.
                  </div>
                </div>

                <div style={styles.linkCol}>
                  <div style={styles.linkHead}>You</div>
                  <div style={styles.linkText}>
                    The operator. You execute one step and keep the power in your hands.
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.inviteLine}>
              If you want to feel it, we power it up with one protocol. One step. No overwhelm.
            </div>
          </>
        ),
        primaryCta: "Power Up the Cipher",
        onPrimary: () => next(),
        secondaryCta: "Show me the protocol",
        onSecondary: () => next(),
      },
      {
        key: "ten-second",
        chapter: "CHAPTER 2 — THE PROTOCOL",
        title: "This is how the reactor stays stable: 10 seconds.",
        subtitle:
          "The 10-Second Rule is the safety system. If you can’t say your next step in 10 seconds, it’s not decoded yet — so we reduce it until it is.",
        body: (
          <>
            <div style={styles.protocolGrid}>
              <div style={styles.protocolPanel}>
                <div style={styles.panelTitle}>Say it</div>
                <div style={styles.quote}>
                  “My next step is <span style={styles.underline}>_____</span>.”
                </div>

                <div style={styles.panelText}>
                  If you hesitate, you don’t need motivation. You need a smaller step.
                </div>

                <div style={styles.protocolNote}>
                  This is the hero move: cross the threshold with a step, not a speech.
                </div>
              </div>

              <div style={styles.protocolPanel}>
                <div style={styles.panelTitle}>Example</div>
                <div style={styles.exampleGrid}>
                  <div style={styles.exampleBad}>
                    <div style={styles.exampleLabel}>Too big</div>
                    <div style={styles.exampleText}>“Fix my finances.”</div>
                    <div style={styles.exampleSub}>No handle. No first move.</div>
                  </div>
                  <div style={styles.exampleGood}>
                    <div style={styles.exampleLabel}>Decoded</div>
                    <div style={styles.exampleText}>“List my four bills due this week.”</div>
                    <div style={styles.exampleSub}>Now you have leverage.</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.cornerstoneLine}>Are you ready to start decoding?</div>
          </>
        ),
        primaryCta: "Decode My Next Step",
        onPrimary: () => next(),
        secondaryCta: "Back",
        onSecondary: () => prev(),
      },
      {
        key: "apply",
        chapter: "CHAPTER 3 — FIRST ACTION",
        title: "One decision. One move. Momentum.",
        subtitle: "The Cipher gives structure. The Co-Pilot decodes. You execute — and you keep the power.",
        body: (
          <>
            <div style={styles.storyCard}>
              <div style={styles.storyTitle}>What happens when you enter</div>
              <ul style={styles.ul}>
                <li style={styles.li}>
                  You bring the question that’s been stuck in your head.
                </li>
                <li style={styles.li}>
                  The Cipher organizes it into what matters.
                </li>
                <li style={styles.li}>
                  The Co-Pilot decodes it into a 10-second next step.
                </li>
                <li style={styles.li}>
                  You take the step — and the next one becomes easier.
                </li>
              </ul>
            </div>

            <div style={styles.inviteLine}>
              This is balance and freedom in the real world: clarity you can use, without overwhelm.
            </div>
          </>
        ),
        primaryCta: "Enter the Cipher",
        onPrimary: () => {
          window.location.hash = "#start";
        },
        secondaryCta: "Back",
        onSecondary: () => prev(),
      },
    ];
    return s;
  }, [stepIndex]);

  const active = steps[stepIndex];

  return (
    <div style={styles.page}>
      <GlobalStyles />

      <div className="bgGlow" aria-hidden="true" />
      <div className="gridOverlay" aria-hidden="true" />
      <div className="dust" aria-hidden="true" />

      {/* HERO REACTOR BAY */}
      <section style={styles.heroTop}>
        <div className="reactor" aria-hidden="true">
          <div className="reactorRing ringA" />
          <div className="reactorRing ringB" />
          <div className="reactorCore" />
          <img
            src="/brand/cipher-emblem.png"
            alt="BALANCE Cipher emblem"
            className="heroEmblem"
            style={styles.heroEmblem}
          />
        </div>

        <div style={styles.heroTopText}>
          <div style={styles.chapter}>{active.chapter}</div>
          <div style={styles.brandTitle}>BALANCE</div>
        </div>
      </section>

      <header style={styles.header}>
        <div style={styles.dots} aria-label="Progress">
          {([0, 1, 2] as const).map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={`dot ${i === stepIndex ? "dotActive" : ""}`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.viewport}>
          <div
            key={active.key}
            style={{
              ...styles.card,
              ...slideInStyle(direction),
            }}
          >
            <div style={styles.titleBlock}>
              <h1 style={styles.h1}>{active.title}</h1>
              {active.subtitle ? <div style={styles.subtitle}>{active.subtitle}</div> : null}
            </div>

            <div style={styles.divider} />

            <div>{active.body}</div>

            <div style={styles.ctaRow}>
              {active.secondaryCta && active.onSecondary ? (
                <button type="button" onClick={active.onSecondary} className="btnSecondary">
                  {active.secondaryCta}
                </button>
              ) : (
                <span />
              )}

              <div className="ctaWrap">
                <div className="cipherCore" aria-hidden="true" />
                <button type="button" onClick={active.onPrimary} className="btnPrimary">
                  <span className="btnPrimaryText">{active.primaryCta}</span>
                  <span className="btnShimmer" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div style={styles.footerHint}>
              Co-Pilot + Cipher, linked: the Cipher provides structure; the Co-Pilot decodes it into simple actions.
            </div>
          </div>
        </div>
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerLine}>
          Next enhancement: a “Cipher Lore” reveal panel (tap to open) that hits wars → codebreaking → power → your life.
        </div>
      </footer>
    </div>
  );
}

function slideInStyle(direction: Direction): React.CSSProperties {
  const name = direction === 1 ? "slideInFromRight" : "slideInFromLeft";
  return { animation: `${name} 300ms ease-out` };
}

function GlobalStyles() {
  return (
    <style>
      {`
        @keyframes slideInFromRight { from { transform: translateX(28px); opacity: 0.0; } to { transform: translateX(0px); opacity: 1.0; } }
        @keyframes slideInFromLeft  { from { transform: translateX(-28px); opacity: 0.0; } to { transform: translateX(0px); opacity: 1.0; } }

        @keyframes breatheGlow {
          0%   { box-shadow: 0 0 0 rgba(0,255,214,0.0), 0 16px 60px rgba(0,0,0,0.55); }
          50%  { box-shadow: 0 0 28px rgba(0,255,214,0.22), 0 16px 60px rgba(0,0,0,0.55); }
          100% { box-shadow: 0 0 0 rgba(0,255,214,0.0), 0 16px 60px rgba(0,0,0,0.55); }
        }

        @keyframes shimmerSweep {
          0%   { transform: translateX(-140%); opacity: 0.0; }
          25%  { opacity: 0.50; }
          100% { transform: translateX(140%); opacity: 0.0; }
        }

        @keyframes ringSpin {
          0% { transform: translate(-50%,-50%) rotate(0deg); opacity: 0.55; }
          50% { opacity: 0.95; }
          100% { transform: translate(-50%,-50%) rotate(360deg); opacity: 0.55; }
        }

        @keyframes ringPulse {
          0%   { transform: translate(-50%,-50%) scale(0.98); opacity: 0.35; }
          50%  { transform: translate(-50%,-50%) scale(1.03); opacity: 0.82; }
          100% { transform: translate(-50%,-50%) scale(0.98); opacity: 0.35; }
        }

        @keyframes emblemBreath {
          0%   { transform: scale(0.99); filter: drop-shadow(0 0 18px rgba(0,255,214,0.10)); }
          50%  { transform: scale(1.02); filter: drop-shadow(0 0 34px rgba(0,255,214,0.18)); }
          100% { transform: scale(0.99); filter: drop-shadow(0 0 18px rgba(0,255,214,0.10)); }
        }

        @keyframes dustDrift {
          0%   { transform: translateY(0px); opacity: 0.10; }
          50%  { opacity: 0.18; }
          100% { transform: translateY(14px); opacity: 0.10; }
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }

        .bgGlow {
          position: absolute;
          inset: -20%;
          background: radial-gradient(closest-side, rgba(0, 255, 214, 0.12), rgba(0, 0, 0, 0) 72%);
          filter: blur(14px);
          pointer-events: none;
        }

        .gridOverlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 56px 56px;
          opacity: 0.12;
          pointer-events: none;
        }

        .dust {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 10% 20%, rgba(255,255,255,0.10), transparent 35%),
            radial-gradient(circle at 70% 30%, rgba(255,255,255,0.08), transparent 40%),
            radial-gradient(circle at 40% 80%, rgba(255,255,255,0.06), transparent 45%);
          opacity: 0.12;
          animation: dustDrift 5.5s ease-in-out infinite;
          pointer-events: none;
        }

        .reactor {
          position: relative;
          width: min(56vw, 260px);
          height: min(56vw, 260px);
          max-height: 30vh;
          max-width: 30vh;
          border-radius: 999px;
          display: grid;
          place-items: center;
        }

        .reactorRing {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 100%;
          height: 100%;
          border-radius: 999px;
          transform: translate(-50%,-50%);
          border: 1px solid rgba(0,255,214,0.18);
          box-shadow: 0 0 46px rgba(0,255,214,0.10), inset 0 0 26px rgba(0,255,214,0.06);
          background: radial-gradient(circle, rgba(0,255,214,0.10), rgba(0,0,0,0) 62%);
          pointer-events: none;
        }

        .ringA { animation: ringSpin 6.2s linear infinite; }
        .ringB {
          width: 86%;
          height: 86%;
          border: 1px solid rgba(255,255,255,0.10);
          background: radial-gradient(circle, rgba(0,255,214,0.08), rgba(0,0,0,0) 64%);
          animation: ringPulse 2.2s ease-in-out infinite;
        }

        .reactorCore {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 42%;
          height: 42%;
          transform: translate(-50%,-50%);
          border-radius: 999px;
          border: 1px solid rgba(0,255,214,0.24);
          background: radial-gradient(circle, rgba(0,255,214,0.16), rgba(0,0,0,0) 70%);
          box-shadow: 0 0 50px rgba(0,255,214,0.14);
          pointer-events: none;
        }

        .heroEmblem { width: 70%; height: auto; animation: emblemBreath 2.6s ease-in-out infinite; }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.06);
          cursor: pointer;
        }
        .dotActive {
          background: rgba(0,255,214,0.70);
          border: 1px solid rgba(0,255,214,0.90);
          box-shadow: 0 0 18px rgba(0,255,214,0.18);
        }

        .ctaWrap { position: relative; display: inline-flex; align-items: center; justify-content: center; }
        .cipherCore {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 92px;
          height: 92px;
          border-radius: 999px;
          transform: translate(-50%,-50%);
          border: 1px solid rgba(0,255,214,0.22);
          box-shadow: 0 0 34px rgba(0,255,214,0.12), inset 0 0 22px rgba(0,255,214,0.08);
          background: radial-gradient(circle, rgba(0,255,214,0.10), rgba(0,0,0,0) 60%);
          animation: ringPulse 1.9s ease-in-out infinite;
          pointer-events: none;
        }

        .btnPrimary {
          position: relative;
          overflow: hidden;
          border-radius: 18px;
          padding: 14px 18px;
          border: 1px solid rgba(0,255,214,0.42);
          background: rgba(0,255,214,0.14);
          color: rgba(255,255,255,0.92);
          font-weight: 900;
          letter-spacing: 0.02em;
          cursor: pointer;
          min-width: 270px;
          backdrop-filter: blur(8px);
          animation: breatheGlow 2.8s ease-in-out infinite;
        }
        .btnPrimary:active { transform: translateY(1px); }
        .btnPrimaryText { position: relative; z-index: 2; }
        .btnShimmer {
          position: absolute;
          top: -40%;
          left: 0;
          width: 60%;
          height: 180%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
          transform: translateX(-140%);
          animation: shimmerSweep 3.0s ease-in-out infinite;
          z-index: 1;
          pointer-events: none;
        }

        .btnSecondary {
          border-radius: 16px;
          padding: 12px 16px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.86);
          font-weight: 750;
          cursor: pointer;
        }
      `}
    </style>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#071423", color: "rgba(255,255,255,0.92)", position: "relative", overflow: "hidden" },

  heroTop: { padding: "18px 18px 6px", maxWidth: 1040, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, position: "relative", zIndex: 2 },
  heroEmblem: { width: "100%", height: "auto" },
  heroTopText: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, minWidth: 180 },

  header: { padding: "0 18px 10px", maxWidth: 1040, margin: "0 auto", display: "flex", justifyContent: "flex-end", position: "relative", zIndex: 2 },

  chapter: { fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(0,255,214,0.86)", fontWeight: 850, textAlign: "right" },
  brandTitle: { fontSize: 18, letterSpacing: "0.10em", fontWeight: 900 },
  dots: { display: "flex", gap: 8, alignItems: "center" },

  main: { padding: "6px 18px 22px", maxWidth: 1040, margin: "0 auto", position: "relative", zIndex: 2 },
  viewport: { position: "relative" },

  card: { borderRadius: 24, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(10, 24, 40, 0.78)", boxShadow: "0 18px 60px rgba(0,0,0,0.55)", padding: 22, backdropFilter: "blur(12px)", maxWidth: 920, margin: "0 auto" },

  titleBlock: { display: "flex", flexDirection: "column", gap: 10 },
  h1: { margin: 0, fontSize: 30, lineHeight: 1.14, letterSpacing: "-0.02em" },
  subtitle: { color: "rgba(255,255,255,0.78)", fontSize: 15, lineHeight: 1.6, maxWidth: 780 },

  divider: { height: 1, background: "linear-gradient(90deg, rgba(0,255,214,0.55), rgba(255,255,255,0.08))", margin: "14px 0 16px" },

  p: { margin: "0 0 12px", fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.86)" },

  powerCard: { borderRadius: 18, border: "1px solid rgba(0,255,214,0.22)", background: "rgba(0,255,214,0.07)", padding: 14, marginBottom: 14 },
  powerLabel: { fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(0,255,214,0.92)", fontWeight: 900, marginBottom: 10 },
  powerLine: { fontSize: 15, lineHeight: 1.65, color: "rgba(255,255,255,0.90)", marginBottom: 10 },
  powerPunch: { marginTop: 10, padding: "10px 12px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.05)", fontSize: 16, lineHeight: 1.6, fontWeight: 900 },

  storyCard: { borderRadius: 18, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.04)", padding: 14, marginBottom: 14 },
  storyTitle: { fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.72)", fontWeight: 900, marginBottom: 10 },

  linkCard: { borderRadius: 18, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.04)", padding: 14, marginBottom: 12 },
  linkTitle: { fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.72)", fontWeight: 900, marginBottom: 10 },
  linkRow: { display: "grid", gridTemplateColumns: "1fr", gap: 10 },
  linkCol: { borderRadius: 16, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.03)", padding: 12 },
  linkHead: { fontSize: 13, fontWeight: 900, color: "rgba(255,255,255,0.92)", marginBottom: 6 },
  linkText: { fontSize: 13, lineHeight: 1.55, color: "rgba(255,255,255,0.78)" },

  inviteLine: { marginTop: 8, color: "rgba(255,255,255,0.70)", fontSize: 13, lineHeight: 1.6 },

  protocolGrid: { display: "grid", gridTemplateColumns: "1fr", gap: 12 },
  protocolPanel: { borderRadius: 18, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.04)", padding: 14 },
  panelTitle: { fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.72)", fontWeight: 900, marginBottom: 10 },
  quote: { fontSize: 18, lineHeight: 1.35, color: "rgba(255,255,255,0.92)", marginBottom: 10 },
  underline: { borderBottom: "2px solid rgba(0,255,214,0.55)", paddingBottom: 1 },
  panelText: { color: "rgba(255,255,255,0.78)", fontSize: 14, lineHeight: 1.55 },
  protocolNote: { marginTop: 10, color: "rgba(255,255,255,0.70)", fontSize: 13, lineHeight: 1.6 },

  exampleGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  exampleBad: { borderRadius: 16, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.04)", padding: 12 },
  exampleGood: { borderRadius: 16, border: "1px solid rgba(0,255,214,0.20)", background: "rgba(0,255,214,0.06)", padding: 12 },
  exampleLabel: { fontSize: 12, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(255,255,255,0.72)", fontWeight: 900, marginBottom: 8 },
  exampleText: { fontSize: 14, color: "rgba(255,255,255,0.92)", lineHeight: 1.5, fontWeight: 900 },
  exampleSub: { marginTop: 6, fontSize: 12, color: "rgba(255,255,255,0.68)", lineHeight: 1.45 },

  cornerstoneLine: { marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.78)", fontSize: 13, lineHeight: 1.6 },

  ul: { margin: 0, paddingLeft: 18 },
  li: { margin: "10px 0", color: "rgba(255,255,255,0.86)", lineHeight: 1.55, fontSize: 14 },

  ctaRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 18, flexWrap: "wrap" },
  footerHint: { marginTop: 14, fontSize: 12, lineHeight: 1.5, color: "rgba(255,255,255,0.62)", borderTop: "1px solid rgba(255,255,255,0.10)", paddingTop: 12 },

  footer: { maxWidth: 1040, margin: "0 auto", padding: "0 18px 22px", color: "rgba(255,255,255,0.60)", fontSize: 12, lineHeight: 1.45, position: "relative", zIndex: 2 },
  footerLine: { borderTop: "1px solid rgba(255,255,255,0.10)", paddingTop: 12 },
};
