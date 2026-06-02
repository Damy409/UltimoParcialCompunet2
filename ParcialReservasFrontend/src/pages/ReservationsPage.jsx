import { useEffect, useState } from "react";
import {
  createReservation,
  deleteReservation,
  findAllReservations,
  updateReservation,
  updateReservationStatus
} from "../api/reservationService.js";
import Header from "../components/Header.jsx";
import ReservationCard from "../components/ReservationCard.jsx";
import ReservationForm from "../components/ReservationForm.jsx";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReservations() {
    setLoading(true);
    setError("");

    try {
      const data = await findAllReservations();
      setReservations(Array.isArray(data) ? data : data.content || []);
    } catch (exception) {
      setError(exception.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(reservation) {
    await createReservation(reservation);
    await loadReservations();
  }

  async function handleUpdate(id, reservation) {
    await updateReservation(id, reservation);
    await loadReservations();
  }

  async function handleStatusChange(id, status) {
    await updateReservationStatus(id, status);
    await loadReservations();
  }

  async function handleDelete(id) {
    const shouldDelete = confirm("Desea eliminar esta reserva?");
    if (!shouldDelete) {
      return;
    }

    await deleteReservation(id);
    await loadReservations();
  }

  useEffect(() => {
    loadReservations();
  }, []);

  return (
    <>
      <Header />
      <main className="page">
        <section className="section-title">
          <h1>Reservas</h1>
          <p>Administra solicitudes, confirmaciones y cancelaciones.</p>
        </section>

        <ReservationForm onCreate={handleCreate} />

        {error && <p className="error">{error}</p>}
        {loading ? (
          <p>Cargando reservas...</p>
        ) : (
          <section className="reservation-list">
            {reservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
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

