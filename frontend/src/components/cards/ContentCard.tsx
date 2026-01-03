import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface ContentCardProps {
  avatarSrc?: string;
  avatarFallback: string;
  name: string;
  publishedAt: string;
  title: string;
  metadata: string;
  description: string;
  link?: {
    url: string;
    text?: string;
  };
  interactions?: {
    upvotes: number;
    downvotes: number;
    comments: number;
  };
}

/**
 * A generic, reusable card component which can display news articles and user posts.
 */
export function ContentCard({
  avatarSrc, // profile picture
  avatarFallback,
  name, // company name OR username
  publishedAt,
  metadata,
  title,
  description,
  link,
  interactions,
}: ContentCardProps) {
  return (
    <Card className="content-card-root">
      <CardHeader className="flex flex-row gap-3 items-center justify-between">
        <div className="flex gap-2 items-center">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage src={avatarSrc} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>

          <div className="content-card-user-badge">
            <h4 className="text-xl font-semibold leading-none">
              {name}
              <span className="ml-2 text-xs text-muted-foreground font-normal">
                {publishedAt}
              </span>
            </h4>
          </div>
        </div>

        {metadata && (
          <div className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
            {metadata}
          </div>
        )}
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <div className="content-card-inner-body">
          <h3 className="text-lg font-bold tracking-tight">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>

          <div className="flex items-center justify-between pt-2">
            {interactions && (
              <div className="flex items-center gap-4">
                <button className="content-card-interaction-btn hover:text-success">
                  <ArrowUpIcon className="w-4 h-4" />
                  <span className="text-xs font-medium">
                    {interactions.upvotes}
                  </span>
                </button>
                <button className="content-card-interaction-btn hover:text-destructive">
                  <ArrowDownIcon className="w-4 h-4" />
                </button>
                <button className="content-card-interaction-btn hover:text-primary">
                  {/* <CommentIcon className="w-4 h-4" /> */}
                  <span className="text-xs font-medium">
                    {interactions.comments}
                  </span>
                </button>
              </div>
            )}

            {link && (
              <a href={link.url} className="content-card-link">
                {link.text || "Read more"}
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}