'use server'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;

interface FetchOptions extends RequestInit {
    // You can add custom options here if needed
}

// <T> allows us to say "This function returns a specific shape of data"
export async function httpClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const config = {
        ...options
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        
        if (!response.ok) {
            // throw new Error(`API Error: ${response.status} - ${errorBody}`);
            throw new Error(response.statusText);
        }

        // Handle empty responses (like 204 No Content) to prevent JSON crashes
        if (response.status === 204) {
            return [] as T; // Return empty array/object based on context
        }

        const data = await response.json();
        
        return data as T;
    } 
    
    catch (error) {
        // In production, you would send this to Sentry/Datadog
        console.error(`Http Client Error [${endpoint}]:`, error);
        
        // Re-throw the error so 'error.tsx' can catch it (Recommended for Next.js)
        throw error;
    }
}