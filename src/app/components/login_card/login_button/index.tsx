"use client";

import { useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { getAccessToken } from "@/src/auth/authUtils";

const LoginButton = () => {
    const { instance, accounts } = useMsal();
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        if (accounts.length > 0) {
            setUser(accounts[0].username);
        } else {
            setUser(null);
        }
    }, [accounts]);

    const login = async () => {
        try {
            const loginResponse = await instance.loginPopup({
                scopes: ["openid", "profile", "email"],
            });
            console.log("✅ Login success:", loginResponse);

            const token = await getAccessToken();
            console.log("✅ Access token acquired:", token);
            window.location.reload();
        }

        catch (error) {
            console.error("🚨 Login or token fetch failed:", error);
        }
    }

    const logout = async () => {
        try {
            await instance.logoutPopup();
            localStorage.removeItem("access_token");
            window.location.reload();
        }
        catch (error) {
            console.error("🚨 Logout Failed: ", error);
        }
    };


    return (
        <div className="d-flex align-items-center justify-content-end me-3">
            {user ? (
                <>
                    <span className="me-2">Hello, {user}</span>
                    <button className="btn btn-outline-danger btn-sm" onClick={logout}>Logout</button>
                </>
            ) : (
                <button className="btn btn-outline-primary btn-sm" onClick={login}>Login</button>
            )}
        </div>
    );
};

export default LoginButton;