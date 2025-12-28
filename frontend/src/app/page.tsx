import { auth0 } from "@/src/lib/auth0";
import DummyApiTester from "../components/DummyApiTester";
import { FeedCarousel } from "../components/cards/FeedCarousel";
import { getFeedByTicker } from "../services/FeedService";
import { FeedItem } from "../types/feed";

export default async function HomePage() {
  // 1. Fetch the user session securely on the server.
  const session = await auth0.getSession();

  // 2. If no session, render the public-facing login state.
  if (!session) {
    let feedItems: FeedItem[] = [];
    try {
      feedItems = await getFeedByTicker();
    } catch (error) {
      console.error('Failed to fetch feed items:', error);
    }

    return (
      <main className="flex flex-col min-h-screen p-8">
        <div>
          <h2>Please log in to continue.</h2>
          <a href="/auth/login">
            <button>Log in</button>
          </a>
        </div>
        <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col justify-center">
          <FeedCarousel items={feedItems} autoplay={false} />
        </div>
      </main>
    );
  }

  // 3. If a session exists, render the authenticated state.
  return (
    <main>
      <h1>Welcome, {session.user.name}!</h1>
      <img src={session.user.picture} alt={`Profile of ${session.user.name}`} />
      <h1>Your email: {session.user.email}</h1>
      <p>
        <a href="/auth/logout">
          <button>Log out</button>
        </a>
      </p>

      <hr style={{ margin: "2rem 0" }} />

      <DummyApiTester />
    </main>
  );
}