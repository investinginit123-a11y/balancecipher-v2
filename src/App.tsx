import React from "react";
impoimport React, { useMemo, useState } from "react";

type Direction = 1 | -1;

type Step = {
  key: "hero" | "ten-second" | "apply";
  title: string;
  kicker?: string;
  body: React.ReactNode;
  primaryCta: string;
  onPrimary: () => void;
  secondaryCta?: string;
  onSecondary?: () => void;
};

export default function App() {
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>(1);

  const goTo = (nextIndex: number) => {
    if (nextIndex === stepIndex) return;
    setDirection(nextIndex > stepIndex ? 1 : -1);
    setStepIndex(nextIndex);
  };

  const next = () => goTo(Math.min(stepIndex + 1, 2));
  const prev = () => goTo(Math.max(stepIndex - 1, 0));

  const steps: Step[] = useMemo(() => {
    return [
      {
        key: "hero",
        title: "Are you ready to start decoding?",
        kicker: "BALANCE Cipher",
        body: (
          <>
            <p style={styles.p}>
              The Cipher is the map. The AI Co-Pilot is the only guide that has the goods to decode it into simple,
              actionable steps — using the BALANCE Formula.
            </p>
            <div style={styles.callout}>
              <div style={styles.calloutTitle}>What you’ll feel in 30 seconds</div>
              <ul style={styles.ul}>
                <li style={styles.li}>Less noise. More clarity.</li>
                <li style={styles.li}>One next step you can actually do.</li>
                <li style={styles.li}>Momentum without overwhelm.</li>
              </ul>
            </div>
          </>
        ),
        primaryCta: "Start Decoding",
        onPrimary: () => next(),
        secondaryCta: "See how it works",
        onSecondary: () => next(),
      },
      {
        key: "ten-second",
        title: "The 10-Second Rule",
        kicker: "Fast clarity, no hype",
        body: (
          <>
            <p style={styles.p}>
              If you can’t explain the next step in under 10 seconds, it’s not clear enough yet.
              The Co-Pilot’s job is to reduce it until it is.
            </p>

            <div style={styles.callout}>
              <div style={styles.calloutTitle}>Try it right now</div>
              <p style={styles.pSmall}>
                Say this out loud (or in your head): <strong>“My next step is…”</strong>
              </p>
              <p style={styles.pSmall}>
                If you stall, the Cipher isn’t decoded yet. That’s not failure — it’s a signal.
              </p>
            </div>

            <div style={styles.miniGrid}>
              <div style={styles.miniCard}>
                <div style={styles.miniCardTitle}>Too big</div>
                <div style={styles.miniCardBody}>“Fix my finances.”</div>
              </div>
              <div style={styles.miniCard}>
                <div style={styles.miniCardTitle}>Decoded</div>
                <div style={styles.miniCardBody}>“List my four bills due this week.”</div>
              </div>
            </div>
          </>
        ),
        primaryCta: "Apply This to Code",
        onPrimary: () => next(),
        secondaryCta: "Back",
        onSecondary: () => prev(),
      },
      {
        key: "apply",
        title: "Apply the Rule to Your Life (Like Code)",
        kicker: "One screen. One action.",
        body: (
          <>
            <p style={styles.p}>
              Think like a clean build: small inputs, clear outputs, no guessing. The Cipher gives the structure.
              The Co-Pilot translates it into a step you can execute today.
            </p>

            <div style={styles.callout}>
              <div style={styles.calloutTitle}>Co-Pilot + Cipher (linked)</div>
              <ul style={styles.ul}>
                <li style={styles.li}>
                  <strong>Structure:</strong> the Cipher shows what matters.
                </li>
                <li style={styles.li}>
                  <strong>Translation:</strong> the Co-Pilot decodes it into one clear step.
                </li>
                <li style={styles.li}>
                  <strong>Execution:</strong> you do the step. Progress is recorded.
                </li>
              </ul>
            </div>
          </>
        ),
        primaryCta: "Enter the Cipher",
        onPrimary: () => {
          // Replace this with your real entry path when ready (examples below).
          // window.location.href = "/app";
          // window.location.hash = "#/app";
          window.location.hash = "#start";
        },
        secondaryCta: "Back",
        onSecondary: () => prev(),
      },
    ];
  }, [stepIndex]);

  const active = steps[stepIndex];

  return (
    <div style={styles.page}>
      <GlobalKeyframes />

      <div style={styles.bgGlow} aria-hidden="true" />

      <header style={styles.header}>
        <div style={styles.brandRow}>
          <img
            src="/brand/Cipher-Emblem.png"
            alt="BALANCE Cipher"
            style={styles.emblem}
            onError={(e) => {
              // If emblem path differs, keep layout stable by hiding the image.
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <div>
            <div style={styles.brandKicker}>{active.kicker}</div>
            <div style={styles.brandTitle}>BALANCE</div>
          </div>
        </div>

        <div style={styles.dots} aria-label="Progress">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              style={{
                ...styles.dot,
                ...(i === stepIndex ? styles.dotActive : null),
              }}
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
            <h1 style={styles.h1}>{active.title}</h1>
            <div style={styles.divider} />

            <div>{active.body}</div>

            <div style={styles.ctaRow}>
              {active.secondaryCta && active.onSecondary ? (
                <button type="button" onClick={active.onSecondary} style={styles.secondaryBtn}>
                  {active.secondaryCta}
                </button>
              ) : (
                <span />
              )}

              <button type="button" onClick={active.onPrimary} style={styles.primaryBtn}>
                {active.primaryCta}
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerLine}>
          Co-Pilot + Cipher, linked: the Cipher provides the structure; the Co-Pilot decodes it into simple actions.
        </div>
      </footer>
    </div>
  );
}

function slideInStyle(direction: Direction): React.CSSProperties {
  const name = direction === 1 ? "slideInFromRight" : "slideInFromLeft";
  return {
    animation: `${name} 240ms ease-out`,
  };
}

function GlobalKeyframes() {
  return (
    <style>
      {`
        @keyframes slideInFromRight {
          from { transform: translateX(22px); opacity: 0.0; }
          to   { transform: translateX(0px);  opacity: 1.0; }
        }
        @keyframes slideInFromLeft {
          from { transform: translateX(-22px); opacity: 0.0; }
          to   { transform: translateX(0px);   opacity: 1.0; }
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
  bgGlow: {
    position: "absolute",
    inset: "-20%",
    background:
      "radial-gradient(closest-side, rgba(0, 255, 214, 0.10), rgba(0, 0, 0, 0) 70%)",
    filter: "blur(12px)",
    pointerEvents: "none",
  },
  header: {
    padding: "22px 18px 12px",
    maxWidth: 980,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  emblem: {
    width: 42,
    height: 42,
    borderRadius: 10,
    boxShadow: "0 0 26px rgba(0,255,214,0.18)",
  },
  brandKicker: {
    fontSize: 12,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "rgba(0,255,214,0.78)",
  },
  brandTitle: {
    fontSize: 18,
    letterSpacing: "0.10em",
    fontWeight: 800,
  },
  dots: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.06)",
    cursor: "pointer",
  },
  dotActive: {
    background: "rgba(0,255,214,0.65)",
    border: "1px solid rgba(0,255,214,0.85)",
    boxShadow: "0 0 18px rgba(0,255,214,0.18)",
  },
  main: {
    padding: "10px 18px 22px",
    maxWidth: 980,
    margin: "0 auto",
  },
  viewport: {
    position: "relative",
  },
  card: {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(10, 24, 40, 0.72)",
    boxShadow: "0 18px 60px rgba(0,0,0,0.55)",
    padding: 22,
    backdropFilter: "blur(10px)",
  },
  h1: {
    margin: 0,
    fontSize: 28,
    lineHeight: 1.15,
    letterSpacing: "-0.02em",
  },
  divider: {
    height: 1,
    background: "linear-gradient(90deg, rgba(0,255,214,0.55), rgba(255,255,255,0.08))",
    margin: "14px 0 16px",
  },
  p: {
    margin: "0 0 14px",
    fontSize: 16,
    lineHeight: 1.55,
    color: "rgba(255,255,255,0.86)",
  },
  pSmall: {
    margin: "0 0 10px",
    fontSize: 14,
    lineHeight: 1.55,
    color: "rgba(255,255,255,0.82)",
  },
  callout: {
    borderRadius: 18,
    border: "1px solid rgba(0,255,214,0.18)",
    background: "rgba(0,255,214,0.06)",
    padding: 14,
    margin: "14px 0 16px",
  },
  calloutTitle: {
    fontSize: 13,
    letterSpacing: "0.10em",
    textTransform: "uppercase",
    color: "rgba(0,255,214,0.85)",
    marginBottom: 10,
    fontWeight: 800,
  },
  ul: {
    margin: 0,
    paddingLeft: 18,
  },
  li: {
    margin: "8px 0",
    color: "rgba(255,255,255,0.84)",
    lineHeight: 1.5,
    fontSize: 14,
  },
  miniGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginTop: 6,
  },
  miniCard: {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    padding: 12,
  },
  miniCardTitle: {
    fontSize: 12,
    letterSpacing: "0.10em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.70)",
    marginBottom: 8,
    fontWeight: 800,
  },
  miniCardBody: {
    fontSize: 14,
    color: "rgba(255,255,255,0.86)",
  },
  ctaRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 18,
  },
  primaryBtn: {
    borderRadius: 16,
    padding: "12px 16px",
    border: "1px solid rgba(0,255,214,0.35)",
    background: "rgba(0,255,214,0.12)",
    color: "rgba(255,255,255,0.92)",
    fontWeight: 800,
    letterSpacing: "0.02em",
    cursor: "pointer",
    boxShadow: "0 0 26px rgba(0,255,214,0.10)",
  },
  secondaryBtn: {
    borderRadius: 16,
    padding: "12px 16px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.05)",
    color: "rgba(255,255,255,0.86)",
    fontWeight: 700,
    cursor: "pointer",
  },
  footer: {
    maxWidth: 980,
    margin: "0 auto",
    padding: "0 18px 22px",
    color: "rgba(255,255,255,0.62)",
    fontSize: 12,
    lineHeight: 1.45,
  },
  footerLine: {
    borderTop: "1px solid rgba(255,255,255,0.10)",
    paddingTop: 12,
  },
};
rt Home from "./pages/Home";

export default function App() {
  return <Home />;
}


