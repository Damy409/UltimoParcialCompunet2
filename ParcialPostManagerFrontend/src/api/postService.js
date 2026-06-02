import { request } from "./http.js";

const DEMO_POSTS_KEY = "demoPosts";
const DEMO_COMMENTS_KEY = "demoComments";

const initialDemoPosts = [
  {
    id: 1,
    title: "Primer post de prueba",
    content: "Este registro permite probar el feed sin depender del backend.",
    username: "admin"
  },
  {
    id: 2,
    title: "Preparacion parcial",
    content: "Revisa Swagger, ajusta servicios y conserva los componentes.",
    username: "admin"
  }
];

const initialDemoComments = {
  1: [
    {
      id: 1,
      content: "Comentario inicial de ejemplo.",
      username: "admin"
    }
  ],
  2: []
};

function isDemoMode() {
  return localStorage.getItem("token") === "demo-post-token";
}

function readDemoPosts() {
  const stored = localStorage.getItem(DEMO_POSTS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(DEMO_POSTS_KEY, JSON.stringify(initialDemoPosts));
  return initialDemoPosts;
}

function saveDemoPosts(posts) {
  localStorage.setItem(DEMO_POSTS_KEY, JSON.stringify(posts));
  return posts;
}

function readDemoComments() {
  const stored = localStorage.getItem(DEMO_COMMENTS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(DEMO_COMMENTS_KEY, JSON.stringify(initialDemoComments));
  return initialDemoComments;
}

function saveDemoComments(comments) {
  localStorage.setItem(DEMO_COMMENTS_KEY, JSON.stringify(comments));
  return comments;
}

export function findAllPosts() {
  if (isDemoMode()) {
    return Promise.resolve(readDemoPosts());
  }

  return request("/posts");
}

export function findPostById(id) {
  if (isDemoMode()) {
    const post = readDemoPosts().find((current) => current.id === Number(id));
    return Promise.resolve(post);
  }

  return request(`/posts/${id}`);
}

export function createPost(post) {
  if (isDemoMode()) {
    const posts = readDemoPosts();
    const newPost = { ...post, id: Date.now(), username: "admin" };
    saveDemoPosts([newPost, ...posts]);
    return Promise.resolve(newPost);
  }

  return request("/posts", {
    method: "POST",
    body: JSON.stringify(post)
  });
}

export function addComment(postId, comment) {
  if (isDemoMode()) {
    const comments = readDemoComments();
    const newComment = { ...comment, id: Date.now(), username: "admin" };
    const nextComments = {
      ...comments,
      [postId]: [...(comments[postId] || []), newComment]
    };
    saveDemoComments(nextComments);
    return Promise.resolve(newComment);
  }

  return request(`/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify(comment)
  });
}

export function findCommentsByPostId(postId) {
  if (isDemoMode()) {
    const comments = readDemoComments();
    return Promise.resolve(comments[postId] || []);
  }

  return request(`/posts/${postId}/comments`);
}
