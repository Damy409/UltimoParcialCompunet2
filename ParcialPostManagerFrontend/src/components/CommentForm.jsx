import { Send } from "lucide-react";
import { useState } from "react";

export default function CommentForm({ onCreate }) {
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    await onCreate({ content });
    setContent("");
    setSaving(false);
  }

  return (
    <form className="panel comment-form" onSubmit={handleSubmit}>
      <textarea placeholder="Escribe un comentario" value={content} onChange={(event) => setContent(event.target.value)} required />
      <button className="primary" disabled={saving}>
        <Send size={18} />
        {saving ? "Enviando..." : "Comentar"}
      </button>
    </form>
  );
}

