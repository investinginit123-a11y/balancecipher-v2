import { NextResponse } from "next/server";

export const runtime = "nodejs";

function maskSsnInAnyShape(value: any): any {
  // Masks SSN anywhere it appears as `ssn` field (string)
  if (value && typeof value === "object") {
    if (Array.isArray(value)) return value.map(maskSsnInAnyShape);

    const out: any = {};
    for (const [k, v] of Object.entries(value)) {
      if (k.toLowerCase() === "ssn" && typeof v === "string") {
        const last4 = v.replace(/\D/g, "").slice(-4);
        out[k] = last4 ? `***-**-${last4}` : "***-**-****";
      } else {
        out[k] = maskSsnInAnyShape(v);
      }
    }
    return out;
  }
  return value;
}

function withCors(res: NextResponse) {
  // Safe defaults. Same-origin calls don’t need this, but it prevents weirdness if you ever POST cross-origin.
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, X-API-Key");
  return res;
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function POST(req: Request) {
  const t0 = Date.now();

  // Canon env vars for this template:
  const baseUrl = process.env.REPLIT_CRM_BASE_URL; // e.g. https://crm.bastiansauto.com
  const apiKey = process.env.REPLIT_NP_API_KEY;
  const debugOn = (process.env.CRM_RELAY_DEBUG || "").toLowerCase() === "true";

  if (!baseUrl) {
    return withCors(
      NextResponse.json(
        { ok: false, error: "Missing REPLIT_CRM_BASE_URL", isConfigError: true },
        { status: 500 }
      )
    );
  }

  if (!apiKey) {
    return withCors(
      NextResponse.json(
        { ok: false, error: "Missing REPLIT_NP_API_KEY", isConfigError: true },
        { status: 500 }
      )
    );
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  // Forward to CRM API endpoint
  const crmUrl = `${baseUrl.replace(/\/$/, "")}/api/applications`;

  try {
    const upstream = await fetch(crmUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(body ?? {}),
    });

    const ms = Date.now() - t0;
    const text = await upstream.text();

    // Try parse upstream response
    let upstreamJson: any = null;
    try {
      upstreamJson = text ? JSON.parse(text) : null;
    } catch {
      upstreamJson = null;
    }

    // Prefer requestId from incoming payload first (then tracking, then upstream response)
    const requestId =
      body?.requestId ??
      body?.tracking?.requestId ??
      upstreamJson?.requestId ??
      null;

    const responsePayload: any = {
      ok: upstream.ok,
      requestId,
      upstreamStatus: upstream.status,
      ms,
    };

    if (debugOn) {
      responsePayload.debug = {
        forwardedTo: crmUrl,
        receivedBody: maskSsnInAnyShape(body),
        upstreamBody: upstreamJson ?? text ?? null,
      };
    }

    return withCors(NextResponse.json(responsePayload, { status: upstream.status }));
  } catch (err: any) {
    return withCors(
      NextResponse.json(
        { ok: false, error: "Relay failed", detail: err?.message || String(err) },
        { status: 500 }
      )
    );
  }
}
