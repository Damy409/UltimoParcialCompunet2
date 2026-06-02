import { LogOut, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthenticatedUser } from "../api/authService.js";

export default function AuthUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  useEffect(() => {
    getAuthenticatedUser()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  return (
    <header className="topbar">
      <div className="user-block">
        <UserCircle size={28} />
        <div>
          <strong>{user?.name || user?.username || "Usuario autenticado"}</strong>
          <span>{user?.email || "Sesion activa"}</span>
        </div>
      </div>
      <button className="icon-button" onClick={logout} title="Cerrar sesion">
        <LogOut size={20} />
      </button>
    </header>
  );
}

