export const config = { runtime: "nodejs" };

function maskSsnInAnyShape(value) {
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

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

function withCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-API-Key");
  return res;
}

export default async function handler(req, res) {
  const t0 = Date.now();
  withCors(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  if (req.method !== "POST") {
    return sendJson(res, 405, { ok: false, error: "Method not allowed" });
  }

  const baseUrl = process.env.REPLIT_CRM_BASE_URL; // e.g. https://crm.bastiansauto.com
  const apiKey = process.env.REPLIT_NP_API_KEY;    // your X-API-Key
  const debugOn = String(process.env.CRM_RELAY_DEBUG || "").toLowerCase() === "true";

  if (!baseUrl) {
    return sendJson(res, 500, { ok: false, error: "Missing REPLIT_CRM_BASE_URL", isConfigError: true });
  }
  if (!apiKey) {
    return sendJson(res, 500, { ok: false, error: "Missing REPLIT_NP_API_KEY", isConfigError: true });
  }

  let body = {};
  try {
    // Vercel Node function body can be object already or a JSON string depending on runtime
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body ?? {});
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
      body: JSON.stringify(body ?? {}),
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
      body?.requestId ??
      body?.tracking?.requestId ??
      upstreamJson?.requestId ??
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

    return sendJson(res, upstream.status, responsePayload);
  } catch (err) {
    return sendJson(res, 500, {
      ok: false,
      error: "Relay failed",
      detail: err?.message || String(err),
    });
  }
}

