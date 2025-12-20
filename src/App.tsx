import React, { useMemo, useState } from "react";

type Direction = 1 | -1;
type StepIndex = 0 | 1 | 2;

type Step = {
  key: "hero" | "operator" | "request";
  chapter?: string;
  title: string;
  subtitle?: string;
  body: React.ReactNode;
  primaryCta: string;
  onPrimary: () => void;
  second<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Balance Cipher - Revival</title>
    <style>
        /* Reset & Base */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: #000;
            color: #fff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            overflow: hidden;
            text-align: center;
            padding: 20px;
        }

        /* Cipher Emblem Container */
        #cipher-container {
            margin-bottom: 60px;
            opacity: 0;
            animation: fadeIn 0.4s ease-in forwards;
        }

        #cipher-emblem {
            width: 220px;
            height: 220px;
            background: radial-gradient(circle, #00ffff22, transparent 70%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 40px #00ffff44;
            animation: pulse 4s infinite ease-in-out;
        }

        #cipher-emblem img {
            width: 180px;
            height: 180px;
            filter: drop-shadow(0 0 20px #00ffff);
        }

        /* Text Lines */
        .tagline {
            font-size: 28px;
            font-weight: 300;
            line-height: 1.4;
            opacity: 0;
            margin-bottom: 20px;
        }

        #tagline1 { animation: fadeIn 0.8s ease-in forwards 0.8s; }
        #tagline2 { animation: fadeIn 0.8s ease-in forwards 2.4s; }
        #tagline3 { animation: fadeIn 0.8s ease-in forwards 4.0s; }

        /* CTA Button */
        #cta-button {
            margin-top: 60px;
            opacity: 0;
            animation: fadeIn 1s ease-in forwards 5.5s;
        }

        .btn {
            display: inline-block;
            padding: 18px 40px;
            font-size: 20px;
            font-weight: 600;
            color: #fff;
            background: transparent;
            border: 2px solid #00ffff;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.4s ease;
            box-shadow: 0 0 20px #00ffff44;
            text-decoration: none;
        }

        .btn:hover {
            background: #00ffff22;
            box-shadow: 0 0 30px #00ffff88;
            transform: scale(1.05);
        }

        /* Animations */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
            0%, 100% { box-shadow: 0 0 40px #00ffff44; }
            50% { box-shadow: 0 0 60px #00ffff88; }
        }

        /* Optional: Replace with your actual emblem URL */
        /* If you have the emblem as an image, upload it and replace the src */
    </style>
</head>
<body>

    <div id="cipher-container">
        <div id="cipher-emblem">
            <!-- Placeholder for the cipher emblem -->
            <!-- Replace src with your actual image URL -->
            <img src="https://via.placeholder.com/180x180/001111/00ffff?text=CIPHER" alt="Balance Cipher Core">
        </div>
    </div>

    <div class="tagline" id="tagline1">You don't have to admit anything.</div>
    <div class="tagline" id="tagline2">You just have to click.</div>
    <div class="tagline" id="tagline3">The cipher already knows what to do.</div>

    <div id="cta-button">
        <a href="#reward-screen" class="btn">
            Show me how the AI cipher raises my score up to 100 points in under 12 months
        </a>
    </div>

    <!-- Simple Reward Screen (hidden until linked) -->
    <div id="reward-screen" style="display:none; margin-top: 100vh; padding: 40px; background: #000;">
        <h2>Welcome. You're in.</h2>
        <p>You’re one of the first to see the Balance Cipher in action.</p>
        <p>Enter your phone below to lock in your private access.</p>
        <!-- Add your form here -->
        <input type="tel" placeholder="Your phone number" style="padding:12px; margin:20px; width:80%; max-width:300px;">
        <button class="btn">Lock in my spot</button>
        <p style="margin-top:40px; font-size:14px;">Chapter 1 awakens in 72 hours.</p>
    </div>

    <script>
        // Optional: Smooth scroll or reveal reward screen on click
        document.querySelector('.btn').addEventListener('click', function(e) {
            // For demo: just show the reward section
            document.getElementById('reward-screen').style.display = 'block';
            document.getElementById('reward-screen').scrollIntoView({ behavior: 'smooth' });
        });
    </script>

</body>
</html>
aryCta?: string;
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

  const next = () =>
    goTo((stepIndex === 2 ? 2 : ((stepIndex + 1) as StepIndex)) as StepIndex);
  const prev = () =>
    goTo((stepIndex === 0 ? 0 : ((stepIndex - 1) as StepIndex)) as StepIndex);

  const steps = useMemo(() => {
    const s: [Step, Step, Step] = [
      {
        key: "hero",
        chapter: "CHAPTER 1 — THE CORE",
        title: "Awaken the Cipher Core.",
        subtitle:
          "Not hype. Not a lecture. A power source for decisions, so you stop guessing and start moving.",
        body: (
          <>
            <div className="panel panelStrong">
              <div className="panelEyebrow">HERE’S WHAT I WANT YOU TO CONSIDER</div>

              <div className="punch">
                Most people aren’t lazy.
                <br />
                They’re overloaded.
              </div>

              <div className="p">
                Life forces you to make complex money decisions with a tired brain.
                That’s not a character flaw. That’s a real constraint.
              </div>

              <div className="punch2">
                The Cipher is leverage you can hold.
                <br />
                It turns chaos into a pattern you can control.
              </div>
            </div>

            <div className="panel">
              <div className="panelTitle">What changes when the core is awake</div>

              <div className="bullets">
                <div className="bullet">You stop hoping you’re making the right move.</div>
                <div className="bullet">You get one clear next step that fits your real life.</div>
                <div className="bullet">You build momentum without overwhelm.</div>
              </div>

              <div className="p">
                That’s how people fix credit and themselves along the way.
                Not by doing everything. By doing the right next thing.
              </div>
            </div>

            <div className="panel">
              <div className="panelTitle">The triad that unlocks the BALANCE Formula</div>

              <div className="triad">
                <div className="triadItem">
                  <div className="triadHead">The Cipher</div>
                  <div className="triadText">The core structure. The pattern.</div>
                </div>

                <div className="triadItem triadGlow">
                  <div className="triadHead">The AI Co-Pilot</div>
                  <div className="triadText">
                    The operator. The decoder who has the goods to translate the Cipher into simple actions,
                    via the BALANCE Formula.
                  </div>
                </div>

                <div className="triadItem">
                  <div className="triadHead">You</div>
                  <div className="triadText">The requester. The one who takes the step and keeps the power.</div>
                </div>
              </div>

              <div className="micro">
                First, we awaken the core. Then we call in the operator. Then you request the decode.
              </div>
            </div>
          </>
        ),
        primaryCta: "Awaken the Cipher Core",
        onPrimary: () => next(),
        secondaryCta: "Show me what this really does",
        onSecondary: () => next(),
      },
      {
        key: "operator",
        chapter: "CHAPTER 2 — THE OPERATOR",
        title: "Invoke the Co-Pilot.",
        subtitle:
          "AI is leverage on a human mind: clarity, speed, stability. The Co-Pilot decodes the Cipher into a next step you can execute.",
        body: (
          <>
            <div className="panel">
              <div className="panelTitle">What AI leverage gives a human</div>

              <div className="cards">
                <div className="cardSmall">
                  <div className="cardHead">Clarity</div>
                  <div className="cardText">One next step that matters most.</div>
                </div>
                <div className="cardSmall">
                  <div className="cardHead">Speed</div>
                  <div className="cardText">Hours of thinking, compressed.</div>
                </div>
                <div className="cardSmall">
                  <div className="cardHead">Stability</div>
                  <div className="cardText">Calm decisions under pressure.</div>
                </div>
                <div className="cardSmall">
                  <div className="cardHead">Blind-spot catch</div>
                  <div className="cardText">It sees what stress hides.</div>
                </div>
              </div>

              <div className="micro">
                This isn’t replacing you. It’s backing you, so you can execute instead of spiral.
              </div>
            </div>

            <div className="panel panelStrong">
              <div className="panelTitle">The stabilizer: 10 seconds</div>

              <div className="quote">
                “My next step is <span className="underline">_____</span>.”
              </div>

              <div className="p">
                If you can’t say it in 10 seconds, it’s not decoded yet.
                We reduce the step until it becomes obvious.
              </div>

              <div className="micro">
                This is how the hero crosses the threshold. One clean move.
              </div>

              <div className="cornerstone">Are you ready to start decoding?</div>
            </div>
          </>
        ),
        primaryCta: "Invoke the Co-Pilot",
        onPrimary: () => next(),
        secondaryCta: "Back",
        onSecondary: () => prev(),
      },
      {
        key: "request",
        chapter: "CHAPTER 3 — THE REQUEST",
        title: "Request the Decode.",
        subtitle:
          "This is the handoff moment: you ask, you receive a clean next step, and momentum becomes real.",
        body: (
          <>
            <div className="panel">
              <div className="panelTitle">What you receive</div>

              <div className="bullets">
                <div className="bullet">A messy situation becomes a clear pattern.</div>
                <div className="bullet">The Co-Pilot decodes it into one next step you can say in 10 seconds.</div>
                <div className="bullet">You take the step, and your next step gets easier.</div>
              </div>

              <div className="p">
                The Cipher stays the cornerstone.
                The Co-Pilot stays the decoder.
                You stay in control.
              </div>

              <div className="micro">
                Canon CTA sequence: Awaken the Cipher Core → Invoke the Co-Pilot → Request the Decode.
              </div>
            </div>
          </>
        ),
        primaryCta: "Request the Decode",
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
  const showHeroVow = stepIndex === 0;

  return (
    <div className="page">
      <GlobalStyles />

      <div className="bgGlow" aria-hidden="true" />
      <div className="gridOverlay" aria-hidden="true" />
      <div className="dust" aria-hidden="true" />

      <section className="heroStack">
        <div className="reactor" aria-hidden="true">
          <div className="reactorRing ringA" />
          <div className="reactorRing ringB" />
          <div className="reactorCore" />
          <img src="/brand/cipher-emblem.png" alt="BALANCE Cipher emblem" className="heroEmblem" />
        </div>

        <div className="heroText">
          <div className="heroOverline">A REVIVAL OF CONTROL</div>

          <div className="heroBrand heroBrandAlive">BALANCE</div>

          <div className="heroChapter">{active.chapter}</div>
        </div>

        <div className="progressDots" aria-label="Progress">
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
      </section>

      <main className="main">
        <div key={active.key} className={`shell ${direction === 1 ? "slideR" : "slideL"}`}>
          <div className="titleBlock">
            <h1 className="h1">{active.title}</h1>

            {showHeroVow ? (
              <div className="heroVow" aria-label="Hero vow">
                <div className="vowLine">This is your revival.</div>

                <div className="vowLine vowGlow vowPulse">Clear direction returns.</div>

                <div className="vowLine">You take the next step with power behind it.</div>
              </div>
            ) : null}

            {active.subtitle ? <div className="subtitle">{active.subtitle}</div> : null}
          </div>

          <div className="divider" />

          <div className="content">{active.body}</div>

          <div className="ctaRow">
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

          <div className="footerHint">
            Co-Pilot + Cipher, linked: the Cipher provides structure; the Co-Pilot decodes it into simple actions via the BALANCE Formula.
          </div>
        </div>
      </main>
    </div>
  );
}

function GlobalStyles() {
  return (
    <style>
      {`
        @keyframes slideInFromRight { from { transform: translateX(22px); opacity: 0.0; } to { transform: translateX(0px); opacity: 1.0; } }
        @keyframes slideInFromLeft  { from { transform: translateX(-22px); opacity: 0.0; } to { transform: translateX(0px); opacity: 1.0; } }

        @keyframes breatheGlow {
          0%   { box-shadow: 0 0 0 rgba(0,255,214,0.0), 0 16px 60px rgba(0,0,0,0.55); }
          50%  { box-shadow: 0 0 32px rgba(0,255,214,0.22), 0 16px 60px rgba(0,0,0,0.55); }
          100% { box-shadow: 0 0 0 rgba(0,255,214,0.0), 0 16px 60px rgba(0,0,0,0.55); }
        }

        @keyframes shimmerSweep {
          0%   { transform: translateX(-140%); opacity: 0.0; }
          25%  { opacity: 0.55; }
          100% { transform: translateX(140%); opacity: 0.0; }
        }

        @keyframes ringSpin {
          0% { transform: translate(-50%,-50%) rotate(0deg); opacity: 0.55; }
          50% { opacity: 0.95; }
          100% { transform: translate(-50%,-50%) rotate(360deg); opacity: 0.55; }
        }

        @keyframes ringPulse {
          0%   { transform: translate(-50%,-50%) scale(0.98); opacity: 0.35; }
          50%  { transform: translate(-50%,-50%) scale(1.04); opacity: 0.82; }
          100% { transform: translate(-50%,-50%) scale(0.98); opacity: 0.35; }
        }

        @keyframes emblemBreath {
          0%   { transform: scale(0.99); filter: drop-shadow(0 0 18px rgba(0,255,214,0.10)); }
          50%  { transform: scale(1.03); filter: drop-shadow(0 0 38px rgba(0,255,214,0.22)); }
          100% { transform: scale(0.99); filter: drop-shadow(0 0 18px rgba(0,255,214,0.10)); }
        }

        /* Stronger vow pulse: tighter cadence, bigger peak */
        @keyframes vowPulse {
          0%   { transform: scale(1.00); filter: drop-shadow(0 0 0 rgba(0,255,214,0.0)); opacity: 0.92; }
          6%   { transform: scale(1.06); filter: drop-shadow(0 0 34px rgba(0,255,214,0.28)); opacity: 1.0; }
          14%  { transform: scale(1.00); filter: drop-shadow(0 0 0 rgba(0,255,214,0.0)); opacity: 0.92; }
          100% { transform: scale(1.00); filter: drop-shadow(0 0 0 rgba(0,255,214,0.0)); opacity: 0.92; }
        }

        /* Stronger BALANCE breath: bigger inhale, deeper glow bloom */
        @keyframes balanceAlive {
          0%   { transform: scale(1.000); filter: drop-shadow(0 0 16px rgba(0,255,214,0.12)); }
          18%  { transform: scale(1.065); filter: drop-shadow(0 0 44px rgba(0,255,214,0.26)); }
          34%  { transform: scale(1.000); filter: drop-shadow(0 0 16px rgba(0,255,214,0.12)); }
          100% { transform: scale(1.000); filter: drop-shadow(0 0 16px rgba(0,255,214,0.12)); }
        }

        @keyframes dustDrift {
          0%   { transform: translateY(0px); opacity: 0.10; }
          50%  { opacity: 0.18; }
          100% { transform: translateY(14px); opacity: 0.10; }
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }

        .page {
          min-height: 100vh;
          background: #071423;
          color: rgba(255,255,255,0.92);
          position: relative;
          overflow: hidden;
        }

        .bgGlow {
          position: absolute;
          inset: -20%;
          background: radial-gradient(closest-side, rgba(0, 255, 214, 0.14), rgba(0, 0, 0, 0) 72%);
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

        .heroStack {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 10px;
          padding: 18px 16px 10px;
          max-width: 960px;
          margin: 0 auto;
        }

        .heroText { display: flex; flex-direction: column; align-items: center; gap: 6px; }

        .heroOverline {
          font-size: clamp(12px, 3.4vw, 14px);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(0,255,214,0.90);
          font-weight: 950;
        }

        .heroBrand {
          font-size: clamp(28px, 8.4vw, 40px);
          letter-spacing: 0.18em;
          font-weight: 1000;
          line-height: 1.02;
          text-transform: uppercase;

          background: linear-gradient(90deg, rgba(0,255,214,0.98), rgba(194,161,90,0.94));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;

          text-shadow: 0 0 20px rgba(0,255,214,0.14);
          transform-origin: center;
        }

        .heroBrandAlive {
          animation: balanceAlive 5.9s ease-in-out infinite;
        }

        .heroChapter {
          font-size: clamp(10px, 2.8vw, 11px);
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          font-weight: 800;
        }

        .progressDots { display: flex; gap: 8px; align-items: center; justify-content: center; margin-top: 2px; }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.06);
          cursor: pointer;
        }

        .dotActive {
          background: rgba(0,255,214,0.80);
          border: 1px solid rgba(0,255,214,0.90);
          box-shadow: 0 0 18px rgba(0,255,214,0.18);
        }

        .reactor {
          position: relative;
          width: min(74vw, 320px);
          height: min(74vw, 320px);
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
          width: 44%;
          height: 44%;
          transform: translate(-50%,-50%);
          border-radius: 999px;
          border: 1px solid rgba(0,255,214,0.24);
          background: radial-gradient(circle, rgba(0,255,214,0.16), rgba(0,0,0,0) 70%);
          box-shadow: 0 0 56px rgba(0,255,214,0.16);
          pointer-events: none;
        }

        .heroEmblem { width: 72%; height: auto; animation: emblemBreath 2.6s ease-in-out infinite; }

        .main { position: relative; z-index: 2; padding: 8px 16px 26px; max-width: 960px; margin: 0 auto; }

        .shell {
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(10, 24, 40, 0.80);
          box-shadow: 0 18px 60px rgba(0,0,0,0.55);
          padding: clamp(16px, 4vw, 22px);
          backdrop-filter: blur(12px);
          max-width: 920px;
          margin: 0 auto;
        }

        .slideR { animation: slideInFromRight 280ms ease-out; }
        .slideL { animation: slideInFromLeft 280ms ease-out; }

        .titleBlock { display: flex; flex-direction: column; gap: 10px; align-items: center; text-align: center; }
        .h1 { margin: 0; font-size: clamp(30px, 7.2vw, 44px); line-height: 1.08; letter-spacing: -0.02em; }

        .heroVow {
          width: 100%;
          max-width: 740px;
          border-radius: 18px;
          border: 1px solid rgba(0,255,214,0.18);
          background: rgba(0,255,214,0.05);
          padding: 12px 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .vowLine {
          font-size: clamp(16px, 4.8vw, 20px);
          line-height: 1.25;
          font-weight: 950;
          color: rgba(255,255,255,0.92);
        }

        .vowGlow {
          color: rgba(0,255,214,0.92);
          text-shadow: 0 0 22px rgba(0,255,214,0.20);
        }

        .vowPulse {
          animation: vowPulse 4.2s ease-in-out infinite;
          transform-origin: center;
        }

        .subtitle { color: rgba(255,255,255,0.80); font-size: clamp(15px, 4.2vw, 18px); line-height: 1.55; max-width: 760px; }

        .divider { height: 1px; background: linear-gradient(90deg, rgba(0,255,214,0.60), rgba(255,255,255,0.08)); margin: 16px 0 16px; }

        .content { display: flex; flex-direction: column; gap: 12px; }

        .panel { border-radius: 18px; border: 1px solid rgba(255,255,255,0.10); background: rgba(255,255,255,0.04); padding: 14px; }
        .panelStrong { border: 1px solid rgba(0,255,214,0.18); background: rgba(0,255,214,0.06); }

        .panelEyebrow { font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(0,255,214,0.92); font-weight: 900; margin-bottom: 10px; text-align: center; }
        .panelTitle { font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.76); font-weight: 900; margin-bottom: 10px; text-align: center; }

        .punch { font-size: clamp(20px, 5.8vw, 26px); font-weight: 950; line-height: 1.16; margin-bottom: 10px; text-align: center; }
        .punch2 { font-size: clamp(18px, 5.2vw, 22px); font-weight: 900; line-height: 1.22; margin-top: 10px; text-align: center; }

        .p { font-size: clamp(15px, 4.1vw, 18px); line-height: 1.65; color: rgba(255,255,255,0.88); margin-top: 8px; text-align: center; }

        .micro { margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.10); font-size: clamp(13px, 3.6vw, 14px); line-height: 1.55; color: rgba(255,255,255,0.70); text-align: center; }

        .bullets { display: flex; flex-direction: column; gap: 10px; margin-top: 6px; }
        .bullet { border-radius: 14px; border: 1px solid rgba(255,255,255,0.10); background: rgba(255,255,255,0.03); padding: 12px; font-size: clamp(15px, 4.0vw, 17px); line-height: 1.45; color: rgba(255,255,255,0.90); text-align: center; font-weight: 800; }

        .triad { display: grid; grid-template-columns: 1fr; gap: 10px; }
        .triadItem { border-radius: 16px; border: 1px solid rgba(255,255,255,0.10); background: rgba(255,255,255,0.03); padding: 12px; text-align: center; }
        .triadGlow { border: 1px solid rgba(0,255,214,0.18); background: rgba(0,255,214,0.05); }

        .triadHead { font-size: 14px; font-weight: 950; margin-bottom: 6px; }
        .triadText { font-size: clamp(14px, 3.9vw, 16px); line-height: 1.55; color: rgba(255,255,255,0.82); }

        .cards { display: grid; grid-template-columns: 1fr; gap: 10px; }
        .cardSmall { border-radius: 16px; border: 1px solid rgba(255,255,255,0.10); background: rgba(255,255,255,0.03); padding: 12px; text-align: center; }
        .cardHead { font-weight: 950; font-size: 15px; margin-bottom: 6px; }
        .cardText { font-size: clamp(14px, 3.9vw, 16px); line-height: 1.5; color: rgba(255,255,255,0.82); }

        .quote { font-size: clamp(18px, 5.2vw, 24px); font-weight: 950; line-height: 1.2; text-align: center; margin-top: 6px; }
        .underline { border-bottom: 2px solid rgba(0,255,214,0.58); padding-bottom: 1px; }

        .cornerstone { margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.10); font-size: clamp(14px, 3.9vw, 16px); line-height: 1.55; color: rgba(255,255,255,0.80); text-align: center; font-weight: 900; }

        .ctaRow { display: flex; flex-direction: column; gap: 10px; margin-top: 16px; align-items: stretch; }

        .ctaWrap { position: relative; display: block; width: 100%; }

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
          padding: 16px 16px;
          border: 1px solid rgba(0,255,214,0.46);
          background: rgba(0,255,214,0.14);
          color: rgba(255,255,255,0.95);
          font-weight: 950;
          letter-spacing: 0.02em;
          cursor: pointer;
          width: 100%;
          font-size: clamp(16px, 4.4vw, 18px);
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
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.24), transparent);
          transform: translateX(-140%);
          animation: shimmerSweep 3.0s ease-in-out infinite;
          z-index: 1;
          pointer-events: none;
        }

        .btnSecondary {
          border-radius: 16px;
          padding: 14px 16px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.90);
          font-weight: 850;
          cursor: pointer;
          width: 100%;
          font-size: clamp(15px, 4.1vw, 17px);
        }

        .footerHint {
          margin-top: 14px;
          font-size: 12px;
          line-height: 1.5;
          color: rgba(255,255,255,0.62);
          border-top: 1px solid rgba(255,255,255,0.10);
          padding-top: 12px;
          text-align: center;
        }

        @media (min-width: 860px) {
          .cards { grid-template-columns: 1fr 1fr; }
          .triad { grid-template-columns: 1fr 1fr 1fr; }
          .ctaRow { flex-direction: row; align-items: center; justify-content: space-between; }
          .btnSecondary { width: auto; min-width: 260px; }
          .btnPrimary { width: auto; min-width: 360px; }
          .ctaWrap { width: auto; }
          .heroVow { padding: 14px 14px; }
        }
      `}
    </style>
  );
}
