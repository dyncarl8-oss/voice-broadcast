import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function summarizePost(
    content: string,
    length: 'ultra-short' | 'standard' = 'standard'
) {
    const prompt = `You are summarizing a creator’s post for a spoken audio update.

Rules:
- Preserve the creator’s intent and tone
- Do NOT add new information
- Do NOT exaggerate
- Do NOT use emojis or bullet points
- Write in natural spoken language
- No disclaimers unless present in original text
- Avoid hype or clickbait
- Keep it concise and clear

Length:
- Ultra-short: 15–20 seconds (approx 40-50 words)
- Standard: 30–45 seconds (approx 75-100 words)

Original Post:
${content}

Return ONLY the spoken script.`;

    const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
    });

    return response.choices[0].message.content;
}
