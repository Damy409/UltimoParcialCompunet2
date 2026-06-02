import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import FeedPage from "./pages/FeedPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/posts/:id"
        element={
          <ProtectedRoute>
            <PostDetailPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/feed" replace />} />
    </Routes>
  );
}

