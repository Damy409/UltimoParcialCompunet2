import { Plus } from "lucide-react";
import { useState } from "react";

const initialForm = {
  name: "",
  category: "",
  price: 0,
  stock: 0,
  status: "DISPONIBLE"
};

export default function ProductForm({ onCreate }) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    const parsedValue = name === "price" || name === "stock" ? Number(value) : value;
    setForm((current) => ({ ...current, [name]: parsedValue }));
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
      <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required />
      <input name="category" placeholder="Categoria" value={form.category} onChange={handleChange} required />
      <input name="price" type="number" min="0" placeholder="Precio" value={form.price} onChange={handleChange} required />
      <input name="stock" type="number" min="0" placeholder="Stock" value={form.stock} onChange={handleChange} required />
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="DISPONIBLE">DISPONIBLE</option>
        <option value="AGOTADO">AGOTADO</option>
        <option value="DESCONTINUADO">DESCONTINUADO</option>
      </select>
      <button className="primary" disabled={saving}>
        <Plus size={18} />
        {saving ? "Guardando..." : "Crear producto"}
      </button>
    </form>
  );
}

