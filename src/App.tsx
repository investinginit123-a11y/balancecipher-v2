import React, { useEffect, useMemo, useRef, useState } from "react";

type Step = 1 | 2 | 3 | 4;

type Step2Phase =
  | "intro"
  | "first"
  | "inhale"
  | "last"
  | "flash"
  | "email"
  | "shrink"
  | "ripple"
  | "done";

type Step4Phase = "black" | "gate" | "welcome";

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
  const [step, setStep] = useState<Step>(1);

  // Captured identity + access
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");

  const displayName = useMemo(() => safeTrimMax(firstName, 40) || "you", [firstName]);

  // -----------------------
  // PAGE 2 (Capture)
  // -----------------------
  const [s2Phase, setS2Phase] = useState<Step2Phase>("intro");
  const [s2Line1, setS2Line1] = useState(false);
  const [s2Line2, setS2Line2] = useState(false);
  const [s2Line3, setS2Line3] = useState(false);
  const [s2ShowInput, setS2ShowInput] = useState(false);

  const [s2Prompt, setS2Prompt] = useState<string>("");
  const [s2Placeholder, setS2Placeholder] = useState<string>("your first name");
  const [s2Value, setS2Value] = useState<string>("");

  const [s2Error, setS2Error] = useState<string>("");

  // Arc “listening” pulse
  const [s2PulseBump, setS2PulseBump] = useState(false);
  const s2LastWordCount = useRef<number>(0);
  const s2InputRef = useRef<HTMLInputElement | null>(null);

  // -----------------------
  // PAGE 3 (Waiting)
  // -----------------------
  const [s3Show, setS3Show] = useState(false);

  // -----------------------
  // PAGE 4 (Final Gate)
  // -----------------------
  const [s4Phase, setS4Phase] = useState<Step4Phase>("black");
  const [s4Line1, setS4Line1] = useState(false);
  const [s4Line2, setS4Line2] = useState(false);
  const [s4ShowDock, setS4ShowDock] = useState(false);
  const [s4Code, setS4Code] = useState("");
  const [s4SubError, setS4SubError] = useState<string>(""); // kept quiet/minimal
  const [s4ArcFlare, setS4ArcFlare] = useState(false);
  const [s4Blackout, setS4Blackout] = useState(true); // overlay for dissolves
  const s4InputRef = useRef<HTMLInputElement | null>(null);

  // Tap-anywhere submit (when code exists)
  const [s4Submitted, setS4Submitted] = useState(false);

  const INFO_URL = "https://balancecipher.com/info";
  const INFO_TEXT = "balancecipher.com/info";

  function goTo(next: Step) {
    setStep(next);
  }

  // =======================
  // PAGE 1 -> PAGE 2
  // =======================
  function handleStartPrivateDecode() {
    setStep(2);
  }

  // =======================
  // PAGE 2 setup / timing
  // =======================
  useEffect(() => {
    if (step !== 2) return;

    setS2Error("");
    setS2Phase("intro");
    setS2Line1(false);
    setS2Line2(false);
    setS2Line3(false);
    setS2ShowInput(false);

    setS2Prompt("");
    setS2Placeholder("your first name");
    setS2Value("");
    s2LastWordCount.current = 0;

    const timers: number[] = [];

    // Black screen + arc already present. We stage the copy:
    timers.push(window.setTimeout(() => setS2Line1(true), 650));
    timers.push(window.setTimeout(() => setS2Line2(true), 650 + 1800));
    timers.push(window.setTimeout(() => setS2Line3(true), 650 + 1800 + 1500));

    // 2s silence, then input
    const inputAt = 650 + 1800 + 1500 + 2000;
    timers.push(
      window.setTimeout(() => {
        setS2Phase("first");
        setS2ShowInput(true);
        setTimeout(() => s2InputRef.current?.focus(), 160);
      }, inputAt)
    );

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [step]);

  // Page 2: arc pulses once per word (on word-count increment)
  useEffect(() => {
    if (step !== 2) return;
    if (!s2ShowInput) return;
    if (!(s2Phase === "first" || s2Phase === "last" || s2Phase === "email")) return;

    const count = (s2Value.match(/\b\w+\b/g) || []).length;
    const last = s2LastWordCount.current;

    if (count > last) {
      s2LastWordCount.current = count;
      setS2PulseBump(true);
      window.setTimeout(() => setS2PulseBump(false), 220);
    }
  }, [s2Value, s2ShowInput, step, s2Phase]);

  function dissolveAndResetStep2(nextPrompt: string, nextPlaceholder: string, nextPhase: Step2Phase) {
    setS2Phase("inhale");
    setS2Error("");

    setS2Line1(false);
    setS2Line2(false);
    setS2Line3(false);
    setS2ShowInput(false);

    window.setTimeout(() => {
      setS2Prompt(nextPrompt);
      setS2Placeholder(nextPlaceholder);
      setS2Value("");
      s2LastWordCount.current = 0;

      setS2Phase(nextPhase);
      setS2ShowInput(true);
      setTimeout(() => s2InputRef.current?.focus(), 150);
    }, 520);
  }

  function submitStep2() {
    if (s2Phase === "first") {
      const fn = safeTrimMax(s2Value, 40);
      if (!fn) return; // no hints
      setFirstName(fn);
      dissolveAndResetStep2("Last name. The formula needs the full signature.", "last name", "last");
      return;
    }

    if (s2Phase === "last") {
      const ln = safeTrimMax(s2Value, 60);
      if (!ln) return;
      setLastName(ln);

      // Arc flare 150ms, then email line
      setS2Phase("flash");
      window.setTimeout(() => {
        setS2Prompt("Email — your key arrives here, once.");
        setS2Placeholder("where your code lands");
        setS2Value("");
        s2LastWordCount.current = 0;

        setS2Phase("email");
        setS2ShowInput(true);
        setTimeout(() => s2InputRef.current?.focus(), 140);
      }, 170);
      return;
    }

    if (s2Phase === "email") {
      const em = safeTrimMax(s2Value, 120);
      if (!isValidEmail(em)) return; // no hints
      setEmail(em);

      if (!accessCode) setAccessCode(generateAccessCode());

      // Confirmation: shrink -> ripple -> done
      setS2Phase("shrink");
      setS2ShowInput(false);

      window.setTimeout(() => {
        setS2Phase("ripple");
        window.setTimeout(() => {
          setS2Phase("done");

          // Auto-advance to Page 3 for preview after a moment
          window.setTimeout(() => setStep(3), 1200);
        }, 620);
      }, 700);
    }
  }

  function onKeyDownStep2(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submitStep2();
    }
  }

  // =======================
  // PAGE 3 setup
  // =======================
  useEffect(() => {
    if (step !== 3) return;

    setS3Show(false);

    const t = window.setTimeout(() => setS3Show(true), 650);

    // For preview: auto-advance to Page 4 after 2.2s
    const t2 = window.setTimeout(() => setStep(4), 2200);

    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, [step]);

  // =======================
  // PAGE 4 setup / timing
  // =======================
  useEffect(() => {
    if (step !== 4) return;

    // Reset Page 4
    setS4Phase("black");
    setS4Line1(false);
    setS4Line2(false);
    setS4ShowDock(false);
    setS4Code("");
    setS4SubError("");
    setS4ArcFlare(false);
    setS4Submitted(false);

    // Start with full blackout
    setS4Blackout(true);

    const timers: number[] = [];

    // 0.8 seconds pure black, then reveal gate
    timers.push(
      window.setTimeout(() => {
        setS4Phase("gate");

        // Fade blackout away once gate begins
        setS4Blackout(false);

        // Arc pulse (CSS) + lines
        timers.push(window.setTimeout(() => setS4Line1(true), 220));
        timers.push(window.setTimeout(() => setS4Line2(true), 220 + 1200));

        // Input dock slides up
        timers.push(
          window.setTimeout(() => {
            setS4ShowDock(true);
            setTimeout(() => s4InputRef.current?.focus(), 130);
          }, 220 + 1200 + 520)
        );
      }, 800)
    );

    return () => timers.forEach((x) => window.clearTimeout(x));
  }, [step]);

  function validateAndSubmitStep4() {
    if (s4Submitted) return;

    const entered = safeTrimMax(s4Code, 40).toUpperCase();
    if (!entered) return;

    const expected = safeTrimMax(accessCode, 40).toUpperCase();

    // Quiet mismatch behavior: minimal underline "blink" (error line appears briefly)
    if (expected && entered !== expected) {
      setS4SubError("Code mismatch.");
      window.setTimeout(() => setS4SubError(""), 900);
      return;
    }

    setS4Submitted(true);

    // Arc flare white -> cyan -> white in 400ms
    setS4ArcFlare(true);
    window.setTimeout(() => setS4ArcFlare(false), 410);

    // Screen dissolves to black for 0.6s
    setS4Blackout(true);

    window.setTimeout(() => {
      // Welcome state
      setS4Phase("welcome");
      // Fade blackout away into expanded room
      window.setTimeout(() => setS4Blackout(false), 120);
    }, 600);
  }

  function onKeyDownStep4(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      validateAndSubmitStep4();
    }
  }

  function onTapAnywhereStep4() {
    // Tap anywhere should submit if code exists (your spec)
    if (step !== 4) return;
    if (s4Phase !== "gate") return;
    if (s4Submitted) return;

    const v = safeTrimMax(s4Code, 40);
    if (!v) return;

    validateAndSubmitStep4();
  }

  // =======================
  // RENDER
  // =======================
  return (
    <div className="app" onPointerDown={onTapAnywhereStep4}>
      <style>{styles}</style>

      {/* PAGE 1 */}
      {step === 1 && (
        <div className="screen">
          <div className="arc arcCyan corePulse" aria-hidden="true" />
          <div className="centerBlock">
            <div className="h1">You're not broken. You were never given a map.</div>
            <div className="p">
              BALANCE Cipher turns confusion into the next clear step—starting with your credit life.
            </div>

            <button className="cta" type="button" onClick={handleStartPrivateDecode}>
              Start the Private Decode
            </button>

            <div className="micro">Takes under a minute to begin.</div>
          </div>
        </div>
      )}

      {/* PAGE 2 */}
      {step === 2 && (
        <div className={`screen step2 ${s2Phase}`}>
          <div
            className={[
              "arc",
              "arcCyan",
              "corePulse",
              s2PulseBump ? "bump" : "",
              s2Phase === "inhale" ? "dim" : "",
              s2Phase === "flash" ? "flashOn150" : "",
              s2Phase === "shrink" ? "shrinkToDot" : "",
              s2Phase === "ripple" ? "rippleBurst" : "",
            ].join(" ")}
            aria-hidden="true"
          />

          {/* Intro lines */}
          {s2Prompt === "" && s2Phase !== "inhale" && s2Phase !== "last" && s2Phase !== "email" && s2Phase !== "done" && (
            <div className="lines">
              <div className={`line l1 ${s2Line1 ? "show" : ""}`}>
                A cipher is the first machine that only spoke when spoken to
              </div>
              <div className={`line l2 ${s2Line2 ? "show" : ""}`}>
                AI does the same — except it remembers every word forever
              </div>
              <div className={`line l3 ${s2Line3 ? "show" : ""}`}>
                You're the only voice it waits for
              </div>
            </div>
          )}

          {/* Reset prompt */}
          {s2Prompt !== "" && (s2Phase === "last" || s2Phase === "email" || s2Phase === "inhale") && (
            <div className="promptWrap">
              <div className={`prompt ${(s2Phase === "last" || s2Phase === "email") ? "show" : ""}`}>{s2Prompt}</div>
            </div>
          )}

          {(s2Phase === "first" || s2Phase === "last" || s2Phase === "email") && (
            <div className={`inputDock ${s2ShowInput ? "show" : ""}`}>
              <input
                ref={s2InputRef}
                className="underlineInput"
                value={s2Value}
                onChange={(e) => setS2Value(e.target.value)}
                placeholder={s2Placeholder}
                onKeyDown={onKeyDownStep2}
                autoComplete={s2Phase === "first" ? "given-name" : s2Phase === "last" ? "family-name" : "email"}
                inputMode={s2Phase === "email" ? "email" : "text"}
                type={s2Phase === "email" ? "email" : "text"}
                aria-label={s2Phase === "first" ? "First name" : s2Phase === "last" ? "Last name" : "Email"}
              />
            </div>
          )}

          {s2Phase === "done" && (
            <div className="doneBlock">
              <div className="doneMain">Code's on the way</div>
              <div className="doneSub">60 seconds</div>
              <div className="doneLink">{INFO_TEXT}</div>
              <div className="doneSub" style={{ marginTop: 6 }}>
                Paste it. You're in.
              </div>
            </div>
          )}

          {/* Hidden (for your debugging while building) */}
          <div className="hiddenMeta" aria-hidden="true">
            first:{firstName} last:{lastName} email:{email} code:{accessCode}
          </div>

          {s2Error && <div className="quietError">{s2Error}</div>}
        </div>
      )}

      {/* PAGE 3 (quiet holding screen) */}
      {step === 3 && (
        <div className="screen step3">
          <div className="arc arcCyan corePulse" aria-hidden="true" />
          <div className={`hold ${s3Show ? "show" : ""}`}>
            <div className="holdMain">Code's on the way</div>
            <div className="holdSub">60 seconds</div>
            <div className="holdLink">{INFO_TEXT}</div>
            <div className="holdSub" style={{ marginTop: 10 }}>
              Paste it. You're in.
            </div>
          </div>

          {/* Hidden debug */}
          <div className="hiddenMeta" aria-hidden="true">
            expected:{accessCode}
          </div>
        </div>
      )}

      {/* PAGE 4 (Final Gate) */}
      {step === 4 && (
        <div className={`screen step4 ${s4Phase}`}>
          {/* Blackout overlay for dissolves */}
          <div className={`blackout ${s4Blackout ? "on" : "off"}`} />

          {s4Phase === "gate" && (
            <>
              <div
                className={[
                  "arc",
                  "arcFinalGate",
                  "unlockPulseOnce",
                  s4ArcFlare ? "flare400" : "",
                ].join(" ")}
                aria-hidden="true"
              />

              <div className="lines">
                <div className={`line g1 ${s4Line1 ? "show" : ""}`}>You brought the key</div>
                <div className={`line g2 ${s4Line2 ? "show" : ""}`}>Paste it below. One time only.</div>
              </div>

              <div className={`dock4 ${s4ShowDock ? "show" : ""}`}>
                <input
                  ref={s4InputRef}
                  className="underlineInput gateInput"
                  value={s4Code}
                  onChange={(e) => setS4Code(e.target.value)}
                  placeholder="your private cipher code"
                  onKeyDown={onKeyDownStep4}
                  inputMode="text"
                  type="text"
                  autoComplete="one-time-code"
                  aria-label="Private cipher code"
                />
                <div className="whisper">
                  First 500 get Chapter One instantly. Everyone else waits 72 hours.
                </div>

                {/* Quiet error line (brief) */}
                {s4SubError && <div className="whisper errorWhisper">{s4SubError}</div>}
              </div>
            </>
          )}

          {s4Phase === "welcome" && (
            <div className="welcomeWrap">
              <div className="welcomeLine">
                {firstName.trim() ? `Welcome home, ${safeTrimMax(firstName, 40)}.` : "Welcome home."}
              </div>

              <div className="arc arcWarm rippleOut" aria-hidden="true">
                <div className="ripple" aria-hidden="true" />
              </div>

              <a className="openBtn" href={INFO_URL}>
                Open the Balance Formula
              </a>
              <div className="openSub">{INFO_TEXT}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = `
  * { margin:0; padding:0; box-sizing:border-box; }
  .app { min-height:100vh; background:#000; color:#fff; font-family: "Helvetica Neue", Arial, sans-serif; }

  .screen{
    min-height:100vh;
    width:100%;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    text-align:center;
    overflow:hidden;
    padding:24px;
    position:relative;
    background:#000;
  }

  /* Subtle room expansion for welcome */
  .screen.step4.welcome{
    animation: roomExpand 3.8s ease forwards;
  }
  @keyframes roomExpand{
    0%   { background:#000; }
    100% { background: radial-gradient(circle at 50% 40%, rgba(0,255,255,.05), transparent 55%),
                    radial-gradient(circle at 50% 60%, rgba(0,255,255,.03), transparent 58%),
                    #000; background-color: #06101a; }
  }

  /* Shared arc base */
  .arc{
    width:60px;
    height:60px;
    border-radius:999px;
    position:relative;
    margin-bottom:34px;
    transform: translateZ(0);
    will-change: transform, opacity, box-shadow;
  }

  /* Cyan arc (Pages 1-3) */
  .arcCyan{
    border: 1px solid rgba(0,255,255,0.35);
    background: radial-gradient(circle, rgba(0,255,255,0.14) 0%, transparent 70%);
    box-shadow: 0 0 12px rgba(0,255,255,0.18);
  }

  /* Quiet heartbeat */
  .corePulse { animation: corePulse 2.8s ease-in-out infinite; }
  @keyframes corePulse {
    0%,100% { box-shadow: 0 0 12px rgba(0,255,255,0.18); }
    50%     { box-shadow: 0 0 28px rgba(0,255,255,0.36); }
  }

  /* Listening bump */
  .bump { animation: bumpPulse 220ms ease-out 1; }
  @keyframes bumpPulse{
    0% { transform: scale(1); box-shadow: 0 0 16px rgba(0,255,255,0.22); }
    55% { transform: scale(1.06); box-shadow: 0 0 34px rgba(0,255,255,0.42); }
    100% { transform: scale(1); box-shadow: 0 0 16px rgba(0,255,255,0.22); }
  }

  .dim { opacity: 0.45; transform: scale(0.96); transition: opacity 380ms ease, transform 380ms ease; }

  .flashOn150 { animation: flashOn150 150ms ease-out 1; }
  @keyframes flashOn150{
    0% { box-shadow: 0 0 18px rgba(0,255,255,0.25); }
    50% { box-shadow: 0 0 55px rgba(0,255,255,0.85); }
    100% { box-shadow: 0 0 18px rgba(0,255,255,0.28); }
  }

  .shrinkToDot { animation: shrinkToDot 700ms ease-in forwards; }
  @keyframes shrinkToDot{
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(0.08); opacity: 0.9; box-shadow: 0 0 6px rgba(0,255,255,0.55); }
  }

  .rippleBurst::after{
    content:"";
    position:absolute;
    left:50%;
    top:50%;
    width:60px;
    height:60px;
    transform: translate(-50%, -50%);
    border-radius:999px;
    border: 2px solid rgba(0,255,255,0.55);
    opacity:0;
    animation: ripple 620ms ease-out 1;
  }
  @keyframes ripple{
    0% { opacity:0.75; transform: translate(-50%, -50%) scale(1); }
    100% { opacity:0; transform: translate(-50%, -50%) scale(18); }
  }

  /* Copy blocks */
  .lines{
    max-width:560px;
    display:flex;
    flex-direction:column;
    gap:12px;
    margin-bottom: 8px;
  }

  .line{
    opacity:0;
    transform: translateY(10px);
    transition: opacity 900ms ease, transform 750ms ease;
    color: rgba(255,255,255,0.92);
    text-shadow: 0 0 18px rgba(0,255,255,0.08);
    font-weight: 300;
  }
  .line.show{ opacity:1; transform: translateY(0); }

  .l1{ font-size:22px; line-height:1.55; }
  .l2{ font-size:20px; line-height:1.55; color: rgba(255,255,255,0.86); }
  .l3{ font-size:19px; line-height:1.55; color: rgba(255,255,255,0.82); margin-top:-2px; }

  .promptWrap{ max-width:560px; margin-bottom: 16px; }
  .prompt{
    opacity:0;
    transform: translateY(10px);
    transition: opacity 900ms ease, transform 750ms ease;
    font-size: 22px;
    font-weight: 300;
    line-height: 1.45;
    color: rgba(255,255,255,0.92);
    text-shadow: 0 0 16px rgba(0,255,255,0.08);
  }
  .prompt.show{ opacity:1; transform: translateY(0); }

  /* Input dock */
  .inputDock{
    position:absolute;
    left:0; right:0;
    bottom: 64px;
    display:flex;
    flex-direction:column;
    align-items:center;
    opacity:0;
    transform: translateY(32px);
    transition: opacity 750ms ease, transform 750ms ease;
    pointer-events:none;
  }
  .inputDock.show{
    opacity:1;
    transform: translateY(0);
    pointer-events:auto;
  }

  .underlineInput{
    width: min(420px, 86vw);
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(0,255,255,0.30);
    padding: 14px 10px 12px;
    color: rgba(255,255,255,0.92);
    font-size: 18px;
    text-align: center;
    outline: none;
    caret-color: rgba(0,255,255,0.95);
    transition: border-color 250ms ease, box-shadow 250ms ease;
  }
  .underlineInput::placeholder{ color: rgba(255,255,255,0.33); }
  .underlineInput:focus{
    border-bottom-color: rgba(0,255,255,0.65);
    box-shadow: 0 12px 28px rgba(0,255,255,0.10);
  }

  /* Done / Hold */
  .doneBlock{
    margin-top: 8px;
    max-width: 560px;
    display:flex;
    flex-direction:column;
    gap:10px;
    align-items:center;
  }
  .doneMain{ font-size:22px; font-weight:300; color: rgba(255,255,255,0.94); }
  .doneSub{ font-size:14px; color: rgba(255,255,255,0.70); }
  .doneLink{ font-size:12px; color: rgba(0,255,255,0.55); margin-top: 6px; }

  .hold{
    opacity:0;
    transform: translateY(8px);
    transition: opacity 900ms ease, transform 900ms ease;
    max-width: 560px;
    display:flex;
    flex-direction:column;
    gap:10px;
    align-items:center;
  }
  .hold.show{ opacity:1; transform: translateY(0); }
  .holdMain{ font-size:22px; font-weight:300; color: rgba(255,255,255,0.94); }
  .holdSub{ font-size:14px; color: rgba(255,255,255,0.70); }
  .holdLink{ font-size:12px; color: rgba(0,255,255,0.55); }

  /* Page 1 */
  .centerBlock{ max-width: 560px; }
  .h1{ font-size:26px; font-weight:650; line-height:1.25; margin-bottom:12px; letter-spacing:0.2px; }
  .p{ font-size:16px; font-weight:300; line-height:1.65; color: rgba(255,255,255,0.78); margin: 0 auto 14px; }
  .cta{
    margin-top: 8px;
    background: transparent;
    border: 1.5px solid rgba(0,255,255,1);
    color: rgba(0,255,255,1);
    font-size: 15px;
    font-weight: 600;
    padding: 12px 26px;
    border-radius: 999px;
    cursor: pointer;
    transition: background 250ms ease, box-shadow 250ms ease;
  }
  .cta:hover{ background: rgba(0,255,255,0.10); box-shadow: 0 0 20px rgba(0,255,255,0.16); }
  .micro{ margin-top:10px; font-size:12px; color: rgba(255,255,255,0.55); }

  .quietError{
    position:absolute;
    bottom: 132px;
    font-size: 12px;
    color: rgba(255,120,120,0.92);
    background: rgba(255,80,80,0.08);
    border: 1px solid rgba(255,80,80,0.25);
    padding: 8px 10px;
    border-radius: 12px;
    max-width: min(420px, 86vw);
  }

  .hiddenMeta{ display:none; }

  /* -----------------------
     PAGE 4 (Final Gate)
     ----------------------- */

  .blackout{
    position:absolute;
    inset:0;
    background:#000;
    opacity: 0;
    transition: opacity 600ms ease;
    pointer-events:none;
    z-index: 50;
  }
  .blackout.on{ opacity: 1; }
  .blackout.off{ opacity: 0; }

  /* Gate arc: white core + razor-thin cyan ring */
  .arcFinalGate{
    width:55px;
    height:55px;
    margin-bottom: 28px;
    opacity:1;
  }
  .arcFinalGate::before{
    content:"";
    position:absolute;
    inset:10px;
    border-radius:999px;
    background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,.86) 55%, rgba(255,255,255,0) 75%);
    filter: blur(.2px);
  }
  .arcFinalGate::after{
    content:"";
    position:absolute;
    inset:0;
    border-radius:999px;
    border: 1px solid rgba(0,255,255,.55);
    box-shadow: 0 0 18px rgba(0,255,255,.18);
  }

  /* One deliberate unlock pulse */
  .unlockPulseOnce{ animation: unlockPulse 1.35s ease-in-out 1; }
  @keyframes unlockPulse{
    0%   { box-shadow: 0 0 10px rgba(255,255,255,.10); }
    45%  { box-shadow: 0 0 34px rgba(0,255,255,.22); }
    100% { box-shadow: 0 0 14px rgba(0,255,255,.14); }
  }

  /* Flare on submit: white -> cyan -> white in 400ms */
  .flare400{ animation: flare400 400ms ease-out 1; }
  @keyframes flare400{
    0%   { filter:none; }
    33%  { box-shadow: 0 0 55px rgba(255,255,255,.55); }
    66%  { box-shadow: 0 0 75px rgba(0,255,255,.60); }
    100% { box-shadow: 0 0 24px rgba(255,255,255,.25); }
  }

  .g1{ font-size:24px; color: rgba(255,255,255,0.96); text-shadow: 0 0 16px rgba(0,255,255,0.06); }
  .g2{ font-size:19px; color: rgba(255,255,255,0.78); margin-top: 6px; }

  .dock4{
    position:absolute;
    left:0; right:0;
    bottom: 74px;
    display:flex;
    flex-direction:column;
    align-items:center;
    gap: 10px;
    opacity:0;
    transform: translateY(32px);
    transition: opacity 800ms ease, transform 800ms ease;
    pointer-events:none;
    z-index: 20;
  }
  .dock4.show{
    opacity:1;
    transform: translateY(0);
    pointer-events:auto;
  }

  .gateInput{
    width: min(280px, 90vw);
    border-bottom-color: rgba(0,255,255,.25);
  }
  .gateInput:focus{
    border-bottom-color: rgba(0,255,255,.65);
    box-shadow: 0 12px 28px rgba(0,255,255,.10);
  }

  .whisper{
    font-size:14px;
    font-weight:300;
    color: rgba(255,255,255,.55);
    opacity: .95;
  }
  .errorWhisper{
    color: rgba(255,120,120,.92);
    opacity: .9;
  }

  /* Welcome */
  .welcomeWrap{
    width: min(760px, 92vw);
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    gap: 14px;
    z-index: 15;
  }

  .welcomeLine{
    font-size:26px;
    font-weight:300;
    letter-spacing:.1px;
    color: rgba(255,248,235,.96);
    text-shadow: 0 0 16px rgba(0,255,255,.08);
    margin-bottom: 2px;
  }

  .arcWarm{
    width:55px;
    height:55px;
    border-radius:999px;
    position:relative;
    margin: 6px 0 2px;
  }
  .arcWarm::before{
    content:"";
    position:absolute;
    inset:10px;
    border-radius:999px;
    background: radial-gradient(circle, rgba(255,248,235,1) 0%, rgba(255,248,235,.85) 55%, rgba(255,248,235,0) 75%);
  }
  .arcWarm::after{
    content:"";
    position:absolute;
    inset:0;
    border-radius:999px;
    border: 1px solid rgba(0,255,255,.40);
    box-shadow: 0 0 16px rgba(0,255,255,.14);
  }

  .rippleOut .ripple{
    position:absolute;
    inset:0;
    border-radius:999px;
    border: 1.5px solid rgba(0,255,255,.30);
    opacity:0;
    animation: rippleOut 3.2s ease-out infinite;
  }
  @keyframes rippleOut{
    0%   { opacity:.55; transform: scale(1); }
    100% { opacity:0; transform: scale(5.2); }
  }

  .openBtn{
    margin-top: 6px;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    padding: 12px 18px;
    border-radius: 999px;
    border: 1.5px solid rgba(0,255,255,.55);
    background: transparent;
    color: rgba(0,255,255,.95);
    text-decoration:none;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 0 18px rgba(0,255,255,.10);
    transition: background 240ms ease, box-shadow 240ms ease, transform 120ms ease;
  }
  .openBtn:hover{
    background: rgba(0,255,255,.10);
    box-shadow: 0 0 24px rgba(0,255,255,.16);
  }
  .openBtn:active{ transform: translateY(1px); }

  .openSub{
    font-size:12px;
    color: rgba(0,255,255,.50);
    margin-top: -6px;
  }

  @media (prefers-reduced-motion: reduce){
    .corePulse { animation:none !important; }
    .bump, .flashOn150, .shrinkToDot, .unlockPulseOnce, .flare400 { animation:none !important; }
    .rippleBurst::after, .rippleOut .ripple { animation:none !important; }
    .line, .prompt, .inputDock, .dock4, .hold, .blackout { transition:none !important; transform:none !important; }
  }
`;
