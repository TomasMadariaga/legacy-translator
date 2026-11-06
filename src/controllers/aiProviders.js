require("dotenv").config();
const { cleanPythonCode } = require("../cleanCode.js");

async function callOpenRouter(prompt) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "deepseek/deepseek-v3.2",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
        max_tokens: 4096
      }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error?.message || "Error en OpenRouter");

    return cleanPythonCode(data.choices[0].message.content);
  } finally {
    clearTimeout(timeout);
  }
}

async function callGroq(prompt) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000);

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0,
          max_tokens: 4096,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) throw new Error(data.error?.message || "Error en Groq");

    return cleanPythonCode(data.choices[0].message.content);
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { callGroq, callOpenRouter };