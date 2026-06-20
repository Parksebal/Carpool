import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function SearchRidesPage() {
  const [rides, setRides] = useState([]);

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
          ),
          vehicles:vehicle_id (
            make,
            model,
            color
          )
        `)
        .eq("status", "posted")
        .gt("seats_remaining", 0)
        .order("departure_time", { ascending: true });

      if (!error) {
        setRides(data ?? []);
      }
    }

    loadRides();
  }, []);

  return (
    <main style={{ maxWidth: "900px", margin: "80px auto" }}>
      <h1>Find a Ride</h1>

      <div style={{ display: "grid", gap: "16px", marginTop: "24px" }}>
        {rides.map((ride) => (
          <div key={ride.id} style={{ border: "1px solid #ccc", padding: "16px" }}>
            <h2>
              {ride.origin_label} → {ride.destination_label}
            </h2>

            <p>Departure: {new Date(ride.departure_time).toLocaleString()}</p>
            <p>Seats left: {ride.seats_remaining}</p>
            <p>Estimated price: ${ride.estimated_price}</p>

            <p>
              Driver: {ride.profiles?.full_name}
            </p>

            <p>
              Car: {ride.vehicles?.color} {ride.vehicles?.make} {ride.vehicles?.model}
            </p>

            <button>Request seat soon</button>
          </div>
        ))}
      </div>
    </main>
  );
}