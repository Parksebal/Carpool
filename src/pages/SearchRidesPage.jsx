import { useEffect, useState } from "react";
import { Link } from "react-router";
import { supabase } from "../lib/supabase";

export default function SearchRidesPage() {
  const [rides, setRides] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRides() {
      const { data, error } = await supabase
        .from("rides")
        .select(`
          id,
          origin_label,
          destination_label,
          departure_time,
          seats_remaining,
          estimated_price,
          profiles:driver_id (
            full_name,
            rating,
            completed_rides
          )
        `)
        .eq("status", "posted")
        .gt("seats_remaining", 0)
        .order("departure_time", { ascending: true });

      if (error) {
        setError(error.message);
        return;
      }

      setRides(data ?? []);
    }

    loadRides();
  }, []);

  return (
    <main style={{ maxWidth: "900px", margin: "80px auto" }}>
      <h1>Find a Ride</h1>

      <p>
        Search posted student rides. Plate number is hidden until the driver
        accepts your request.
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "grid", gap: "16px", marginTop: "24px" }}>
        {rides.map((ride) => (
          <div key={ride.id} style={{ border: "1px solid #ccc", padding: "16px" }}>
            <h2>
              {ride.origin_label} → {ride.destination_label}
            </h2>

            <p>Departure: {new Date(ride.departure_time).toLocaleString()}</p>
            <p>Seats left: {ride.seats_remaining}</p>
            <p>Estimated price: ${ride.estimated_price ?? "TBD"}</p>
            <p>Driver: {ride.profiles?.full_name ?? "Verified driver"}</p>

            <Link to={`/rides/${ride.id}/request`}>
              Request seat
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}