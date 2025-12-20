import React, { useMemo, useState } from "react";

type Direction = 1 | -1;
type StepIndex = 0 | 1 | 2;

type Step = {
  key: "hero" | "ten-second" | "apply";
  eyebrow?: string;
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
        eyebrow: "BALANCE Cipher",
        title: "Are you ready to start decoding?",
        subtitle: "Tap once. Get clarity fast. Keep moving.",
        body: (
          <>
            <div style={styles.leadCard}>
              <div style={styles.leadTitle}>What happens next</div>
              <ol style={styles.ol}>
                <li style={styles.li}>
                  <strong>Step 1:</strong> Choose what you want clarity on.
                </li>
                <li style={styles.li}>
                  <strong>Step 2:</strong> The AI Co-Pilot decodes the Cipher into one simple action (10 seconds).
                </li>
                <li style={styles.li}>
                  <strong>Step 3:</strong> You execute one clean step. Progress is recorded.
                </li>
              </ol>
            </div>

            <div style={styles.microNote}>
              The Cipher is the structure. The Co-Pilot has the goods to decode it into simple, actionable steps — via the
              BALANCE Formula.
            </div>
          </>
        ),
        primaryCta: "Start Decoding",
        onPrimary: () => next(),
        secondaryCta: "Preview the 10-Second Rule",
        onSecondary: () => next(),
      },
      {
        key: "ten-second",
        eyebrow: "The Rule",
        title: "The 10-Second Rule",
        subtitle: "If your next step can’t be said in 10 seconds, it’s not decoded yet.",
        body: (
          <>
            <div style={styles.split}>
              <div style={styles.panel}>
                <div style={styles.panelTitle}>Say this out loud</div>
                <div style={styles.quote}>
                  “My next step is <span style={styles.underline}>_____</span>.”
                </div>
                <div style={styles.panelText}>
                  If you stall, you don’t need motivation. You need a smaller step.
                </div>
              </div>

              <div style={styles.panel}>
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

            <div style={styles.microNote}>One screen. One action. Keep moving.</div>
          </>
        ),
        primaryCta: "Apply This (Like Code)",
        onPrimary: () => next(),
        secondaryCta: "Back",
        onSecondary: () => prev(),
      },
      {
        key: "apply",
        eyebrow: "Execution",
        title: "Apply the Rule (Like Code)",
        subtitle: "Small inputs. Clear outputs. No guessing.",
        body: (
          <>
            <div style={styles.leadCard}>
              <div style={styles.leadTitle}>Co-Pilot + Cipher (linked)</div>
              <ul style={styles.ul}>
                <li style={styles.li}>
                  <strong>Cipher:</strong> shows what matters (structure).
                </li>
                <li style={styles.li}>
                  <strong>Co-Pilot:</strong> decodes it into one clean step (translation).
                </li>
                <li style={styles.li}>
                  <strong>You:</strong> execute the step (ownership).
                </li>
              </ul>
            </div>

            <div style={styles.microNote}>
              When you enter the Cipher, the only goal is forward motion — without overwhelm.
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
      <div className="watermark" aria-hidden="true" />

      <header style={styles.header}>
        <div style={styles.brandRow}>
          <img
            src="/brand/cipher-emblem.png"
            alt="BALANCE Cipher emblem"
            style={styles.emblem}
            className="emblemPulse"
          />
          <div>
            <div style={styles.eyebrow}>{active.eyebrow}</div>
            <div style={styles.brandTitle}>BALANCE</div>
          </div>
        </div>

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
        <div style={styles.footerLine}>If the button pulse is too intense, we can dial it down in one CSS block.</div>
      </footer>
    </div>
  );
}

function slideInStyle(direction: Direction): React.CSSProperties {
  const name = direction === 1 ? "slideInFromRight" : "slideInFromLeft";
  return { animation: `${name} 260ms ease-out` };
}

