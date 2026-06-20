import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";

export default function VehiclePage() {
  const navigate = useNavigate();

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [color, setColor] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [seatsAvailable, setSeatsAvailable] = useState(1);
  const [vehiclePhoto, setVehiclePhoto] = useState(null);
  const [error, setError] = useState("");

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

    let vehiclePhotoPath = null;

    if (vehiclePhoto) {
      vehiclePhotoPath = `${user.id}/vehicle-${Date.now()}-${vehiclePhoto.name}`;

      const { error: photoError } = await supabase.storage
        .from("verification-docs")
        .upload(vehiclePhotoPath, vehiclePhoto);

      if (photoError) {
        setError(photoError.message);
        return;
      }
    }

    const { error: vehicleError } = await supabase.from("vehicles").insert({
      driver_id: user.id,
      make,
      model,
      year: year ? Number(year) : null,
      color,
      plate_number: plateNumber,
      vehicle_photo_path: vehiclePhotoPath,
      seats_available: Number(seatsAvailable),
    });

    if (vehicleError) {
      setError(vehicleError.message);
      return;
    }

    navigate("/dashboard");
  }

  return (
    <main style={{ maxWidth: "600px", margin: "80px auto" }}>
      <h1>Vehicle Information</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
        <input placeholder="Make, e.g. Toyota" value={make} onChange={(e) => setMake(e.target.value)} />
        <input placeholder="Model, e.g. Corolla" value={model} onChange={(e) => setModel(e.target.value)} />
        <input placeholder="Year, e.g. 2019" value={year} onChange={(e) => setYear(e.target.value)} />
        <input placeholder="Color, e.g. Gray" value={color} onChange={(e) => setColor(e.target.value)} />
        <input placeholder="License plate" value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} />

        <input
          type="number"
          min="1"
          max="6"
          value={seatsAvailable}
          onChange={(e) => setSeatsAvailable(e.target.value)}
        />

        <label>
          Vehicle photo
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setVehiclePhoto(e.target.files?.[0] ?? null)}
          />
        </label>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button>Save vehicle</button>
      </form>
    </main>
  );
}