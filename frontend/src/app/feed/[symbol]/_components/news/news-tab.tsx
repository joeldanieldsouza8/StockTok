import { auth0 } from "@/lib/auth0";
import { NewsArticle } from "lib/types/news-item";
import { ThumbsUp, MessageSquare } from "lucide-react";

interface NewsTabProps {
    symbol: string;
}

export default async function NewsTab({ symbol }: NewsTabProps) {
    const apiBaseUrl = process.env.BACKEND_API_URL || "http://api-gateway:8080";

    let news: NewsArticle[] = [];

    try {
        const { token } = await auth0.getAccessToken();

        const response = await fetch(`${apiBaseUrl}/api/news?symbols=${symbol}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (response.ok) {
            news = await response.json();
        } else {
            console.error("Failed to fetch news:", response.status);
        }
    } catch (error) {
        console.error("Error fetching news:", error);
    }

    console.log("Printing the data from the news API");
    console.log(news);

    return (
        <div className="flex flex-col">
            {news.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No news available for {symbol}</p>
            ) : (
                news.map((item, index) => (
                    <div
                        key={item.uuid}
                        className={`flex flex-col gap-3 py-6 ${
                            index !== news.length - 1 ? "border-b border-border/50" : ""
                        }`}
                    >
                        <div className="space-y-2">
                            <h3 className="text-base font-semibold leading-tight text-foreground">
                                {item.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {item.description}
                            </p>
                        </div>

                        <div className="flex items-center gap-4 text-muted-foreground mt-1">
                            <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                                <ThumbsUp className="h-4 w-4" />
                            </button>

                            <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                                <MessageSquare className="h-4 w-4" />
                            </button>

                            <span className="text-xs">• {item.publishedAt}</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}