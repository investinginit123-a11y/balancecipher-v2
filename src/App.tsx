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
        chapter: "CHAPTER 1 — THE CALL",
        title: "Some things are hidden in plain sight.",
        subtitle:
          "A cipher turns chaos into a pattern. This one is powered by AI — like an arc reactor for your money decisions.",
        body: (
          <>
            <div style={styles.storyCard}>
              <div style={styles.storyTitle}>What a cipher really does</div>
              <p style={styles.p}>
                A cipher is a tool that <strong>locks complexity</strong> into a structure — so it can be decoded into
                something usable.
              </p>
              <p style={styles.p}>
                Throughout history, ciphers protected messages, shaped outcomes, and changed what was possible. Not
                because they were loud — because they were precise.
              </p>
            </div>

            <div style={styles.mysteryCard}>
              <div style={styles.mysteryTitle}>The BALANCE Cipher</div>
              <p style={styles.p}>
                Here, the Cipher is the <strong>structure</strong>.
                <br />
                The AI Co-Pilot is the <strong>decoder</strong>.
                <br />
                You are the one who <strong>moves</strong>.
              </p>

              <div style={styles.whisper}>
                You don’t need to “fix your life.” You need a clear next step you can say in 10 seconds.
              </div>
            </div>

            <div style={styles.inviteLine}>
              If you’re ready, we start with one small decode — no pressure. Just the first door.
            </div>
          </>
        ),
        primaryCta: "Open the First Door",
        onPrimary: () => next(),
        secondaryCta: "What does “decoding” mean?",
        onSecondary: () => next(),
      },
      {
        key: "ten-second",
        chapter: "CHAPTER 2 — THE THRESHOLD",
        title: "The Arc Reactor Protocol: 10 seconds.",
        subtitle:
          "If your next step can’t be said in 10 seconds, the Cipher isn’t decoded yet. That’s not failure. That’s the signal.",
        body: (
          <>
            <div style={styles.protocolGrid}>
              <div style={styles.protocolPanel}>
                <div style={styles.panelTitle}>Say this</div>
                <div style={styles.quote}>
                  “My next step is <span style={styles.underline}>_____</span>.”
                </div>
                <div style={styles.panelText}>
                  If you hesitate, we reduce the step until it becomes obvious.
                </div>
              </div>

              <div style={styles.protocolPanel}>
                <div style={styles.panelTitle}>Example</div>
                <div style={styles.exampleGrid}>
                  <div style={styles.exampleBad}>
                    <div style={styles.exampleLabel}>Too big</div>
                    <div style={styles.exampleText}>“Fix my finances.”</div>
                  </div>
                  <div style={styles.exampleGood}>
                    <div style={styles.exampleLabel}>Decoded</div>
                    <div style={styles.exampleText}>“List my four bills due this week.”</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.microNote}>
              This is the hero’s move: one clean step across the threshold. Not everything. Just the next thing.
            </div>

            <div style={styles.cornerstoneLine}>
              Are you ready to start decoding?
            </div>
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
        title: "Small inputs. Clear outputs.",
        subtitle: "The Cipher gives structure. The Co-Pilot decodes. You execute — and keep the power.",
        body: (
          <>
            <div style={styles.storyCard}>
              <div style={styles.storyTitle}>Co-Pilot + Cipher (linked)</div>
              <ul style={styles.ul}>
                <li style={styles.li}>
                  <strong>Cipher:</strong> turns the mess into a pattern (structure).
                </li>
                <li style={styles.li}>
                  <strong>Co-Pilot:</strong> decodes the pattern into one clear action.
                </li>
                <li style={styles.li}>
                  <strong>You:</strong> take the step and build momentum.
                </li>
              </ul>
            </div>

            <div style={styles.inviteLine}>
              When you enter, we don’t overwhelm you. We power up one system at a time.
            </div>
          </>
        ),
        primaryCta: "Enter the Cipher",
        onPrimary: () => {
          // Replace with your real entry point when ready.
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

      {/* HERO REACTOR BAY (mobile-first, top 25% feel) */}
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
          Next build option: add a “Cipher Lore” micro-screen (30 seconds) before Chapter 2, if you want deeper mystery.
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
          50%  { box-shadow: 0 0 24px rgba(0,255,214,0.20), 0 16px 60px rgba(0,0,0,0.55); }
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
          50%  { transform: translate(-50%,-50%) scale(1.03); opacity: 0.78; }
          100% { transform: translate(-50%,-50%) scale(0.98); opacity: 0.35; }
        }

        @keyframes emblemBreath {
          0%   { transform: scale(0.99); filter: drop-shadow(0 0 18px rgba(0,255,214,0.10)); }
          50%  { transform: scale(1.02); filter: drop-shadow(0 0 30px rgba(0,255,214,0.18)); }
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
          width: min(52vw, 240px);
          height: min(52vw, 240px);
          max-height: 28vh;
          max-width: 28vh;
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
          box-shadow: 0 0 40px rgba(0,255,214,0.10), inset 0 0 24px rgba(0,255,214,0.06);
          background: radial-gradient(circle, rgba(0,255,214,0.10), rgba(0,0,0,0) 62%);
          pointer-events: none;
        }

        .ringA {
          animation: ringSpin 6.2s linear infinite;
        }

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
          box-shadow: 0 0 44px rgba(0,255,214,0.14);
          pointer-events: none;
        }

        .heroEmblem {
          width: 70%;
          height: auto;
          animation: emblemBreath 2.6s ease-in-out infinite;
        }

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
          min-width: 240px;
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
  page: {
    minHeight: "100vh",
    background: "#071423",
    color: "rgba(255,255,255,0.92)",
    position: "relative",
    overflow: "hidden",
  },

  heroTop: {
    padding: "18px 18px 6px",
    maxWidth: 1040,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    position: "relative",
    zIndex: 2,
  },
  heroEmblem: {
    width: "100%",
    height: "auto",
  },
  heroTopText: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 6,
    minWidth: 180,
  },

  header: {
    padding: "0 18px 10px",
    maxWidth: 1040,
    margin: "0 auto",
    display: "flex",
    justifyContent: "flex-end",
    position: "relative",
    zIndex: 2,
  },

  chapter: {
    fontSize: 12,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "rgba(0,255,214,0.86)",
    fontWeight: 850,
    textAlign: "right",
  },

  brandTitle: {
    fontSize: 18,
    letterSpacing: "0.10em",
    fontWeight: 900,
  },

  dots: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },

  main: {
    padding: "6px 18px 22px",
    maxWidth: 1040,
    margin: "0 auto",
    position: "relative",
    zIndex: 2,
  },
  viewport: { position: "relative" },

  card: {
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(10, 24, 40, 0.78)",
    boxShadow: "0 18px 60px rgba(0,0,0,0.55)",
    padding: 22,
    backdropFilter: "blur(12px)",
    maxWidth: 900,
    margin: "0 auto",
  },

  titleBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  h1: {
    margin: 0,
    fontSize: 30,
    lineHeight: 1.14,
    letterSpacing: "-0.02em",
  },
  subtitle: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 15,
    lineHeight: 1.6,
    maxWidth: 760,
  },

  divider: {
    height: 1,
    background: "linear-gradient(90deg, rgba(0,255,214,0.55), rgba(255,255,255,0.08))",
    margin: "14px 0 16px",
  },

  p: {
    margin: "0 0 12px",
    fontSize: 15,
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.86)",
  },

  storyCard: {
    borderRadius: 18,
    border: "1px solid rgba(0,255,214,0.18)",
    background: "rgba(0,255,214,0.06)",
    padding: 14,
    marginBottom: 14,
  },
  storyTitle: {
    fontSize: 12,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "rgba(0,255,214,0.88)",
    fontWeight: 900,
    marginBottom: 10,
  },

  mysteryCard: {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    padding: 14,
    marginBottom: 12,
  },
  mysteryTitle: {
    fontSize: 12,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.72)",
    fontWeight: 900,
    marginBottom: 10,
  },

  whisper: {
    marginTop: 10,
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(0,255,214,0.14)",
    background: "rgba(0,255,214,0.04)",
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    lineHeight: 1.55,
  },

  inviteLine: {
    marginTop: 8,
    color: "rgba(255,255,255,0.70)",
    fontSize: 13,
    lineHeight: 1.6,
  },

  protocolGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 12,
  },
  protocolPanel: {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    padding: 14,
  },
  panelTitle: {
    fontSize: 12,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.72)",
    fontWeight: 900,
    marginBottom: 10,
  },
  quote: {
    fontSize: 18,
    lineHeight: 1.35,
    color: "rgba(255,255,255,0.92)",
    marginBottom: 10,
  },
  underline: {
    borderBottom: "2px solid rgba(0,255,214,0.55)",
    paddingBottom: 1,
  },
  panelText: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 14,
    lineHeight: 1.55,
  },

  exampleGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  exampleBad: {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    padding: 12,
  },
  exampleGood: {
    borderRadius: 16,
    border: "1px solid rgba(0,255,214,0.20)",
    background: "rgba(0,255,214,0.06)",
    padding: 12,
  },
  exampleLabel: {
    fontSize: 12,
    letterSpacing: "0.10em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.72)",
    fontWeight: 900,
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.88)",
    lineHeight: 1.5,
  },

  microNote: {
    marginTop: 10,
    color: "rgba(255,255,255,0.70)",
    fontSize: 13,
    lineHeight: 1.6,
  },

  cornerstoneLine: {
    marginTop: 14,
    paddingTop: 12,
    borderTop: "1px solid rgba(255,255,255,0.10)",
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    lineHeight: 1.6,
  },

  ul: { margin: 0, paddingLeft: 18 },
  li: { margin: "10px 0", color: "rgba(255,255,255,0.86)", lineHeight: 1.55, fontSize: 14 },

  ctaRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 18,
    flexWrap: "wrap",
  },

  footerHint: {
    marginTop: 14,
    fontSize: 12,
    lineHeight: 1.5,
    color: "rgba(255,255,255,0.62)",
    borderTop: "1px solid rgba(255,255,255,0.10)",
    paddingTop: 12,
  },

  footer: {
    maxWidth: 1040,
    margin: "0 auto",
    padding: "0 18px 22px",
    color: "rgba(255,255,255,0.60)",
    fontSize: 12,
    lineHeight: 1.45,
    position: "relative",
    zIndex: 2,
  },
  footerLine: {
    borderTop: "1px solid rgba(255,255,255,0.10)",
    paddingTop: 12,
  },
};
