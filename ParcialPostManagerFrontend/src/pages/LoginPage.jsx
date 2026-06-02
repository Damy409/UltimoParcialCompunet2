import { MessageSquareText } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_USER, login } from "../api/authService.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const token = await login(credentials);
      localStorage.setItem("token", token);
      navigate("/feed");
    } catch (exception) {
      setError(exception.message);
    }
  }

  return (
    <main className="login-screen">
      <form className="login-box" onSubmit={handleSubmit}>
        <MessageSquareText size={42} />
        <h1>Post Manager</h1>
        <p className="hint">Usuario demo: {DEFAULT_USER.username} / {DEFAULT_USER.password}</p>
        <input name="username" placeholder="Usuario" value={credentials.username} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Contrasena" value={credentials.password} onChange={handleChange} required />
        {error && <p className="error">{error}</p>}
        <button className="primary">Ingresar</button>
      </form>
    </main>
  );
}
