import React, { useEffect, useMemo, useRef, useState } from "react";

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
