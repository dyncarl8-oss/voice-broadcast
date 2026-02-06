"use client";

import { useState } from "react";
import { X, Loader2, Play, Volume2 } from "lucide-react";
import { sendVoiceBroadcast } from "@/app/api/broadcast/actions";

interface VoiceSummaryModalProps {
    post: any;
    isOpen: boolean;
    onClose: () => void;
}

export function VoiceSummaryModal({ post, isOpen, onClose }: VoiceSummaryModalProps) {
    const [loading, setLoading] = useState(false);
    const [length, setLength] = useState<"short" | "standard">("standard");
    const [audience, setAudience] = useState<"all" | "product_scoped">("all");

    if (!isOpen) return null;

    const handleSend = async () => {
        setLoading(true);
        const result = await sendVoiceBroadcast({
            postId: post.id || post._id.toString(),
            companyId: post.companyId,
            length,
            audience,
            voiceId: "mock-voice-id", // Fetch from creator's profile in real app
        });
        setLoading(false);
        if (result.success) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-lg border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <header className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Volume2 className="w-5 h-5 text-primary" />
                        Voice Broadcast
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-muted rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </header>

                <div className="p-6 space-y-6">
                    <div className="space-y-3">
                        <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Broadcast Length</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setLength("short")}
                                className={`p-4 border rounded-xl text-left transition-all ${length === "short" ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted"}`}
                            >
                                <div className="font-bold">Ultra-short</div>
                                <div className="text-xs text-muted-foreground">15–20 seconds summary</div>
                            </button>
                            <button
                                onClick={() => setLength("standard")}
                                className={`p-4 border rounded-xl text-left transition-all ${length === "standard" ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted"}`}
                            >
                                <div className="font-bold">Standard</div>
                                <div className="text-xs text-muted-foreground">30–45 seconds summary</div>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Target Audience</label>
                        <select
                            value={audience}
                            onChange={(e) => setAudience(e.target.value as any)}
                            className="w-full px-4 py-3 border rounded-xl bg-background outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="all">All Company Members</option>
                            <option value="product_scoped">Specific Product Subscribers</option>
                        </select>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <div className="flex gap-2">
                            <span className="text-yellow-600 font-bold">⚠️</span>
                            <p className="text-sm text-yellow-800">
                                This will send a direct message to members. We recommend previewing the summary before sending.
                            </p>
                        </div>
                    </div>
                </div>

                <footer className="p-6 bg-muted/30 border-t flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 border rounded-xl font-semibold hover:bg-muted transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="flex-2 flex items-center justify-center gap-2 py-3 px-8 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                        Confirm & Send
                    </button>
                </footer>
            </div>
        </div>
    );
}
