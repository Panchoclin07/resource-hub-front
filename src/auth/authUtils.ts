// src/utils/authUtils.ts
import { msalInstance } from "./msalInstance";
import { authScopes } from "./authConfig";

export const getAccessToken = async () => {
    const accounts = msalInstance.getAllAccounts();

    if (accounts.length === 0) {
        throw new Error("No accounts found. User might not be logged in.");
    }

    const request = {
        scopes: authScopes.scopes,
        account: accounts[0],
    };

    try {
        const response = await msalInstance.acquireTokenSilent(request);
        console.log("This is the token that was acquired ", response.accessToken);
        localStorage.setItem("access_token", response.accessToken);
        return response.accessToken;
    } catch (error) {
        console.error("Silent token acquisition failed:", error);
        throw error;
    }
};