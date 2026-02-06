"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PenSquare, Mic2, BarChart3, Settings, LogOut } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface NavigationProps {
    role: "admin" | "member";
    companyId?: string;
    experienceId?: string;
}

export function Navigation({ role, companyId, experienceId }: NavigationProps) {
    const pathname = usePathname();

    const adminLinks = [
        { name: "Dashboard", href: `/dashboard/${companyId || ''}`, icon: LayoutDashboard },
        { name: "Create Post", href: `/dashboard/${companyId || ''}/posts/new`, icon: PenSquare },
        { name: "Voice Profiles", href: `/dashboard/${companyId || ''}/voice`, icon: Mic2 },
        { name: "Analytics", href: `/dashboard/${companyId || ''}/analytics`, icon: BarChart3 },
        { name: "Settings", href: `/dashboard/${companyId || ''}/settings`, icon: Settings },
    ];

    const memberLinks = [
        { name: "Feed", href: `/experiences/${experienceId || ''}`, icon: LayoutDashboard },
        { name: "Settings", href: `/experiences/${experienceId || ''}/settings`, icon: Settings },
    ];

    const links = role === "admin" ? adminLinks : memberLinks;

    return (
        <nav className="flex flex-col gap-1 p-4">
            {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                            isActive
                                ? "bg-indigo-50 text-indigo-700"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        )}
                    >
                        <Icon className="w-4 h-4" />
                        {link.name}
                    </Link>
                );
            })}
        </nav>
    );
}
