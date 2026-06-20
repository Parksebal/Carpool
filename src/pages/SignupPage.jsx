import { useState } from "react";
import { Link } from "react-router";
import { supabase } from "../lib/supabase";
import { isEduEmail } from "../lib/validators";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSignup(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!isEduEmail(email)) {
      setError("Please use a valid .edu email address.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/onboarding/profile`,
      },
    });

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Check your email to confirm your account.");
  }

  return (
    <main style={{ maxWidth: "450px", margin: "80px auto" }}>
      <h1>Create your account</h1>

      <p>Use your university email to join.</p>

      <form onSubmit={handleSignup} style={{ display: "grid", gap: "16px" }}>
        <input
          placeholder="you@school.edu"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        <button>Sign up</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </main>
  );
}