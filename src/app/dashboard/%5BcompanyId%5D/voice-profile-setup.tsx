"use client";

import { useState } from "react";
import { Mic, CheckCircle, AlertCircle, Upload } from "lucide-react";

export function VoiceProfileSetup({ creatorId }: { creatorId: string }) {
    const [consent, setConsent] = useState(false);
    const [isCloned, setIsCloned] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClone = async () => {
        setLoading(true);
        // Placeholder for actual cloning logic
        setTimeout(() => {
            setIsCloned(true);
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="bg-card border rounded-2xl p-8 space-y-6 shadow-sm overflow-hidden relative">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <Mic className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold">Voice Cloning Setup</h2>
                    <p className="text-muted-foreground text-sm">Clone your voice to send personalized audio summaries.</p>
                </div>
            </div>

            {!isCloned ? (
                <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="p-4 bg-muted/50 rounded-xl border border-dashed text-center space-y-3">
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground font-medium">Upload 2-3 minutes of clear audio (MP3/WAV)</p>
                        <button className="px-4 py-2 bg-background border rounded-lg text-sm font-semibold hover:bg-muted transition-colors">
                            Choose Files
                        </button>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <input
                            type="checkbox"
                            id="consent"
                            checked={consent}
                            onChange={(e) => setConsent(e.target.checked)}
                            className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer select-none">
                            I explicitly consent to cloning my voice for the purpose of sending audio summaries to my members.
                            I understand that I can revoke this consent and delete my voice profile at any time.
                        </label>
                    </div>

                    <button
                        onClick={handleClone}
                        disabled={!consent || loading}
                        className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-all"
                    >
                        {loading ? "Cloning Voice..." : "Clone My Voice"}
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-6 space-y-4 animate-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-lg">Voice Successfully Cloned!</p>
                        <p className="text-sm text-muted-foreground">Your broadcasts will now use your authentic AI voice.</p>
                    </div>
                    <button className="text-sm font-semibold text-red-600 hover:underline">
                        Delete Voice Profile
                    </button>
                </div>
            )}

            {isCloned && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
                    <AlertCircle className="w-4 h-4" />
                    Your voice samples are stored securely and never used for training.
                </div>
            )}
        </div>
    );
}
