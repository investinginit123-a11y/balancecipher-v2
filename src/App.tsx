import React, { useEffect, useRef, useState } from "react";

type View = "landing" | "p2" | "p3" | "p4" | "p5";

function safeTrimMax(v: string, maxLen: number) {
  return v.trim().slice(0, maxLen);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function generateAccessCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export default function App() {
  const [view, setView] = useState<View>("landing");

  // Capture data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [codeInput, setCodeInput] = useState("");

  // Page 2 input (kept separate)
  const [p2First, setP2First] = useState("");

  const p2FirstRef = useRef<HTMLInputElement | null>(null);
  const lastRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const codeRef = useRef<HTMLInputElement | null>(null);

  // Receivable overlay (B / A / L)
  const [rewardOn, setRewardOn] = useState(false);
  const [rewardLetter, setRewardLetter] = useState<"B" | "A" | "L" | null>(null);
  const [rewardCopy, setRewardCopy] = useState<string>("");
  const rewardTimerRef = useRef<number | null>(null);

  function clearRewardTimer() {
    if (rewardTimerRef.current) {
      window.clearTimeout(rewardTimerRef.current);
      rewardTimerRef.current = null;
    }
  }

  function showReward(
    letter: "B" | "A" | "L",
    copy: string,
    holdMs: number,
    after?: () => void
  ) {
    clearRewardTimer();
    setRewardLetter(letter);
    setRewardCopy(copy);
    setRewardOn(true);

    rewardTimerRef.current = window.setTimeout(() => {
      setRewardOn(false);
      setRewardLetter(null);
      setRewardCopy("");
      rewardTimerRef.current = null;
      after?.();
    }, holdMs);
  }

  useEffect(() => {
    return () => clearRewardTimer();
  }, []);

  function goTo(v: View) {
    setView(v);
  }

  function goToDecode() {
    setP2First("");
    goTo("p2");
  }

  // STEP 2 -> STEP 3 transition:
  // User gives first name -> receives B -> then Page 3 starts.
  function submitFirstFromP2() {
    if (rewardOn) return;
    const fn = safeTrimMax(p2First, 40);
    if (!fn) return;

    setFirstName(fn);

    showReward("B", "", 950, () => {
      goTo("p3");
    });
  }

  // STEP 3 (one move):
  // User gives last name -> receives A + Break Away sentence -> auto-advance to email.
  function submitLast() {
    if (rewardOn) return;
    const ln = safeTrimMax(lastName, 60);
    if (!ln) return;

    setLastName(ln);

    showReward("A", "Your full name just unlocked Break Away.", 1500, () => {
      goTo("p4");
    });
  }

  // STEP 4 (email):
  // User gives email -> receives L + awakened/learn prompt -> then code gate.
  function submitEmail() {
    if (rewardOn) return;
    const em = safeTrimMax(email, 120);
    if (!isValidEmail(em)) return;

    setEmail(em);

    const nextCode = accessCode || generateAccessCode();
    if (!accessCode) setAccessCode(nextCode);

    showReward("L", "Do you feel like you’ve been awakened?\nAre you ready to learn more?", 1550, () => {
      goTo("p5");
    });
  }

  function submitCode() {
    if (rewardOn) return;
    const expected = accessCode.trim().toUpperCase();
    const entered = codeInput.trim().toUpperCase();
    if (!entered) return;

    if (expected && entered !== expected) return;

    window.location.href = "https://balancecipher.com/info";
  }

  function onEnter(e: React.KeyboardEvent<HTMLInputElement>, action: () => void) {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  }

  // Focus management for Pages 3–5
  useEffect(() => {
    if (rewardOn) return;
    if (view === "p3") setTimeout(() => lastRef.current?.focus(), 60);
    if (view === "p4") setTimeout(() => emailRef.current?.focus(), 60);
    if (view === "p5") setTimeout(() => codeRef.current?.focus(), 60);
  }, [view, rewardOn]);

  // Focus Page 2 input after the full “gift” sequence completes.
  useEffect(() => {
    if (view !== "p2") return;
    const t = setTimeout(() => p2FirstRef.current?.focus(), 36500);
    return () => clearTimeout(t);
  }, [view]);

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

          --uiFont: "Helvetica Neue", Helvetica, Arial, sans-serif;
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
          font-family: var(--uiFont);
          font-weight: 300;
          overflow-x: hidden;
          text-align:center;

          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: geometricPrecision;
        }

        button, input, textarea, select {
          font: inherit;
          -webkit-font-smoothing: inherit;
          -moz-osx-font-smoothing: inherit;
          text-rendering: inherit;
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

        /* PAGE 2 AI-mode pulse: bigger + faster than standard */
        @keyframes balancePulseAI{
          0%, 100%{
            transform: scale(1.00);
            opacity: 0.92;
            text-shadow: 0 0 18px rgba(215,176,107,0.30);
          }
          50%{
            transform: scale(1.12);
            opacity: 1;
            text-shadow: 0 0 30px rgba(215,176,107,0.58);
          }
        }

        /* Receivable overlay (B / A / L) */
        .rewardOverlay{
          position: fixed;
          inset: 0;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          z-index: 9999;
          pointer-events: none;
        }

        @keyframes slamIn {
          0%   { opacity: 0; transform: translateY(18px) scale(0.86); filter: blur(2px); }
          45%  { opacity: 1; transform: translateY(0) scale(1.10); filter: blur(0px); }
          72%  { opacity: 1; transform: translateY(0) scale(0.99); }
          100% { opacity: 1; transform: translateY(0) scale(1.00); }
        }

        .rewardLetter{
          font-size: clamp(120px, 24vw, 220px);
          line-height: 0.95;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.96);
          text-shadow: 0 0 26px rgba(40,240,255,0.14);
          animation: slamIn 520ms cubic-bezier(0.18, 0.9, 0.22, 1) both;
          margin: 0;
          padding: 0;
        }

        .rewardCopy{
          margin-top: 12px;
          max-width: min(720px, 92vw);
          white-space: pre-line;
          font-size: clamp(18px, 4.6vw, 26px);
          line-height: 1.4;
          color: rgba(255,255,255,0.90);
          font-weight: 300;
          letter-spacing: 0.01em;
          text-shadow: 0 0 22px rgba(40,240,255,0.10);
          padding: 0 10px;
        }

        /* PAGE 1 */
        .p1{
          min-height:100vh;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
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
          font-weight: 700;
        }

        .eqSym{
          font-size: 18px;
          color: rgba(255,255,255,0.62);
          font-weight: 700;
        }

        .balance{
          font-size: 24px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--brass);
          padding: 2px 6px;
          border-radius: 10px;
          animation: balancePulse 3.6s ease-in-out infinite;
        }

        .cornerstone{
          margin-top: 6px;
          font-size: 15px;
          color: rgba(255,255,255,0.88);
          font-weight: 500;
        }

        .cornerstone strong{
          font-weight: 700;
          color: rgba(255,255,255,0.98);
        }

        .sub{
          width: min(640px, 100%);
          color: rgba(255,255,255,0.72);
          font-size: 16px;
          line-height: 1.55;
          margin-top: 8px;
          font-weight: 300;
        }

        .btn{
          padding: 16px 22px;
          border-radius: 999px;
          border: 1.5px solid rgba(40,240,255,0.75);
          color: rgba(255,255,255,0.96);
          background: linear-gradient(180deg, rgba(40,240,255,0.08), rgba(40,240,255,0.03));
          box-shadow: 0 0 24px rgba(40,240,255,0.18), 0 12px 30px rgba(0,0,0,0.35);
          cursor:pointer;
          font-weight: 700;
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
          font-weight: 300;
        }

        /* PAGE 2 */
        .p2{
          min-height:100vh;
          background:#000;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          padding: 24px 18px 112px;
          position: relative;
          overflow:hidden;
        }

        .p2Fade{
          position:absolute;
          inset:0;
          background:#000;
          opacity:1;
          animation: fadeOut 0.7s ease forwards;
          z-index: 20;
          pointer-events:none;
        }

        @keyframes fadeOut{ to { opacity: 0; } }

        .p2Wrap{
          width: min(820px, 100%);
          display:flex;
          flex-direction:column;
          align-items:center;
          gap: 6px;
          position: relative;
          z-index: 3;
        }

        .stage{
          width: min(780px, 100%);
          min-height: 150px;
          margin-top: -10px;
          position: relative;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:flex-start;
          gap: 12px;
        }

        @keyframes titleInOut{
          0%   { opacity:0; transform: translateY(10px); }
          18%  { opacity:1; transform: translateY(0); }
          72%  { opacity:1; transform: translateY(0); }
          100% { opacity:0; transform: translateY(-8px); }
        }

        @keyframes meaningInOut{
          0%   { opacity:0; transform: translateY(10px); }
          10%  { opacity:1; transform: translateY(0); }
          92%  { opacity:1; transform: translateY(0); }
          100% { opacity:0; transform: translateY(-8px); }
        }

        @keyframes sceneInStay{
          0%   { opacity:0; transform: translateY(10px); }
          100% { opacity:1; transform: translateY(0); }
        }

        /* Requested: titles less bold */
        .title{
          font-size: clamp(42px, 9.6vw, 60px);
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.96);
          opacity:0;
        }

        .meaning{
          font-size: clamp(24px, 6.2vw, 34px);
          font-weight: 300;
          color: rgba(255,255,255,0.90);
          text-shadow: 0 0 22px rgba(40,240,255,0.10);
          max-width: 780px;
          line-height: 1.6;
          opacity:0;
          padding: 0 6px;
        }

        .scene1Title { animation: titleInOut 2.6s ease forwards; animation-delay: 1.4s; }
        .scene1Mean  { animation: meaningInOut 6.2s ease forwards; animation-delay: 4.7s; }

        .scene2Title { animation: titleInOut 2.6s ease forwards; animation-delay: 11.8s; }
        .scene2Mean  { animation: meaningInOut 6.2s ease forwards; animation-delay: 15.1s; }

        .scene3Title { animation: titleInOut 2.6s ease forwards; animation-delay: 22.2s; }
        .scene3Mean  { animation: meaningInOut 6.2s ease forwards; animation-delay: 25.5s; }

        .finalWrap{
          position:absolute;
          left:0; right:0;
          top: 0;
          display:flex;
          flex-direction:column;
          align-items:center;
          gap: 14px;
          opacity:0;
          animation: sceneInStay 0.85s ease forwards;
          animation-delay: 32.8s;
          pointer-events:none;
        }

        .finalRow{
          display:flex;
          align-items: baseline;
          justify-content:center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .tightRow{
          gap: 8px;
        }

        .finalWord{
          font-size: 22px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.92);
          font-weight: 700;
        }

        .finalSym{
          font-size: 22px;
          color: rgba(255,255,255,0.78);
          font-weight: 700;
        }

        /* PAGE 2: BALANCE slightly bigger + bigger/faster pulse (AI mode) */
        .finalBalance{
          font-size: 38px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--brass);
          text-shadow: 0 0 22px var(--brassGlow);
          padding: 2px 10px;
          border-radius: 10px;
          animation: balancePulseAI 2.35s ease-in-out infinite;
        }

        .finalLine{
          font-size: 18px;
          color: rgba(40,240,255,0.70);
          line-height: 1.45;
          max-width: 780px;
          font-weight: 300;
        }

        .parenGroup{
          display:inline-flex;
          align-items: baseline;
          gap: 4px;
          white-space: nowrap;
        }

        .paren{
          font-size: 22px;
          color: rgba(255,255,255,0.78);
          font-weight: 700;
          margin: 0;
          padding: 0;
        }

        .parenText{
          font-size: 20px;
          font-weight: 500;
          letter-spacing: 0.02em;
          color: rgba(40,240,255,0.78);
        }

        .bracketGroup{
          display:inline-flex;
          align-items: baseline;
          gap: 4px;
          white-space: nowrap;
        }

        .bracket{
          font-size: 22px;
          color: rgba(255,255,255,0.78);
          font-weight: 700;
        }

        .bracketText{
          font-size: 22px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 700;
          color: rgba(255,255,255,0.92);
        }

        .dock{
          position:absolute;
          left:0; right:0;
          bottom: 42px;
          display:flex;
          flex-direction:column;
          align-items:center;
          gap: 12px;
          opacity:0;
          transform: translateY(20px);
          animation: dockIn 0.55s ease forwards;
          animation-delay: 35.0s;
          z-index: 4;
        }

        @keyframes dockIn{
          to { opacity:1; transform: translateY(0); }
        }

        .unlockText{
          font-size: 18px;
          color: rgba(255,255,255,0.78);
          max-width: 780px;
          line-height: 1.5;
          padding: 0 8px;
          font-weight: 300;
        }

        .underlineOnly{
          width: min(560px, 90vw);
          background: transparent;
          border: none;
          border-bottom: 2px solid rgba(40,240,255,0.46);
          padding: 18px 10px 12px;
          color: rgba(255,255,255,0.94);
          font-size: 22px;
          font-weight: 500;
          text-align: center;
          outline: none;
          caret-color: rgba(40,240,255,0.95);
          transition: border-color 250ms ease, box-shadow 250ms ease;
        }

        .underlineOnly:focus{
          border-bottom-color: rgba(40,240,255,0.92);
          box-shadow: 0 14px 34px rgba(40,240,255,0.12);
        }

        /* Pages 3–5 */
        .pX{
          min-height:100vh;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          padding: 34px 18px 84px;
          background:#000;
          text-align:center;
        }

        .arcSmall{
          width: 150px;
          height: 150px;
          border-radius: 999px;
          border: 1.8px solid rgba(0,255,255,0.33);
          margin: 0 auto 18px;
          box-shadow: 0 0 22px rgba(0,255,255,0.20);
          animation: corePulse 3.8s ease-in-out infinite;
          position: relative;
          display:flex;
          align-items:center;
          justify-content:center;
          overflow:hidden;
        }

        .arcSmall::before{
          content:"";
          position:absolute;
          inset:-60%;
          background: radial-gradient(circle, rgba(0,255,255,0.14), transparent 55%);
          transform: rotate(18deg);
          opacity: 0.85;
          animation: slowDrift 10s ease-in-out infinite;
          pointer-events:none;
        }

        .line{
          font-weight: 500;
          font-size: clamp(24px, 5.6vw, 32px);
          max-width: 640px;
          line-height: 1.25;
          margin: 0 auto 14px;
          color: rgba(255,255,255,0.94);
        }

        .whisper{
          margin-top: 10px;
          font-size: 14px;
          color: rgba(255,255,255,0.56);
          max-width: 520px;
          line-height: 1.45;
          font-weight: 300;
        }

        .tinyLink{
          margin-top: 8px;
          font-size: 12px;
          color: rgba(0,255,255,0.55);
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: lowercase;
        }

        @media (prefers-reduced-motion: reduce){
          .p2Fade{ display:none; }
          .scene1Title, .scene1Mean, .scene2Title, .scene2Mean, .scene3Title, .scene3Mean{
            opacity: 0 !important;
            animation: none !important;
          }
          .finalWrap{
            opacity: 1 !important;
            animation: none !important;
            pointer-events: none !important;
          }
          .dock{
            opacity: 1 !important;
            animation: none !important;
            transform: none !important;
          }
          .core, .core::before, .finalBalance, .arcSmall, .arcSmall::before, .balance{
            animation: none !important;
          }
          .rewardLetter{ animation: none !important; }
        }

        @media (max-width: 420px){
          .core{ width: 236px; height: 236px; }
          .emblemLg{ width: 188px; height: 188px; }
          .btn{ width: 100%; max-width: 340px; }
          .arcSmall{ width: 136px; height: 136px; }
        }
      `}</style>

      {/* RECEIVABLE OVERLAY */}
      {rewardOn && rewardLetter ? (
        <div className="rewardOverlay" aria-label="Receivable reward overlay">
          <div className="rewardLetter">{rewardLetter}</div>
          {rewardCopy ? <div className="rewardCopy">{rewardCopy}</div> : null}
        </div>
      ) : null}

      {/* PAGE 1 */}
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

            <button className="btn" type="button" onClick={goToDecode}>
              Start the private decode
            </button>

            <div className="hint">No pressure. No shame. Just clarity.</div>
          </div>
        </main>
      ) : null}

      {/* PAGE 2 */}
      {view === "p2" ? (
        <main className="p2" aria-label="Private decode — Page 2">
          <div className="p2Fade" />

          <div className="p2Wrap">
            <div className="core" aria-label="Cipher core">
              <img
                className="emblemLg"
                src="/brand/cipher-emblem.png"
                alt="BALANCE Cipher Core"
                loading="eager"
                style={{ opacity: 0.92 }}
              />
            </div>

            <div className="stage" aria-label="Cinematic sequence">
              <div className="title scene1Title">Cipher</div>
              <div className="meaning scene1Mean">
                The first human intelligence device built to create and figure out unbreakable codes.
              </div>

              <div className="title scene2Title">Co-Pilot + AI</div>
              <div className="meaning scene2Mean">AI — built to complete once-impossible tasks in seconds.</div>

              <div className="title scene3Title">You</div>
              <div className="meaning scene3Mean">
                You — the most powerful of all three, designed and built around endless potential.
              </div>

              {/* Tightened bracket groups + tightened spacing */}
              <div className="finalWrap" aria-label="Final equation">
                <div className="finalRow tightRow">
                  <span className="finalWord">Cipher</span>
                  <span className="parenGroup" aria-label="Cipher descriptor">
                    <span className="paren">(</span>
                    <span className="parenText">a pattern reader</span>
                    <span className="paren">)</span>
                  </span>

                  <span className="finalSym">+</span>

                  <span className="finalWord">Co-Pilot</span>
                  <span className="parenGroup" aria-label="Co-Pilot descriptor">
                    <span className="paren">(</span>
                    <span className="parenText">AI reader</span>
                    <span className="paren">)</span>
                  </span>

                  <span className="finalSym">+</span>

                  <span className="bracketGroup" aria-label="AI power source term">
                    <span className="bracket">[</span>
                    <span className="bracketText">Your AI Power Source</span>
                    <span className="bracket">]</span>
                  </span>

                  <span className="finalSym">+</span>

                  <span className="finalWord">You</span>
                  <span className="parenGroup" aria-label="You descriptor">
                    <span className="paren">(</span>
                    <span className="parenText">endless potential</span>
                    <span className="paren">)</span>
                  </span>

                  <span className="finalSym">=</span>

                  <span className="finalBalance">BALANCE</span>
                </div>

                <div className="finalLine">This is your AI-powered guide.</div>
              </div>
            </div>
          </div>

          <div className="dock">
            <div className="unlockText">
              To unlock the next step, enter your first name to unlock the start of your journey.
            </div>

            <input
              ref={p2FirstRef}
              className="underlineOnly"
              value={p2First}
              onChange={(e) => setP2First(e.target.value)}
              onKeyDown={(e) => onEnter(e, submitFirstFromP2)}
              aria-label="First name"
              autoComplete="given-name"
              placeholder=""
              disabled={rewardOn}
            />
          </div>
        </main>
      ) : null}

      {/* PAGE 3 — STEP 3 (one move) */}
      {view === "p3" ? (
        <main className="pX" aria-label="Private decode — Page 3">
          <div className="arcSmall" aria-label="Cipher core" />
          <div className="line">Does it feel good to finally break free?</div>

          <input
            ref={lastRef}
            className="underlineOnly"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onKeyDown={(e) => onEnter(e, submitLast)}
            aria-label="Last name"
            autoComplete="family-name"
            placeholder=""
            disabled={rewardOn}
          />

          <div className="whisper">Enter confirms. No noise.</div>
        </main>
      ) : null}

      {/* PAGE 4 — STEP 4 (email / L receivable on submit) */}
      {view === "p4" ? (
        <main className="pX" aria-label="Private decode — Page 4">
          <div className="arcSmall" aria-label="Cipher core" />
          <div className="line">Where do you want the full map delivered?</div>

          <input
            ref={emailRef}
            className="underlineOnly"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => onEnter(e, submitEmail)}
            aria-label="Email"
            autoComplete="email"
            inputMode="email"
            placeholder=""
            disabled={rewardOn}
          />

          <div className="whisper">Enter confirms. No noise.</div>
          <div className="tinyLink">balancecipher.com/info</div>
        </main>
      ) : null}

      {/* PAGE 5 */}
      {view === "p5" ? (
        <main className="pX" aria-label="Private decode — Page 5">
          <div className="arcSmall" aria-label="Final gate" />
          <div className="line">You brought the key.</div>
          <div className="whisper">Paste it below. One time only.</div>

          <input
            ref={codeRef}
            className="underlineOnly"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            onKeyDown={(e) => onEnter(e, submitCode)}
            aria-label="Private cipher code"
            autoComplete="one-time-code"
            placeholder=""
            disabled={rewardOn}
          />

          <div className="whisper">First 500 get Chapter One instantly. Everyone else waits 72 hours.</div>
          <div className="tinyLink">balancecipher.com/info</div>

          <div className="whisper" style={{ marginTop: 14 }}>
            Preview code (temporary):{" "}
            <strong style={{ fontWeight: 700 }}>
              {accessCode || "(generated after email entry)"}
            </strong>
          </div>
        </main>
      ) : null}
    </>
  );
}
