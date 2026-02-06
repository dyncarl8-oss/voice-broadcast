"use client";

import { WhopApp } from "@whop/react/components";
import { PropsWithChildren } from "react";

export function WhopProvider({ children }: PropsWithChildren) {
    return (
        <WhopApp>
            {children}
        </WhopApp>
    );
}
