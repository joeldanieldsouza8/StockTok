import { auth0 } from "src/lib/auth0";

const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        return process.env.BACKEND_API_URL || "http://localhost:5069";
    }
    return process.env.BACKEND_API_URL || "http://api-gateway:8080";
};

const BASE_URL = getBaseUrl();

interface FetchOptions extends RequestInit {}

export async function httpClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const session = await auth0.getSession();
    const token = session?.accessToken;

    // 2. Prepare headers
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");
    
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

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

        const data = await response.json();
        return data as T;
    } 
    catch (error) {
        console.error(`Http Client Error [${endpoint}]:`, error);
        throw error;
    }
}