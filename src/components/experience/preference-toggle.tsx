"use client";

import { useState } from "react";
import { Bell, BellOff } from "lucide-react";

export function PreferenceToggle() {
    const [isMuted, setIsMuted] = useState(false);

    return (
        <button
            onClick={() => setIsMuted(!isMuted)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${isMuted
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                }`}
        >
            {isMuted ? (
                <>
                    <BellOff className="w-3 h-3" />
                    Summaries Muted
                </>
            ) : (
                <>
                    <Bell className="w-3 h-3" />
                    Voice Summaries On
                </>
            )}
        </button>
    );
}
