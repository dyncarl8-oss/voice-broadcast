import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}
