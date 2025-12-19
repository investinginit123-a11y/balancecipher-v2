import React from "react";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050B18",
        color: "rgba(255,255,255,0.92)",
        padding: 22,
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 920,
          margin: "0 auto",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 18,
          background: "rgba(255,255,255,0.04)",
          padding: 18,
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "8px 10px",
            borderRadius: 999,
            background: "rgba(0,255,220,0.10)",
            border: "1px solid rgba(0,255,220,0.25)",
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            fontSize: 12,
            marginBottom: 12,
          }}
        >
          BALANCE Cipher V2
        </div>

        <h1 style={{ margin: "0 0 10px", fontSize: 34, lineHeight: 1.1 }}>
          Baseline Home Page
        </h1>

        <p style={{ margin: 0, lineHeight: 1.6, color: "rgba(255,255,255,0.78)" }}>
          If you can see this on Vercel, the project is building correctly. Next step is to replace this file with your
          full BALANCE Cipher V2 landing page code.
        </p>
      </div>
    </main>
  );
}

