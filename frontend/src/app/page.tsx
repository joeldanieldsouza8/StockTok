import { auth0 } from "@/src/lib/auth0";
import DummyApiTester from "../components/DummyApiTester";


export default async function HomePage() {
  // 1. Fetch the user session securely on the server.
  const session = await auth0.getSession();

  // 2. If no session, render the public-facing login state.
  if (!session) {
    return (
      <main>
        <h2>Please log in to continue.</h2>
        <a href="/auth/login">
          <button>Log in</button>
        </a>
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