import React, { useEffect, useRef, useState } from "react";

type Step = 1 | 2 | 3 | 4;

function safeTrimMax(v: string, maxLen: number) {
  return v.trim().slice(0, maxLen);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function generateAccessCode(): string {
  // Client-side placeholder. Replace with server-generated + emailed code later.
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export default function App() {
  const [step, setStep] = useState<Step>(1);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [codeInput, setCodeInput] = useState("");

  const [error, setError] = useState("");

  // Page 2 staged reveals
  const [showLine1, setShowLine1] = useState(false);
  const [showLine2, setShowLine2] = useState(false);
  const [showLine3, setShowLine3] = useState(false);
  const [showField, setShowField] = useState(false);
  const [showBtn, setShowBtn] = useState(false);

  const firstNameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const codeRef = useRef<HTMLInputElement | null>(null);

  // Clear error on step changes
  useEffect(() => setError(""), [step]);

  // Run Page 2 animation every time step becomes 2
  useEffect(() => {
    if (step !== 2) return;

    setShowLine1(false);
    setShowLine2(false);
    setShowLine3(false);
    setShowField(false);
    setShowBtn(false);

    const timers: number[] = [];
    timers.push(window.setTimeout(() => setShowLine1(true), 800));
    timers.push(window.setTimeout(() => setShowLine2(true), 2500));
    timers.push(window.setTimeout(() => setShowLine3(true), 4300));
    timers.push(
      window.setTimeout(() => {
        setShowField(true);
        setTimeout(() => firstNameRef.current?.focus(), 120);
      }, 6200)
    );
    timers.push(window.setTimeout(() => setShowBtn(true), 6300));

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [step]);

  function goTo(next: Step) {
    setStep(next);
  }

  // PAGE 1 CTA → PAGE 2
  function handleStartPrivateDecode() {
    goTo(2);
  }

  // PAGE 2 → PAGE 3
  function handleContinueFromPage2() {
    const fn = safeTrimMax(firstName, 40);
    const ln = safeTrimMax(lastName, 60);

    if (!fn) {
      setError("Please enter your first name to continue.");
      firstNameRef.current?.focus();
      return;
    }

    setFirstName(fn);
    setLastName(ln);
    goTo(3);
    setTimeout(() => emailRef.current?.focus(), 150);
  }

  // PAGE 3 → PAGE 4
  function handleGetCode() {
    const em = safeTrimMax(email, 120);

    if (!isValidEmail(em)) {
      setError("Please enter a valid email address.");
      emailRef.current?.focus();
      return;
    }

    setEmail(em);
    const code = generateAccessCode();
    setAccessCode(code);
    setCodeInput(code);

    goTo(4);
    setTimeout(() => codeRef.current?.focus(), 150);
  }

  // PAGE 4 “ENTER APP” (placeholder behavior)
  function handleEnterApp() {
    const expected = safeTrimMax(accessCode, 30).toUpperCase();
    const entered = safeTrimMax(codeInput, 30).toUpperCase();

    if (!expected) {
      setError("No access code is available yet. Please go back and request one.");
      return;
    }
    if (entered !== expected) {
      setError("That code does not match. Please check it and try again.");
      codeRef.current?.focus();
      return;
    }

    // If you later set a real app entry URL, this will route.
    const entryUrl = (import.meta as any)?.env?.VITE_APP_ENTRY_URL || "";
    if (entryUrl) {
      window.location.href = entryUrl;
      return;
    }

    setError(
      "Access confirmed. Next: set VITE_APP_ENTRY_URL in Vercel to route into the BALANCE Engine app."
    );
  }

  const displayName = safeTrimMax(firstName, 40) || "you";

  return (
    <div className="stage">
      <style>{css}</style>

      {/* PAGE 1 */}
      {step === 1 && (
        <div className="screen">
          <div className="core" aria-hidden="true" />
          <div className="hero">
            <div className="h1">You’re not broken. You were never given a map.</div>
            <div className="p">
              BALANCE Cipher turns confusion into the next clear step—starting with your credit life.
            </div>

            <button className="next-btn show" type="button" onClick={handleStartPrivateDecode}>
              Start the Private Decode
            </button>

            <div className="micro">Takes under a minute to begin.</div>
          </div>
        </div>
      )}

      {/* PAGE 2 (matches your HTML prototype look/feel) */}
      {step === 2 && (
        <div className="screen">
          <div className="core" aria-hidden="true" />

          <div className={`text ${showLine1 ? "show" : ""}`}>
            A cipher was the first AI — made of ink, not silicon.
          </div>
          <div className={`text ${showLine2 ? "show" : ""}`}>
            AI doesn’t lead. It listens. Then hands you the key.
          </div>
          <div className={`text ${showLine3 ? "show" : ""}`}>You’re the only code that matters.</div>

          <div className={`fieldWrap ${showField ? "show" : ""}`}>
            <input
              ref={firstNameRef}
              className="field"
              placeholder="Your first name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="given-name"
            />
            <input
              className="field"
              placeholder="Your last name (optional)"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="family-name"
            />
          </div>

          <button
            className={`next-btn ${showBtn ? "show" : ""}`}
            type="button"
            onClick={handleContinueFromPage2}
          >
            Continue
          </button>

          {error && <div className="error">{error}</div>}

          <button className="link" type="button" onClick={() => goTo(1)}>
            Back
          </button>
        </div>
      )}

      {/* PAGE 3 */}
      {step === 3 && (
        <div className="screen">
          <div className="core" aria-hidden="true" />
          <div className="hero">
            <div className="h1">Alright, {displayName}. Here’s what we’re decoding.</div>
            <div className="p">
              BALANCE Cipher is a simple map for real change—applied to your credit life. The Cipher
              reveals the pattern. The AI Co-Pilot translates it into the next step. You stay in
              control.
            </div>

            <div className="formula">
              <div className="formulaTitle">The BALANCE Formula</div>
              <div className="formulaLine">
                Break Away → Awaken → Learn → Act → Now-or-Never → Clarity → Evaluate
              </div>
            </div>

            <div className="p" style={{ marginTop: 16 }}>
              Enter your email to receive your private decode key.
            </div>

            <input
              ref={emailRef}
              className="field showAlways"
              placeholder="Your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <button className="next-btn show" type="button" onClick={handleGetCode}>
              Get My Access Code
            </button>
            <div className="micro">Are you ready to start decoding?</div>

            {error && <div className="error">{error}</div>}

            <button className="link" type="button" onClick={() => goTo(2)}>
              Back
            </button>
          </div>
        </div>
      )}

      {/* PAGE 4 */}
      {step === 4 && (
        <div className="screen">
          <div className="core" aria-hidden="true" />
          <div className="hero">
            <div className="h1">Your Private Decode Key is Ready.</div>
            <div className="p">
              This key unlocks the BALANCE Engine so the Co-Pilot can guide you step-by-step—starting
              with your credit life.
            </div>

            <div className="codeBox">
              <div className="codeLabel">Your code</div>
              <div className="codeValue">{accessCode || "—"}</div>
            </div>

            <input
              ref={codeRef}
              className="field showAlways"
              placeholder="Enter your code"
              type="text"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
            />

            <button className="next-btn show" type="button" onClick={handleEnterApp}>
              Enter the BALANCE Engine
            </button>
            <div className="micro">The Co-Pilot decodes. You decide.</div>

            {error && <div className="error">{error}</div>}

            <button className="link" type="button" onClick={() => goTo(3)}>
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const css = `
  *{margin:0;padding:0;box-sizing:border-box;}
  .stage{
    min-height:100vh;
    background:#000;
    color:#fff;
    font-family: "Helvetica Neue", Arial, sans-serif;
  }
  .screen{
    min-height:100vh;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    text-align:center;
    overflow:hidden;
    padding:24px;
  }
  .core{
    width:70px;
    height:70px;
    border-radius:50%;
    border:1px solid rgba(0,255,255,.30);
    background: radial-gradient(circle, rgba(0,255,255,.12) 0%, transparent 70%);
    margin-bottom:36px;
    animation:pulse 3.5s ease-in-out infinite;
  }
  @keyframes pulse{
    0%,100%{box-shadow:0 0 15px rgba(0,255,255,.18);}
    50%{box-shadow:0 0 35px rgba(0,255,255,.38);}
  }

  .hero{max-width:520px;}
  .h1{
    font-weight:650;
    font-size:26px;
    line-height:1.25;
    margin-bottom:12px;
    letter-spacing:.2px;
  }
  .p{
    font-weight:300;
    font-size:16px;
    line-height:1.65;
    color: rgba(255,255,255,.78);
    margin:0 auto 14px;
    max-width:520px;
  }

  .text{
    font-weight:300;
    font-size:18px;
    line-height:1.65;
    max-width:360px;
    margin-bottom:12px;
    opacity:0;
    transform: translateY(8px);
    transition: opacity .8s ease, transform .7s ease;
  }
  .text.show{opacity:1;transform: translateY(0);}

  .fieldWrap{
    width:280px;
    opacity:0;
    transform: translateY(8px);
    transition: opacity .7s ease, transform .7s ease;
    margin-top:18px;
  }
  .fieldWrap.show{opacity:1;transform: translateY(0);}

  .field{
    width:280px;
    padding:14px 20px;
    background:transparent;
    border:1.2px solid rgba(0,255,255,.30);
    color:#fff;
    font-size:18px;
    text-align:center;
    border-radius:14px;
    margin:10px 0 0;
    transition:border .3s ease, box-shadow .3s ease;
  }
  .field:focus{
    outline:none;
    border-color: rgba(0,255,255,.60);
    box-shadow: 0 0 18px rgba(0,255,255,.25);
  }
  .showAlways{opacity:1;transform:none;}

  .next-btn{
    background:transparent;
    border:1.5px solid #00ffff;
    color:#00ffff;
    font-size:16px;
    font-weight:500;
    padding:12px 36px;
    border-radius:25px;
    cursor:pointer;
    margin-top:16px;
    transition: background .25s ease;
    opacity:0;
    transform: translateY(8px);
  }
  .next-btn.show{opacity:1;transform: translateY(0);transition: opacity .7s ease, transform .7s ease, background .25s ease;}
  .next-btn:hover{background: rgba(0,255,255,.10);}

  .micro{
    margin-top:10px;
    font-size:12px;
    color: rgba(255,255,255,.55);
  }

  .link{
    margin-top:18px;
    background:transparent;
    border:1px solid rgba(255,255,255,.18);
    color: rgba(255,255,255,.75);
    font-size:12px;
    padding:8px 12px;
    border-radius:12px;
    cursor:pointer;
  }
  .link:hover{border-color: rgba(0,255,255,.30);}

  .formula{
    margin: 10px auto 0;
    max-width:520px;
    border: 1px solid rgba(0,255,255,.18);
    border-radius: 16px;
    padding: 14px 14px;
    background: rgba(0,255,255,.04);
  }
  .formulaTitle{font-weight:650;margin-bottom:6px;}
  .formulaLine{color: rgba(255,255,255,.75);font-size:14px;line-height:1.6;}

  .codeBox{
    margin: 14px auto 0;
    max-width:420px;
    border-radius: 16px;
    border: 1px solid rgba(0,255,255,.18);
    background: rgba(0,255,255,.04);
    padding: 14px 14px;
  }
  .codeLabel{font-size:12px;color: rgba(255,255,255,.55);margin-bottom: 6px;}
  .codeValue{
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New", monospace;
    font-size: 22px;
    letter-spacing: 2px;
    color: #00ffff;
  }

  .error{
    margin-top: 14px;
    background: rgba(255,80,80,.10);
    border: 1px solid rgba(255,80,80,.35);
    color: rgba(255,120,120,.95);
    border-radius: 14px;
    padding: 10px 12px;
    max-width: 520px;
    font-size: 13px;
    line-height:1.45;
  }

  @media (prefers-reduced-motion: reduce){
    .core{animation:none;}
    .text,.fieldWrap,.next-btn{transition:none;transform:none;}
  }
`;
