import React, { useEffect, useMemo, useRef, useState } from "react";

type Step = 1 | 2 | 3 | 4;

type FunnelState = {
  step: Step;
  firstName: string;
  lastName: string;
  email: string;
  accessCode: string; // client-side placeholder code
};

const STORAGE_KEY = "balancecipher_funnel_v2_state";

function safeTrimMax(value: string, maxLen: number) {
  return value.trim().slice(0, maxLen);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function generateAccessCode(): string {
  // Client-side placeholder code generator.
  // Replace later with server-generated + emailed code.
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function loadState(): FunnelState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<FunnelState>;
    if (!parsed.step) return null;

    return {
      step: (parsed.step as Step) ?? 1,
      firstName: typeof parsed.firstName === "string" ? parsed.firstName : "",
      lastName: typeof parsed.lastName === "string" ? parsed.lastName : "",
      email: typeof parsed.email === "string" ? parsed.email : "",
      accessCode: typeof parsed.accessCode === "string" ? parsed.accessCode : "",
    };
  } catch {
    return null;
  }
}

function saveState(state: FunnelState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export default function App() {
  const restored = useMemo(() => loadState(), []);
  const [step, setStep] = useState<Step>(restored?.step ?? 1);

  const [firstName, setFirstName] = useState(restored?.firstName ?? "");
  const [lastName, setLastName] = useState(restored?.lastName ?? "");
  const [email, setEmail] = useState(restored?.email ?? "");
  const [accessCode, setAccessCode] = useState(restored?.accessCode ?? "");
  const [codeInput, setCodeInput] = useState("");

  const [error, setError] = useState<string>("");

  // Page 2 timed reveal flags
  const [p2Line1, setP2Line1] = useState(false);
  const [p2Line2, setP2Line2] = useState(false);
  const [p2Line3, setP2Line3] = useState(false);
  const [p2Fields, setP2Fields] = useState(false);
  const [p2Button, setP2Button] = useState(false);

  const firstNameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const codeRef = useRef<HTMLInputElement | null>(null);

  const displayName = useMemo(() => {
    const fn = safeTrimMax(firstName, 40);
    return fn.length ? fn : "you";
  }, [firstName]);

  // Persist core funnel state
  useEffect(() => {
    saveState({
      step,
      firstName,
      lastName,
      email,
      accessCode,
    });
  }, [step, firstName, lastName, email, accessCode]);

  // Clear errors on step change
  useEffect(() => {
    setError("");
  }, [step]);

  // Page 2 timers (run only when step == 2)
  useEffect(() => {
    if (step !== 2) return;

    // Reset reveal flags each time we enter Page 2
    setP2Line1(false);
    setP2Line2(false);
    setP2Line3(false);
    setP2Fields(false);
    setP2Button(false);

    const timers: number[] = [];
    timers.push(window.setTimeout(() => setP2Line1(true), 700));
    timers.push(window.setTimeout(() => setP2Line2(true), 2200));
    timers.push(window.setTimeout(() => setP2Line3(true), 3900));
    timers.push(window.setTimeout(() => setP2Fields(true), 5600));
    timers.push(
      window.setTimeout(() => {
        setP2Button(true);
        // focus first name once visible
        setTimeout(() => firstNameRef.current?.focus(), 120);
      }, 5800)
    );

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [step]);

  function goTo(next: Step) {
    setStep(next);
  }

  function handleStartPrivateDecode() {
    goTo(2);
  }

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
    // focus email quickly
    setTimeout(() => emailRef.current?.focus(), 150);
  }

  function handleGetAccessCode() {
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

    // Note: later, this is where you'd trigger sending the code via email.
    // For now, code is shown on-screen and stored locally.
  }

  function handleValidateCodeAndEnter() {
    const entered = safeTrimMax(codeInput, 30).toUpperCase();
    const expected = safeTrimMax(accessCode, 30).toUpperCase();

    if (!expected) {
      setError("No access code is available yet. Please go back and request one.");
      return;
    }

    if (entered !== expected) {
      setError("That code does not match. Please check it and try again.");
      codeRef.current?.focus();
      return;
    }

    // Final action: invitation to the app.
    // If you later want to redirect, set VITE_APP_ENTRY_URL and it will take effect.
    const envAny = import.meta as unknown as { env?: Record<string, string> };
    const entryUrl = envAny.env?.VITE_APP_ENTRY_URL || "";

    if (entryUrl) {
      window.location.href = entryUrl;
      return;
    }

    setError(
      "Access confirmed. Next step: wire the app entry URL (VITE_APP_ENTRY_URL) to route into the BALANCE Engine."
    );
  }

  function handleResetFunnel() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setStep(1);
    setFirstName("");
    setLastName("");
    setEmail("");
    setAccessCode("");
    setCodeInput("");
    setError("");
  }

  return (
    <div className="wrap">
      <style>{css}</style>

      <div className="shell">
        <div className="topbar">
          <div className="brand">
            <div className="core" aria-hidden="true" />
            <div className="brandText">
              <div className="brandName">BALANCE Cipher</div>
              <div className="brandSub">Private Decode Funnel</div>
            </div>
          </div>

          <div className="topActions">
            <button className="linkBtn" type="button" onClick={handleResetFunnel}>
              Reset
            </button>
          </div>
        </div>

        <div className="card">
          {step === 1 && (
            <div className="page">
              <h1 className="h1">You’re not broken. You were never given a map.</h1>
              <p className="p">
                BALANCE Cipher turns confusion into the next clear step—starting with your credit life, where most people
                feel stuck.
              </p>

              <div className="ctaRow">
                <button className="ctaBtn" type="button" onClick={handleStartPrivateDecode}>
                  Start the Private Decode
                </button>
                <div className="micro">Takes under a minute to begin.</div>
              </div>

              <div className="footerNote">
                No hype. No shame. Just clarity, one decision at a time.
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="page">
              <h1 className="h1">Let’s make it personal.</h1>

              <div className="stack">
                <div className={`line ${p2Line1 ? "show" : ""}`}>
                  A cipher was the first AI — made of ink, not silicon.
                </div>
                <div className={`line ${p2Line2 ? "show" : ""}`}>
                  AI doesn’t lead. It listens. Then hands you the key.
                </div>
                <div className={`line ${p2Line3 ? "show" : ""}`}>
                  You’re the only code that matters.
                </div>
              </div>

              <div className={`fields ${p2Fields ? "show" : ""}`}>
                <input
                  ref={firstNameRef}
                  className="input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  autoComplete="given-name"
                  inputMode="text"
                />
                <input
                  className="input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name (optional)"
                  autoComplete="family-name"
                  inputMode="text"
                />
              </div>

              <div className={`ctaRow ${p2Button ? "show" : ""}`}>
                <button className="ctaBtn" type="button" onClick={handleContinueFromPage2}>
                  Continue
                </button>
                <div className="micro">Your info stays private. This is step-by-step, not spam.</div>
              </div>

              {error && <div className="error">{error}</div>}

              <div className="navRow">
                <button className="linkBtn" type="button" onClick={() => goTo(1)}>
                  Back
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="page">
              <h1 className="h1">Alright, {displayName}. Here’s what we’re decoding.</h1>

              <p className="p">
                BALANCE Cipher is a simple map for real change—applied to your credit life. The Cipher reveals the
                pattern. The AI Co-Pilot translates it into the next step. You stay in control.
              </p>

              <div className="formula">
                <div className="formulaTitle">The BALANCE Formula</div>
                <div className="formulaLine">
                  Break Away → Awaken → Learn → Act → Now-or-Never → Clarity → Evaluate
                </div>
              </div>

              <div className="divider" />

              <h2 className="h2">Get your private decode key</h2>
              <p className="p">
                If you want your access code (and to save your progress), enter your email. We send one code. You choose
                what happens next.
              </p>

              <div className="fields show">
                <input
                  ref={emailRef}
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  autoComplete="email"
                  inputMode="email"
                />
              </div>

              <div className="ctaRow show">
                <button className="ctaBtn" type="button" onClick={handleGetAccessCode}>
                  Get My Access Code
                </button>
                <div className="micro">Are you ready to start decoding?</div>
              </div>

              {error && <div className="error">{error}</div>}

              <div className="navRow">
                <button className="linkBtn" type="button" onClick={() => goTo(2)}>
                  Back
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="page">
              <h1 className="h1">Your Private Decode Key is Ready.</h1>
              <p className="p">
                This key unlocks the BALANCE Engine so the Co-Pilot can guide you step-by-step through the BALANCE
                Formula—starting with your credit life.
              </p>

              <div className="codeBox">
                <div className="codeLabel">Your code</div>
                <div className="codeValue">{accessCode || "—"}</div>
                <div className="micro">For now, this code is generated on-screen as a prototype.</div>
              </div>

              <div className="divider" />

              <h2 className="h2">Enter your code</h2>
              <div className="fields show">
                <input
                  ref={codeRef}
                  className="input"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="Enter your code"
                  inputMode="text"
                />
              </div>

              <div className="ctaRow show">
                <button className="ctaBtn" type="button" onClick={handleValidateCodeAndEnter}>
                  Enter the BALANCE Engine
                </button>
                <div className="micro">The Co-Pilot decodes. You decide.</div>
              </div>

              {error && <div className="error">{error}</div>}

              <div className="navRow">
                <button className="linkBtn" type="button" onClick={() => goTo(3)}>
                  Back
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="foot">
          <div className="footHint">
            If you want Page 4 to redirect into the app automatically, set{" "}
            <span className="mono">VITE_APP_ENTRY_URL</span> in Vercel environment variables.
          </div>
        </div>
      </div>
    </div>
  );
}

const css = `
:root{
  --bg:#04070b;
  --card:#050b12;
  --stroke:rgba(0,255,255,.25);
  --stroke2:rgba(0,255,255,.45);
  --teal:#00ffff;
  --text:rgba(255,255,255,.92);
  --muted:rgba(255,255,255,.72);
  --muted2:rgba(255,255,255,.58);
  --danger:rgba(255,80,80,.95);
}

*{ box-sizing:border-box; }

.wrap{
  min-height:100vh;
  background: radial-gradient(circle at 20% 10%, rgba(0,255,255,.10), transparent 45%),
              radial-gradient(circle at 80% 40%, rgba(0,255,255,.06), transparent 50%),
              var(--bg);
  color:var(--text);
  font-family: "Helvetica Neue", Arial, sans-serif;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:24px;
}

.shell{
  width:min(760px, 100%);
}

.topbar{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:16px;
  margin-bottom:14px;
}

.brand{
  display:flex;
  align-items:center;
  gap:12px;
}

.brandText{ line-height:1.15; }
.brandName{ font-weight:650; letter-spacing:.2px; }
.brandSub{ font-size:12px; color:var(--muted2); margin-top:3px; }

.core{
  width:46px;
  height:46px;
  border-radius:999px;
  border:1px solid var(--stroke2);
  background: radial-gradient(circle, rgba(0,255,255,.14) 0%, transparent 70%);
  animation: pulse 3.5s ease-in-out infinite;
}

@keyframes pulse{
  0%,100%{ box-shadow: 0 0 14px rgba(0,255,255,.18); }
  50%{ box-shadow: 0 0 30px rgba(0,255,255,.36); }
}

.card{
  background: linear-gradient(180deg, rgba(0,255,255,.05), transparent 55%),
              rgba(5,11,18,.78);
  border:1px solid var(--stroke);
  border-radius:22px;
  padding:26px 22px;
  box-shadow: 0 18px 40px rgba(0,0,0,.45);
}

.page{
  text-align:center;
  padding:6px 10px 10px;
}

.h1{
  font-size:28px;
  font-weight:650;
  letter-spacing:.2px;
  margin:0 0 10px;
}

.h2{
  font-size:18px;
  font-weight:650;
  margin:0 0 8px;
}

.p{
  font-size:16px;
  line-height:1.65;
  color:var(--muted);
  margin:0 auto 16px;
  max-width: 560px;
}

.stack{
  margin: 18px auto 10px;
  max-width: 560px;
  display:flex;
  flex-direction:column;
  gap:10px;
}

.line{
  font-size:16px;
  line-height:1.65;
  color:var(--muted);
  opacity:0;
  transform: translateY(8px);
  transition: opacity .8s ease, transform .7s ease;
}

.line.show{
  opacity:1;
  transform: translateY(0);
}

.fields{
  display:flex;
  flex-direction:column;
  gap:10px;
  margin: 14px auto 6px;
  max-width: 380px;
  opacity:0;
  transform: translateY(8px);
  transition: opacity .7s ease, transform .7s ease;
}

.fields.show{
  opacity:1;
  transform: translateY(0);
}

.input{
  width:100%;
  padding:14px 16px;
  border-radius:14px;
  border:1.2px solid var(--stroke2);
  background: transparent;
  color: var(--text);
  font-size:16px;
  text-align:center;
  outline:none;
}

.input:focus{
  border-color: rgba(0,255,255,.7);
  box-shadow: 0 0 18px rgba(0,255,255,.22);
}

.ctaRow{
  margin-top: 14px;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:8px;
  opacity:0;
  transform: translateY(8px);
  transition: opacity .7s ease, transform .7s ease;
}

.ctaRow.show{
  opacity:1;
  transform: translateY(0);
}

.ctaBtn{
  border-radius:999px;
  border:1.5px solid var(--teal);
  background: transparent;
  color: var(--teal);
  padding: 12px 26px;
  font-size:15px;
  font-weight:650;
  cursor:pointer;
  transition: background .25s ease, transform .08s ease, box-shadow .25s ease;
  min-width: 240px;
}

.ctaBtn:hover{
  background: rgba(0,255,255,.10);
  box-shadow: 0 0 18px rgba(0,255,255,.18);
}

.ctaBtn:active{
  transform: translateY(1px);
}

.micro{
  font-size:12px;
  color: var(--muted2);
}

.footerNote{
  margin-top: 18px;
  font-size:13px;
  color: var(--muted2);
}

.formula{
  margin: 10px auto 0;
  max-width: 600px;
  border: 1px solid rgba(0,255,255,.18);
  border-radius: 16px;
  padding: 14px 14px;
  background: rgba(0,255,255,.04);
}

.formulaTitle{
  font-weight:650;
  margin-bottom:6px;
}

.formulaLine{
  color: var(--muted);
  font-size:14px;
  line-height:1.6;
}

.divider{
  height:1px;
  background: rgba(0,255,255,.15);
  margin: 18px auto;
  max-width: 640px;
}

.error{
  margin-top: 14px;
  background: rgba(255,80,80,.10);
  border: 1px solid rgba(255,80,80,.35);
  color: var(--danger);
  border-radius: 14px;
  padding: 10px 12px;
  max-width: 520px;
  margin-left:auto;
  margin-right:auto;
  font-size: 13px;
  line-height:1.45;
}

.navRow{
  margin-top: 18px;
  display:flex;
  justify-content:center;
}

.linkBtn{
  background: transparent;
  border: 1px solid rgba(255,255,255,.16);
  color: rgba(255,255,255,.78);
  padding: 8px 12px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 12px;
}

.linkBtn:hover{
  border-color: rgba(0,255,255,.28);
}

.codeBox{
  margin: 14px auto 0;
  max-width: 420px;
  border-radius: 16px;
  border: 1px solid rgba(0,255,255,.18);
  background: rgba(0,255,255,.04);
  padding: 14px 14px;
}

.codeLabel{
  font-size:12px;
  color: var(--muted2);
  margin-bottom: 6px;
}

.codeValue{
  font-family: ui-mono SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 22px;
  letter-spacing: 2px;
  color: var(--teal);
}

.foot{
  margin-top: 12px;
  text-align:center;
}

.footHint{
  font-size:12px;
  color: var(--muted2);
}

.mono{
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  color: rgba(255,255,255,.82);
}

@media (max-width: 420px){
  .h1{ font-size:24px; }
  .ctaBtn{ width:100%; min-width: unset; }
}

@media (prefers-reduced-motion: reduce){
  .core{ animation:none; }
  .line, .fields, .ctaRow{ transition:none; transform:none; }
}
`;
