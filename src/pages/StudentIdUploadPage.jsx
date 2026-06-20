import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";

export default function StudentIdUploadPage() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  async function handleUpload(event) {
    event.preventDefault();
    setError("");

    if (!file) {
      setError("Please upload your student ID.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    const filePath = `${user.id}/student-id-${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("verification-docs")
      .upload(filePath, file);

    if (uploadError) {
      setError(uploadError.message);
      return;
    }

    const { error: verificationError } = await supabase
      .from("student_verifications")
      .upsert({
        user_id: user.id,
        student_id_path: filePath,
        status: "pending",
      });

    if (verificationError) {
      setError(verificationError.message);
      return;
    }

    await supabase
      .from("profiles")
      .update({ student_status: "pending" })
      .eq("id", user.id);

    navigate("/onboarding/pending");
  }

  return (
    <main style={{ maxWidth: "600px", margin: "80px auto" }}>
      <h1>Verify your student status</h1>

      <p>Upload your student ID. This is only used for verification.</p>

      <form onSubmit={handleUpload} style={{ display: "grid", gap: "16px" }}>
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
          }}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button>Submit for review</button>
      </form>
    </main>
  );
}