import React, { useEffect, useMemo, useRef, useState } from "react";

export default function App() {
  const [showReward, setShowReward] = useState(false);
  const rewardRef = useRef<HTMLDivElement | null>(null);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useEffect(() => {
    if (!showReward) return;
    if (!rewardRef.current) return;

    try {
      rewardRef.current.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    } catch {
      // no-op
    }
  }, [showReward, prefersReducedMotion]);

  function handlePrimaryClick() {
    setShowReward(true);
  }

  return (
    <>
      <style>{`
        :root{
          --bg0:#050b14;
          --bg1:#061a2b;

          --teal:#28f0ff;
          --tealSoft: rgba(40, 240, 255, 0.18);
          --tealGlow: rgba(40, 240, 255, 0.35);

          /* Brass / Gold accent */
          --brass:#d7b06b;
          --brassGlow: rgba(215, 176, 107, 0.32);

          --text:#ffffff;
          --muted: rgba(255,255,255,0.72);
          --muted2: rgba(255,255,255,0.58);

          --radius: 28px;
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
        }

        .page{
          min-height:100vh;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          text-align:center;
          padding: 28px 18px 52px;
        }

        .wrap{
          width: min(760px, 100%);
          margin: 0 auto;
          display:flex;
          flex-direction:column;
          align-items:center;
          gap: 18px;
        }

        .cipherContainer{
          margin-bottom: 10px;
          opacity: 0;
          transform: translateY(14px);
          animation: fadeInUp 520ms ease-out forwards;
        }

        /* Emblem size (already +25%) */
        .cipherEmblem{
          width: 275px;
          height: 275px;
          border-radius: 999px;
          display:flex;
          align-items:center;
          justify-content:center;
          background: radial-gradient(circle, rgba(40,240,255,0.18), transparent 68%);
          box-shadow:
            0 0 62px rgba(40,240,255,0.20),
            inset 0 0 28px rgba(40,240,255,0.14);
          position: relative;
          overflow: hidden;
          animation: corePulse 3.8s ease-in-out infinite;
        }

        .cipherEmblem::before{
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

        .cipherImg{
          width: 220px;
          height: 220px;
          object-fit: contain;
          filter: drop-shadow(0 0 20px rgba(40,240,255,0.60));
          position: relative;
          z-index: 1;
        }

        /* Equation row: Cipher + Co-Pilot + You = BALANCE */
        .equationRow{
          display:flex;
          align-items: baseline;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 8px;
          margin-bottom: 6px;

          opacity: 0;
          transform: translateY(10px);
          animation: fadeInUp 600ms ease-out forwards;
          animation-delay: 260ms;
        }

        .equationText{
          font-size: 16px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--brass);
          text-shadow: 0 0 14px var(--brassGlow);
          font-weight: 700;
        }

        .equationSymbol{
          font-size: 18px;
          color: rgba(255,255,255,0.80);
          letter-spacing: 0.05em;
          font-weight: 800;
        }

        /* BALANCE as the "alive" result */
        .balanceWord{
          font-size: 22px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 900;
          color: var(--brass);
          text-shadow:
            0 0 18px var(--brassGlow),
            0 0 34px rgba(40,240,255,0.14);
          padding: 2px 6px;
          border-radius: 10px;
          position: relative;
          animation: balancePulse 3.6s ease-in-out infinite;
        }

        .tagline{
          font-size: clamp(22px, 4.6vw, 32px);
          font-weight: 320;
          line-height: 1.25;
          color: rgba(255,255,255,0.92);
          margin: 0;
          opacity: 0;
          transform: translateY(14px);
        }

        .t1{ animation: fadeInUp 720ms ease-out forwards; animation-delay: 740ms; }
        .t2{ animation: fadeInUp 720ms ease-out forwards; animation-delay: 2200ms; }
        .t3{ animation: fadeInUp 720ms ease-out forwards; animation-delay: 3600ms; }

        .sub{
          width: min(640px, 100%);
          margin: 6px auto 0;
          color: var(--muted);
          font-size: clamp(14px, 3.6vw, 16px);
          line-height: 1.55;
          opacity: 0;
          transform: translateY(12px);
          animation: fadeInUp 720ms ease-out forwards;
          animation-delay: 4700ms;
        }

        .cornerstone{
          margin-top: 10px;
          font-size: 15px;
          color: rgba(255,255,255,0.86);
          opacity: 0;
          transform: translateY(12px);
          animation: fadeInUp 720ms ease-out forwards;
          animation-delay: 5050ms;
        }

        .cornerstone strong{
          color: rgba(255,255,255,0.95);
          font-weight: 650;
        }

        .ctaRow{
          margin-top: 22px;
          opacity: 0;
          transform: translateY(14px);
          animation: fadeInUp 760ms ease-out forwards;
          animation-delay: 5600ms;
        }

        .btn{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding: 16px 22px;
          border-radius: 999px;
          border: 1.5px solid rgba(40,240,255,0.75);
          color: rgba(255,255,255,0.96);
          background: linear-gradient(180deg, rgba(40,240,255,0.08), rgba(40,240,255,0.03));
          box-shadow:
            0 0 24px rgba(40,240,255,0.18),
            0 12px 30px rgba(0,0,0,0.35);
          cursor:pointer;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.01em;
          transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
          position: relative;
          overflow: hidden;
          text-decoration:none;
          max-width: min(560px, 100%);
          line-height: 1.2;
          text-align:center;
        }

        .btn::after{
          content:"";
          position:absolute;
          inset:0;
          background: linear-gradient(120deg, transparent 0%, rgba(40,240,255,0.22) 30%, transparent 60%);
          transform: translateX(-120%);
          animation: shimmer 2.8s ease-in-out infinite;
          pointer-events:none;
        }

        .btn:hover{
          transform: translateY(-1px);
          box-shadow:
            0 0 34px rgba(40,240,255,0.28),
            0 14px 34px rgba(0,0,0,0.42);
          background: linear-gradient(180deg, rgba(40,240,255,0.12), rgba(40,240,255,0.04));
        }

        .btn:active{
          transform: translateY(0px) scale(0.99);
        }

        .ctaHint{
          margin-top: 10px;
          font-size: 13px;
          color: rgba(255,255,255,0.60);
        }

        .rewardSpacer{ height: 64px; }

        .reward{
          width: min(900px, 100%);
          margin: 0 auto;
          padding: 22px 18px 70px;
          display: ${showReward ? "block" : "none"};
        }

        .rewardCard{
          border-radius: var(--radius);
          background:
            radial-gradient(600px 400px at 30% 10%, rgba(40,240,255,0.10), transparent 55%),
            linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03));
          border: 1px solid rgba(255,255,255,0.10);
          box-shadow:
            0 0 30px rgba(40,240,255,0.12),
            0 18px 50px rgba(0,0,0,0.35);
          padding: 22px 18px;
          text-align: left;
        }

        .rewardTitle{
          margin: 0 0 8px 0;
          font-size: 22px;
          letter-spacing: 0.01em;
        }

        .rewardP{
          margin: 0 0 10px 0;
          color: var(--muted);
          line-height: 1.55;
          font-size: 15px;
        }

        .formRow{
          display:flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 14px;
        }

        .input{
          width: 100%;
          padding: 14px 14px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(0,0,0,0.22);
          color: rgba(255,255,255,0.94);
          outline: none;
          font-size: 16px;
        }

        .input::placeholder{ color: rgba(255,255,255,0.50); }

        .miniBtn{
          width: 100%;
          padding: 14px 16px;
          border-radius: 14px;
          border: 1.5px solid rgba(40,240,255,0.65);
          background: rgba(40,240,255,0.08);
          color: rgba(255,255,255,0.96);
          font-weight: 750;
          cursor: pointer;
          transition: transform 160ms ease, box-shadow 160ms ease;
          box-shadow: 0 0 22px rgba(40,240,255,0.14);
        }

        .miniBtn:hover{
          transform: translateY(-1px);
          box-shadow: 0 0 30px rgba(40,240,255,0.22);
        }

        .foot{
          margin-top: 14px;
          font-size: 13px;
          color: rgba(255,255,255,0.56);
        }

        @keyframes fadeInUp{
          from{ opacity: 0; transform: translateY(14px); }
          to{ opacity: 1; transform: translateY(0); }
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

        @keyframes balancePulse{
          0%, 100%{
            transform: scale(1.00);
            text-shadow:
              0 0 16px rgba(215,176,107,0.26),
              0 0 30px rgba(40,240,255,0.10);
            opacity: 0.92;
          }
          50%{
            transform: scale(1.06);
            text-shadow:
              0 0 22px rgba(215,176,107,0.42),
              0 0 44px rgba(40,240,255,0.16);
            opacity: 1;
          }
        }

        @keyframes slowDrift{
          0%, 100%{ transform: translate(-2%, -1%) rotate(12deg); opacity: 0.72; }
          50%{ transform: translate(2%, 1%) rotate(18deg); opacity: 0.90; }
        }

        @keyframes shimmer{
          0%{ transform: translateX(-120%); opacity: 0.0; }
          15%{ opacity: 0.8; }
          45%{ opacity: 0.6; }
          100%{ transform: translateX(120%); opacity: 0.0; }
        }

        /* Mobile tuning */
        @media (max-width: 420px){
          .cipherEmblem{ width: 236px; height: 236px; }
          .cipherImg{ width: 188px; height: 188px; }
          .equationText{ font-size: 15px; }
          .equationSymbol{ font-size: 17px; }
          .balanceWord{ font-size: 20px; }
          .btn{ padding: 15px 18px; font-size: 15px; }
        }

        /* Reduced motion: show everything immediately, no movement */
        @media (prefers-reduced-motion: reduce){
          .cipherContainer, .equationRow, .tagline, .sub, .cornerstone, .ctaRow{
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .cipherEmblem{ animation: none !important; }
          .cipherEmblem::before{ animation: none !important; }
          .btn::after{ animation: none !important; }
          .balanceWord{ animation: none !important; }
        }
      `}</style>

      <main className="page">
        <div className="wrap">
          <div className="cipherContainer" aria-label="Cipher core">
            <div className="cipherEmblem">
              <img className="cipherImg" src="/brand/cipher-emblem.png" alt="BALANCE Cipher Core" loading="eager" />
            </div>
          </div>

          <div className="equationRow" aria-label="Cipher equation">
            <span className="equationText">Cipher</span>
            <span className="equationSymbol">+</span>
            <span className="equationText">Co-Pilot</span>
            <span className="equationSymbol">+</span>
            <span className="equationText">You</span>
            <span className="equationSymbol">=</span>
            <span className="balanceWord">BALANCE</span>
          </div>

          <p className="tagline t1">You don’t have to explain anything.</p>
          <p className="tagline t2">You just choose one step.</p>
          <p className="tagline t3">The Co-Pilot uses the Cipher to make it simple.</p>

          <div className="sub">
            This isn’t hype. It’s a guided decode. The Cipher shows the pattern. The AI Co-Pilot turns it into clear
            actions, using the BALANCE Formula. You stay in control the whole time.
          </div>

          <div className="cornerstone">
            <strong>Are you ready to start decoding?</strong>
          </div>

          <div className="ctaRow">
            <button className="btn" type="button" onClick={handlePrimaryClick}>
              Start the private decode
            </button>
            <div className="ctaHint">No pressure. No shame. Just clarity.</div>
          </div>
        </div>
      </main>

      <div className="rewardSpacer" />

      <section className="reward" ref={rewardRef} aria-live="polite">
        <div className="rewardCard">
          <h2 className="rewardTitle">Welcome. You’re in.</h2>
          <p className="rewardP">
            You’re seeing the BALANCE Cipher in its early form. If you want private access when the first chapter
            opens, drop your phone number below.
          </p>
          <p className="rewardP">The Co-Pilot will guide you step-by-step. The Cipher stays the map.</p>

          <div className="formRow">
            <input className="input" type="tel" placeholder="Your phone number" inputMode="tel" />
            <button
              className="miniBtn"
              type="button"
              onClick={() => {
                alert("Captured. Next: connect this to your form or SMS tool.");
              }}
            >
              Lock in my spot
            </button>
          </div>

          <div className="foot">Chapter 1 awakens soon. When it does, you’ll know exactly what to do next.</div>
        </div>
      </section>
    </>
  );
}
