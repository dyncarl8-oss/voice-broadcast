"use client";

import { BarChart3, Users, PlayCircle, MessageSquare } from "lucide-react";

export function AnalyticsDashboard({ companyId }: { companyId: string }) {
    const stats = [
        { label: "DMs Sent", value: "1,284", icon: MessageSquare, color: "text-blue-500" },
        { label: "Active Listeners", value: "856", icon: Users, color: "text-green-500" },
        { label: "Listen Rate", value: "67%", icon: PlayCircle, color: "text-purple-500" },
        { label: "Growth", value: "+12%", icon: BarChart3, color: "text-orange-500" },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
                <div key={stat.label} className="bg-card border rounded-2xl p-5 shadow-sm space-y-2">
                    <div className="flex justify-between items-center">
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+4%</span>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
