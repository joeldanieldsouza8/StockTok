// News article
export interface NewsArticle {
    uuid: string;
    title: string;
    description: string;
    url: string;
    language: string;
    publishedAt: string;
    newsArticleEntities?: NewsArticleEntity[];
}

// Associated Company
export interface NewsArticleEntity {
    id: string;
    symbol: string;
    name: string;
    country: string;
    industry: string;
    articleID: string;
}

export type NewsApiResponse = NewsArticle[];