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

  function goTo(v: View) {
    setView(v);
  }

  function goToDecode() {
    setP2First("");
    goTo("p2");
  }

  function submitFirstFromP2() {
    const fn = safeTrimMax(p2First, 40);
    if (!fn) return;
    setFirstName(fn);
    goTo("p3");
  }

  function submitLast() {
    const ln = safeTrimMax(lastName, 60);
    if (!ln) return;
    setLastName(ln);
    goTo("p4");
  }

  function submitEmail() {
    const em = safeTrimMax(email, 120);
    if (!isValidEmail(em)) return;
    setEmail(em);

    if (!accessCode) setAccessCode(generateAccessCode());
    goTo("p5");
  }

  function submitCode() {
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
    if (view === "p3") setTimeout(() => lastRef.current?.focus(), 50);
    if (view === "p4") setTimeout(() => emailRef.current?.focus(), 50);
    if (view === "p5") setTimeout(() => codeRef.current?.focus(), 50);
  }, [view]);

  // Focus Page 2 input after the full “gift” sequence completes.
  useEffect(() => {
    if (view !== "p2") return;
    const t = setTimeout(() => p2FirstRef.current?.focus(), 26000);
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

        /* PAGE 2 — your “title → meaning → dissolve” rhythm */
        .p2{
          min-height:100vh;
          background:#000;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          padding: 34px 18px 110px;
          position: relative;
          overflow:hidden;
        }

        /* Fade-to-black overlay (0.7s) */
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
          gap: 18px;
          position: relative;
          z-index: 3;
        }

        .stage{
          width: min(740px, 100%);
          min-height: 190px;
          position: relative;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:flex-start;
          gap: 10px;
        }

        @keyframes sceneInOut{
          0%   { opacity:0; transform: translateY(10px); }
          12%  { opacity:1; transform: translateY(0); }
          78%  { opacity:1; transform: translateY(0); }
          100% { opacity:0; transform: translateY(-6px); }
        }

        @keyframes sceneInStay{
          0%   { opacity:0; transform: translateY(10px); }
          100% { opacity:1; transform: translateY(0); }
        }

        .title{
          font-size: clamp(30px, 8vw, 46px);
          font-weight: 950;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.96);
          opacity:0;
        }

        .meaning{
          font-size: 16px;
          font-weight: 450;
          color: rgba(40,240,255,0.62);
          max-width: 720px;
          line-height: 1.55;
          opacity:0;
        }

        .scene1Title { animation: sceneInOut 3.1s ease forwards; animation-delay: 1.6s; }
        .scene1Mean  { animation: sceneInOut 4.2s ease forwards; animation-delay: 4.2s; }

        .scene2Title { animation: sceneInOut 3.1s ease forwards; animation-delay: 9.0s; }
        .scene2Mean  { animation: sceneInOut 4.2s ease forwards; animation-delay: 11.5s; }

        .scene3Title { animation: sceneInOut 3.0s ease forwards; animation-delay: 16.6s; }
        .scene3Mean  { animation: sceneInOut 4.2s ease forwards; animation-delay: 18.9s; }

        /* Final equation locks in and stays */
        .finalWrap{
          position:absolute;
          left:0; right:0;
          top: 0;
          display:flex;
          flex-direction:column;
          align-items:center;
          gap: 12px;
          opacity:0;
          animation: sceneInStay 0.8s ease forwards;
          animation-delay: 24.2s;
          pointer-events:none;
        }

        .finalRow{
          display:flex;
          align-items: baseline;
          justify-content:center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .finalWord{
          font-size: 18px;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.90);
          font-weight: 900;
        }

        .finalSym{
          font-size: 20px;
          color: rgba(255,255,255,0.72);
          font-weight: 950;
        }

        .finalBalance{
          font-size: 26px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 950;
          color: var(--brass);
          text-shadow: 0 0 18px var(--brassGlow);
          padding: 2px 8px;
          border-radius: 10px;
          animation: balancePulse 3.6s ease-in-out infinite;
        }

        .finalLine{
          font-size: 14px;
          color: rgba(40,240,255,0.62);
          line-height: 1.45;
          max-width: 680px;
        }

        /* Bottom unlock prompt + underline input */
        .dock{
          position:absolute;
          left:0; right:0;
          bottom: 42px;
          display:flex;
          flex-direction:column;
          align-items:center;
          gap: 10px;
          opacity:0;
          transform: translateY(22px);
          animation: dockIn 0.55s ease forwards;
          animation-delay: 26.2s;
          z-index: 4;
        }

        @keyframes dockIn{
          to { opacity:1; transform: translateY(0); }
        }

        .unlockText{
          font-size: 14px;
          color: rgba(255,255,255,0.72);
          max-width: 640px;
          line-height: 1.45;
        }

        .underlineOnly{
          width: min(420px, 86vw);
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(40,240,255,0.42);
          padding: 14px 10px 12px;
          color: rgba(255,255,255,0.92);
          font-size: 18px;
          text-align: center;
          outline: none;
          caret-color: rgba(40,240,255,0.95);
          transition: border-color 250ms ease, box-shadow 250ms ease;
        }

        .underlineOnly:focus{
          border-bottom-color: rgba(40,240,255,0.86);
          box-shadow: 0 12px 28px rgba(40,240,255,0.10);
        }

        /* Pages 3–5 baseline */
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
          font-weight: 350;
          font-size: clamp(22px, 5.2vw, 28px);
          max-width: 520px;
          line-height: 1.25;
          margin: 0 auto 14px;
          color: rgba(255,255,255,0.94);
        }

        .whisper{
          margin-top: 10px;
          font-size: 13px;
          color: rgba(255,255,255,0.56);
          max-width: 420px;
          line-height: 1.45;
        }

        .tinyLink{
          margin-top: 8px;
          font-size: 12px;
          color: rgba(0,255,255,0.55);
        }

        /* Reduced motion: show final equation + dock immediately */
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
          .core, .core::before, .finalBalance, .arcSmall, .arcSmall::before{
            animation: none !important;
          }
        }

        @media (max-width: 420px){
          .core{ width: 236px; height: 236px; }
          .emblemLg{ width: 188px; height: 188px; }
          .btn{ width: 100%; max-width: 340px; }
          .arcSmall{ width: 136px; height: 136px; }
        }
      `}</style>

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

      {/* PAGE 2 (your revised vision) */}
      {view === "p2" ? (
        <main className="p2" aria-label="Private decode — Page 2">
          <div className="p2Fade" />

          <div className="p2Wrap">
            {/* Energy Source (stays on screen) */}
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
              {/* Cipher title → dissolve */}
              <div className="title scene1Title">Cipher</div>

              {/* Cipher meaning → dissolve */}
              <div className="meaning scene1Mean">
                The first human intelligence device built to create and figure out unbreakable codes.
              </div>

              {/* Co-Pilot title → dissolve */}
              <div className="title scene2Title">Co-Pilot + AI</div>

              {/* Co-Pilot meaning → dissolve */}
              <div className="meaning scene2Mean">
                AI — built to complete once-impossible tasks in seconds.
              </div>

              {/* You title → dissolve */}
              <div className="title scene3Title">You</div>

              {/* You meaning → dissolve */}
              <div className="meaning scene3Mean">
                You — the most powerful of all three, designed and built around endless potential.
              </div>

              {/* Final equation locks in */}
              <div className="finalWrap" aria-label="Final equation">
                <div className="finalRow">
                  <span className="finalWord">Cipher</span>
                  <span className="finalSym">(</span>
                  <span className="finalWord" style={{ color: "rgba(40,240,255,0.72)" }}>
                    a pattern reader
                  </span>
                  <span className="finalSym">)</span>

                  <span className="finalSym">+</span>

                  <span className="finalWord">Co-Pilot</span>
                  <span className="finalSym">(</span>
                  <span className="finalWord" style={{ color: "rgba(40,240,255,0.72)" }}>
                    your AI power source
                  </span>
                  <span className="finalSym">)</span>

                  <span className="finalSym">=</span>

                  <span className="finalWord" style={{ color: "rgba(255,255,255,0.90)" }}>
                    Your Potential
                  </span>

                  <span className="finalSym">=</span>

                  <span className="finalBalance">BALANCE</span>
                </div>

                <div className="finalLine">This is your AI-powered guide.</div>
              </div>
            </div>
          </div>

          {/* Unlock prompt + first name */}
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
            />
          </div>
        </main>
      ) : null}

      {/* PAGE 3 */}
      {view === "p3" ? (
        <main className="pX" aria-label="Private decode — Page 3">
          <div className="arcSmall" aria-label="Cipher core" />
          <div className="line">Last name. Make it real.</div>

          <input
            ref={lastRef}
            className="underlineOnly"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onKeyDown={(e) => onEnter(e, submitLast)}
            aria-label="Last name"
            autoComplete="family-name"
            placeholder=""
          />

          <div className="whisper">Enter confirms. No noise.</div>
        </main>
      ) : null}

      {/* PAGE 4 */}
      {view === "p4" ? (
        <main className="pX" aria-label="Private decode — Page 4">
          <div className="arcSmall" aria-label="Cipher core" />
          <div className="line">Email — your key arrives here, once.</div>

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
          />

          <div className="whisper">First 500 get Chapter One instantly. Everyone else waits 72 hours.</div>
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
          />

          <div className="whisper">First 500 get Chapter One instantly. Everyone else waits 72 hours.</div>
          <div className="tinyLink">balancecipher.com/info</div>

          <div className="whisper" style={{ marginTop: 14 }}>
            Preview code (temporary): <strong>{accessCode || "(generated after email entry)"}</strong>
          </div>
        </main>
      ) : null}
    </>
  );
}
