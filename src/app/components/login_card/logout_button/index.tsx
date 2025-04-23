"use client";

import { useMsal } from "@azure/msal-react";

export default function LogoutButton() {
    const { instance } = useMsal();

    const handleLogout = () => {
        instance.logoutRedirect().catch(e => {
            console.error("Logout failed", e);
        });
    };

    return <button onClick={handleLogout}>Logout</button>;
}