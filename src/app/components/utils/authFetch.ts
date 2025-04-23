export const authFetch = (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("access_token");
    const isFormData = options.body instanceof FormData;

    const headers: Record<string, string> = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // only add Content-Type if it's NOT FormData
        ...(!isFormData ? { "Content-Type": "application/json" } : {}),
    };

    return fetch(url, {
        ...options,
        headers,
    });
};