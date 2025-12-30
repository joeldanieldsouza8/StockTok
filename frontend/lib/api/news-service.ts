import { auth0 } from "src/lib/auth0";

import {NewsArticle} from "lib/types/news-item";
import {httpClient} from "lib/api/fetch-client";

export async function getNewsBySymbol(symbol: string): Promise<NewsArticle[]> {
    const endpoint = `/api/news/${symbol}`
    
    const { token } = await auth0.getAccessToken();
    
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    };
    
    const news = await httpClient<NewsArticle[]>(endpoint, options);
    
    return news;
}