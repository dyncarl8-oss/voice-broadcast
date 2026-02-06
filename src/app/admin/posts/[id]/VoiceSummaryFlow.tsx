"use client";

import { useState, useTransition } from "react";
import { generateSummaryAction, confirmAndSendBroadcast } from "./broadcast-actions";
import { Loader2, Mic2, Send, Wand2, CheckCircle2 } from "lucide-react";

interface VoiceSummaryFlowProps {
    postId: string;
}

export function VoiceSummaryFlow({ postId }: VoiceSummaryFlowProps) {
    const [step, setStep] = useState<"idle" | "summarizing" | "editing" | "sending" | "success">("idle");
    const [script, setScript] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleGenerateSummary = async () => {
        setStep("summarizing");
        try {
            const { script: generatedScript } = await generateSummaryAction(postId);
            if (generatedScript) {
                setScript(generatedScript);
                setStep("editing");
            }
        } catch (error) {
            alert("Failed to generate summary");
            setStep("idle");
        }
    };

    const handleSendBroadcast = async () => {
        setStep("sending");
        try {
            // For MVP, we use a placeholder voiceId
            await confirmAndSendBroadcast(postId, script, "default-voice-id");
            setStep("success");
        } catch (error) {
            alert("Failed to send broadcast");
            setStep("editing");
        }
    };

    if (step === "success") {
        return (
            <div className="bg-green-50 border border-green-200 p-6 rounded-xl text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                <div>
                    <h3 className="text-lg font-bold text-green-900">Broadcast Sent!</h3>
                    <p className="text-green-700">Your voice summary has been delivered to members.</p>
                </div>
                <button
                    onClick={() => setStep("idle")}
                    className="text-sm font-medium text-green-800 hover:underline"
                >
                    Send another?
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
                <Mic2 className="w-4 h-4 text-indigo-600" />
                Voice Summary Broadcast
            </h3>

            {step === "idle" && (
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                        Automatically summarize this post and send it as a voice DM to your members.
                    </p>
                    <button
                        onClick={handleGenerateSummary}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
                    >
                        <Wand2 className="w-4 h-4" />
                        Generate Audio Script
                    </button>
                </div>
            )}

            {(step === "summarizing" || step === "sending") && (
                <div className="py-12 flex flex-col items-center justify-center text-gray-500 space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    <p>{step === "summarizing" ? "AI is summarizing your post..." : "Generating voice and sending DMs..."}</p>
                </div>
            )}

            {step === "editing" && (
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase">Spoken Script</label>
                        <textarea
                            value={script}
                            onChange={(e) => setScript(e.target.value)}
                            className="w-full p-3 border rounded-lg h-32 text-sm resize-none focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={handleSendBroadcast}
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
                        >
                            <Send className="w-4 h-4" />
                            Confirm & Send Broadcast
                        </button>
                        <button
                            onClick={() => setStep("idle")}
                            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
