import { CalendarCheck, LogOut } from "lucide-react";
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
        <CalendarCheck size={26} />
        <div>
          <strong>Reservas</strong>
          <span>Gestion administrativa</span>
        </div>
      </div>
      <button className="icon-button" onClick={logout} title="Cerrar sesion">
        <LogOut size={20} />
      </button>
    </header>
  );
}

