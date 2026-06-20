import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";

export default function PostRidePage() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [vehicleId, setVehicleId] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [seatsAvailable, setSeatsAvailable] = useState(1);
  const [maxDetourMinutes, setMaxDetourMinutes] = useState(10);
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadVehicles() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data } = await supabase
        .from("vehicles")
        .select("*")
        .eq("driver_id", user.id);

      setVehicles(data ?? []);
    }

    loadVehicles();
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("driver_status")
      .eq("id", user.id)
      .single();

    if (profile?.driver_status !== "approved") {
      setError("You must be an approved driver before posting rides.");
      return;
    }

    const { error: rideError } = await supabase.from("rides").insert({
      driver_id: user.id,
      vehicle_id: vehicleId,
      origin_label: origin,
      destination_label: destination,
      departure_time: departureTime,
      seats_total: Number(seatsAvailable),
      seats_remaining: Number(seatsAvailable),
      max_detour_minutes: Number(maxDetourMinutes),
      estimated_price: estimatedPrice ? Number(estimatedPrice) : null,
      status: "posted",
    });

    if (rideError) {
      setError(rideError.message);
      return;
    }

    navigate("/dashboard");
  }

  return (
    <main style={{ maxWidth: "600px", margin: "80px auto" }}>
      <h1>Post an Existing Ride</h1>

      <p>Only post trips you were already planning to take.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
        <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
          <option value="">Select vehicle</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.color} {vehicle.make} {vehicle.model}
            </option>
          ))}
        </select>

        <input placeholder="Origin" value={origin} onChange={(e) => setOrigin(e.target.value)} />
        <input placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} />

        <input
          type="datetime-local"
          value={departureTime}
          onChange={(e) => setDepartureTime(e.target.value)}
        />

        <input
          type="number"
          min="1"
          placeholder="Seats available"
          value={seatsAvailable}
          onChange={(e) => setSeatsAvailable(e.target.value)}
        />

        <input
          type="number"
          min="0"
          placeholder="Max detour minutes"
          value={maxDetourMinutes}
          onChange={(e) => setMaxDetourMinutes(e.target.value)}
        />

        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Estimated rider contribution"
          value={estimatedPrice}
          onChange={(e) => setEstimatedPrice(e.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button>Publish ride</button>
      </form>
    </main>
  );
}