import React, { useEffect, useMemo, useRef, useState } from "react";

type StepKey =
  | "welcome"
  | "firstPrompt"
  | "firstInput"
  | "lastPrompt"
  | "laimport React, { useEffect, useMemo, useRef, useState } from "react";

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

  // Page 2 state (your injected step flow)
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const firstRef = useRef<HTMLInputElement | null>(null);
  const lastRef = useRef<HTMLInputElement | null>(null);

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

  // Focus inputs when Page 2 is active and the inputs appear
  useEffect(() => {
    if (view !== "decode") return;

    if (current === "firstInput") {
      setTimeout(() => firstRef.current?.focus(), prefersReducedMotion ? 0 : 220);
    }
    if (current === "lastInput") {
      setTimeout(() => lastRef.current?.focus(), prefersReducedMotion ? 0 : 220);
    }
  }, [view, current, prefersReducedMotion]);

  function goToDecodePage() {
    // This is the “code break” you asked for: CTA triggers the next page.
    setView("decode");
    setStepIndex(0);
  }

  function goBackToLanding() {
    setView("landing");
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
    if (current === "firstInput") return "Continue";
    if (current === "lastInput") return "Continue";
    if (current === "cta") return "Continue";
    return "Continue";
  }

  function onPrimary() {
    // Page 2 final CTA hook — replace this later with your real “Page 3” or form submit.
    if (current === "cta") {
      alert("Confirmed. Next: connect this to your real form / next page.");
      return;
    }
    if (!canAdvanceFromThisStep()) return;
    next();
  }

  function show(step: StepKey): boolean {
    return steps.indexOf(step) <= stepIndex;
  }

  return (
    <>
      <style>{`
        :root{
          --bg0:#050b14;
          --bg1:#000;
          --text:#ffffff;

          --teal:#28f0ff;
          --tealSoft: rgba(40, 240, 255, 0.18);
          --tealGlow: rgba(40, 240, 255, 0.35);

          --brass:#d7b06b;
          --brassGlow: rgba(215, 176, 107, 0.32);

          --muted: rgba(255,255,255,0.72);
          --muted2: rgba(255,255,255,0.58);
          --radius: 28px;
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
        }

        /* Shared pulse */
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
            text-shadow:
              0 0 16px rgba(215,176,107,0.26),
              0 0 30px rgba(40,240,255,0.10);
          }
          50%{
            transform: scale(1.06);
            opacity: 1;
            text-shadow:
              0 0 24px rgba(215,176,107,0.42),
              0 0 44px rgba(40,240,255,0.16);
          }
        }

        /* =========================
           PAGE 1 — LANDING
           ========================= */
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

        .p1Core{
          width: 275px;
          height: 275px;
          border-radius: 999px;
          display:flex;
          align-items:center;
          justify-content:center;
          background: radial-gradient(circle, rgba(40,240,255,0.18), transparent 68%);
          box-shadow:
            0 0 62px rgba(40,240,255,0.20),
            inset 0 0 28px rgba(40,240,255,0.14);
          position: relative;
          overflow: hidden;
          animation: corePulse 3.8s ease-in-out infinite;
          margin-bottom: 4px;
        }

        .p1Core::before{
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

        .p1Emblem{
          width: 220px;
          height: 220px;
          object-fit: contain;
          filter: drop-shadow(0 0 20px rgba(40,240,255,0.60));
          position: relative;
          z-index: 1;
        }

        .p1Equation{
          display:flex;
          align-items: baseline;
          justify-content:center;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 8px;
        }

        .p1EqText{
          font-size: 16px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.82);
          font-weight: 750;
        }

        .p1EqSym{
          font-size: 18px;
          color: rgba(255,255,255,0.62);
          font-weight: 900;
        }

        .p1Balance{
          font-size: 24px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 950;
          color: var(--brass);
          padding: 2px 6px;
          border-radius: 10px;
          animation: balancePulse 3.6s ease-in-out infinite;
        }

        .p1Cornerstone{
          margin-top: 6px;
          font-size: 15px;
          color: rgba(255,255,255,0.88);
        }

        .p1Cornerstone strong{
          font-weight: 800;
          color: rgba(255,255,255,0.98);
        }

        .p1Sub{
          width: min(640px, 100%);
          color: rgba(255,255,255,0.72);
          font-size: clamp(14px, 3.7vw, 16px);
          line-height: 1.55;
          margin-top: 8px;
        }

        .p1CtaRow{
          margin-top: 18px;
          display:flex;
          flex-direction:column;
          align-items:center;
          gap: 10px;
        }

        .p1Btn{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding: 16px 22px;
          border-radius: 999px;
          border: 1.5px solid rgba(40,240,255,0.75);
          color: rgba(255,255,255,0.96);
          background: linear-gradient(180deg, rgba(40,240,255,0.08), rgba(40,240,255,0.03));
          box-shadow:
            0 0 24px rgba(40,240,255,0.18),
            0 12px 30px rgba(0,0,0,0.35);
          cursor:pointer;
          font-weight: 750;
          font-size: 16px;
          transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
          max-width: min(560px, 100%);
          text-align:center;
        }

        .p1Btn:hover{
          transform: translateY(-1px);
          box-shadow:
            0 0 34px rgba(40,240,255,0.28),
            0 14px 34px rgba(0,0,0,0.42);
          background: linear-gradient(180deg, rgba(40,240,255,0.12), rgba(40,240,255,0.04));
        }

        .p1Hint{
          font-size: 13px;
          color: rgba(255,255,255,0.58);
        }

        /* =========================
           PAGE 2 — DECODE (your step flow)
           ========================= */
        .p2{
          min-height:100vh;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:flex-start;
          padding: 42px 18px 60px;
          text-align:center;
        }

        .p2TopRow{
          width: min(520px, 100%);
          display:flex;
          justify-content: flex-start;
          margin: 0 auto 10px;
        }

        .p2Back{
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.82);
          cursor: pointer;
        }

        .p2CoreWrap{ margin: 6px 0 16px; }

        .p2Arc{
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

        .p2Arc::before{
          content:"";
          position:absolute;
          inset:-60%;
          background: radial-gradient(circle, rgba(0,255,255,0.14), transparent 55%);
          transform: rotate(18deg);
          opacity: 0.85;
          animation: slowDrift 10s ease-in-out infinite;
          pointer-events:none;
        }

        .p2Emblem{
          width: 118px;
          height: 118px;
          object-fit: contain;
          filter: drop-shadow(0 0 18px rgba(0,255,255,0.55));
          position:relative;
          z-index:1;
        }

        .p2Stack{
          width: min(520px, 100%);
          margin: 0 auto;
          display:flex;
          flex-direction:column;
          align-items:center;
          gap: 14px;
        }

        .p2Step{
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 420ms ease, transform 380ms ease;
          width: 100%;
        }

        .p2Step.show{
          opacity: 1;
          transform: translateY(0);
        }

        .p2Line{
          font-weight: 300;
          font-size: clamp(22px, 5.2vw, 28px);
          margin: 14px auto;
          max-width: 420px;
          line-height: 1.25;
        }

        .p2LineSm{
          font-size: 15px;
          color: rgba(0,255,255,0.55);
          font-weight: 450;
          max-width: 360px;
          line-height: 1.45;
          margin: 10px auto 6px;
        }

        .p2Input{
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

        .p2Input:focus{
          outline: none;
          border-color: rgba(0,255,255,1);
          box-shadow: 0 0 14px rgba(0,255,255,0.28);
        }

        .p2EquationRow{
          display:flex;
          align-items: baseline;
          justify-content:center;
          flex-wrap: wrap;
          gap: 10px;
          margin: 12px auto 0;
        }

        .p2EqText{
          font-size: 15px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(0,255,255,0.62);
          font-weight: 750;
        }

        .p2EqSym{
          font-size: 17px;
          color: rgba(255,255,255,0.72);
          font-weight: 900;
        }

        .p2BalanceWord{
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

        .p2Cornerstone{
          margin-top: 12px;
          font-size: 15px;
          color: rgba(255,255,255,0.86);
        }

        .p2Cornerstone strong{
          font-weight: 800;
          color: rgba(255,255,255,0.98);
        }

        .p2BtnRow{
          margin-top: 18px;
          display:flex;
          gap: 10px;
          justify-content:center;
          flex-wrap: wrap;
        }

        .p2Btn{
          padding: 15px 22px;
          font-size: 16px;
          font-weight: 650;
          color: #fff;
          background: transparent;
          border: 1.8px solid rgba(0,255,255,0.70);
          border-radius: 999px;
          cursor: pointer;
          transition: transform .16s ease, box-shadow .2s ease, background .2s ease;
        }

        .p2Btn:hover{
          background: rgba(0,255,255,0.08);
          box-shadow: 0 0 18px rgba(0,255,255,0.36);
          transform: translateY(-1px);
        }

        .p2Btn:disabled{
          opacity: 0.45;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        .p2BtnSecondary{
          border-color: rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.75);
        }

        .p2Hint{
          margin-top: 10px;
          font-size: 13px;
          color: rgba(255,255,255,0.58);
          max-width: 440px;
          line-height: 1.4;
        }

        @media (max-width: 420px){
          .p1Core{ width: 236px; height: 236px; }
          .p1Emblem{ width: 188px; height: 188px; }
          .p1Btn{ width: 100%; max-width: 340px; }

          .p2Arc{ width: 136px; height: 136px; }
          .p2Emblem{ width: 108px; height: 108px; }
          .p2Btn{ width: 100%; max-width: 340px; }
        }

        @media (prefers-reduced-motion: reduce){
          .p1Core, .p1Core::before, .p1Balance,
          .p2Arc, .p2Arc::before, .p2BalanceWord{
            animation: none !important;
          }

          .p2Step{
            transition: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      {view === "landing" ? (
        <main className="p1">
          <div className="p1Wrap">
            <div className="p1Core" aria-label="Cipher core">
              <img className="p1Emblem" src="/brand/cipher-emblem.png" alt="BALANCE Cipher Core" loading="eager" />
            </div>

            <div className="p1Equation" aria-label="Cipher equation">
              <span className="p1EqText">Cipher</span>
              <span className="p1EqSym">+</span>
              <span className="p1EqText">Co-Pilot</span>
              <span className="p1EqSym">+</span>
              <span className="p1EqText">You</span>
              <span className="p1EqSym">=</span>
              <span className="p1Balance">BALANCE</span>
            </div>

            <div className="p1Cornerstone">
              <strong>Are you ready to start decoding?</strong>
            </div>

            <div className="p1Sub">
              The Cipher shows the pattern. The Co-Pilot makes it simple. You take the next step with clear direction.
            </div>

            <div className="p1CtaRow">
              <button className="p1Btn" type="button" onClick={goToDecodePage}>
                Start the private decode
              </button>
              <div className="p1Hint">No pressure. No shame. Just clarity.</div>
            </div>
          </div>
        </main>
      ) : (
        <main className="p2">
          <div className="p2TopRow">
            <button className="p2Back" type="button" onClick={goBackToLanding}>
              Back to landing
            </button>
          </div>

          <div className="p2CoreWrap" aria-label="Cipher core">
            <div className="p2Arc">
              <img className="p2Emblem" src="/brand/cipher-emblem.png" alt="BALANCE Cipher Core" />
            </div>
          </div>

          <div className="p2Stack">
            <div className={`p2Step ${show("welcome") ? "show" : ""}`}>
              <div className="p2Line">Let’s make this personal.</div>
            </div>

            <div className={`p2Step ${show("firstPrompt") ? "show" : ""}`}>
              <div className="p2Line">Your first name.</div>
            </div>

            <div className={`p2Step ${show("firstInput") ? "show" : ""}`}>
              <input
                ref={firstRef}
                className="p2Input"
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
              />
            </div>

            <div className={`p2Step ${show("lastPrompt") ? "show" : ""}`}>
              <div className="p2Line">
                AI doesn’t need your last name.
                <br />
                Balance needs your full truth.
              </div>
            </div>

            <div className={`p2Step ${show("lastInput") ? "show" : ""}`}>
              <input
                ref={lastRef}
                className="p2Input"
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
              />
            </div>

            <div className={`p2Step ${show("cipherExplain") ? "show" : ""}`}>
              <div className="p2LineSm">
                The Cipher isn’t software.
                <br />
                It’s the quiet math between what you do… and what your score becomes.
              </div>
              <div className="p2Cornerstone">
                <strong>Are you ready to start decoding?</strong>
              </div>
            </div>

            <div className={`p2Step ${show("equation") ? "show" : ""}`}>
              <div className="p2EquationRow" aria-label="Cipher equation">
                <span className="p2EqText">Cipher</span>
                <span className="p2EqSym">+</span>
                <span className="p2EqText">Co-Pilot</span>
                <span className="p2EqSym">+</span>
                <span className="p2EqText">You</span>
                <span className="p2EqSym">=</span>
                <span className="p2BalanceWord">BALANCE</span>
              </div>
            </div>

            <div className={`p2Step ${show("cta") ? "show" : ""}`}>
              <div className="p2BtnRow">
                {stepIndex > 0 && current !== "cta" ? (
                  <button className="p2Btn p2BtnSecondary" type="button" onClick={back}>
                    Back
                  </button>
                ) : null}

                <button className="p2Btn" type="button" onClick={onPrimary} disabled={!canAdvanceFromThisStep()}>
                  {primaryLabel()}
                </button>
              </div>

              <div className="p2Hint">
                {current === "firstInput" || current === "lastInput"
                  ? "This is just for personalization. No hype. No shame."
                  : "Cipher + Co-Pilot + You = BALANCE. Clear direction returns."}
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
}
stInput"
  | "cipherExplain"
  | "equation"
  | "cta";

export default function App() {
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const firstRef = useRef<HTMLInputElement | null>(null);
  const lastRef = useRef<HTMLInputElement | null>(null);

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

  useEffect(() => {
    // Focus inputs when they appear (but respect reduced motion timing by focusing immediately)
    if (current === "firstInput") {
      setTimeout(() => firstRef.current?.focus(), prefersReducedMotion ? 0 : 220);
    }
    if (current === "lastInput") {
      setTimeout(() => lastRef.current?.focus(), prefersReducedMotion ? 0 : 220);
    }
  }, [current, prefersReducedMotion]);

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
    if (current === "firstInput") return "Continue";
    if (current === "lastInput") return "Continue";
    if (current === "cta") return "Start the private decode";
    return "Continue";
  }

  function onPrimary() {
    if (current === "cta") {
      // Non-destructive placeholder action
      alert("Confirmed. Next: connect this to your form or onboarding flow.");
      return;
    }
    if (!canAdvanceFromThisStep()) return;
    next();
  }

  function show(step: StepKey): boolean {
    return steps.indexOf(step) <= stepIndex;
  }

  return (
    <>
      <style>{`
        :root{
          --bg:#000;
          --text:#e0f7ff;

          --teal: rgba(0,255,255,1);
          --teal55: rgba(0,255,255,0.33);
          --teal77: rgba(0,255,255,0.47);

          --brass:#d7b06b;
          --brassGlow: rgba(215,176,107,0.30);

          --muted: rgba(0,255,255,0.55);
          --muted2: rgba(255,255,255,0.70);
        }

        *{ box-sizing:border-box; }
        html,body{ height:100%; }
        body{
          margin:0;
          background: var(--bg);
          color: var(--text);
          font-family: "Helvetica Neue", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          text-align:center;
          overflow-x:hidden;
        }

        .page{
          min-height:100vh;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:flex-start;
          padding: 42px 18px 60px;
          position:relative;
        }

        .coreWrap{
          margin: 18px 0 18px;
          position: relative;
          z-index: 2;
        }

        .arc{
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

        .arc::before{
          content:"";
          position:absolute;
          inset:-60%;
          background: radial-gradient(circle, rgba(0,255,255,0.14), transparent 55%);
          transform: rotate(18deg);
          opacity: 0.85;
          animation: slowDrift 10s ease-in-out infinite;
          pointer-events:none;
        }

        .emblem{
          width: 118px;
          height: 118px;
          object-fit: contain;
          filter: drop-shadow(0 0 18px rgba(0,255,255,0.55));
          position:relative;
          z-index:1;
        }

        @keyframes corePulse{
          0%, 100% { box-shadow: 0 0 22px rgba(0,255,255,0.20); transform: scale(1.00); }
          50% { box-shadow: 0 0 44px rgba(0,255,255,0.46); transform: scale(1.03); }
        }

        @keyframes slowDrift{
          0%, 100%{ transform: translate(-2%, -1%) rotate(12deg); opacity: 0.70; }
          50%{ transform: translate(2%, 1%) rotate(20deg); opacity: 0.95; }
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

        .equationRow{
          display:flex;
          align-items: baseline;
          justify-content:center;
          flex-wrap: wrap;
          gap: 10px;
          margin: 12px auto 0;
        }

        .eqText{
          font-size: 15px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(0,255,255,0.62);
          font-weight: 700;
        }

        .eqSym{
          font-size: 17px;
          color: rgba(255,255,255,0.72);
          font-weight: 900;
        }

        .balanceWord{
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

        @keyframes balancePulse{
          0%, 100%{ transform: scale(1.00); opacity: 0.90; text-shadow: 0 0 16px rgba(215,176,107,0.22); }
          50%{ transform: scale(1.06); opacity: 1; text-shadow: 0 0 26px rgba(215,176,107,0.44); }
        }

        .cornerstone{
          margin-top: 12px;
          font-size: 15px;
          color: rgba(255,255,255,0.86);
        }

        .cornerstone strong{
          font-weight: 750;
          color: rgba(255,255,255,0.96);
        }

        .btnRow{
          margin-top: 18px;
          display:flex;
          gap: 10px;
          justify-content:center;
          flex-wrap: wrap;
        }

        .btn{
          padding: 15px 22px;
          font-size: 16px;
          font-weight: 650;
          color: #fff;
          background: transparent;
          border: 1.8px solid rgba(0,255,255,0.70);
          border-radius: 999px;
          cursor: pointer;
          transition: transform .16s ease, box-shadow .2s ease, background .2s ease;
        }

        .btn:hover{
          background: rgba(0,255,255,0.08);
          box-shadow: 0 0 18px rgba(0,255,255,0.36);
          transform: translateY(-1px);
        }

        .btn:disabled{
          opacity: 0.45;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        .btnSecondary{
          border-color: rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.75);
        }

        .hint{
          margin-top: 10px;
          font-size: 13px;
          color: rgba(255,255,255,0.58);
          max-width: 440px;
          line-height: 1.4;
        }

        @media (max-width: 420px){
          .arc{ width: 136px; height: 136px; }
          .emblem{ width: 108px; height: 108px; }
          .btn{ width: 100%; max-width: 340px; }
        }

        @media (prefers-reduced-motion: reduce){
          .arc, .balanceWord{ animation: none !important; }
          .arc::before{ animation: none !important; }
          .step{ transition: none !important; transform: none !important; opacity: 1 !important; }
        }
      `}</style>

      <main className="page">
        <div className="coreWrap" aria-label="Cipher core">
          <div className="arc">
            <img className="emblem" src="/brand/cipher-emblem.png" alt="BALANCE Cipher Core" />
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
            <div className="equationRow" aria-label="Cipher equation">
              <span className="eqText">Cipher</span>
              <span className="eqSym">+</span>
              <span className="eqText">Co-Pilot</span>
              <span className="eqSym">+</span>
              <span className="eqText">You</span>
              <span className="eqSym">=</span>
              <span className="balanceWord">BALANCE</span>
            </div>
          </div>

          <div className={`step ${show("cta") ? "show" : ""}`}>
            <div className="btnRow">
              {stepIndex > 0 && current !== "cta" ? (
                <button className="btn btnSecondary" type="button" onClick={back}>
                  Back
                </button>
              ) : null}

              <button className="btn" type="button" onClick={onPrimary} disabled={!canAdvanceFromThisStep()}>
                {primaryLabel()}
              </button>
            </div>

            <div className="hint">
              {current === "firstInput" || current === "lastInput"
                ? "This is just for personalization. No hype. No shame."
                : "Cipher + Co-Pilot + You. Clear direction returns."}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
