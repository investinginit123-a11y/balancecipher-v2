import React from "react";
import ReactDOM from "react-dom/client";

console.log("[BALANCE DIAG] main.tsx loaded");

// Lazy-load App so import-time failures become catchable and visible.
const LazyApp = React.lazy(() => import("./App"));

type EBState = { error: Error | null; info: React.ErrorInfo | null };

class RootErrorBoundary extends React.Component<{ children: React.ReactNode }, EBState> {
  state: EBState = { error: null, info: null };

  static getDerivedStateFromError(error: Error) {
    return { error, info: null };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[BALANCE DIAG] RootErrorBoundary caught:", error, info);
    this.setState({ error, info });
  }

  render() {
    if (this.state.error) {
      const msg = this.state.error?.message || "(no error message)";
      const stack = this.state.error?.stack || "(no stack)";
      const comp = this.state.info?.componentStack || "";

      return (
        <div
          style={{
            minHeight: "100vh",
            padding: 20,
            background: "#0b0f14",
            color: "#e8eef6",
            fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, sans-serif',
            textAlign: "left",
          }}
        >
          <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            BALANCE — Mount/Runtime Error
          </div>

          <p style={{ marginTop: 10, opacity: 0.9 }}>
            Your bundle loaded, but React crashed while rendering. Copy/paste the details below into chat.
          </p>

          <div style={{ marginTop: 12, padding: 12, border: "1px solid rgba(40,240,255,0.35)", borderRadius: 12 }}>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>Error message</div>
            <pre style={{ whiteSpace: "pre-wrap", margin: 0, fontSize: 13, lineHeight: 1.4 }}>{msg}</pre>

            <div style={{ fontWeight: 800, marginTop: 12, marginBottom: 6 }}>Stack</div>
            <pre style={{ whiteSpace: "pre-wrap", margin: 0, fontSize: 12, lineHeight: 1.35, opacity: 0.9 }}>
              {stack}
            </pre>

            {comp ? (
              <>
                <div style={{ fontWeight: 800, marginTop: 12, marginBottom: 6 }}>Component stack</div>
                <pre style={{ whiteSpace: "pre-wrap", margin: 0, fontSize: 12, lineHeight: 1.35, opacity: 0.9 }}>
                  {comp}
                </pre>
              </>
            ) : null}
          </div>

          <p style={{ marginTop: 12, fontSize: 13, opacity: 0.75 }}>
            Console proof should also show: <strong>[BALANCE DIAG] main.tsx loaded</strong>
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

function ensureRootEl(): HTMLElement {
  let el = document.getElementById("root");
  if (!el) {
    // If root is missing, create it so we can render an error screen instead of blank.
    el = document.createElement("div");
    el.id = "root";
    document.body.innerHTML = "";
    document.body.appendChild(el);
  }
  return el;
}

const rootEl = ensureRootEl();
const root = ReactDOM.createRoot(rootEl);

try {
  root.render(
    <React.StrictMode>
      <RootErrorBoundary>
        <React.Suspense
          fallback={
            <div
              style={{
                minHeight: "100vh",
                padding: 20,
                background: "#fff",
                color: "#111",
                fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, sans-serif',
                textAlign: "left",
              }}
            >
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>BALANCE Loading</h1>
              <p style={{ marginTop: 10, lineHeight: 1.5 }}>
                If this gets stuck, the App module may be failing to import or crashing immediately.
              </p>
            </div>
          }
        >
          <LazyApp />
        </React.Suspense>
      </RootErrorBoundary>
    </React.StrictMode>
  );
} catch (err) {
  console.error("[BALANCE DIAG] Fatal mount error (outer try/catch):", err);
  const msg = err instanceof Error ? err.message : String(err);
  root.render(
    <div style={{ minHeight: "100vh", padding: 20, background: "#fff", color: "#111", textAlign: "left" }}>
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>BALANCE Fatal Mount Error</h1>
      <pre style={{ whiteSpace: "pre-wrap", marginTop: 10 }}>{msg}</pre>
    </div>
  );
}
