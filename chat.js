export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  const { message } = req.body;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing API key in environment." });
  }

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "You are a travel AI. Give short and helpful responses only." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    if (!data || !data.choices || !data.choices[0]?.message?.content) {
      return res.status(502).json({ error: "No valid response from OpenRouter." });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
