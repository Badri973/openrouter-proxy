export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  const { message } = req.body;

  // Handle simple greetings manually
  const lowerMessage = message.trim().toLowerCase();
  const greetings = ["hi", "hello", "hey", "salam", "asalamualaikum"];
  if (greetings.includes(lowerMessage)) {
    return res.status(200).json({
      choices: [
        { message: { content: "Hi! How may I assist you?" } }
      ]
    });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": Bearer ${apiKey},
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "system",
            content: "You are a travel AI in Pakistan. Always give the shortest relevant response. Avoid any extra details. Keep greetings brief like: 'Hi! How may I assist you?'"
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("AI Proxy Error:", err);
    return res.status(500).json({ error: "AI request failed." });
  }
}
