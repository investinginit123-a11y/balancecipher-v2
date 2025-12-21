import React, { useEffect, useMemo, useRef, useState } from "react";

type PageId = 1 | 2 | 3 | 4 | 5;

function generateAccessCode(len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // avoid confusing I/1/O/0
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function App() {
  // --- Primary flow state (5 pages) ---
  const [page, setPage] = useState<PageId>(1);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [enteredCode, setEnteredCode] = useState<string>("");
  const [codeError, setCodeError] = useState<string>("");

  // --- Page 2 cinematic sequencing ---
  const [seqStep, setSeqStep] = useState<number>(0);
  const [aiMode, setAiMode] = useState<boolean>(false);

  // Timers cleanup (prevents runaway setTimeout causing sluggishness)
  const timersRef = useRef<number[]>([]);
  const reduceMotionRef = useRef<boolean>(false);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    reduceMotionRef.current = !!mq?.matches;

    const onChange = () => {
      reduceMotionRef.current = !!mq?.matches;
    };
    mq?.addEventListener?.("change", onChange);

    return () => mq?.removeEventListener?.("change", onChange);
  }, []);

  const clearTimers = () => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  };

  // Reset per-page transient state
  useEffect(() => {
    clearTimers();
    setCodeError("");

    if (page !== 2) {
      setSeqStep(0);
      setAiMode(false);
    }

    // Page 2 cinematic schedule
    if (page === 2) {
      setSeqStep(0);
      setAiMode(false);

      // Readability-first timing; slightly slower on mobile feel; minimal DOM churn
      const base = reduceMotionRef.current ? 0 : 720;

      const schedule = (ms: number, fn: () => void) => {
        const id = window.setTimeout(fn, ms);
        timersRef.current.push(id);
      };

      // Step plan: reveal in stable layers
      // 0: title
      // 1: cipher token
      // 2: copilot token + AI reader emphasis
      // 3: your AI power source token
      // 4: you token
      // 5: your potential token
      // 6: equals + BALANCE (AI mode pulse)
      // 7: input appears
      schedule(base * 1, () => setSeqStep(1));
      schedule(base * 2, () => setSeqStep(2));
      schedule(base * 3, () => setSeqStep(3));
      schedule(base * 4, () => setSeqStep(4));
      schedule(base * 5, () => setSeqStep(5));
      schedule(base * 6, () => setSeqStep(6));
      schedule(base * 6, () => setAiMode(true));
      schedule(base * 7, () => setSeqStep(7));
    }

    return () => clearTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // --- Derived helpers ---
  const canGoNextFromPage3 = useMemo(() => lastName.trim().length > 0, [lastName]);
  const canGoNextFromPage2 = useMemo(() => firstName.trim().length > 0, [firstName]);
  const canGoNextFromPage4 = useMemo(() => {
    const v = email.trim();
    return v.length > 5 && v.includes("@") && v.includes(".");
  }, [email]);

  const goToInfo = () => {
    // Final redirect gate
    window.location.href = "https://balancecipher.com/info";
  };

  const goNext = () => {
    setPage((p) => clamp((p + 1) as number, 1, 5) as PageId);
  };

  const goBack = () => {
    setPage((p) => clamp((p - 1) as number, 1, 5) as PageId);
  };

  const startDecoding = () => {
    setPage(2);
  };

  const handleGenerateCode = () => {
    const code = generateAccessCode(6);
    setGeneratedCode(code);
    setPage(5);
  };

  const handleVerifyCode = () => {
    const expected = generatedCode.trim().toUpperCase();
    const got = enteredCode.trim().toUpperCase();

    if (!expected) {
      setCodeError("No code was generated yet. Go back and generate a code first.");
      return;
    }
    if (got !== expected) {
      setCodeError("That code doesn’t match. Check it and try again.");
      return;
    }
    setCodeError("");
    goToInfo();
  };

  const brandImageSrc = "/brand/Cypher-Emblem.png";

  return (
    <div className="appRoot">
      <style>{`
        :root {
          --bg0: #07131f;
          --bg1: #06101a;
          --teal: #2ee6d6;
          --teal2: #15bfb0;
          --brass: #c7a66a;
          --text: rgba(255,255,255,0.92);
          --muted: rgba(255,255,255,0.70);
          --faint: rgba(255,255,255,0.55);
          --card: rgba(255,255,255,0.06);
          --card2: rgba(255,255,255,0.09);
          --line: rgba(46,230,214,0.28);
          --shadow: 0 20px 70px rgba(0,0,0,0.55);
          --radius: 18px;
        }

        * { box-sizing: border-box; }
        html, body { height: 100%; }
        body {
          margin: 0;
          background: radial-gradient(1200px 800px at 50% 12%, rgba(46,230,214,0.10), transparent 60%),
                      radial-gradient(900px 700px at 50% 120%, rgba(21,191,176,0.08), transparent 62%),
                      linear-gradient(180deg, var(--bg0), var(--bg1));
          color: var(--text);
          font-family: "Helvetica Neue", Helvetica, Arial, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
          font-weight: 300;
          overflow-x: hidden;
        }

        /* Ensure inputs/buttons inherit font (mobile consistency canon) */
        input, button, textarea, select {
          font: inherit;
          color: inherit;
        }

        .appRoot {
          min-height: 100vh;
          display: flex;
          align-items: stretch;
          justify-content: center;
          padding: 18px 14px 26px;
        }

        .frame {
          width: 100%;
          max-width: 980px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .topBar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 6px 6px 0;
        }

        .crumb {
          font-size: 12px;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: var(--faint);
          user-select: none;
        }

        .navBtns {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btnGhost {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 999px;
          padding: 10px 14px;
          cursor: pointer;
          transition: transform 140ms ease, border-color 140ms ease, background 140ms ease;
        }
        .btnGhost:hover { border-color: rgba(46,230,214,0.38); background: rgba(46,230,214,0.06); }
        .btnGhost:active { transform: scale(0.98); }

        .card {
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03));
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .stage {
          position: relative;
          padding: 26px 18px 22px;
          min-height: 72vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 18px;
        }

        .center {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
        }

        .emblemWrap {
          width: 128px;
          height: 128px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          position: relative;
          background: radial-gradient(circle at 50% 50%, rgba(46,230,214,0.16), rgba(0,0,0,0) 62%);
        }

        .emblemGlow {
          position: absolute;
          inset: -14px;
          border-radius: 999px;
          background: radial-gradient(circle at 50% 50%, rgba(46,230,214,0.22), rgba(0,0,0,0) 60%);
          filter: blur(8px);
          opacity: 0.9;
          pointer-events: none;
        }

        .emblemImg {
          width: 112px;
          height: 112px;
          object-fit: contain;
          filter: drop-shadow(0 0 22px rgba(46,230,214,0.18));
          user-select: none;
        }

        @keyframes emblemPulse {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.04); opacity: 1; }
        }

        .emblemPulse {
          animation: emblemPulse 2.6s ease-in-out infinite;
        }

        .tagline {
          max-width: 720px;
          color: var(--muted);
          font-size: clamp(15px, 2.3vw, 18px);
          line-height: 1.55;
        }

        .headline {
          font-size: clamp(26px, 5.2vw, 44px);
          line-height: 1.12;
          letter-spacing: -0.02em;
          font-weight: 500; /* canon: titles 500 */
          margin: 0;
        }

        .subhead {
          margin: 0;
          color: var(--muted);
          font-size: clamp(14px, 2.2vw, 18px);
          line-height: 1.6;
          max-width: 760px;
        }

        .primaryBtn {
          background: radial-gradient(120px 80px at 30% 30%, rgba(46,230,214,0.26), rgba(46,230,214,0.06)),
                      linear-gradient(180deg, rgba(46,230,214,0.16), rgba(46,230,214,0.08));
          border: 1px solid rgba(46,230,214,0.38);
          color: var(--text);
          border-radius: 999px;
          padding: 14px 18px;
          cursor: pointer;
          transition: transform 140ms ease, border-color 140ms ease, background 140ms ease;
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        .primaryBtn:hover { border-color: rgba(46,230,214,0.55); background: rgba(46,230,214,0.16); }
        .primaryBtn:active { transform: scale(0.985); }

        .primaryBtn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .divider {
          width: min(520px, 92%);
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(46,230,214,0.28), transparent);
          margin: 10px 0 0;
        }

        /* PAGE 2 cinematic */
        .title {
          font-weight: 500; /* canon */
          font-size: clamp(22px, 4.2vw, 34px);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.86);
          margin: 0;
        }

        .cinematicLine {
          margin: 0;
          font-size: clamp(18px, 4.8vw, 28px);
          line-height: 1.35;
          color: rgba(255,255,255,0.90);
        }

        .fadeIn {
          opacity: 0;
          transform: translateY(6px);
          animation: fadeInUp 460ms ease forwards;
        }

        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .equationRow {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 10px 0 6px;
          margin-top: 4px;
        }

        .tightRow { gap: 8px; } /* canon tightening */

        .term {
          display: inline-flex;
          align-items: baseline;
          gap: 6px;
          padding: 10px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(8px);
          max-width: 100%;
        }

        .eqText {
          font-weight: 700; /* canon: equation weight */
          letter-spacing: 0.01em;
          font-size: clamp(14px, 3.2vw, 16px);
          color: rgba(255,255,255,0.88);
          white-space: nowrap;
        }

        .parenGroup {
          display: inline-flex;
          gap: 4px;
          white-space: nowrap;
          color: rgba(255,255,255,0.70);
          font-weight: 300;
        }

        .plus, .equals {
          font-weight: 700;
          color: rgba(46,230,214,0.70);
          letter-spacing: 0.02em;
          user-select: none;
        }

        .plus { font-size: clamp(16px, 4.2vw, 22px); }
        .equals { font-size: clamp(16px, 4.2vw, 22px); }

        .balanceWord{
          font-weight: 700; /* canon */
          font-size: clamp(46px, 9.4vw, 82px); /* slightly bigger */
          letter-spacing: 0.02em;
          color: rgba(255,255,255,0.94);
          text-shadow: 0 0 18px rgba(46,230,214,0.18);
          will-change: transform;
          line-height: 1;
        }

        @keyframes balancePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); }
        }

        @keyframes balancePulseAI {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.20); } /* larger peak */
        }

        .balancePulse {
          animation: balancePulse 1.35s ease-in-out infinite;
        }

        .balancePulseAI {
          animation: balancePulseAI 0.95s ease-in-out infinite; /* faster */
        }

        /* Underline input (Page 2, 3, 4) */
        .inputRow {
          width: min(520px, 92%);
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 10px;
          align-items: center;
        }

        .inputLabel {
          font-size: 13px;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.60);
        }

        .underlineInput {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          padding: 12px 2px 10px;
          border-bottom: 2px solid rgba(46,230,214,0.34);
          font-size: clamp(18px, 4.6vw, 22px);
          font-weight: 300;
          text-align: center;
          transition: border-color 160ms ease;
        }
        .underlineInput:focus { border-bottom-color: rgba(46,230,214,0.60); }

        .helper {
          max-width: 760px;
          color: rgba(255,255,255,0.68);
          font-size: clamp(13px, 2.2vw, 15px);
          line-height: 1.6;
          margin: 0;
        }

        .codeBox {
          width: min(520px, 92%);
          border-radius: 14px;
          padding: 14px 14px;
          background: rgba(0,0,0,0.22);
          border: 1px solid rgba(46,230,214,0.22);
        }

        .codeMono {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 18px;
          letter-spacing: 0.18em;
          color: rgba(255,255,255,0.92);
          font-weight: 600;
          text-align: center;
          user-select: all;
        }

        .error {
          color: rgba(255, 166, 166, 0.96);
          font-weight: 500;
          margin: 0;
        }

        /* Motion safety */
        @media (prefers-reduced-motion: reduce) {
          .fadeIn { animation: none; opacity: 1; transform: none; }
          .emblemPulse, .balancePulse, .balancePulseAI { animation: none; }
        }
      `}</style>

      <div className="frame">
        <div className="topBar">
          <div className="crumb">
            {page === 1 && "PAGE 1 — LANDING"}
            {page === 2 && "PAGE 2 — CIPHER + CO-PILOT"}
            {page === 3 && "PAGE 3 — LAST NAME"}
            {page === 4 && "PAGE 4 — EMAIL + CODE"}
            {page === 5 && "PAGE 5 — FINAL GATE"}
          </div>

          <div className="navBtns">
            {page !== 1 && (
              <button className="btnGhost" onClick={goBack} type="button">
                Back
              </button>
            )}
          </div>
        </div>

        <div className="card">
          <div className="stage">
            {page === 1 && (
              <div className="center">
                <div className="emblemWrap">
                  <div className="emblemGlow" />
                  <img
                    className="emblemImg emblemPulse"
                    src={brandImageSrc}
                    alt="BALANCE Cipher Emblem"
                    onError={(e) => {
                      // If image path differs, we fail gracefully instead of breaking layout.
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>

                <h1 className="headline">Are you ready to start decoding?</h1>

                <p className="tagline">
                  The AI-powered simple cipher that propels you on a path of prosperity and Freedom.
                </p>

                <div className="divider" />

                <button className="primaryBtn" onClick={startDecoding} type="button">
                  Start decoding
                </button>
              </div>
            )}

            {page === 2 && (
              <div className="center">
                {seqStep >= 0 && <p className="title fadeIn">The Cipher Equation</p>}

                {seqStep >= 1 && (
                  <p className="cinematicLine fadeIn">
                    Cipher{" "}
                    <span className="parenGroup">
                      <span>(</span>
                      <span>a pattern reader</span>
                      <span>)</span>
                    </span>
                  </p>
                )}

                {seqStep >= 2 && (
                  <p className="cinematicLine fadeIn">
                    Co-Pilot{" "}
                    <span className="parenGroup">
                      <span>(</span>
                      <span>AI reader</span>
                      <span>)</span>
                    </span>
                  </p>
                )}

                {seqStep >= 3 && (
                  <p className="cinematicLine fadeIn">Bracketing your AI power source</p>
                )}

                {/* Final equation row (NO duplicated + Your Potential) */}
                {seqStep >= 2 && (
                  <div className={`equationRow tightRow ${seqStep >= 2 ? "fadeIn" : ""}`}>
                    {/* Cipher */}
                    {seqStep >= 1 && (
                      <span className="term">
                        <span className="eqText">Cipher</span>
                        <span className="parenGroup">
                          <span>(</span>
                          <span>a pattern reader</span>
                          <span>)</span>
                        </span>
                      </span>
                    )}

                    {seqStep >= 2 && <span className="plus">+</span>}

                    {/* Co-Pilot */}
                    {seqStep >= 2 && (
                      <span className="term">
                        <span className="eqText">Co-Pilot</span>
                        <span className="parenGroup">
                          <span>(</span>
                          <span>AI reader</span>
                          <span>)</span>
                        </span>
                      </span>
                    )}

                    {seqStep >= 3 && <span className="plus">+</span>}

                    {/* Your AI Power Source */}
                    {seqStep >= 3 && (
                      <span className="term">
                        <span className="eqText">Your AI Power Source</span>
                      </span>
                    )}

                    {seqStep >= 4 && <span className="plus">+</span>}

                    {/* You */}
                    {seqStep >= 4 && (
                      <span className="term">
                        <span className="eqText">You</span>
                      </span>
                    )}

                    {seqStep >= 5 && <span className="plus">+</span>}

                    {/* Your Potential (single instance only) */}
                    {seqStep >= 5 && (
                      <span className="term">
                        <span className="eqText">Your Potential</span>
                      </span>
                    )}

                    {seqStep >= 6 && <span className="equals">=</span>}

                    {/* BALANCE */}
                    {seqStep >= 6 && (
                      <span
                        className={[
                          "balanceWord",
                          reduceMotionRef.current ? "" : aiMode ? "balancePulseAI" : "balancePulse",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        BALANCE
                      </span>
                    )}
                  </div>
                )}

                {seqStep >= 7 && (
                  <div className="inputRow fadeIn">
                    <div className="inputLabel">First name</div>
                    <input
                      className="underlineInput"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder=""
                      autoFocus
                      inputMode="text"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && canGoNextFromPage2) goNext();
                      }}
                    />
                    <button
                      className="primaryBtn"
                      onClick={goNext}
                      disabled={!canGoNextFromPage2}
                      type="button"
                    >
                      Continue
                    </button>
                  </div>
                )}
              </div>
            )}

            {page === 3 && (
              <div className="center">
                <h2 className="headline">Last name</h2>
                <p className="subhead">
                  Keep it simple. This is just to personalize the handoff.
                </p>

                <div className="inputRow">
                  <div className="inputLabel">Last name</div>
                  <input
                    className="underlineInput"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoFocus
                    inputMode="text"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && canGoNextFromPage3) goNext();
                    }}
                  />
                  <button
                    className="primaryBtn"
                    onClick={goNext}
                    disabled={!canGoNextFromPage3}
                    type="button"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {page === 4 && (
              <div className="center">
                <h2 className="headline">Email</h2>
                <p className="subhead">
                  This generates your access code for the final gate.
                </p>

                <div className="inputRow">
                  <div className="inputLabel">Email</div>
                  <input
                    className="underlineInput"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                    inputMode="email"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && canGoNextFromPage4) handleGenerateCode();
                    }}
                  />

                  <button
                    className="primaryBtn"
                    onClick={handleGenerateCode}
                    disabled={!canGoNextFromPage4}
                    type="button"
                  >
                    Generate code
                  </button>
                </div>

                <p className="helper">
                  Note: In a production build this would typically email the code. For now, it is generated
                  and shown on the next screen.
                </p>
              </div>
            )}

            {page === 5 && (
              <div className="center">
                <h2 className="headline">Final gate</h2>
                <p className="subhead">
                  Paste your code to continue.
                </p>

                <div className="codeBox">
                  <div className="inputLabel">Your generated code</div>
                  <div className="codeMono">{generatedCode ? generatedCode : "—"}</div>
                </div>

                <div className="inputRow">
                  <div className="inputLabel">Paste code</div>
                  <input
                    className="underlineInput"
                    value={enteredCode}
                    onChange={(e) => {
                      setEnteredCode(e.target.value.toUpperCase());
                      setCodeError("");
                    }}
                    autoFocus
                    inputMode="text"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleVerifyCode();
                    }}
                  />

                  {codeError && <p className="error">{codeError}</p>}

                  <button className="primaryBtn" onClick={handleVerifyCode} type="button">
                    Unlock and continue
                  </button>

                  <button
                    className="btnGhost"
                    onClick={() => setPage(4)}
                    type="button"
                    style={{ marginTop: 8 }}
                  >
                    Go back and change email
                  </button>
                </div>

                <p className="helper">
                  If the code is correct, you will be redirected to <span style={{ color: "rgba(46,230,214,0.80)" }}>balancecipher.com/info</span>.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Minimal footer to stabilize layout height and reduce reflow */}
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.40)", fontSize: 12, paddingBottom: 8 }}>
          BALANCE Cipher • Single-file build
        </div>
      </div>
    </div>
  );
}
