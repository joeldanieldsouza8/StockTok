import DummyApiTester from "./DummyApiTester";

export default function HomeHero({ session }: { session: any }) {
  // Server component used by page.tsx — session is optional
  return (
    <div className="mx-auto max-w-5xl">
      <section className="text-center py-12">

        <h1 className="text-muted max-w-7xl mx-auto text-4xl font-extrabold mb-3">keep it simple and shout out for stockTok team you guys are doing a greate job espcialy if you are reading this, it means that you know how to use github, pround of you </h1>

        {!session ? (
          <div className="flex items-center justify-center gap-4">
            <a href="/auth/login" className="inline-block px-6 py-3 rounded-md btn-primary">Sign in with Auth0</a>
            <a href="#features" className="text-muted">Learn more</a>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <img src={session.user.picture} alt={session.user.name} className="w-14 h-14 rounded-full" />
            <div className="text-left">
              <div className="text-lg font-semibold">Welcome back, {session.user.name}</div>
              <div className="text-sm text-muted">{session.user.email}</div>
            </div>
          </div>
        )}
      </section>

      {/* quick stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="p-6 border rounded-lg text-center">
          <div className="text-2xl font-bold">99%</div>
          <div className="text-muted">API uptime</div>
        </div>
        <div className="p-6 border rounded-lg text-center">
          <div className="text-2xl font-bold">Auth0</div>
          <div className="text-muted">Secure auth provider</div>
        </div>
        <div className="p-6 border rounded-lg text-center">
          <div className="text-2xl font-bold">Tokens</div>
          <div className="text-muted">JWT + session support</div>
        </div>
      </section>

      {/* features */}
      <section id="features" className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">What you can do</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg">
            <h4 className="font-semibold mb-2">Secure APIs</h4>
            <p className="text-muted text-sm">Protect endpoints using JWT bearer tokens validated by the backend.</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h4 className="font-semibold mb-2">Role-based UI</h4>
            <p className="text-muted text-sm">Add roles in Auth0 and render content conditionally on both frontend and backend.</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h4 className="font-semibold mb-2">API tester</h4>
            <p className="text-muted text-sm">Quickly call your backend from the app using the existing Dummy API tester.</p>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">How it works</h3>
        <ol className="list-decimal list-inside space-y-2 text-muted">
          <li>Sign in via Auth0 (Google) — Auth0 issues ID + access tokens.</li>
          <li>Next.js stores a session cookie and can request access tokens server-side.</li>
          <li>Calls to the backend include the access token as a Bearer token and the backend validates it locally.</li>
        </ol>
      </section>

      {/* authenticated area */}
      {session && (
        <section className="mb-12">
          <h3 className="text-xl font-semibold mb-4">Developer tools</h3>
          <p className="text-muted mb-4">Use this small tester to call your protected backend endpoints.</p>
          <DummyApiTester />
        </section>
      )}
    </div>
  );
}
