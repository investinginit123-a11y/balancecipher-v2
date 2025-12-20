import React, { useEffect, useMemo, useRef, useState } from "react";

type View = "landing" | "decode";

type StepKey =
  | "welcome"
  | "firstPrompt"
  | "firstInput"
  | "lastPrompt"
  | "lastInput"
  | "cipherExplain"
  | "equation"
  | "cta";

export default function App() {
  // PAGE SWITCH (Page 1 -> Page 2)
  const [view, setView] = useState<View>("landing");

  // Page 2 state (step flow)
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const firstRef = useRef<HTMLInputElement | null>(null);
  const lastRef = useRef<HTMLInputElement | null>(null);
  const autoTimerRef = useRef<number | null>(null);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  const steps: StepKey[] = [
    "welcome",
    "firstPrompt",
    "firstInput",
    "lastPrompt",
    "lastInput",
    "cipherExplain",
    "equation",
    "cta",
  ];

  const current = steps[stepIndex];

  function clearAutoTimer() {
    if (autoTimerRef.current) {
      window.clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  }

  // Auto-reveal behavior on Page 2
  useEffect(() => {
    clearAutoTimer();

    if (view !== "decode") return;

    // If reduced motion is on, do not auto-advance—show controls immediately.
    if (prefersReducedMotion) return;

    // Auto-advance: welcome -> firstPrompt -> firstInput (then stop for typing)
    if (stepIndex === 0) {
      autoTimerRef.current = window.setTimeout(() => setStepIndex(1), 900);
      return;
    }
    if (stepIndex === 1) {
      autoTimerRef.current = window.setTimeout(() => setStepIndex(2), 900);
      return;
    }

    // Auto-advance: lastPrompt -> lastInput (then stop for typing)
    if (stepIndex === 3) {
      autoTimerRef.current = window.setTimeout(() => setStepIndex(4), 900);
      return;
    }

    // After last name is completed, we can lightly auto-reveal the final info
    // cipherExplain -> equation -> cta (still with buttons visible)
    if (stepIndex === 5) {
      autoTimerRef.current = window.setTimeout(() => setStepIndex(6), 950);
      return;
    }
    if (stepIndex === 6) {
      autoTimerRef.current = window.setTimeout(() => setStepIndex(7), 950);
      return;
    }
  }, [view, stepIndex, prefersReducedMotion]);

  // Focus inputs when they appear on Page 2
  useEffect(() => {
    if (view !== "decode") return;

    if (current === "firstInput") {
      setTimeout(() => firstRef.current?.focus(), prefersReducedMotion ? 0 : 220);
    }
    if (current === "lastInput") {
      setTimeout(() => lastRef.current?.focus(), prefersReducedMotion ? 0 : 220);
    }
  }, [view, current, prefersReducedMotion]);

  function show(step: StepKey): boolean {
    return steps.indexOf(step) <= stepIndex;
  }

  function next() {
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function back() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function canAdvanceFromThisStep(): boolean {
    if (current === "firstInput") return firstName.trim().length > 0;
    if (current === "lastInput") return lastName.trim().length > 0;
    return true;
  }

  function primaryLabel(): string {
    if (current === "cta") return "Continue";
    return "Continue";
  }

  function onPrimary() {
    // Page 2 final CTA hook — replace later with your real next page / form submit.
    if (current === "cta") {
      alert("Confirmed. Next: connect this to your real form / next page.");
      return;
    }

    if (!canAdvanceFromThisStep()) return;
    next();
  }

  function goToDecodePage() {
    clearAutoTimer();
    setView("decode");
    setStepIndex(0);
  }

  function goBackToLanding() {
    clearAutoTimer();
    setView("landing");
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      onPrimary();
    }
  }

  // Show control buttons whenever user interaction is needed (or reduced motion is on)
  const showControlsOnDecode =
    view === "decode" &&
    (prefersReducedMotion ||
      current === "firstInput" ||
      current === "lastPrompt" ||
      current === "lastInput" ||
      current === "cipherExplain" ||
      current === "equation" ||
      current === "cta");

  return (
    <>
      <style>{`
        :root{
          --bg0:#050b14;
          --bg1:#000;

          --teal: rgba(40, 240, 255, 1);
          --tealSoft: rgba(40, 240, 255, 0.18);

          --brass:#d7b06b;
          --brassGlow: rgba(215, 176, 107, 0.32);

          --text: rgba(255,255,255,0.96);
          --muted: rgba(255,255,255,0.72);
        }

        *{ box-sizing:border-box; }
        html, body { height:100%; }
        body{
          margin:0;
          background:
            radial-gradient(900px 600px at 50% 30%, rgba(40,240,255,0.10), transparent 60%),
            radial-gradient(700px 500px at 50% 85%, rgba(40,240,255,0.06), transparent 60%),
            linear-gradient(180deg, var(--bg0), var(--bg1));
          color: var(--text);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          overflow-x: hidden;
          text-align:center;
        }

        @keyframes corePulse{
          0%, 100%{
            box-shadow: 0 0 62px rgba(40,240,255,0.20), inset 0 0 28px rgba(40,240,255,0.14);
            transform: scale(1.00);
          }
          50%{
            box-shadow: 0 0 90px rgba(40,240,255,0.32), inset 0 0 34px rgba(40,240,255,0.20);
            transform: scale(1.03);
          }
        }

        @keyframes slowDrift{
          0%, 100%{ transform: translate(-2%, -1%) rotate(12deg); opacity: 0.72; }
          50%{ transform: translate(2%, 1%) rotate(18deg); opacity: 0.92; }
        }

        @keyframes balancePulse{
          0%, 100%{
            transform: scale(1.00);
            opacity: 0.92;
            text-shadow: 0 0 16px rgba(215,176,107,0.26);
          }
          50%{
            transform: scale(1.06);
            opacity: 1;
            text-shadow: 0 0 24px rgba(215,176,107,0.46);
          }
        }

        /* PAGE 1 */
        .p1{
          min-height:100vh;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          text-align:center;
          padding: 34px 18px 60px;
        }

        .p1Wrap{
          width: min(820px, 100%);
          display:flex;
          flex-direction:column;
          align-items:center;
          gap: 16px;
        }

        .core{
          width: 275px;
          height: 275px;
          border-radius: 999px;
          display:flex;
          align-items:center;
          justify-content:center;
          background: radial-gradient(circle, var(--tealSoft), transparent 68%);
          box-shadow: 0 0 62px rgba(40,240,255,0.20), inset 0 0 28px rgba(40,240,255,0.14);
          position: relative;
          overflow: hidden;
          animation: corePulse 3.8s ease-in-out infinite;
        }

        .core::before{
          content:"";
          position:absolute;
          inset:-40%;
          background: radial-gradient(circle, rgba(40,240,255,0.16), transparent 55%);
          transform: rotate(15deg);
          filter: blur(2px);
          opacity: 0.9;
          animation: slowDrift 9.5s ease-in-out infinite;
          pointer-events:none;
        }

        .emblemLg{
          width: 220px;
          height: 220px;
          object-fit: contain;
          filter: drop-shadow(0 0 20px rgba(40,240,255,0.60));
          position: relative;
          z-index: 1;
        }

        .equation{
          display:flex;
          align-items: baseline;
          justify-content:center;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 6px;
        }

        .eqText{
          font-size: 16px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.86);
          font-weight: 800;
        }

        .eqSym{
          font-size: 18px;
          color: rgba(255,255,255,0.62);
          font-weight: 900;
        }

        .balance{
          font-size: 24px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 950;
          color: var(--brass);
          padding: 2px 6px;
          border-radius: 10px;
          animation: balancePulse 3.6s ease-in-out infinite;
        }

        .cornerstone{
          margin-top: 6px;
          font-size: 15px;
          color: rgba(255,255,255,0.88);
        }

        .cornerstone strong{
          font-weight: 850;
          color: rgba(255,255,255,0.98);
        }

        .sub{
          width: min(640px, 100%);
          color: rgba(255,255,255,0.72);
          font-size: 16px;
          line-height: 1.55;
          margin-top: 8px;
        }

        .btn{
          padding: 16px 22px;
          border-radius: 999px;
          border: 1.5px solid rgba(40,240,255,0.75);
          color: rgba(255,255,255,0.96);
          background: linear-gradient(180deg, rgba(40,240,255,0.08), rgba(40,240,255,0.03));
          box-shadow: 0 0 24px rgba(40,240,255,0.18), 0 12px 30px rgba(0,0,0,0.35);
          cursor:pointer;
          font-weight: 800;
          font-size: 16px;
          transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
          max-width: min(560px, 100%);
          text-align:center;
        }

        .btn:hover{
          transform: translateY(-1px);
          box-shadow: 0 0 34px rgba(40,240,255,0.28), 0 14px 34px rgba(0,0,0,0.42);
          background: linear-gradient(180deg, rgba(40,240,255,0.12), rgba(40,240,255,0.04));
        }

        .hint{
          margin-top: 10px;
          font-size: 13px;
          color: rgba(255,255,255,0.58);
        }

        /* PAGE 2 */
        .p2{
          min-height:100vh;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:flex-start;
          padding: 42px 18px 60px;
          text-align:center;
        }

        .topRow{
          width: min(520px, 100%);
          display:flex;
          justify-content:flex-start;
          margin: 0 auto 10px;
        }

        .backBtn{
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.82);
          cursor: pointer;
        }

        .arcSm{
          width: 150px;
          height: 150px;
          border-radius: 999px;
          border: 1.8px solid rgba(0,255,255,0.33);
          margin: 0 auto;
          filter: blur(0.6px);
          box-shadow: 0 0 22px rgba(0,255,255,0.20);
          animation: corePulse 4s infinite ease-in-out;
          position: relative;
          display:flex;
          align-items:center;
          justify-content:center;
          overflow:hidden;
        }

        .arcSm::before{
          content:"";
          position:absolute;
          inset:-60%;
          background: radial-gradient(circle, rgba(0,255,255,0.14), transparent 55%);
          transform: rotate(18deg);
          opacity: 0.85;
          animation: slowDrift 10s ease-in-out infinite;
          pointer-events:none;
        }

        .emblemSm{
          width: 118px;
          height: 118px;
          object-fit: contain;
          filter: drop-shadow(0 0 18px rgba(0,255,255,0.55));
          position:relative;
          z-index:1;
        }

        .stack{
          width: min(520px, 100%);
          margin: 0 auto;
          display:flex;
          flex-direction:column;
          align-items:center;
          gap: 14px;
        }

        .step{
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 420ms ease, transform 380ms ease;
          width: 100%;
        }

        .step.show{
          opacity: 1;
          transform: translateY(0);
        }

        .line{
          font-weight: 300;
          font-size: clamp(22px, 5.2vw, 28px);
          margin: 14px auto;
          max-width: 420px;
          line-height: 1.25;
        }

        .lineSm{
          font-size: 15px;
          color: rgba(0,255,255,0.55);
          font-weight: 450;
          max-width: 360px;
          line-height: 1.45;
          margin: 10px auto 6px;
        }

        .input{
          background: transparent;
          border: 1px solid rgba(0,255,255,0.33);
          color: #fff;
          font-size: 18px;
          width: min(320px, 92%);
          padding: 14px 18px;
          border-radius: 12px;
          margin: 8px auto 0;
          display:block;
          text-align:center;
          transition: border-color .3s, box-shadow .3s;
        }

        .input:focus{
          outline: none;
          border-color: rgba(0,255,255,1);
          box-shadow: 0 0 14px rgba(0,255,255,0.28);
        }

        .equation2{
          display:flex;
          align-items: baseline;
          justify-content:center;
          flex-wrap: wrap;
          gap: 10px;
          margin: 12px auto 0;
        }

        .eqText2{
          font-size: 15px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(0,255,255,0.62);
          font-weight: 800;
        }

        .eqSym2{
          font-size: 17px;
          color: rgba(255,255,255,0.72);
          font-weight: 900;
        }

        .balance2{
          font-size: 22px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 950;
          color: var(--brass);
          text-shadow: 0 0 18px var(--brassGlow);
          padding: 2px 6px;
          border-radius: 10px;
          animation: balancePulse 3.6s ease-in-out infinite;
        }

        .btnRow{
          margin-top: 18px;
          display:flex;
          gap: 10px;
          justify-content:center;
          flex-wrap: wrap;
        }

        .btn2{
          padding: 15px 22px;
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          background: transparent;
          border: 1.8px solid rgba(0,255,255,0.70);
          border-radius: 999px;
          cursor: pointer;
          transition: transform .16s ease, box-shadow .2s ease, background .2s ease;
        }

        .btn2:hover{
          background: rgba(0,255,255,0.08);
          box-shadow: 0 0 18px rgba(0,255,255,0.36);
          transform: translateY(-1px);
        }

        .btn2:disabled{
          opacity: 0.45;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        .btn2Secondary{
          border-color: rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.75);
        }

        .hint2{
          margin-top: 10px;
          font-size: 13px;
          color: rgba(255,255,255,0.58);
          max-width: 440px;
          line-height: 1.4;
        }

        @media (max-width: 420px){
          .core{ width: 236px; height: 236px; }
          .emblemLg{ width: 188px; height: 188px; }
          .btn{ width: 100%; max-width: 340px; }

          .arcSm{ width: 136px; height: 136px; }
          .emblemSm{ width: 108px; height: 108px; }
          .btn2{ width: 100%; max-width: 340px; }
        }

        @media (prefers-reduced-motion: reduce){
          .core, .core::before, .balance,
          .arcSm, .arcSm::before, .balance2{
            animation: none !important;
          }
          .step{
            transition: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      {view === "landing" ? (
        <main className="p1">
          <div className="p1Wrap">
            <div className="core" aria-label="Cipher core">
              <img
                className="emblemLg"
                src="/brand/cipher-emblem.png"
                alt="BALANCE Cipher Core"
                loading="eager"
              />
            </div>

            <div className="equation" aria-label="Cipher equation">
              <span className="eqText">Cipher</span>
              <span className="eqSym">+</span>
              <span className="eqText">Co-Pilot</span>
              <span className="eqSym">+</span>
              <span className="eqText">You</span>
              <span className="eqSym">=</span>
              <span className="balance">BALANCE</span>
            </div>

            <div className="cornerstone">
              <strong>Are you ready to start decoding?</strong>
            </div>

            <div className="sub">
              The Cipher shows the pattern. The Co-Pilot makes it simple. You take the next step with clear direction.
            </div>

            <button className="btn" type="button" onClick={goToDecodePage}>
              Start the private decode
            </button>

            <div className="hint">No pressure. No shame. Just clarity.</div>
          </div>
        </main>
      ) : (
        <main className="p2">
          <div className="topRow">
            <button className="backBtn" type="button" onClick={goBackToLanding}>
              Back to landing
            </button>
          </div>

          <div style={{ margin: "6px 0 16px" }}>
            <div className="arcSm" aria-label="Cipher core">
              <img className="emblemSm" src="/brand/cipher-emblem.png" alt="BALANCE Cipher Core" />
            </div>
          </div>

          <div className="stack">
            <div className={`step ${show("welcome") ? "show" : ""}`}>
              <div className="line">Let’s make this personal.</div>
            </div>

            <div className={`step ${show("firstPrompt") ? "show" : ""}`}>
              <div className="line">Your first name.</div>
            </div>

            <div className={`step ${show("firstInput") ? "show" : ""}`}>
              <input
                ref={firstRef}
                className="input"
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onKeyDown={handleInputKeyDown}
                autoComplete="given-name"
              />
            </div>

            <div className={`step ${show("lastPrompt") ? "show" : ""}`}>
              <div className="line">
                AI doesn’t need your last name.
                <br />
                Balance needs your full truth.
              </div>
            </div>

            <div className={`step ${show("lastInput") ? "show" : ""}`}>
              <input
                ref={lastRef}
                className="input"
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onKeyDown={handleInputKeyDown}
                autoComplete="family-name"
              />
            </div>

            <div className={`step ${show("cipherExplain") ? "show" : ""}`}>
              <div className="lineSm">
                The Cipher isn’t software.
                <br />
                It’s the quiet math between what you do… and what your score becomes.
              </div>
              <div className="cornerstone">
                <strong>Are you ready to start decoding?</strong>
              </div>
            </div>

            <div className={`step ${show("equation") ? "show" : ""}`}>
              <div className="equation2" aria-label="Cipher equation">
                <span className="eqText2">Cipher</span>
                <span className="eqSym2">+</span>
                <span className="eqText2">Co-Pilot</span>
                <span className="eqSym2">+</span>
                <span className="eqText2">You</span>
                <span className="eqSym2">=</span>
                <span className="balance2">BALANCE</span>
              </div>
            </div>

            {showControlsOnDecode ? (
              <div className={`step show`}>
                <div className="btnRow">
                  {stepIndex > 0 && current !== "cta" ? (
                    <button className="btn2 btn2Secondary" type="button" onClick={back}>
                      Back
                    </button>
                  ) : null}

                  <button
                    className="btn2"
                    type="button"
                    onClick={onPrimary}
                    disabled={!canAdvanceFromThisStep()}
                  >
                    {primaryLabel()}
                  </button>
                </div>

                <div className="hint2">
                  {current === "firstInput" || current === "lastInput"
                    ? "This is just for personalization. No hype. No shame."
                    : "Cipher + Co-Pilot + You = BALANCE. Clear direction returns."}
                </div>
              </div>
            ) : null}
          </div>
        </main>
      )}
    </>
  );
}
