import { LogOut, Plane } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <header className="topbar">
      <div className="brand">
        <Plane size={24} />
        <div>
          <strong>Operaciones Aereas</strong>
          <span>Tablero de vuelos</span>
        </div>
      </div>
      <button className="icon-button" onClick={logout} title="Cerrar sesion">
        <LogOut size={20} />
      </button>
    </header>
  );
}

