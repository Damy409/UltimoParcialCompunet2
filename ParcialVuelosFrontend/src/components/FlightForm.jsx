import { Plus } from "lucide-react";
import { useState } from "react";

const initialForm = {
  code: "",
  airline: "",
  origin: "",
  destination: "",
  departureTime: "",
  arrivalTime: "",
  status: "PROGRAMADO"
};

export default function FlightForm({ onCreate }) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    await onCreate(form);
    setForm(initialForm);
    setSaving(false);
  }

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <input name="code" placeholder="Codigo" value={form.code} onChange={handleChange} required />
      <input name="airline" placeholder="Aerolinea" value={form.airline} onChange={handleChange} required />
      <input name="origin" placeholder="Origen" value={form.origin} onChange={handleChange} required />
      <input name="destination" placeholder="Destino" value={form.destination} onChange={handleChange} required />
      <input name="departureTime" type="datetime-local" value={form.departureTime} onChange={handleChange} required />
      <input name="arrivalTime" type="datetime-local" value={form.arrivalTime} onChange={handleChange} required />
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="PROGRAMADO">PROGRAMADO</option>
        <option value="EN_VUELO">EN_VUELO</option>
        <option value="ATERRIZADO">ATERRIZADO</option>
      </select>
      <button className="primary" disabled={saving}>
        <Plus size={18} />
        {saving ? "Guardando..." : "Crear vuelo"}
      </button>
    </form>
  );
}

