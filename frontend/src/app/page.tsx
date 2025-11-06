import { auth0 } from "@/src/lib/auth0";
import HomeHero from "../components/HomeHero";


export default async function HomePage() {
  // 1. Fetch the user session securely on the server.
  const session = await auth0.getSession();

  // Render a single HomeHero component that handles both public/authenticated UX
  return (
    <main>
      <HomeHero session={session} />
    </main>
  );
}