import { UserOnboarding } from "@/components/user-onboarding";
import React from "react";
import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";

export default async function OnboardingPage() {
  // Get the session on the server
  const session = await auth0.getSession();

  // If no session, redirect to login with returnTo parameter
  if (!session) {
    redirect("/auth/login?returnTo=/onboarding");
  }

  // Pass the user data to the client component
  return <UserOnboarding user={session.user} />;
}