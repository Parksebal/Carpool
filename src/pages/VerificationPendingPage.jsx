import { Link } from "react-router";

export default function VerificationPendingPage() {
  return (
    <main style={{ maxWidth: "600px", margin: "80px auto", textAlign: "center" }}>
      <h1>Verification pending</h1>

      <p>
        Your student ID has been submitted. Once approved, you will be able to
        access the student carpool dashboard.
      </p>

      <Link to="/dashboard">Check dashboard</Link>
    </main>
  );
}