import { Save, Trash2 } from "lucide-react";
import { useState } from "react";

const statuses = ["PENDIENTE", "CONFIRMADA", "CANCELADA"];

export default function ReservationCard({ reservation, onDelete, onStatusChange, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...reservation });

  function handleDraftChange(event) {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: name === "people" ? Number(value) : value }));
  }

  async function saveChanges() {
    await onUpdate(reservation.id, draft);
    setEditing(false);
  }

  return (
    <article className="reservation-card">
      <div className="card-header">
        <div>
          <span className={`badge ${reservation.status?.toLowerCase()}`}>{reservation.status}</span>
          <h3>{reservation.customerName}</h3>
          <p>{reservation.serviceName}</p>
        </div>
        <button className="danger icon-button" onClick={() => onDelete(reservation.id)} title="Eliminar reserva">
          <Trash2 size={18} />
        </button>
      </div>

      {editing ? (
        <div className="edit-grid">
          <input name="customerName" value={draft.customerName || ""} onChange={handleDraftChange} />
          <input name="serviceName" value={draft.serviceName || ""} onChange={handleDraftChange} />
          <input name="reservationDate" type="datetime-local" value={draft.reservationDate || ""} onChange={handleDraftChange} />
          <input name="people" type="number" min="1" value={draft.people || 1} onChange={handleDraftChange} />
          <button className="primary" onClick={saveChanges}>
            <Save size={16} />
            Guardar
          </button>
        </div>
      ) : (
        <div className="reservation-details">
          <span>Fecha: {reservation.reservationDate}</span>
          <span>Personas: {reservation.people}</span>
          <span>ID: {reservation.id}</span>
        </div>
      )}

      <div className="card-actions">
        <select value={reservation.status} onChange={(event) => onStatusChange(reservation.id, event.target.value)}>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button onClick={() => setEditing((value) => !value)}>{editing ? "Cancelar" : "Editar"}</button>
      </div>
    </article>
  );
}

