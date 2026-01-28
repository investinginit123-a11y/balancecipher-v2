export const config = {
  runtime: "nodejs",
};

function maskSsnInAnyShape(value) {
  // Masks SSN anywhere it appears as `ssn` field (string)
  if (value && typeof value === "object") {
    if (Array.isArray(value)) return value.map(maskSsnInAnyShape);

    const out = {};
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

function safeJsonStringify(x) {
  try {
    return JSON.stringify(x);
  } catch {
    return "{}";
  }
}

export default async function handler(req, res) {
  const t0 = Date.now();

  // Allow OPTIONS preflight
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method Not Allowed" });
    return;
  }

  const baseUrl = process.env.REPLIT_CRM_BASE_URL; // e.g. https://crm.bastiansauto.com
  const apiKey = process.env.REPLIT_NP_API_KEY;
  const debugOn = String(process.env.CRM_RELAY_DEBUG || "").toLowerCase() === "true";

  if (!baseUrl) {
    res.status(500).json({
      ok: false,
      error: "Missing REPLIT_CRM_BASE_URL",
      isConfigError: true,
    });
    return;
  }

  if (!apiKey) {
    res.status(500).json({
      ok: false,
      error: "Missing REPLIT_NP_API_KEY",
      isConfigError: true,
    });
    return;
  }

  let body = {};
  try {
    body = req.body && typeof req.body === "object" ? req.body : {};
  } catch {
    body = {};
  }

  const crmUrl = `${String(baseUrl).replace(/\/$/, "")}/api/applications`;

  try {
    const upstream = await fetch(crmUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(body),
    });

    const ms = Date.now() - t0;
    const text = await upstream.text();

    let upstreamJson = null;
    try {
      upstreamJson = text ? JSON.parse(text) : null;
    } catch {
      upstreamJson = null;
    }

    const requestId =
      body?.requestId ||
      body?.tracking?.requestId ||
      upstreamJson?.requestId ||
      null;

    const responsePayload = {
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

    res.status(upstream.status).json(responsePayload);
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: "Relay failed",
      detail: err?.message || String(err) || safeJsonStringify(err),
    });
  }
}

