  async function postToCrm(payload: CrmPayload) {
    // Use the Vercel serverless API proxy which has proper access to environment variables
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`CRM POST failed: ${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`);
    }

    // If CRM returns JSON, we read it (but we don't require it).
    try {
      return await res.json();
    } catch {
      return { ok: true };
    }
  }