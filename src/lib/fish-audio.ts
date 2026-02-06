export async function generateAudio(text: string, voiceId: string) {
    const response = await fetch("https://api.fish.audio/v1/tts", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.FISH_AUDIO_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text,
            reference_id: voiceId,
            format: "mp3",
        }),
    });

    if (!response.ok) {
        throw new Error(`Fish Audio API error: ${response.statusText}`);
    }

    // Returns arrayBuffer of the MP3
    return await response.arrayBuffer();
}

/**
 * Note: Fish Audio supports custom voice cloning.
 * In a real app, you'd use their SDK or specific endpoints to create a reference voice.
 * For MVP, we assume the creator has already set up their reference_id.
 */
export async function listVoices() {
    const response = await fetch("https://api.fish.audio/v1/voices", {
        headers: {
            "Authorization": `Bearer ${process.env.FISH_AUDIO_API_KEY}`,
        },
    });

    if (!response.ok) return [];
    return await response.json();
}
