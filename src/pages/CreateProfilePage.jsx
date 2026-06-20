import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";

export default function CreateProfilePage() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");

  const [fullName, setFullName] = useState("");
  const [university, setUniversity] = useState("");
  const [classYear, setClassYear] = useState("");
  const [major, setMajor] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      setUserId(user.id);
      setEmail(user.email ?? "");
    }

    loadUser();
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      email,
      full_name: fullName,
      university,
      class_year: classYear,
      major,
      student_status: "not_submitted",
      driver_status: "not_submitted",
    });

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/onboarding/student-id");
  }

  return (
    <main style={{ maxWidth: "600px", margin: "80px auto" }}>
      <h1>Create your profile</h1>

      <p>This profile helps verified students know who they are riding with.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
        <input
          placeholder="Full name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
        />

        <input
          placeholder="University"
          value={university}
          onChange={(event) => setUniversity(event.target.value)}
        />

        <input
          placeholder="Class year, e.g. 2027"
          value={classYear}
          onChange={(event) => setClassYear(event.target.value)}
        />

        <input
          placeholder="Major, optional"
          value={major}
          onChange={(event) => setMajor(event.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button>Save profile</button>
      </form>
    </main>
  );
}