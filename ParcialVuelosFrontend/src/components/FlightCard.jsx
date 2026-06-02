import { Save, Trash2 } from "lucide-react";
import { useState } from "react";

const statuses = ["PROGRAMADO", "EN_VUELO", "ATERRIZADO"];

export default function FlightCard({ flight, onDelete, onStatusChange, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...flight });

  function handleDraftChange(event) {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
  }

  async function saveChanges() {
    await onUpdate(flight.id, draft);
    setEditing(false);
  }

  return (
    <article className="flight-card">
      <div className="flight-main">
        <div>
          <span className={`badge ${flight.status?.toLowerCase()}`}>{flight.status}</span>
          <h3>{flight.code || flight.flightNumber}</h3>
          <p>{flight.airline}</p>
        </div>
        <button className="danger icon-button" onClick={() => onDelete(flight.id)} title="Eliminar vuelo">
          <Trash2 size={18} />
        </button>
      </div>

      {editing ? (
        <div className="edit-grid">
          <input name="code" value={draft.code || ""} onChange={handleDraftChange} />
          <input name="airline" value={draft.airline || ""} onChange={handleDraftChange} />
          <input name="origin" value={draft.origin || ""} onChange={handleDraftChange} />
          <input name="destination" value={draft.destination || ""} onChange={handleDraftChange} />
          <button className="primary" onClick={saveChanges}>
            <Save size={16} />
            Guardar
          </button>
        </div>
      ) : (
        <div className="flight-details">
          <span>Origen: {flight.origin}</span>
          <span>Destino: {flight.destination}</span>
          <span>Salida: {flight.departureTime}</span>
          <span>Llegada: {flight.arrivalTime}</span>
        </div>
      )}

      <div className="card-actions">
        <select value={flight.status} onChange={(event) => onStatusChange(flight.id, event.target.value)}>
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

