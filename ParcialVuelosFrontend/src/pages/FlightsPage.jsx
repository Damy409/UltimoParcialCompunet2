import { useEffect, useState } from "react";
import { createFlight, deleteFlight, findAllFlights, updateFlight, updateFlightStatus } from "../api/flightService.js";
import FlightCard from "../components/FlightCard.jsx";
import FlightForm from "../components/FlightForm.jsx";
import Header from "../components/Header.jsx";

export default function FlightsPage() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadFlights() {
    setLoading(true);
    try {
      const data = await findAllFlights();
      setFlights(Array.isArray(data) ? data : data.content || []);
    } catch (exception) {
      setError(exception.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(flight) {
    await createFlight(flight);
    await loadFlights();
  }

  async function handleUpdate(id, flight) {
    await updateFlight(id, flight);
    await loadFlights();
  }

  async function handleStatusChange(id, status) {
    await updateFlightStatus(id, status);
    await loadFlights();
  }

  async function handleDelete(id) {
    await deleteFlight(id);
    await loadFlights();
  }

  useEffect(() => {
    loadFlights();
  }, []);

  return (
    <>
      <Header />
      <main className="page">
        <section className="section-title">
          <h1>Vuelos programados</h1>
          <p>Gestion operacional en tiempo real</p>
        </section>

        <FlightForm onCreate={handleCreate} />

        {error && <p className="error">{error}</p>}
        {loading ? (
          <p>Cargando vuelos...</p>
        ) : (
          <section className="flight-list">
            {flights.map((flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onUpdate={handleUpdate}
              />
            ))}
          </section>
        )}
      </main>
    </>
  );
}

