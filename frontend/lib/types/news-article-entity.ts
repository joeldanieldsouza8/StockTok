export interface NewsArticleEntity {
    symbol: string,
    name: string,
    exchange: string,
    exchange_long: string,
    country: string,
    type: string,
    industry: string,
    match_score: number,
    sentiment_score: number,
}