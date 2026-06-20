import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../lib/supabase";

export default function DashboardPage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, student_status, driver_status")
        .eq("id", user.id)
        .single();

      if (!data) {
        navigate("/onboarding/profile");
        return;
      }

      if (data.student_status !== "approved") {
        navigate("/onboarding/pending");
        return;
      }

      setProfile(data);
      setLoading(false);
    }

    loadProfile();
  }, [navigate]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main style={{ maxWidth: "900px", margin: "80px auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h1>Welcome, {profile?.full_name}</h1>
          <p>What would you like to do today?</p>
        </div>

        <button onClick={handleLogout}>Logout</button>
      </div>

      <div style={{ display: "grid", gap: "16px", marginTop: "32px" }}>
        <Link to="/rider/search">Find a ride</Link>
        <Link to="/driver/verify">Become a driver</Link>
        <Link to="/rider/search">Find a ride</Link>
        <Link to="/driver/post">Post a ride</Link>
        <Link to="/my-rides">My rides</Link>
      </div>
    </main>
  );
}