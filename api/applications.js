export default async function handler(req, res) {
  // Allow only POST (and handle preflight just in case)
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  const ingestUrl = process.env.NP_CRM_INGEST_URL;
  const apiKey = process.env.NP_API_KEY;

  if (!ingestUrl) {
    res.status(500).json({ ok: false, error: "Missing NP_CRM_INGEST_URL" });
    return;
  }
  if (!apiKey) {
    res.status(500).json({ ok: false, error: "Missing NP_API_KEY" });
    return;
  }

  try {
    const upstream = await fetch(ingestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(req.body ?? {}),
    });

    const text = await upstream.text();
    res.status(upstream.status);

    // Try to return JSON if possible, otherwise raw text
    try {
      res.setHeader("Content-Type", "application/json");
      res.end(text || JSON.stringify({ ok: true }));
    } catch {
      res.setHeader("Content-Type", "text/plain");
      res.end(text || "ok");
    }
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: "Proxy failed",
      detail: err?.message || String(err),
    });
  }
}

