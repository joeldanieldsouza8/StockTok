"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Define the user type based on Auth0 session
interface UserOnboardingProps {
  user: {
    name?: string;
    given_name?: string;
    nickname?: string;
    email?: string;
    picture?: string;
    sub?: string;
  };
}

export function UserOnboarding({ user }: UserOnboardingProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const displayName = user.name || user.given_name || user.nickname || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleContinue = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the backend to sync/create user via the Next.js API route
      const response = await fetch("/api/newUser", { method: "GET" });
      const data = await response.json();

      if (!response.ok) {
        // Handle error response from backend
        console.error("[Onboarding] Error:", data);
        setError(data.error || "Failed to complete onboarding");
        setIsLoading(false);
        return;
      }

      // Check if user is new (201) or existing (200)
      // The API route forwards the status, but we can also check the response
      console.log("[Onboarding] Success:", data);

      // Redirect to home/dashboard after successful sync
      router.push("/");
    } catch (error) {
      console.error("[Onboarding] Error during onboarding:", error);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome!</CardTitle>
          <CardDescription>Let&apos;s get your account set up</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={user.picture || "/placeholder.svg"}
                alt={displayName}
              />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground">
                {displayName}
              </h3>
              {user.email && (
                <p className="text-sm text-muted-foreground">{user.email}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-center text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            onClick={handleContinue}
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Setting up..." : "Continue"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
