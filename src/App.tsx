import React, { useEffect, useMemo, useRef, useState } from "react";

type View = "landing" | "p2" | "p3" | "p4" | "p5";

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
  const [view, setView] = useState<View>("landing");

  // Data capture across funnel
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [accessCode, setAccessCode] = useState<string>("");
  const [codeInput, setCodeInput] = useState<string>("");

  // Shared reduced motion
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  // -----------------------------
  // PAGE 2: Cinematic equation build
  // -----------------------------
  type P2Stage =
    | "fadeInBlack"
    | "arcSilence"
    | "cipherWord"
    | "cipherSub"
    | "pause1"
    | "copilotWord"
    | "copilotSub"
    | "pause2"
    | "youWord"
    | "equalsSign"
    | "balanceWord"
    | "breathe"
    | "input";

  const [p2Stage, setP2Stage] = useState<P2Stage>("fadeInBlack");
  const [p2BlackOn, setP2BlackOn] = useState<boolean>(true);
  const [p2First, setP2First] = useState<string>("");
  const p2FirstRef = useRef<HTMLInputElement | null>(null);

  // Cleanup timers
  const p2Timers = useRef<number[]>([]);

  function clearP2Timers() {
    p2Timers.current.forEach((t) => window.clearTimeout(t));
    p2Timers.current = [];
  }

  useEffect(() => {
    if (view !== "p2") return;

    clearP2Timers();
    setP2First("");
    setP2Stage("fadeInBlack");
    setP2BlackOn(true);

    // If reduced motion: show everything immediately (and show input)
    if (prefersReducedMotion) {
      setP2BlackOn(false);
      setP2Stage("input");
      setTimeout(() => p2FirstRef.current?.focus(), 0);
      return;
    }

    // Spec timing:
    // 1) fade to black 0.7s
    // 2) 0.8s silence, then "Cipher"
    // 3) 1.6s later subline
    // 4) 2.0s pause
    // 5) "Co-Pilot"
    // 6) 1.6s later subline
    // 7) 2.0s pause
    // 8) "+ You"
    // 9) 1.8s later "="
    // 10) 1.2s later "BALANCE"
    // 11) 2.5s breathe
    // 12) input slides up

    const push = (fn: () => void, ms: number) => {
      p2Timers.current.push(window.setTimeout(fn, ms));
    };

    // t=0 already black overlay on.
    // t=700 black overlay fades off (arc now "present")
    push(() => {
      setP2BlackOn(false);
      setP2Stage("arcSilence");
    }, 700);

    // t=1500 show Cipher
    push(() => setP2Stage("cipherWord"), 1500);

    // t=3100 cipher sub
    push(() => setP2Stage("cipherSub"), 3100);

    // t=5100 copilot word
    push(() => setP2Stage("copilotWord"), 5100);

    // t=6700 copilot sub
    push(() => setP2Stage("copilotSub"), 6700);

    // t=8700 + You
    push(() => setP2Stage("youWord"), 8700);

    // t=10500 equals
    push(() => setP2Stage("equalsSign"), 10500);

    // t=11700 balance
    push(() => setP2Stage("balanceWord"), 11700);

    // t=14200 input
    push(() => {
      setP2Stage("input");
      setTimeout(() => p2FirstRef.current?.focus(), 150);
    }, 14200);

    return () => clearP2Timers();
  }, [view, prefersReducedMotion]);

  function goTo(v: View) {
    // Clear page-2 timers so they don’t bleed
    clearP2Timers();
    setView(v);
  }

  function goToDecodePage() {
    goTo("p2");
  }

  function submitFirstNameFromP2() {
    const fn = safeTrimMax(p2First, 40);
    if (!fn) return; // no labels, no nagging
    setFirstName(fn);
    goTo("p3");
  }

  function onKeyDownP2(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submitFirstNameFromP2();
    }
  }

  // -----------------------------
  // Pages 3–5 (kept functional; we can cinematic-upgrade next)
  // -----------------------------
  const lastRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const codeRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (view === "p3") setTimeout(() => lastRef.current?.focus(), prefersReducedMotion ? 0 : 200);
    if (view === "p4") setTimeout(() => emailRef.current?.focus(), prefersReducedMotion ? 0 : 200);
    if (view === "p5") setTimeout(() => codeRef.current?.focus(), prefersReducedMotion ? 0 : 200);
  }, [view, prefersReducedMotion]);

  function canContinueP3() {
    return lastName.trim().length > 0;
  }
  function canContinueP4() {
    return isValidEmail(email);
  }
  function canContinueP5() {
    const expected = accessCode.trim().toUpperCase();
    const entered = codeInput.trim().toUpperCase();
    if (!expected) return entered.length > 0;
    return entered.length > 0 && entered === expected;
  }

  function continueFromP3() {
    if (!canContinueP3()) return;
    goTo("p4");
  }
  function continueFromP4() {
    if (!canContinueP4()) return;
    if (!accessCode) setAccessCode(generateAccessCode());
    goTo("p5");
  }
  function continueFromP5() {
    if (!canContinueP5()) return;
    // Final "welcome" moment: for now, just route to info
    window.location.href = "https://balancecipher.com/info";
  }

  function onKeyDownGeneric(
    e: React.KeyboardEvent<HTMLInputElement>,
    action: () => void
  ) {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  }

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

        /* PAGE 2 cinematic */
        .p2{
          min-height:100vh;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          padding: 34px 18px 84px;
          background: #000;
          position: relative;
          overflow: hidden;
        }

        .p2Black{
          position:absolute;
          inset:0;
          background:#000;
          opacity: 1;
          transition: opacity 700ms ease;
          pointer-events:none;
          z-index: 20;
        }
        .p2Black.off{ opacity: 0; }

        .p2CoreWrap{
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          gap: 18px;
          position: relative;
          z-index: 5;
        }

        .p2Words{
          width: min(620px, 100%);
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          gap: 10px;
          min-height: 168px;
        }

        .bigWord{
          font-size: clamp(30px, 8vw, 44px);
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.96);
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 520ms ease, transform 520ms ease;
        }
        .bigWord.show{
          opacity: 1;
          transform: translateY(0);
        }

        .subLine{
          font-size: 16px;
          font-weight: 400;
          color: rgba(40,240,255,0.60);
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 520ms ease, transform 520ms ease;
          margin-top: -6px;
        }
        .subLine.show{
          opacity: 1;
          transform: translateY(0);
        }

        .p2InlineRow{
          display:flex;
          align-items:center;
          justify-content:center;
          gap: 12px;
          flex-wrap: wrap;
          min-height: 48px;
        }

        .eqSymBig{
          font-size: clamp(28px, 7vw, 40px);
          font-weight: 900;
          color: rgba(255,255,255,0.88);
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 520ms ease, transform 520ms ease;
        }
        .eqSymBig.show{
          opacity: 1;
          transform: translateY(0);
        }

        /* Input dock: no label, no placeholder, underline only */
        .p2Dock{
          position:absolute;
          left:0; right:0;
          bottom: 38px;
          display:flex;
          justify-content:center;
          opacity: 0;
          transform: translateY(26px);
          transition: opacity 520ms ease, transform 520ms ease;
          z-index: 10;
          pointer-events:none;
        }
        .p2Dock.show{
          opacity: 1;
          transform: translateY(0);
          pointer-events:auto;
        }

        .underlineOnly{
          width: min(420px, 86vw);
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(40,240,255,0.40);
          padding: 14px 10px 12px;
          color: rgba(255,255,255,0.92);
          font-size: 18px;
          text-align: center;
          outline: none;
          caret-color: rgba(40,240,255,0.95);
          transition: border-color 250ms ease, box-shadow 250ms ease;
        }
        .underlineOnly:focus{
          border-bottom-color: rgba(40,240,255,0.80);
          box-shadow: 0 12px 28px rgba(40,240,255,0.10);
        }

        /* Pages 3–5 (basic) */
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
        .line{
          font-weight: 300;
          font-size: clamp(22px, 5.2vw, 28px);
          margin: 18px auto 12px;
          max-width: 420px;
          line-height: 1.25;
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
        .btn2{
          margin-top: 16px;
          padding: 15px 22px;
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          background: transparent;
          border: 1.8px solid rgba(0,255,255,0.70);
          border-radius: 999px;
          cursor: pointer;
        }
        .btn2:disabled{ opacity:0.45; cursor:not-allowed; }
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

        @media (prefers-reduced-motion: reduce){
          .core, .core::before, .balance{ animation: none !important; }
          .p2Black, .bigWord, .subLine, .eqSymBig, .p2Dock{
            transition: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      {/* PAGE 1 *
