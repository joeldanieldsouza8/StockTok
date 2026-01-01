import { auth0 } from "@/lib/auth0";
import DummyApiTester from "@/components/DummyApiTester";

export default async function HealthPage() {
  // Fetch the user session securely on the server
  const session = await auth0.getSession();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>🏥 Health Check Page</h1>
      <hr style={{ margin: "1rem 0" }} />

      {/* Session Information */}
      <section>
        <h2>Session Status</h2>
        {session ? (
          <div style={{ backgroundColor: "#d4edda", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
            <p style={{ color: "#155724" }}>✅ Authenticated</p>
            <pre style={{ backgroundColor: "#f8f9fa", padding: "1rem", borderRadius: "4px", overflow: "auto" }}>
              {JSON.stringify(session.user, null, 2)}
            </pre>
          </div>
        ) : (
          <div style={{ backgroundColor: "#f8d7da", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
            <p style={{ color: "#721c24" }}>❌ Not Authenticated</p>
            <a href="/auth/login">
              <button>Log in</button>
            </a>
          </div>
        )}
      </section>

      <hr style={{ margin: "1rem 0" }} />
      <section>
        <h2>API Health Tests</h2>
        <p>API health tests available via backend endpoints.</p>
      </section>

      <hr style={{ margin: "1rem 0" }} />

      {/* Navigation */}
      <section>
        <a href="/">
          <button>← Back to Home</button>
        </a>
        {session && (
          <a href="/auth/logout" style={{ marginLeft: "1rem" }}>
            <button>Log out</button>
          </a>
        )}
      </section>
    </main>
  );
}