function GlobalStyles() {
  return (
    <style>
      {`
        @keyframes slideInFromRight { from { transform: translateX(26px); opacity: 0.0; } to { transform: translateX(0px); opacity: 1.0; } }
        @keyframes slideInFromLeft  { from { transform: translateX(-26px); opacity: 0.0; } to { transform: translateX(0px); opacity: 1.0; } }

        @keyframes breatheGlow {
          0%   { box-shadow: 0 0 0 rgba(0,255,214,0.0), 0 16px 60px rgba(0,0,0,0.55); }
          50%  { box-shadow: 0 0 28px rgba(0,255,214,0.22), 0 16px 60px rgba(0,0,0,0.55); }
          100% { box-shadow: 0 0 0 rgba(0,255,214,0.0), 0 16px 60px rgba(0,0,0,0.55); }
        }
        @keyframes cipherCorePulse {
          0%   { transform: translate(-50%,-50%) scale(0.98); opacity: 0.55; }
          50%  { transform: translate(-50%,-50%) scale(1.03); opacity: 0.95; }
          100% { transform: translate(-50%,-50%) scale(0.98); opacity: 0.55; }
        }
        @keyframes shimmerSweep {
          0%   { transform: translateX(-140%); opacity: 0.0; }
          25%  { opacity: 0.55; }
          100% { transform: translateX(140%); opacity: 0.0; }
        }
        @keyframes emblemFloat {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
          100% { transform: translateY(0px); }
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }

        .bgGlow {
          position: absolute;
          inset: -20%;
          background: radial-gradient(closest-side, rgba(0, 255, 214, 0.10), rgba(0, 0, 0, 0) 70%);
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
        .watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 520px;
          height: 520px;
          transform: translate(-50%,-50%);
          background-image: url('/brand/cipher-emblem.png');
          background-size: contain;
          background-repeat: no-repeat;
          opacity: 0.06;
          pointer-events: none;
        }
        .emblemPulse {
          animation: emblemFloat 2.6s ease-in-out infinite;
          box-shadow: 0 0 26px rgba(0,255,214,0.20);
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
          animation: cipherCorePulse 1.8s ease-in-out infinite;
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
          min-width: 220px;
          backdrop-filter: blur(8px);
          animation: breatheGlow 2.4s ease-in-out infinite;
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
          animation: shimmerSweep 2.6s ease-in-out infinite;
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
  header: { padding: "22px 18px 12px", maxWidth: 1040, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, position: "relative", zIndex: 2 },
  brandRow: { display: "flex", alignItems: "center", gap: 14 },
  emblem: { width: 44, height: 44, borderRadius: 12 },
  eyebrow: { fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(0,255,214,0.86)", fontWeight: 850 },
  brandTitle: { fontSize: 18, letterSpacing: "0.10em", fontWeight: 900 },
  dots: { display: "flex", gap: 8, alignItems: "center" },
  main: { padding: "10px 18px 22px", maxWidth: 1040, margin: "0 auto", position: "relative", zIndex: 2 },
  viewport: { position: "relative" },
  card: { borderRadius: 24, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(10, 24, 40, 0.78)", boxShadow: "0 18px 60px rgba(0,0,0,0.55)", padding: 22, backdropFilter: "blur(12px)", maxWidth: 840, margin: "0 auto" },
  titleBlock: { display: "flex", flexDirection: "column", gap: 8 },
  h1: { margin: 0, fontSize: 30, lineHeight: 1.12, letterSpacing: "-0.02em" },
  subtitle: { color: "rgba(255,255,255,0.78)", fontSize: 15, lineHeight: 1.5, maxWidth: 680 },
  divider: { height: 1, background: "linear-gradient(90deg, rgba(0,255,214,0.55), rgba(255,255,255,0.08))", margin: "14px 0 16px" },
  leadCard: { borderRadius: 18, border: "1px solid rgba(0,255,214,0.18)", background: "rgba(0,255,214,0.06)", padding: 14, marginBottom: 14 },
  leadTitle: { fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(0,255,214,0.88)", fontWeight: 900, marginBottom: 10 },
  microNote: { marginTop: 8, color: "rgba(255,255,255,0.70)", fontSize: 13, lineHeight: 1.55 },
  ol: { margin: 0, paddingLeft: 18 },
  ul: { margin: 0, paddingLeft: 18 },
  li: { margin: "10px 0", color: "rgba(255,255,255,0.86)", lineHeight: 1.55, fontSize: 14 },
  split: { display: "grid", gridTemplateColumns: "1fr", gap: 12 },
  panel: { borderRadius: 18, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.04)", padding: 14 },
  panelTitle: { fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.72)", fontWeight: 900, marginBottom: 10 },
  quote: { fontSize: 18, lineHeight: 1.35, color: "rgba(255,255,255,0.92)", marginBottom: 10 },
  underline: { borderBottom: "2px solid rgba(0,255,214,0.55)", paddingBottom: 1 },
  panelText: { color: "rgba(255,255,255,0.78)", fontSize: 14, lineHeight: 1.55 },
  exampleGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  exampleBad: { borderRadius: 16, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.04)", padding: 12 },
  exampleGood: { borderRadius: 16, border: "1px solid rgba(0,255,214,0.20)", background: "rgba(0,255,214,0.06)", padding: 12 },
  exampleLabel: { fontSize: 12, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(255,255,255,0.72)", fontWeight: 900, marginBottom: 8 },
  exampleText: { fontSize: 14, color: "rgba(255,255,255,0.88)", lineHeight: 1.5 },
  ctaRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 18, flexWrap: "wrap" },
  footerHint: { marginTop: 14, fontSize: 12, lineHeight: 1.5, color: "rgba(255,255,255,0.62)", borderTop: "1px solid rgba(255,255,255,0.10)", paddingTop: 12 },
  footer: { maxWidth: 1040, margin: "0 auto", padding: "0 18px 22px", color: "rgba(255,255,255,0.60)", fontSize: 12, lineHeight: 1.45, position: "relative", zIndex: 2 },
  footerLine: { borderTop: "1px solid rgba(255,255,255,0.10)", paddingTop: 12 },
};
