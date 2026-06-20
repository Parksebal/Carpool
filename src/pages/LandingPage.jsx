import { Link } from "react-router";

export default function LandingPage() {
  return (
    <main>
      <nav style={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
        <h1>Campus Carpool</h1>

        <div style={{ display: "flex", gap: "16px" }}>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign up</Link>
        </div>
      </nav>

      <section style={{ maxWidth: "800px", margin: "80px auto", textAlign: "center" }}>
        <h2>Student-only carpooling for universities</h2>

        <p>
          Verified students can share rides for trips they are already taking.
          Riders help cover gas, tolls, and detour costs.
        </p>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "24px" }}>
          <Link to="/signup">Get started</Link>
          <Link to="/login">Login</Link>
        </div>
      </section>
    </main>
  );
}