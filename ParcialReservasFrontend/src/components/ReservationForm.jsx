import { Plus } from "lucide-react";
import { useState } from "react";

const initialForm = {
  customerName: "",
  serviceName: "",
  reservationDate: "",
  people: 1,
  status: "PENDIENTE"
};

export default function ReservationForm({ onCreate }) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: name === "people" ? Number(value) : value }));
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
      <input name="customerName" placeholder="Cliente" value={form.customerName} onChange={handleChange} required />
      <input name="serviceName" placeholder="Servicio" value={form.serviceName} onChange={handleChange} required />
      <input name="reservationDate" type="datetime-local" value={form.reservationDate} onChange={handleChange} required />
      <input name="people" type="number" min="1" value={form.people} onChange={handleChange} required />
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="PENDIENTE">PENDIENTE</option>
        <option value="CONFIRMADA">CONFIRMADA</option>
        <option value="CANCELADA">CANCELADA</option>
      </select>
      <button className="primary" disabled={saving}>
        <Plus size={18} />
        {saving ? "Guardando..." : "Crear reserva"}
      </button>
    </form>
  );
}

