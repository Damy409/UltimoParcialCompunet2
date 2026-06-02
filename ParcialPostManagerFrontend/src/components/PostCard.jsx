import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function PostCard({ post, detailed = false }) {
  return (
    <article className="post-card">
      <div>
        <h2>{post.title}</h2>
        <p>{post.content || post.description}</p>
      </div>
      <div className="post-meta">
        <span>{post.author?.username || post.user?.username || post.username || "Autor"}</span>
        {!detailed && (
          <Link className="detail-link" to={`/posts/${post.id}`}>
            <MessageCircle size={17} />
            Comentarios
          </Link>
        )}
      </div>
    </article>
  );
}

