import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";

export default function Dashboard() {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>🎉 You're logged in!</h1>
      <p style={{ color: "#888", margin: "16px 0" }}>Dashboard coming soon 💕.</p>
      <button onClick={handleLogout} style={{
        padding: "10px 24px", borderRadius: "8px", border: "none",
        background: "#6366f1", color: "#fff", cursor: "pointer"
      }}>
        Log Out
      </button>
    </div>
  );
}
