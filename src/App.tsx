<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Final Gate | Page 4</title>
    <style>
      :root{
        --bg:#000;
        --midnight:#06101a;
        --cyan: rgba(0,255,255,1);
        --cyanSoft: rgba(0,255,255,.55);
        --cyanFaint: rgba(0,255,255,.25);
        --white: rgba(255,255,255,1);
        --warmWhite: rgba(255,248,235,.96);
        --gray: rgba(255,255,255,.45);
        --whisper: rgba(255,255,255,.55);
      }

      *{ margin:0; padding:0; box-sizing:border-box; }
      html,body{ height:100%; background:var(--bg); }
      body{
        font-family: "Helvetica Neue", Arial, sans-serif;
        color: var(--white);
        overflow:hidden;
      }

      /* Stage */
      .stage{
        position:relative;
        height:100vh;
        width:100vw;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        background: var(--bg);
      }

      /* Slow “room expands” gradient for the welcome state */
      .stage.welcome{
        animation: roomExpand 3.8s ease forwards;
      }
      @keyframes roomExpand{
        0%{
          background: #000;
        }
        100%{
          background: radial-gradient(circle at 50% 40%, rgba(0,255,255,.05), transparent 55%),
                      radial-gradient(circle at 50% 60%, rgba(0,255,255,.03), transparent 58%),
                      #000;
          background-color: var(--midnight);
        }
      }

      /* Initial blackout */
      .blackout{
        position:absolute;
        inset:0;
        background:#000;
        opacity:1;
        pointer-events:none;
        transition: opacity 600ms ease;
        z-index: 50;
      }
      .blackout.hide{
        opacity:0;
      }
      .blackout.full{
        opacity:1;
      }

      /* Center stack */
      .center{
        width:min(720px, 92vw);
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        text-align:center;
        gap:14px;
        padding: 22px 14px;
        z-index: 10;
      }

      /* Arc */
      .arc{
        width:55px;
        height:55px;
        border-radius:999px;
        position:relative;
        opacity:0;
        transform: translateY(8px);
        transition: opacity 700ms ease, transform 700ms ease;
      }
      .arc.show{
        opacity:1;
        transform: translateY(0);
      }

      /* White core + razor-thin cyan ring */
      .arc::before{
        content:"";
        position:absolute;
        inset:10px;
        border-radius:999px;
        background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,.86) 55%, rgba(255,255,255,.0) 75%);
        filter: blur(.2px);
      }
      .arc::after{
        content:"";
        position:absolute;
        inset:0;
        border-radius:999px;
        border: 1px solid rgba(0,255,255,.55);
        box-shadow: 0 0 18px rgba(0,255,255,.18);
      }

      /* One-time unlock pulse */
      .arc.unlockPulse{
        animation: unlockPulse 1.35s ease-in-out 1;
      }
      @keyframes unlockPulse{
        0%   { box-shadow: 0 0 10px rgba(255,255,255,.10); }
        45%  { box-shadow: 0 0 34px rgba(0,255,255,.22); }
        100% { box-shadow: 0 0 14px rgba(0,255,255,.14); }
      }

      /* Flare on submit: white → cyan → white in 400ms */
      .arc.flare{
        animation: flare 400ms ease-out 1;
      }
      @keyframes flare{
        0%   { filter:none; }
        33%  { box-shadow: 0 0 55px rgba(255,255,255,.55); }
        66%  { box-shadow: 0 0 75px rgba(0,255,255,.60); }
        100% { box-shadow: 0 0 24px rgba(255,255,255,.25); }
      }

      /* Warm arc for welcome */
      .arc.warm::before{
        background: radial-gradient(circle, rgba(255,248,235,1) 0%, rgba(255,248,235,.85) 55%, rgba(255,248,235,0) 75%);
      }
      .arc.warm::after{
        border-color: rgba(0,255,255,.40);
        box-shadow: 0 0 16px rgba(0,255,255,.14);
      }
      .arc.warmRipple::after{
        box-shadow: 0 0 16px rgba(0,255,255,.14);
      }
      .arc.warmRipple > .ripple{
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

      /* Lines */
      .line{
        opacity:0;
        transform: translateY(10px);
        transition: opacity 900ms ease, transform 800ms ease;
        text-shadow: 0 0 18px rgba(0,255,255,.08);
      }
      .line.show{
        opacity:1;
        transform: translateY(0);
      }
      .l1{ font-size:24px; font-weight:300; letter-spacing:.1px; }
      .l2{ font-size:19px; font-weight:300; color: rgba(255,255,255,.78); }

      /* Input dock */
      .dock{
        position:absolute;
        left:0; right:0;
        bottom: 74px;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        gap:10px;
        opacity:0;
        transform: translateY(32px);
        transition: opacity 800ms ease, transform 800ms ease;
        pointer-events:none;
        z-index: 20;
      }
      .dock.show{
        opacity:1;
        transform: translateY(0);
        pointer-events:auto;
      }

      .codeInput{
        width: min(280px, 90vw);
        background: transparent;
        border: none;
        border-bottom: 1px solid rgba(0,255,255,.25);
        padding: 14px 10px 12px;
        color: rgba(255,255,255,.92);
        font-size: 18px;
        text-align:center;
        outline:none;
        caret-color: rgba(0,255,255,.9);
        transition: border-color 250ms ease, box-shadow 250ms ease;
      }
      .codeInput::placeholder{
        color: rgba(255,255,255,.33);
      }
      .codeInput:focus{
        border-bottom-color: rgba(0,255,255,.65);
        box-shadow: 0 12px 28px rgba(0,255,255,.10);
      }

      .whisper{
        font-size:14px;
        font-weight:300;
        color: var(--whisper);
        opacity: .95;
      }

      /* Welcome state */
      .welcomeBlock{
        display:none;
        width:min(760px, 92vw);
        text-align:center;
        z-index: 15;
      }
      .welcomeBlock.show{
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        gap: 14px;
      }
      .welcomeLine{
        font-size:26px;
        font-weight:300;
        letter-spacing:.1px;
        color: var(--warmWhite);
        text-shadow: 0 0 16px rgba(0,255,255,.08);
      }

      .openBtn{
        margin-top: 6px;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:10px;
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
      .openBtn:active{
        transform: translateY(1px);
      }
      .openSub{
        font-size:12px;
        color: rgba(0,255,255,.50);
        margin-top: -8px;
      }

      /* Utility */
      .hidden{ display:none !important; }

      @media (prefers-reduced-motion: reduce){
        .corePulse, .arc.unlockPulse, .arc.flare, .stage.welcome{ animation:none !important; }
        .line, .dock, .arc, .blackout { transition:none !important; transform:none !important; }
      }
    </style>
  </head>

  <body>
    <div class="stage" id="stage">
      <div class="blackout" id="blackout"></div>

      <!-- Gate content -->
      <div class="center" id="gate">
        <div class="arc" id="arc" aria-hidden="true"></div>

        <div class="line l1" id="line1">You brought the key</div>
        <div class="line l2" id="line2">Paste it below. One time only.</div>
      </div>

      <div class="dock" id="dock">
        <input
          id="code"
          class="codeInput"
          type="text"
          inputmode="text"
          autocomplete="one-time-code"
          placeholder="your private cipher code"
          aria-label="Private cipher code"
        />
        <div class="whisper">First 500 get Chapter One instantly. Everyone else waits 72 hours.</div>
      </div>

      <!-- Welcome content -->
      <div class="welcomeBlock" id="welcome">
        <div class="welcomeLine" id="welcomeLine">Welcome home</div>

        <div class="arc warm warmRipple show" id="arcWarm" aria-hidden="true">
          <div class="ripple" aria-hidden="true"></div>
        </div>

        <a class="openBtn" id="openBtn" href="https://balancecipher.com/info">
          Open the Balance Formula
        </a>
        <div class="openSub">balancecipher.com/info</div>
      </div>
    </div>

    <script>
      // Optional personalization:
      // - Provide ?name=Brian in the URL, or
      // - Store localStorage.setItem("balancecipher_firstName","Brian")
      function getFirstName() {
        try {
          const url = new URL(window.location.href);
          const q = (url.searchParams.get("name") || "").trim();
          if (q) return q;
          const s = (localStorage.getItem("balancecipher_firstName") || "").trim();
          return s;
        } catch {
          return "";
        }
      }

      const stage = document.getElementById("stage");
      const blackout = document.getElementById("blackout");
      const arc = document.getElementById("arc");
      const line1 = document.getElementById("line1");
      const line2 = document.getElementById("line2");
      const dock = document.getElementById("dock");
      const input = document.getElementById("code");

      const welcome = document.getElementById("welcome");
      const welcomeLine = document.getElementById("welcomeLine");

      let hasSubmitted = false;

      // 1) Pure black for 0.8s
      setTimeout(() => {
        // Reveal arc
        arc.classList.add("show");
        arc.classList.add("unlockPulse");

        // Fade in line 1 shortly after arc appears
        setTimeout(() => line1.classList.add("show"), 260);

        // 1.2 seconds later, line 2
        setTimeout(() => line2.classList.add("show"), 260 + 1200);

        // Then input slides up from bottom
        setTimeout(() => {
          dock.classList.add("show");
          // Cursor already blinking
          input.focus();
        }, 260 + 1200 + 520);

        // Remove blackout
        blackout.classList.add("hide");
      }, 800);

      function dissolveToBlackThenWelcome() {
        // Arc flares white → cyan → white in 400ms
        arc.classList.add("flare");

        // Entire screen dissolves to black for 0.6s
        blackout.classList.remove("hide");
        blackout.classList.add("full");

        setTimeout(() => {
          // Switch to welcome state
          stage.classList.add("welcome");

          // Hide gate elements
          line1.classList.remove("show");
          line2.classList.remove("show");
          dock.classList.remove("show");
          arc.classList.add("hidden");

          // Welcome text with name (if available)
          const name = getFirstName();
          welcomeLine.textContent = name ? `Welcome home, ${name}.` : "Welcome home.";

          welcome.classList.add("show");

          // Fade blackout out to reveal the expanded room
          setTimeout(() => {
            blackout.classList.add("hide");
            blackout.classList.remove("full");
          }, 120);
        }, 600);
      }

      function trySubmit() {
        if (hasSubmitted) return;

        const v = (input.value || "").trim();
        if (!v) return;

        hasSubmitted = true;

        // Immediately trigger the transition
        dissolveToBlackThenWelcome();
      }

      // Enter submits
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          trySubmit();
        }
      });

      // “tap anywhere” behavior: if code exists and user taps outside input, submit
      document.addEventListener("pointerdown", (e) => {
        if (hasSubmitted) return;
        if (!input) return;
        const v = (input.value || "").trim();
        if (!v) return;

        // If they tap anywhere (including outside), treat as confirm.
        // If you want “only outside input”, uncomment the next two lines:
        // if (e.target === input) return;
        // if (input.contains(e.target)) return;

        trySubmit();
      });
    </script>
  </body>
</html>
