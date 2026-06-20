import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  async function handleLogin(event) {
    event.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/dashboard");
  }

  return (
    <main style={{ maxWidth: "450px", margin: "80px auto" }}>
      <h1>Login</h1>

      <form onSubmit={handleLogin} style={{ display: "grid", gap: "16px" }}>
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

        <button>Login</button>
      </form>

      <p>
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </main>
  );
}