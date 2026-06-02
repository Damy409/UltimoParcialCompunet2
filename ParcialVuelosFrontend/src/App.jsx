import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import FlightsPage from "./pages/FlightsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/flights"
        element={
          <ProtectedRoute>
            <FlightsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/flights" replace />} />
    </Routes>
  );
}

