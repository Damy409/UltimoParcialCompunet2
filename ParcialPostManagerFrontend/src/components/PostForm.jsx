import { Send } from "lucide-react";
import { useState } from "react";

export default function PostForm({ onCreate }) {
  const [form, setForm] = useState({ title: "", content: "" });
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    await onCreate(form);
    setForm({ title: "", content: "" });
    setSaving(false);
  }

  return (
    <form className="panel post-form" onSubmit={handleSubmit}>
      <input name="title" placeholder="Titulo del post" value={form.title} onChange={handleChange} required />
      <textarea name="content" placeholder="Escribe tu post" value={form.content} onChange={handleChange} required />
      <button className="primary" disabled={saving}>
        <Send size={18} />
        {saving ? "Publicando..." : "Publicar"}
      </button>
    </form>
  );
}

