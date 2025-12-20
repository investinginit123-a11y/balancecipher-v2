import React, { useEffect, useMemo, useRef, useState } from "react";

type View = "landing" | "p2" | "p3" | "p4" | "p5";

/**
 * Page steps:
 * - P2: personal + first name
 * - P3: last name + cipher explain + equation
 * - P4: email + send code message
 * - P5: final gate (paste code) -> welcome
 */
type StepKey =
  | "welcome"
  | "firstPrompt"
  | "firstInput"
  | "cta"
  | "lastPrompt"
  | "lastInput"
  | "cipherExplain"
  | "equation"
  | "emailPrompt"
  | "emailInput"
  | "sendExplain"
  | "finalGate"
  | "finalInput"
  | "finalWhisper"
  | "welcomeHome";

function safeTrimMax(v: string, maxLen: number) {
  return v.trim().slice(0, maxLen);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function generateAccessCode(): string {
  // Client-side placeholder. Replace later with server-generated + emailed code.
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export default function App() {
  // PAGE SWITCH (Page 1 -> Page 2 -> Page 3 -> Page 4 -> Page 5)
  const [view, setView] = useState<View>("landing");

  // Per-page step flow
  const [stepIndex, setStepIndex] = useState<number>(0);

  // Data capture
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [accessCode, setAccessCode] = useState<string>("");

  // Final gate input
  const [codeInput, setCodeInput] = useState<string>("");

  // Refs (focus)
  const firstRef = useRef<HTMLInputElement | null>(null);
  const lastRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const codeRef = useRef<HTMLInputElement | null>(null);

  // Auto reveal timing
  const autoTimerRef = useRef<number | null>(null);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  const stepsForView: StepKey[] = useMemo(() => {
    if (view === "p2")
      return ["welcome", "firstPrompt", "firstInput", "cta"];
    if (view === "p3")
      return ["lastPrompt", "lastInput", "cipherExplain", "equation", "cta"];
    if (view === "p4")
      return ["emailPrompt", "emailInput", "sendExplain", "cta"];
    if (view === "p5")
      return ["finalGate", "finalInput", "finalWhisper", "welcomeHome"];
    return [];
  }, [view]);

  const current = stepsForView[stepIndex];

  function clearAutoTimer() {
    if (autoTimerRef.current) {
      window.clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  }

  function show(step: StepKey): boolean {
    return stepsForView.indexOf(step) <= stepIndex;
  }

  function next() {
    setStepIndex((i) => Math.min(i + 1, stepsForView.length - 1));
  }

  function back() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function goTo(v: View) {
    clearAutoTimer();
    setView(v);
    setStepIndex(0);
  }

  function goToDecodePage() {
    goTo("p2");
  }

  function goBackFromP2() {
    goTo("landing");
  }

  function goBackFromP3() {
    goTo("p2");
  }

  function goBackFromP4() {
    goTo("p3");
  }

  function goBackFromP5() {
    goTo("p4");
  }

  function canAdvanceFromThisStep(): boolean {
    if (view === "p2" && current === "firstInput") return firstName.trim().length > 0;
    if (view === "p3" && current === "lastInput") return lastName.trim().length > 0;
    if (view === "p4" && current === "emailInput") return isValidEmail(email);
    if (view === "p5" && current === "finalInput") {
      const expected = accessCode.trim().toUpperCase();
      const entered = codeInput.trim().toUpperCase();
      if (!expected) return entered.length > 0; // allow preview even if code missing
      return entered.length > 0 && entered === expected;
    }
    return true;
  }

  function primaryLabel(): string {
    if (view === "p2" && current === "cta") return "Continue";
    if (view === "p3" && current === "cta") return "Continue";
    if (view === "p4" && current === "cta") return "Continue";
    // On page 5 we do not show a big CTA; code entry drives it.
    return "Continue";
  }

  function onPrimary() {
    if (!canAdvanceFromThisStep()) return;

    // Page-level handoffs
    if (view === "p2" && current === "cta") {
      goTo("p3");
      return;
    }
    if (view === "p3" && current === "cta") {
      goTo("p4");
      return;
    }
    if (view === "p4" && current === "cta") {
      // Generate code (placeholder for now)
      if (!accessCode) {
        const code = generateAccessCode();
        setAccessCode(code);

        // Persist basic personalization for later (optional)
        try {
          localStorage.setItem("balancecipher_firstName", safeTrimMax(firstName, 40));
          localStorage.setItem("balancecipher_lastName", safeTrimMax(lastName, 60));
          localStorage.setItem("balancecipher_email", safeTrimMax(email, 120));
          localStorage.setItem("balancecipher_code", code);
        } catch {
          // ignore storage failures
        }
      }
      goTo("p5");
      return;
    }

    // In-page steps
    next();
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();

      // Page 5 is special: Enter on code triggers welcome instantly if correct.
      if (view === "p5" && current === "finalInput") {
        if (canAdvanceFromThisStep()) {
          // advance to whisper then welcome
          next(); // finalWhisper
          // slight delay then welcome
          window.setTimeout(() => {
            setStepIndex(stepsForView.indexOf("welcomeHome"));
          }, prefersReducedMotion ? 0 : 520);
        }
        return;
      }

      onPrimary();
    }
  }

  // Auto-reveal behavior per page (keeps your format + pacing)
  useEffect(() => {
    clearAutoTimer();
    if (view === "landing") return;
    if (prefersReducedMotion) return;

    // P2: welcome -> firstPrompt -> firstInput (then stop for typing)
    if (view === "p2") {
      if (stepIndex === 0) {
        autoTimerRef.current = window.setTimeout(() => setStepIndex(1), 900);
        return;
      }
      if (stepIndex === 1) {
        autoTimerRef.current = window.setTimeout(() => setStepIndex(2), 900);
        return;
      }
      return;
    }

    // P3: lastPrompt -> lastInput (then stop) then auto cipherExplain -> equation -> cta
    if (view === "p3") {
      if (stepIndex === 0) {
        autoTimerRef.current = window.setTimeout(() => setStepIndex(1), 900);
        return;
      }
      // after last input completes, user hits Continue, then:
      if (stepIndex === 2) {
        autoTimerRef.current = window.setTimeout(() => setStepIndex(3), 950);
        return;
      }
      if (stepIndex === 3) {
        autoTimerRef.current = window.setTimeout(() => setStepIndex(4), 950);
        return;
      }
      return;
    }

    // P4: emailPrompt -> emailInput (then stop) then auto sendExplain -> cta
    if (view === "p4") {
      if (stepIndex === 0) {
        autoTimerRef.current = window.setTimeout(() => setStepIndex(1), 900);
        return;
      }
      if (stepIndex === 2) {
        autoTimerRef.current = window.setTimeout(() => setStepIndex(3), 950);
        return;
      }
      return;
    }

    // P5: gate line shows immediately; input shows shortly after
    if (view === "p5") {
      if (stepIndex === 0) {
        autoTimerRef.current = window.setTimeout(() => setStepIndex(1), 900);
        return;
      }
      if (stepIndex === 1) {
        autoTimerRef.current = window.setTimeout(() => setStepIndex(2), 900);
        return;
      }
      return;
    }
  }, [view, stepIndex, prefersReducedMotion]);

  // Focus inputs when they appear
  useEffect(() => {
    if (view === "p2" && current === "firstInput") {
      setTimeout(() => firstRef.current?.focus(), prefersReducedMotion ? 0 : 220);
    }
    if (view === "p3" && current === "lastInput") {
      setTimeout(() => lastRef.current?.focus(), prefersReducedMotion ? 0 : 220);
    }
    if (view === "p4" && current === "emailInput") {
      setTimeout(() => emailRef.current?.focus(), prefersReducedMotion ? 0 : 220);
    }
    if (view === "p5" && current === "finalInput") {
      setTimeout(() => codeRef.current?.focus(), prefersReducedMotion ? 0 : 220);
    }
  }, [view, current, prefersReducedMotion]);

  // Show control buttons whenever user interaction is needed (or reduced motion is on)
  const showControls =
    view !== "landing" &&
    (prefersReducedMotion ||
      current === "firstInput" ||
      current === "lastInput" ||
      current === "emailInput" ||
      current === "cipherExplain" ||
      current === "equation" ||
      current === "sendExplain" ||
      current === "cta");

  const infoUrlText = "balancecipher.com/info";

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

        /* Pages 2–5 */
        .pX{
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

        /* Final gate arc (white core + thin cyan ring) */
        .arcGate{
          width: 150px;
          height: 150px;
          border-radius: 999px;
          border: 1px solid rgba(0,255,255,0.36);
          margin: 0 auto;
          box-shadow: 0 0 18px rgba(0,255,255,0.16);
          position: relative;
          display:flex;
          align-items:center;
          justify-content:center;
          overflow:hidden;
        }

        .arcGate::before{
          content:"";
          position:absolute;
          inset: 22px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.65) 55%, rgba(255,255,255,0) 75%);
          filter: blur(0.2px);
        }

        .arcGate::after{
          content:"";
          position:absolute;
          inset:0;
          border-radius:999px;
          border: 1px solid rgba(0,255,255,0.55);
          box-shadow: 0 0 16px rgba(0,255,255,0.12);
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

        .whisper{
          margin-top: 8px;
          font-size: 13px;
          color: rgba(255,255,255,0.52);
          max-width: 420px;
          line-height: 1.45;
        }

        .gateBtn{
          margin-top: 14px;
          padding: 14px 18px;
          border-radius: 999px;
          border: 1.5px solid rgba(40,240,255,0.65);
          color: rgba(40,240,255,0.95);
          background: rgba(0,0,0,0.18);
          cursor: pointer;
          font-weight: 800;
          text-decoration:none;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap: 10px;
          box-shadow: 0 0 18px rgba(40,240,255,0.12);
        }

        .gateBtn:hover{
          background: rgba(40,240,255,0.08);
          box-shadow: 0 0 24px rgba(40,240,255,0.16);
        }

        .tinyLink{
          margin-top: 8px;
          font-size: 12px;
          color: rgba(0,255,255,0.55);
        }

        @media (max-width: 420px){
          .core{ width: 236px; height: 236px; }
          .emblemLg{ width: 188px; height: 188px; }
          .btn{ width: 100%; max-width: 340px; }

          .arcSm, .arcGate{ width: 136px; height: 136px; }
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

      {/* PAGE 1 (Landing) */}
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
      ) : null}

      {/* PAGE 2 */}
      {view === "p2" ? (
        <main className="pX">
          <div className="topRow">
            <button className="backBtn" type="button" onClick={goBackFromP2}>
              Back
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

            {showControls ? (
              <div className="step show">
                <div className="btnRow">
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
                  This is just for personalization. No hype. No shame.
                </div>
              </div>
            ) : null}
          </div>
        </main>
      ) : null}

      {/* PAGE 3 */}
      {view === "p3" ? (
        <main className="pX">
          <div className="topRow">
            <button className="backBtn" type="button" onClick={goBackFromP3}>
              Back
            </button>
          </div>

          <div style={{ margin: "6px 0 16px" }}>
            <div className="arcSm" aria-label="Cipher core">
              <img className="emblemSm" src="/brand/cipher-emblem.png" alt="BALANCE Cipher Core" />
            </div>
          </div>

          <div className="stack">
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

            {showControls ? (
              <div className="step show">
                <div className="btnRow">
                  <button className="btn2 btn2Secondary" type="button" onClick={back} disabled={stepIndex === 0}>
                    Back
                  </button>

                  <button className="btn2" type="button" onClick={onPrimary} disabled={!canAdvanceFromThisStep()}>
                    {primaryLabel()}
                  </button>
                </div>

                <div className="hint2">
                  Cipher + Co-Pilot + You = BALANCE. Clear direction returns.
                </div>
              </div>
            ) : null}
          </div>
        </main>
      ) : null}

      {/* PAGE 4 */}
      {view === "p4" ? (
        <main className="pX">
          <div className="topRow">
            <button className="backBtn" type="button" onClick={goBackFromP4}>
              Back
            </button>
          </div>

          <div style={{ margin: "6px 0 16px" }}>
            <div className="arcSm" aria-label="Cipher core">
              <img className="emblemSm" src="/brand/cipher-emblem.png" alt="BALANCE Cipher Core" />
            </div>
          </div>

          <div className="stack">
            <div className={`step ${show("emailPrompt") ? "show" : ""}`}>
              <div className="line">Email — your key arrives here, once.</div>
            </div>

            <div className={`step ${show("emailInput") ? "show" : ""}`}>
              <input
                ref={emailRef}
                className="input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleInputKeyDown}
                autoComplete="email"
              />
              <div className="whisper">
                First 500 get Chapter One instantly. Everyone else waits 72 hours.
              </div>
            </div>

            <div className={`step ${show("sendExplain") ? "show" : ""}`}>
              <div className="lineSm">
                Code’s on the way.
                <br />
                60 seconds.
              </div>
              <div className="tinyLink">{infoUrlText}</div>
            </div>

            {showControls ? (
              <div className="step show">
                <div className="btnRow">
                  <button className="btn2 btn2Secondary" type="button" onClick={back} disabled={stepIndex === 0}>
                    Back
                  </button>

                  <button className="btn2" type="button" onClick={onPrimary} disabled={!canAdvanceFromThisStep()}>
                    {primaryLabel()}
                  </button>
                </div>

                <div className="hint2">
                  We’ll wire real code-delivery later. For now, this preview confirms the flow.
                </div>
              </div>
            ) : null}
          </div>
        </main>
      ) : null}

      {/* PAGE 5 (Final Gate) */}
      {view === "p5" ? (
        <main className="pX">
          <div className="topRow">
            <button className="backBtn" type="button" onClick={goBackFromP5}>
              Back
            </button>
          </div>

          <div style={{ margin: "6px 0 16px" }}>
            <div className="arcGate" aria-label="Final gate" />
          </div>

          <div className="stack">
            <div className={`step ${show("finalGate") ? "show" : ""}`}>
              <div className="line">You brought the key.</div>
            </div>

            <div className={`step ${show("finalInput") ? "show" : ""}`}>
              <div className="lineSm">Paste it below. One time only.</div>
              <input
                ref={codeRef}
                className="input"
                type="text"
                placeholder="your private cipher code"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
                autoComplete="one-time-code"
              />
            </div>

            <div className={`step ${show("finalWhisper") ? "show" : ""}`}>
              <div className="whisper">
                First 500 get Chapter One instantly. Everyone else waits 72 hours.
              </div>
            </div>

            <div className={`step ${show("welcomeHome") ? "show" : ""}`}>
              <div className="line">
                Welcome home{firstName.trim() ? `, ${safeTrimMax(firstName, 40)}` : ""}.
              </div>

              <a className="gateBtn" href="https://balancecipher.com/info">
                Open the Balance Formula
              </a>
              <div className="tinyLink">{infoUrlText}</div>

              {/* Debug line hidden by default later; kept visible now to help you test */}
              <div className="hint2" style={{ marginTop: 10 }}>
                Preview code (temporary): <strong>{accessCode || "(not generated yet)"}</strong>
              </div>
            </div>

            {/* Minimal controls: On Page 5, code entry + Enter drives the transition.
                If reduced motion is on, show a Continue button for accessibility. */}
            {prefersReducedMotion ? (
              <div className="step show">
                <div className="btnRow">
                  <button className="btn2" type="button" onClick={() => setStepIndex(stepsForView.indexOf("welcomeHome"))}>
                    Continue
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </main>
      ) : null}
    </>
  );
}
