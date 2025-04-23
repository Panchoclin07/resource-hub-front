"use client";

import { useMsal } from "@azure/msal-react";

export default function UserInfo() {
    const { accounts } = useMsal();

    if (accounts.length === 0) return null;

    const user = accounts[0];
    return (
        <div>
            <p>Signed in as: {user.username}</p>
        </div>
    );
}