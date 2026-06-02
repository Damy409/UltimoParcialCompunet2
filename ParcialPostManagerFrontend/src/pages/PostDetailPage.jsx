import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { addComment, findCommentsByPostId, findPostById } from "../api/postService.js";
import AuthUser from "../components/AuthUser.jsx";
import CommentForm from "../components/CommentForm.jsx";
import CommentList from "../components/CommentList.jsx";
import PostCard from "../components/PostCard.jsx";

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDetail() {
    setLoading(true);
    try {
      const [postData, commentsData] = await Promise.all([
        findPostById(id),
        findCommentsByPostId(id)
      ]);
      setPost(postData);
      setComments(Array.isArray(commentsData) ? commentsData : commentsData.content || []);
    } catch (exception) {
      setError(exception.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateComment(comment) {
    await addComment(id, comment);
    await loadDetail();
  }

  useEffect(() => {
    loadDetail();
  }, [id]);

  return (
    <>
      <AuthUser />
      <main className="page detail-page">
        <Link className="back-link" to="/feed">
          <ArrowLeft size={17} />
          Volver
        </Link>

        {error && <p className="error">{error}</p>}
        {loading ? (
          <p>Cargando detalle...</p>
        ) : (
          <>
            {post && <PostCard post={post} detailed />}
            <CommentForm onCreate={handleCreateComment} />
            <CommentList comments={comments} />
          </>
        )}
      </main>
    </>
  );
}

