import React, { useEffect, useMemo, useRef, useState } from "react";

type Step = 1 | 2 | 3 | 4;

type CapturePhase =
  | "intro" // lines fade in
  | "first" // first name input
  | "inhale" // inhale transition between prompts
  | "last" // last name input
  | "flash" // quick bright flash before email
  | "email" // email input
  | "shrink" // arc shrinks to dot
  | "ripple" // ripple expands off-screen
  | "done"; // final message

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

  // Captured identity
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");

  // Screen2 UI state
  const [phase, setPhase] = useState<CapturePhase>("intro");
  const [line1, setLine1] = useState(false);
  const [line2, setLine2] = useState(false);
  const [line3, setLine3] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const [prompt, setPrompt] = useState<string>(""); // used after intro resets
  const [inputValue, setInputValue] = useState<string>("");
  const [placeholder, setPlaceholder] = useState<string>("your first name");

  const [error, setError] = useState<string>("");

  // Arc reactive pulse on word completion
  const [pulseBump, setPulseBump] = useState(false);
  const [pulseTick, setPulseTick] = useState(0);
  const lastWordCountRef = useRef<number>(0);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const displayDomain = "balancecipher.com/info";

  const displayName = useMemo(() => {
    const fn = safeTrimMax(firstName, 40);
    return fn.length ? fn : "you";
  }, [firstName]);

  function goTo(next: Step) {
    setStep(next);
  }

  // Page 1 CTA → Page 2
  function handleStartPrivateDecode() {
    setStep(2);
  }

  // Initialize Screen2 when we enter step 2
  useEffect(() => {
    if (step !== 2) return;

    // Reset everything for Screen2 experience
    setError("");
    setPhase("intro");
    setLine1(false);
    setLine2(false);
    setLine3(false);
    setShowInput(false);

    setPrompt("");
    setInputValue("");
    setPlaceholder("your first name");

    lastWordCountRef.current = 0;

    // Intro timing per your spec:
    // Line 1 (22px) appears, then after 1.8s line 2, then after 1.5s line 3,
    // then pause 2.2s, then input slides up.
    const timers: number[] = [];

    timers.push(window.setTimeout(() => setLine1(true), 650));
    timers.push(window.setTimeout(() => setLine2(true), 650 + 1800));
    timers.push(window.setTimeout(() => setLine3(true), 650 + 1800 + 1500));

    const inputAt = 650 + 1800 + 1500 + 2200;
    timers.push(
      window.setTimeout(() => {
        setPhase("first");
        setShowInput(true);
        setTimeout(() => inputRef.current?.focus(), 180);
      }, inputAt)
    );

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [step]);

  // Word-count pulse: pulse once per word (when word count increases)
  useEffect(() => {
    if (step !== 2) return;
    if (!showInput) return;

    const count = (inputValue.match(/\b\w+\b/g) || []).length;
    const last = lastWordCountRef.current;

    if (count > last) {
      lastWordCountRef.current = count;
      softPulse();
    }
  }, [inputValue, showInput, step]);

  function softPulse() {
    // A soft “listening” bump: toggle a short animation class.
    setPulseTick((n) => n + 1);
    setPulseBump(true);
    window.setTimeout(() => setPulseBump(false), 220);
  }

  function hardFlash() {
    // 300ms bright flash
    setPulseTick((n) => n + 1);
    // handled via phase class "flash"
  }

  function resetToNewPrompt(nextPrompt: string, nextPlaceholder: string, nextPhase: CapturePhase) {
    // “Screen inhales. Arc dims. Everything resets.”
    setPhase("inhale");
    setError("");

    // Remove intro lines and input quickly
    setLine1(false);
    setLine2(false);
    setLine3(false);
    setShowInput(false);

    // Small inhale pause
    window.setTimeout(() => {
      setPrompt(nextPrompt);
      setPlaceholder(nextPlaceholder);
      setInputValue("");
      lastWordCountRef.current = 0;

      setPhase(nextPhase);
      setShowInput(true);
      setTimeout(() => inputRef.current?.focus(), 160);
    }, 520);
  }

  function advanceFromFirstName() {
    const fn = safeTrimMax(inputValue, 40);
    if (!fn) {
      setError("First name required.");
      return;
    }
    setFirstName(fn);

    resetToNewPrompt("Last name. Make it real.", "last name", "last");
  }

  function advanceFromLastName() {
    const ln = safeTrimMax(inputValue, 60);
    if (!ln) {
      setError("Last name required.");
      return;
    }
    setLastName(ln);

    // Arc brightens. 300ms flash. Then email field.
    setPhase("flash");
    hardFlash();

    window.setTimeout(() => {
      setPrompt(""); // per your spec, no extra line needed; the field itself carries it
      setPlaceholder("where your code lands");
      setInputValue("");
      lastWordCountRef.current = 0;

      setPhase("email");
      setShowInput(true);
      setTimeout(() => inputRef.current?.focus(), 140);
    }, 320);
  }

  function advanceFromEmail() {
    const em = safeTrimMax(inputValue, 120);
    if (!isValidEmail(em)) {
      setError("Valid email required.");
      return;
    }
    setEmail(em);

    // Generate code now (prototype behavior; later you’d send it)
    if (!accessCode) setAccessCode(generateAccessCode());

    // Arc shrinks to a dot. 0.7s. Then ripple.
    setPhase("shrink");
    setShowInput(false);
    setError("");

    window.setTimeout(() => {
      setPhase("ripple");
      window.setTimeout(() => {
        setPhase("done");
      }, 620);
    }, 700);
  }

  function onEnterSubmit() {
    if (step !== 2) return;

    if (phase === "first") return advanceFromFirstName();
    if (phase === "last") return advanceFromLastName();
    if (phase === "email") return advanceFromEmail();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      onEnterSubmit();
    }
  }

  return (
    <div className="app">
      <style>{styles}</style>

      {/* PAGE 1 (kept intentionally simple; your existing Page 1 can be merged later) */}
      {step === 1 && (
        <div className="screen">
          <div className="arc corePulse" aria-hidden="true" />

          <div className="centerBlock">
            <div className="h1">You’re not broken. You were never given a map.</div>
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

      {/* PAGE 2 / Screen2 (your spec) */}
      {step === 2 && (
        <div className={`screen ${phase}`}>
          <div
            className={[
              "arc",
              "arcBase",
              "corePulse",
              pulseBump ? "bump" : "",
              phase === "inhale" ? "dim" : "",
              phase === "flash" ? "flashOn" : "",
              phase === "shrink" ? "shrinkToDot" : "",
              phase === "ripple" ? "rippleBurst" : "",
              phase === "done" ? "doneHold" : "",
            ].join(" ")}
            aria-hidden="true"
            // pulseTick used to re-trigger CSS animations when needed
            data-tick={pulseTick}
          />

          {/* Intro lines */}
          {prompt === "" && phase !== "inhale" && phase !== "last" && phase !== "email" && phase !== "done" && (
            <div className="lines">
              <div className={`line l1 ${line1 ? "show" : ""}`}>
                A cipher is the first machine that only spoke when spoken to.
              </div>
              <div className={`line l2 ${line2 ? "show" : ""}`}>
                AI does the same — except it remembers everything. Forever.
              </div>
              <div className={`line l3 ${line3 ? "show" : ""}`}>You don’t need to be loud. Just honest.</div>
            </div>
          )}

          {/* Prompt after reset (Last name…) */}
          {prompt !== "" && (phase === "last" || phase === "inhale") && (
            <div className="promptWrap">
              <div className={`prompt ${phase === "last" ? "show" : ""}`}>{prompt}</div>
            </div>
          )}

          {/* Input (slides up from bottom, underline style) */}
          {(phase === "first" || phase === "last" || phase === "email") && (
            <div className={`inputDock ${showInput ? "show" : ""}`}>
              <input
                ref={inputRef}
                className="underlineInput"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder}
                onKeyDown={onKeyDown}
                autoComplete={
                  phase === "first" ? "given-name" : phase === "last" ? "family-name" : "email"
                }
                inputMode={phase === "email" ? "email" : "text"}
                type={phase === "email" ? "email" : "text"}
                aria-label={phase === "first" ? "First name" : phase === "last" ? "Last name" : "Email"}
              />
              <div className="inputHint">
                Press Enter
              </div>
            </div>
          )}

          {/* Error (quiet, minimal) */}
          {error && <div className="quietError">{error}</div>}

          {/* Done message (no button) */}
          {phase === "done" && (
            <div className="doneBlock">
              <div className="doneMain">Your private code is on its way.</div>
              <div className="doneSub">60 seconds.</div>
              <div className="doneLink">{displayDomain}</div>

              {/* Stored for later pages 3/4 integration; not displayed here per spec. */}
              <div className="hiddenMeta" aria-hidden="true">
                code:{accessCode} name:{firstName} {lastName} email:{email}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Placeholder Pages 3 & 4 (kept minimal now; we’ll build them after Screen2 is locked) */}
      {step === 3 && (
        <div className="screen">
          <div className="arc corePulse" aria-hidden="true" />
          <div className="centerBlock">
            <div className="h1">Page 3 placeholder</div>
            <div className="p">
              Captured: {displayName}. Email: {email || "—"}.
            </div>
            <button className="cta" type="button" onClick={() => goTo(4)}>
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="screen">
          <div className="arc corePulse" aria-hidden="true" />
          <div className="centerBlock">
            <div className="h1">Page 4 placeholder</div>
            <div className="p">
              Access code stored: {accessCode || "—"} (prototype).
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }

  .app {
    min-height: 100vh;
    background: #000;
    color: #fff;
    font-family: "Helvetica Neue", Arial, sans-serif;
  }

  .screen {
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
    padding: 24px;
    position: relative;
  }

  /* ARC */
  .arc {
    width: 60px;
    height: 60px;
    border-radius: 999px;
    border: 1px solid rgba(0,255,255,0.35);
    background: radial-gradient(circle, rgba(0,255,255,0.14) 0%, transparent 70%);
    margin-bottom: 34px;
    position: relative;
    transform: translateZ(0);
    will-change: transform, opacity, box-shadow;
  }

  /* Base pulse every 2.8 seconds: quiet heart */
  .corePulse {
    animation: corePulse 2.8s ease-in-out infinite;
  }

  @keyframes corePulse {
    0%, 100% { box-shadow: 0 0 12px rgba(0,255,255,0.18); }
    50%      { box-shadow: 0 0 28px rgba(0,255,255,0.36); }
  }

  /* “listening” bump: once per word */
  .bump {
    animation: bumpPulse 220ms ease-out 1;
  }

  @keyframes bumpPulse {
    0%   { transform: scale(1); box-shadow: 0 0 16px rgba(0,255,255,0.22); }
    55%  { transform: scale(1.06); box-shadow: 0 0 34px rgba(0,255,255,0.42); }
    100% { transform: scale(1); box-shadow: 0 0 16px rgba(0,255,255,0.22); }
  }

  /* INHALE: arc dims + slight sink */
  .dim {
    opacity: 0.45;
    transform: scale(0.96);
    transition: opacity 380ms ease, transform 380ms ease;
  }

  /* FLASH: 300ms bright */
  .flashOn {
    animation: flashOn 300ms ease-out 1;
  }
  @keyframes flashOn {
    0%   { box-shadow: 0 0 12px rgba(0,255,255,0.22); opacity: 0.9; }
    50%  { box-shadow: 0 0 60px rgba(0,255,255,0.85); opacity: 1; }
    100% { box-shadow: 0 0 18px rgba(0,255,255,0.28); opacity: 1; }
  }

  /* SHRINK: arc collapses to dot over 0.7s */
  .shrinkToDot {
    animation: shrinkToDot 700ms ease-in forwards;
  }
  @keyframes shrinkToDot {
    0%   { transform: scale(1); opacity: 1; }
    100% { transform: scale(0.08); opacity: 0.9; box-shadow: 0 0 6px rgba(0,255,255,0.55); }
  }

  /* RIPPLE: ring expands off-screen like water */
  .rippleBurst::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 60px;
    height: 60px;
    transform: translate(-50%, -50%);
    border-radius: 999px;
    border: 2px solid rgba(0,255,255,0.55);
    opacity: 0;
    animation: ripple 620ms ease-out 1;
  }

  @keyframes ripple {
    0%   { opacity: 0.75; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(18); }
  }

  /* TEXT LINES */
  .lines {
    max-width: 520px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 10px;
  }

  .line {
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 900ms ease, transform 750ms ease;
    color: rgba(255,255,255,0.92);
    text-shadow: 0 0 18px rgba(0,255,255,0.08);
  }

  .line.show {
    opacity: 1;
    transform: translateY(0);
  }

  .l1 { font-size: 22px; font-weight: 300; line-height: 1.55; }
  .l2 { font-size: 20px; font-weight: 300; line-height: 1.55; color: rgba(255,255,255,0.86); }
  .l3 { font-size: 19px; font-weight: 300; line-height: 1.55; color: rgba(255,255,255,0.82); }

  /* Prompt after reset */
  .promptWrap {
    max-width: 520px;
    margin-bottom: 16px;
  }
  .prompt {
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 900ms ease, transform 750ms ease;
    font-size: 22px;
    font-weight: 300;
    line-height: 1.45;
    color: rgba(255,255,255,0.92);
    text-shadow: 0 0 16px rgba(0,255,255,0.08);
  }
  .prompt.show {
    opacity: 1;
    transform: translateY(0);
  }

  /* INPUT DOCK: slides up from bottom */
  .inputDock {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 52px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    opacity: 0;
    transform: translateY(32px);
    transition: opacity 750ms ease, transform 750ms ease;
    pointer-events: none;
  }

  .inputDock.show {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .underlineInput {
    width: min(420px, 86vw);
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(0,255,255,0.30);
    padding: 14px 10px;
    color: rgba(255,255,255,0.92);
    font-size: 18px;
    text-align: center;
    outline: none;
    caret-color: rgba(0,255,255,0.95);
  }

  .underlineInput::placeholder {
    color: rgba(0,255,255,0.45);
    text-transform: lowercase;
  }

  .underlineInput:focus {
    border-bottom-color: rgba(0,255,255,0.65);
    box-shadow: 0 10px 30px rgba(0,255,255,0.10);
  }

  .inputHint {
    font-size: 12px;
    color: rgba(255,255,255,0.55);
    letter-spacing: 0.2px;
  }

  .quietError {
    position: absolute;
    bottom: 132px;
    font-size: 12px;
    color: rgba(255,120,120,0.92);
    background: rgba(255,80,80,0.08);
    border: 1px solid rgba(255,80,80,0.25);
    padding: 8px 10px;
    border-radius: 12px;
    max-width: min(420px, 86vw);
  }

  /* DONE STATE */
  .doneBlock {
    margin-top: 8px;
    max-width: 520px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }

  .doneMain {
    font-size: 22px;
    font-weight: 300;
    color: rgba(255,255,255,0.94);
    text-shadow: 0 0 18px rgba(0,255,255,0.10);
  }

  .doneSub {
    font-size: 14px;
    color: rgba(255,255,255,0.70);
  }

  .doneLink {
    font-size: 12px;
    color: rgba(0,255,255,0.55);
    margin-top: 8px;
  }

  .hiddenMeta { display: none; }

  /* Page 1 simple styling */
  .centerBlock {
    max-width: 520px;
  }

  .h1 {
    font-size: 26px;
    font-weight: 650;
    line-height: 1.25;
    margin-bottom: 12px;
    letter-spacing: 0.2px;
  }

  .p {
    font-size: 16px;
    font-weight: 300;
    line-height: 1.65;
    color: rgba(255,255,255,0.78);
    margin: 0 auto 14px;
  }

  .cta {
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

  .cta:hover {
    background: rgba(0,255,255,0.10);
    box-shadow: 0 0 20px rgba(0,255,255,0.16);
  }

  .micro {
    margin-top: 10px;
    font-size: 12px;
    color: rgba(255,255,255,0.55);
  }

  /* Motion safety */
  @media (prefers-reduced-motion: reduce) {
    .corePulse { animation: none; }
    .line, .prompt, .inputDock { transition: none; transform: none; }
    .bump, .flashOn, .shrinkToDot { animation: none; }
    .rippleBurst::after { animation: none; }
  }
`;

