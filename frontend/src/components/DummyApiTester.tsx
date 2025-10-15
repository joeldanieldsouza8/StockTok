"use client";

import { useState } from "react";

export default function DummyApiTester() {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleTestDummyEndpoint() {
    setIsLoading(true);
    setError(null);
    setMessage("");

    try {
      const response = await fetch("/api/dummy");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An unknown error occurred.");
      }

      // Display the successful data from the backend.
      setMessage(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button onClick={handleTestDummyEndpoint} disabled={isLoading}>
        {isLoading ? "Contacting Backend..." : "Test Backend API Dummy Endpoint"}
      </button>

      {error && <pre style={{ color: "red", border: "1px solid red", padding: "10px" }}>Error: {error}</pre>}
      {message && <pre style={{ color: "green", border: "1px solid green", padding: "10px" }}>Success: {message}</pre>}
    </div>
  );
}