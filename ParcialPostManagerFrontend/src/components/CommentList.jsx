export default function CommentList({ comments }) {
  if (!comments.length) {
    return <p className="muted">Este post todavia no tiene comentarios.</p>;
  }

  return (
    <section className="comments">
      {comments.map((comment) => (
        <article className="comment" key={comment.id}>
          <strong>{comment.author?.username || comment.user?.username || comment.username || "Usuario"}</strong>
          <p>{comment.content || comment.text}</p>
        </article>
      ))}
    </section>
  );
}

