import { useEffect, useState } from "react";
import { createPost, findAllPosts } from "../api/postService.js";
import AuthUser from "../components/AuthUser.jsx";
import PostCard from "../components/PostCard.jsx";
import PostForm from "../components/PostForm.jsx";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPosts() {
    setLoading(true);
    try {
      const data = await findAllPosts();
      setPosts(Array.isArray(data) ? data : data.content || []);
    } catch (exception) {
      setError(exception.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(post) {
    await createPost(post);
    await loadPosts();
  }

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <>
      <AuthUser />
      <main className="page feed-layout">
        <section>
          <h1>Feed</h1>
          <PostForm onCreate={handleCreate} />
        </section>

        <section className="post-list">
          {error && <p className="error">{error}</p>}
          {loading ? (
            <p>Cargando posts...</p>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </section>
      </main>
    </>
  );
}

