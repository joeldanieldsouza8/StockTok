import React from "react";
import { NewsArticle } from "lib/types/news-item"; 
import { ContentCard } from "src/components/cards/ContentCard";

interface Props {
  article: NewsArticle; 
}

export function NewsCard({ article }: Props) {
  // Now TypeScript knows that article has newsArticleEntities, title, etc.
  const primaryEntity =
    article.newsArticleEntities && article.newsArticleEntities.length > 0
      ? article.newsArticleEntities[0]
      : null;

  const avatarFallback = primaryEntity
    ? primaryEntity.symbol.substring(0, 2).toUpperCase()
    : "NA";

  const formattedDate = new Date(article.publishedAt).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );

  const industry =
    article.newsArticleEntities && article.newsArticleEntities.length > 0
      ? `Industry: ${article.newsArticleEntities
          .map((e) => e.industry)
          .filter(Boolean)
          .join(", ")}`
      : "";

  const entityName = primaryEntity ? primaryEntity.name : "Unknown";

  return (
    <ContentCard
      avatarSrc=""
      avatarFallback={avatarFallback}
      name={entityName}
      publishedAt={formattedDate}
      metadata={industry}
      title={article.title}
      description={article.description}
      link={
        article.url
          ? {
              url: article.url,
              text: "Read full article...",
            }
          : undefined
      }
    />
  );
}