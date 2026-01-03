const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        return "";  // Client-side calls go to Next.js API routes
    }
    return "";  // Server-side also uses API routes
};

const BASE_URL = getBaseUrl();

interface FetchOptions extends RequestInit {}

export async function httpClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");

    const config = {
        ...options,
        headers
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            console.error(`Fetch failed with status: ${response.status}`);
            throw new Error(response.statusText);
        }

        if (response.status === 204) {
            return [] as T;
        }

        return await response.json() as T;
    } catch (error) {
        console.error(`Http Client Error [${endpoint}]:`, error);
        throw error;
    }
}