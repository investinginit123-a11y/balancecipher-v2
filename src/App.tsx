import React, { useEffect, useMemo, useRef, useState } from "react";

type Step = 1 | 2 | 3 | 4;

type CapturePhase =
  | "intro"
  | "first"
  | "inhale"
  | "last"
  | "flash"
  | "email"
  | "shrink"
  | "ripple"
  | "done";

const AUTO_ADVANCE_FROM_STEP2_TO_STEP3 = true; // no button; moves forward after "done"

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

  // Step 2 (cinematic capture) state
  const [phase2, setPhase2] = useState<CapturePhase>("intro");
  const [s2Line1, setS2Line1] = useState(false);
  const [s2Line2, setS2Line2] = useState(false);
  const [s2Line3, setS2Line3] = useState(false);
  const [s2ShowInput, setS2ShowInput] = useState(false);
  const [s2Prompt, setS2Prompt] = useState<string>("");
  const [s2Placeholder, setS2Placeholder] = useState<string>("your first name");
  const [s2Value, setS2Value] = useState<string>("");
  const [s2Error, setS2Error] = useState<string>("");

  // “listening” pulse on word completion
  const [s2PulseBump, setS2PulseBump] = useState(false);
  const [s2PulseTick, setS2PulseTick] = useState(0);
  const s2LastWordCount = useRef<number>(0);

  const s2InputRef = useRef<HTMLInputElement | null>(null);

  // Step 3 (code paste) state
  const [s3Line1, setS3Line1] = useState(false);
  const [s3Line2, setS3Line2] = useState(false);
  const [s3Line3, setS3Line3] = useState(false);
  const [s3ShowInput, setS3ShowInput] = useState(false);
  const [s3Error, setS3Error] = useState("");
  const [s3CodeValue, setS3CodeValue] = useState("");
  const s3InputRef = useRef<HTMLInputElement | null>(null);

  const displayName = useMemo(() => safeTrimMax(firstName, 40) || "you", [firstName]);
  const infoUrlText = "balancecipher.com/info";

  function goTo(next: Step) {
    setStep(next);
  }

  function softPulseStep2() {
    setS2PulseTick((n) => n + 1);
    setS2PulseBump(true);
    window.setTimeout(() => setS2PulseBump(false), 220);
  }

  // Page 1 CTA → Page 2
  function handleStartPrivateDecode() {
    setStep(2);
  }

  // ---------- STEP 2: TIMING + STATE ----------
  useEffect(() => {
    if (step !== 2) return;

    // Reset Step2
    setS2Error("");
    setPhase2("intro");
    setS2Line1(false);
    setS2Line2(false);
    setS2Line3(false);
    setS2ShowInput(false);
    setS2Prompt("");
    setS2Placeholder("your first name");
    setS2Value("");
    s2LastWordCount.current = 0;

    // Intro timing
    const timers: number[] = [];

    timers.push(window.setTimeout(() => setS2Line1(true), 650));
    timers.push(window.setTimeout(() => setS2Line2(true), 650 + 1800));
    timers.push(window.setTimeout(() => setS2Line3(true), 650 + 1800 + 1500));

    const inputAt = 650 + 1800 + 1500 + 2200;
    timers.push(
      window.setTimeout(() => {
        setPhase2("first");
        setS2ShowInput(true);
        setTimeout(() => s2InputRef.current?.focus(), 180);
      }, inputAt)
    );

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [step]);

  // Step2 word-count pulse (once per word)
  useEffect(() => {
    if (step !== 2) return;
    if (!s2ShowInput) return;
    if (!(phase2 === "first" || phase2 === "last" || phase2 === "email")) return;

    const count = (s2Value.match(/\b\w+\b/g) || []).length;
    const last = s2LastWordCount.current;

    if (count > last) {
      s2LastWordCount.current = count;
      softPulseStep2();
    }
  }, [s2Value, s2ShowInput, step, phase2]);

  function resetToNewPromptStep2(nextPrompt: string, nextPlaceholder: string, nextPhase: CapturePhase) {
    setPhase2("inhale");
    setS2Error("");

    // dissolve
    setS2Line1(false);
    setS2Line2(false);
    setS2Line3(false);
    setS2ShowInput(false);

    window.setTimeout(() => {
      setS2Prompt(nextPrompt);
      setS2Placeholder(nextPlaceholder);
      setS2Value("");
      s2LastWordCount.current = 0;

      setPhase2(nextPhase);
      setS2ShowInput(true);
      setTimeout(() => s2InputRef.current?.focus(), 160);
    }, 520);
  }

  function advanceStep2First() {
    const fn = safeTrimMax(s2Value, 40);
    if (!fn) {
      setS2Error("First name required.");
      return;
    }
    setFirstName(fn);
    resetToNewPromptStep2("Last name. Make it real.", "last name", "last");
  }

  function advanceStep2Last() {
    const ln = safeTrimMax(s2Value, 60);
    if (!ln) {
      setS2Error("Last name required.");
      return;
    }
    setLastName(ln);

    // flare 150ms, then email prompt
    setPhase2("flash");
    window.setTimeout(() => {
      setS2Prompt("Email — your key arrives here, once.");
      setS2Placeholder("where your code lands");
      setS2Value("");
      s2LastWordCount.current = 0;

      setPhase2("email");
      setS2ShowInput(true);
      setTimeout(() => s2InputRef.current?.focus(), 140);
    }, 170);
  }

  function advanceStep2Email() {
    const em = safeTrimMax(s2Value, 120);
    if (!isValidEmail(em)) {
      setS2Error("Valid email required.");
      return;
    }
    setEmail(em);

    if (!accessCode) setAccessCode(generateAccessCode());

    // confirmation: two slow pulses (handled as class timing)
    setPhase2("shrink");
    setS2ShowInput(false);
    setS2Error("");

    const timers: number[] = [];
    timers.push(
      window.setTimeout(() => {
        setPhase2("ripple");
        timers.push(
          window.setTimeout(() => {
            setPhase2("done");

            if (AUTO_ADVANCE_FROM_STEP2_TO_STEP3) {
              timers.push(window.setTimeout(() => setStep(3), 1200));
            }
          }, 620)
        );
      }, 700)
    );

    return () => timers.forEach((t) => window.clearTimeout(t));
  }

  function submitStep2OnEnter() {
    if (step !== 2) return;

    if (phase2 === "first") return advanceStep2First();
    if (phase2 === "last") return advanceStep2Last();
    if (phase2 === "email") return advanceStep2Email();
  }

  function onKeyDownStep2(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submitStep2OnEnter();
    }
  }

  // ---------- STEP 3: CODE PASTE SCREEN ----------
  useEffect(() => {
    if (step !== 3) return;

    setS3Error("");
    setS3Line1(false);
    setS3Line2(false);
    setS3Line3(false);
    setS3ShowInput(false);
    setS3CodeValue("");

    const timers: number[] = [];

    // one breath
    const breath = 900;
    timers.push(window.setTimeout(() => setS3Line1(true), breath));
    timers.push(window.setTimeout(() => setS3Line2(true), breath + 1800));
    timers.push(window.setTimeout(() => setS3Line3(true), breath + 1800 + 1500));

    // 2s silence → input appears
    const inputAt = breath + 1800 + 1500 + 2000;
    timers.push(
      window.setTimeout(() => {
        setS3ShowInput(true);
        setTimeout(() => s3InputRef.current?.focus(), 160);
      }, inputAt)
    );

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [step]);

  function onKeyDownStep3(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();

      const entered = safeTrimMax(s3CodeValue, 30).toUpperCase();
      const expected = safeTrimMax(accessCode, 30).toUpperCase();

      if (!entered) return; // no hints, no validation text

      if (!expected) {
        // if code missing (prototype safeguard), allow creation but keep it quiet
        setS3Error("No code is available yet.");
        return;
      }

      if (entered !== expected) {
        setS3Error("Code mismatch.");
        return;
      }

      // success → Step 4 (app entry placeholder for now)
      setS3Error("");
      setStep(4);
    }
  }

  // ---------- STEP 4: APP ENTRY PLACEHOLDER ----------
  useEffect(() => {
    if (step !== 4) return;

    // Optional: redirect if an env var exists
    const entryUrl = (import.meta as any)?.env?.VITE_APP_ENTRY_URL || "";
    if (entryUrl) {
      window.location.href = entryUrl;
    }
  }, [step]);

  return (
    <div className="app">
      <style>{styles}</style>

      {/* PAGE 1 */}
      {step === 1 && (
        <div className="screen">
          <div className="arc corePulse" aria-hidden="true" />
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

      {/* PAGE 2 (working capture) */}
      {step === 2 && (
        <div className={`screen ${phase2}`}>
          <div
            className={[
              "arc",
              "arcBase",
              "corePulse",
              s2PulseBump ? "bump" : "",
              phase2 === "inhale" ? "dim" : "",
              phase2 === "flash" ? "flashOn150" : "",
              phase2 === "shrink" ? "shrinkToDot" : "",
              phase2 === "ripple" ? "rippleBurst" : "",
              phase2 === "done" ? "doneHold" : "",
            ].join(" ")}
            aria-hidden="true"
            data-tick={s2PulseTick}
          />

          {/* Intro lines */}
          {s2Prompt === "" && phase2 !== "inhale" && phase2 !== "last" && phase2 !== "email" && phase2 !== "done" && (
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

          {/* Reset prompt lines */}
          {s2Prompt !== "" && (phase2 === "last" || phase2 === "email" || phase2 === "inhale") && (
            <div className="promptWrap">
              <div className={`prompt ${(phase2 === "last" || phase2 === "email") ? "show" : ""}`}>{s2Prompt}</div>
            </div>
          )}

          {(phase2 === "first" || phase2 === "last" || phase2 === "email") && (
            <div className={`inputDock ${s2ShowInput ? "show" : ""}`}>
              <input
                ref={s2InputRef}
                className="underlineInput"
                value={s2Value}
                onChange={(e) => setS2Value(e.target.value)}
                placeholder={s2Placeholder}
                onKeyDown={onKeyDownStep2}
                autoComplete={phase2 === "first" ? "given-name" : phase2 === "last" ? "family-name" : "email"}
                inputMode={phase2 === "email" ? "email" : "text"}
                type={phase2 === "email" ? "email" : "text"}
                aria-label={phase2 === "first" ? "First name" : phase2 === "last" ? "Last name" : "Email"}
              />
              {/* No hints requested; this stays extremely quiet */}
              <div className="inputHintQuiet">Enter</div>
            </div>
          )}

          {s2Error && <div className="quietError">{s2Error}</div>}

          {phase2 === "done" && (
            <div className="doneBlock">
              <div className="doneMain">Code’s on the way</div>
              <div className="doneSub">60 seconds</div>
              <div className="doneLink">{infoUrlText}</div>
              <div className="doneSub" style={{ marginTop: 6 }}>
                Paste it. You're in.
              </div>
            </div>
          )}
        </div>
      )}

      {/* PAGE 3 (your new cinematic paste-code screen; no CTA) */}
      {step === 3 && (
        <div className="screen">
          <div className="arc corePulse" aria-hidden="true" />

          <div className="lines">
            <div className={`line l1 ${s3Line1 ? "show" : ""}`}>
              A cipher is the first machine that only spoke when spoken to
            </div>
            <div className={`line l2 ${s3Line2 ? "show" : ""}`}>
              AI does the same — except it remembers every word forever
            </div>
            <div className={`line l3 ${s3Line3 ? "show" : ""}`}>
              You're the only voice it waits for
            </div>
          </div>

          <div className={`inputDock ${s3ShowInput ? "show" : ""}`} style={{ bottom: 64 }}>
            <input
              ref={s3InputRef}
              className="underlineInput noPlaceholder"
              value={s3CodeValue}
              onChange={(e) => setS3CodeValue(e.target.value)}
              placeholder=""
              onKeyDown={onKeyDownStep3}
              inputMode="text"
              type="text"
              aria-label="Access code"
              autoComplete="one-time-code"
            />
          </div>

          {/* No CTA. Only the quiet instruction text. */}
          <div className="s3Footer">
            <div className="doneMainMini">Code’s on the way. 60 seconds.</div>
            <div className="doneLinkMini">{infoUrlText}</div>
            <div className="doneSubMini">Paste it. You’re in.</div>
          </div>

          {s3Error && <div className="quietError">{s3Error}</div>}

          {/* Hidden debug info for you (remove later) */}
          <div className="hiddenMeta" aria-hidden="true">
            name:{displayName} last:{lastName} email:{email} expected:{accessCode}
          </div>
        </div>
      )}

      {/* PAGE 4 (app entry placeholder) */}
      {step === 4 && (
        <div className="screen">
          <div className="arc corePulse" aria-hidden="true" />
          <div className="centerBlock">
            <div className="h1">Access confirmed.</div>
            <div className="p">
              {displayName}, you're inside the entry gate. Next step is wiring this into the BALANCE Engine route.
            </div>
            <div className="micro">
              If you set <span className="mono">VITE_APP_ENTRY_URL</span>, this screen will auto-redirect.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  .app { min-height: 100vh; background: #000; color: #fff; font-family: "Helvetica Neue", Arial, sans-serif; }

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

  .corePulse { animation: corePulse 2.8s ease-in-out infinite; }

  @keyframes corePulse {
    0%, 100% { box-shadow: 0 0 12px rgba(0,255,255,0.18); }
    50%      { box-shadow: 0 0 28px rgba(0,255,255,0.36); }
  }

  /* Listening bump */
  .bump { animation: bumpPulse 220ms ease-out 1; }

  @keyframes bumpPulse {
    0%   { transform: scale(1); box-shadow: 0 0 16px rgba(0,255,255,0.22); }
    55%  { transform: scale(1.06); box-shadow: 0 0 34px rgba(0,255,255,0.42); }
    100% { transform: scale(1); box-shadow: 0 0 16px rgba(0,255,255,0.22); }
  }

  /* Inhale */
  .dim { opacity: 0.45; transform: scale(0.96); transition: opacity 380ms ease, transform 380ms ease; }

  /* 150ms flare */
  .flashOn150 { animation: flashOn150 150ms ease-out 1; }
  @keyframes flashOn150 {
    0%   { box-shadow: 0 0 18px rgba(0,255,255,0.25); }
    50%  { box-shadow: 0 0 55px rgba(0,255,255,0.85); }
    100% { box-shadow: 0 0 18px rgba(0,255,255,0.28); }
  }

  /* Shrink to dot */
  .shrinkToDot { animation: shrinkToDot 700ms ease-in forwards; }
  @keyframes shrinkToDot {
    0%   { transform: scale(1); opacity: 1; }
    100% { transform: scale(0.08); opacity: 0.9; box-shadow: 0 0 6px rgba(0,255,255,0.55); }
  }

  /* Ripple */
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

  /* Lines */
  .lines {
    max-width: 560px;
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

  .line.show { opacity: 1; transform: translateY(0); }

  .l1 { font-size: 22px; font-weight: 300; line-height: 1.55; }
  .l2 { font-size: 20px; font-weight: 300; line-height: 1.55; color: rgba(255,255,255,0.86); }
  .l3 { font-size: 19px; font-weight: 300; line-height: 1.55; color: rgba(255,255,255,0.82); margin-top: -2px; }

  /* Prompt */
  .promptWrap { max-width: 560px; margin-bottom: 16px; }
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
  .prompt.show { opacity: 1; transform: translateY(0); }

  /* Input dock */
  .inputDock {
    position: absolute;
    left: 0; right: 0;
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
  .noPlaceholder::placeholder { color: transparent; }

  .inputHintQuiet {
    font-size: 11px;
    color: rgba(255,255,255,0.20);
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

  /* Done blocks */
  .doneBlock {
    margin-top: 8px;
    max-width: 560px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }
  .doneMain { font-size: 22px; font-weight: 300; color: rgba(255,255,255,0.94); }
  .doneSub  { font-size: 14px; color: rgba(255,255,255,0.70); }
  .doneLink { font-size: 12px; color: rgba(0,255,255,0.55); margin-top: 6px; }

  /* Step 3 footer text (no CTA) */
  .s3Footer {
    position: absolute;
    bottom: 26px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: center;
    opacity: 0.85;
  }
  .doneMainMini { font-size: 14px; color: rgba(255,255,255,0.70); }
  .doneLinkMini { font-size: 12px; color: rgba(0,255,255,0.55); }
  .doneSubMini  { font-size: 12px; color: rgba(255,255,255,0.60); }

  /* Page 1 styling */
  .centerBlock { max-width: 560px; }
  .h1 { font-size: 26px; font-weight: 650; line-height: 1.25; margin-bottom: 12px; letter-spacing: 0.2px; }
  .p  { font-size: 16px; font-weight: 300; line-height: 1.65; color: rgba(255,255,255,0.78); margin: 0 auto 14px; }

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
  .cta:hover { background: rgba(0,255,255,0.10); box-shadow: 0 0 20px rgba(0,255,255,0.16); }
  .micro { margin-top: 10px; font-size: 12px; color: rgba(255,255,255,0.55); }
  .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New", monospace; }

  .hiddenMeta { display: none; }

  @media (prefers-reduced-motion: reduce) {
    .corePulse { animation: none; }
    .line, .prompt, .inputDock { transition: none; transform: none; }
    .bump, .flashOn150, .shrinkToDot { animation: none; }
    .rippleBurst::after { animation: none; }
  }
`;
