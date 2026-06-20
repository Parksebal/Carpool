import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";

export default function DriverVerifyPage() {
  const navigate = useNavigate();

  const [licenseFile, setLicenseFile] = useState(null);
  const [insuranceFile, setInsuranceFile] = useState(null);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!licenseFile || !insuranceFile) {
      setError("Please upload both your driver's license and proof of insurance.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    const licensePath = `${user.id}/drivers-license-${Date.now()}-${licenseFile.name}`;
    const insurancePath = `${user.id}/insurance-${Date.now()}-${insuranceFile.name}`;

    const { error: licenseError } = await supabase.storage
      .from("verification-docs")
      .upload(licensePath, licenseFile);

    if (licenseError) {
      setError(licenseError.message);
      return;
    }

    const { error: insuranceError } = await supabase.storage
      .from("verification-docs")
      .upload(insurancePath, insuranceFile);

    if (insuranceError) {
      setError(insuranceError.message);
      return;
    }

    const { error: driverError } = await supabase
      .from("driver_verifications")
      .upsert({
        user_id: user.id,
        drivers_license_path: licensePath,
        insurance_path: insurancePath,
        status: "pending",
      });

    if (driverError) {
      setError(driverError.message);
      return;
    }

    await supabase
      .from("profiles")
      .update({ driver_status: "pending" })
      .eq("id", user.id);

    navigate("/driver/vehicle");
  }

  return (
    <main style={{ maxWidth: "600px", margin: "80px auto" }}>
      <h1>Driver Verification</h1>

      <p>Upload your driver's license and proof of insurance.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
        <label>
          Driver's license
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(event) => setLicenseFile(event.target.files?.[0] ?? null)}
          />
        </label>

        <label>
          Proof of insurance
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(event) => setInsuranceFile(event.target.files?.[0] ?? null)}
          />
        </label>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button>Submit driver documents</button>
      </form>
    </main>
  );
}