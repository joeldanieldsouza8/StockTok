import React from "react";
import { Card, CardHeader, CardContent } from "components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";

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
    <Card className="max-w-[900px] min-w-[700px] bg-slate-800 text-white border-slate-700">
      <CardHeader className="flex flex-row gap-3 items-center justify-between">
        <div className="flex gap-2 items-center">
          <Avatar className="h-10 w-10 border-2 border-slate-600">
            <AvatarImage src={avatarSrc} alt="icon" />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="flex bg-slate-700 px-3 py-2 rounded">
            <h4 className="text-2xl font-semibold leading-none">
              {name}{" "}
              <span className="text-sm text-slate-400"> {publishedAt}</span>
            </h4>
          </div>
        </div>
        {metadata && (
          <div className="text-sm text-slate-300 whitespace-nowrap">
            {metadata}
          </div>
        )}
      </CardHeader>
      <CardContent className="px-6 space-y-3">
        <div className="bg-slate-700 p-4 rounded space-y-3">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-slate-300 text-base leading-relaxed">
            {description}
          </p>
          {link && !interactions && (
            <div className="flex justify-end pt2">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                {link.text || "See more..."}
              </a>
            </div>
          )}

          {interactions && (
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-slate-300 hover:text-green-400 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                  <span className="text-sm">{interactions.upvotes}</span>
                </button>

                <button className="flex items-center gap-1 text-slate-300 hover:text-red-400 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  <span className="text-sm">{interactions.downvotes}</span>
                </button>

                <button className="flex items-center gap-1 text-slate-300 hover:text-blue-400 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span className="text-sm">{interactions.comments}</span>
                </button>
              </div>

              {link && (
                <a
                  href={link.url}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  {link.text || "View full post →"}
                </a>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
