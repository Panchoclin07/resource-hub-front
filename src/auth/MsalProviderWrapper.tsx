"use client";
import { ReactNode, useEffect, useState } from "react";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./msalInstance";

interface Props {
    children: ReactNode;
}

export default function MsalProviderWrapper({ children }: Props) {
    const [isMsalInitialized, setIsMsalInitialized] = useState(false);

    useEffect(() => {
        const initializeMsal = async () => {
            await msalInstance.initialize();
            await msalInstance.handleRedirectPromise();
            setIsMsalInitialized(true);
        };
        initializeMsal();
    }, []);

    if (!isMsalInitialized) {
        return <div>Loading authentication...</div>; // Optional loading indicator
    }

    return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}