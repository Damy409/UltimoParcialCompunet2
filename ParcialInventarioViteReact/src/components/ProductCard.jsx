import { Save, Trash2 } from "lucide-react";
import { useState } from "react";

const statuses = ["DISPONIBLE", "AGOTADO", "DESCONTINUADO"];

export default function ProductCard({ product, onDelete, onStatusChange, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...product });

  function handleDraftChange(event) {
    const { name, value } = event.target;
    const parsedValue = name === "price" || name === "stock" ? Number(value) : value;
    setDraft((current) => ({ ...current, [name]: parsedValue }));
  }

  async function saveChanges() {
    await onUpdate(product.id, draft);
    setEditing(false);
  }

  return (
    <article className="product-card">
      <div className="card-header">
        <div>
          <span className={`badge ${product.status?.toLowerCase()}`}>{product.status}</span>
          <h3>{product.name}</h3>
          <p>{product.category}</p>
        </div>
        <button className="danger icon-button" onClick={() => onDelete(product.id)} title="Eliminar producto">
          <Trash2 size={18} />
        </button>
      </div>

      {editing ? (
        <div className="edit-grid">
          <input name="name" value={draft.name || ""} onChange={handleDraftChange} />
          <input name="category" value={draft.category || ""} onChange={handleDraftChange} />
          <input name="price" type="number" min="0" value={draft.price || 0} onChange={handleDraftChange} />
          <input name="stock" type="number" min="0" value={draft.stock || 0} onChange={handleDraftChange} />
          <button className="primary" onClick={saveChanges}>
            <Save size={16} />
            Guardar
          </button>
        </div>
      ) : (
        <div className="product-details">
          <span>Precio: ${product.price}</span>
          <span>Stock: {product.stock}</span>
          <span>ID: {product.id}</span>
        </div>
      )}

      <div className="card-actions">
        <select value={product.status} onChange={(event) => onStatusChange(product.id, event.target.value)}>
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

