export async function summarizePost(content: string, length: "short" | "standard") {
    const prompt = `
    You are summarizing a creator’s post for a spoken audio update.

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
    - Ultra-short (short): 15–20 seconds
    - Standard: 30–45 seconds

    Original Post:
    ${content}

    Return ONLY the spoken script.
  `;

    // Placeholder for AI API call
    // In production, this would use fetch to an LLM provider
    console.log("Summarizing with prompt:", prompt);

    // Mocking the response for now
    return content.slice(0, length === "short" ? 150 : 300) + "...";
}
