import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `Generate 3 viral social media hooks about: ${topic}`;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
    });

    const hooks = response.choices[0].message.content
      .split("\n")
      .filter(Boolean);

    res.status(200).json({ hooks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate hooks" });
  }
}
