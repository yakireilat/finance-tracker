import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.root}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.left}>
        <div style={styles.brand}>
          <div style={styles.logoMark}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={styles.brandName}>
            <span style={styles.brandAccent}>Finance</span> Tracker
          </span>
        </div>

        <div style={styles.heroText}>
          <h1 style={styles.heroTitle}>
            Take control of<br />
            <span style={styles.heroAccent}>your money.</span>
          </h1>
          <p style={styles.heroSub}>
            Track spending, set budgets, and understand where your money goes — all in one place.
          </p>
        </div>

        <div style={styles.stats}>
          {[
            { label: "Tracked monthly", value: "$0" },
            { label: "Categories", value: "6+" },
            { label: "Free forever", value: "100%" },
          ].map(s => (
            <div key={s.label} style={styles.stat}>
              <span style={styles.statValue}>{s.value}</span>
              <span style={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <div style={styles.cardTopLine} />
          <h2 style={styles.cardTitle}>Welcome back</h2>
          <p style={styles.cardSubtitle}>Sign in to your account</p>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={styles.input}
                placeholder="you@example.com"
                onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={styles.input}
                placeholder="••••••••"
                onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? (
                <span style={styles.spinner} />
              ) : "Sign In"}
            </button>
          </form>

          <p style={styles.footer}>
            No account?{" "}
            <Link to="/register" style={styles.link}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  root: {
    display: "flex",
    minHeight: "100vh",
    background: "var(--bg-base)",
    position: "relative",
    overflow: "hidden",
  },
  blob1: {
    position: "fixed",
    top: "-300px", left: "-200px",
    width: "700px", height: "700px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  blob2: {
    position: "fixed",
    bottom: "-200px", right: "30%",
    width: "500px", height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  left: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "60px",
    position: "relative",
    zIndex: 1,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "80px",
  },
  logoMark: {
    width: "36px", height: "36px",
    background: "var(--accent-glow)",
    border: "1px solid rgba(99,102,241,0.3)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "var(--text-primary)",
  },
  brandAccent: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroText: { marginBottom: "48px" },
  heroTitle: {
    fontSize: "52px",
    fontWeight: "700",
    letterSpacing: "-0.03em",
    lineHeight: 1.1,
    color: "var(--text-primary)",
    marginBottom: "16px",
  },
  heroAccent: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6, #34d399)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSub: {
    fontSize: "16px",
    color: "var(--text-secondary)",
    lineHeight: 1.6,
    maxWidth: "400px",
  },
  stats: { display: "flex", gap: "40px" },
  stat: { display: "flex", flexDirection: "column", gap: "4px" },
  statValue: { fontSize: "24px", fontWeight: "700", color: "var(--text-primary)" },
  statLabel: { fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" },
  right: {
    width: "440px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    position: "relative",
    zIndex: 1,
  },
  card: {
    width: "100%",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-xl)",
    padding: "40px",
    position: "relative",
    overflow: "hidden",
  },
  cardTopLine: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)",
  },
  cardTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "var(--text-primary)",
    marginBottom: "6px",
    letterSpacing: "-0.02em",
  },
  cardSubtitle: {
    fontSize: "13px",
    color: "var(--text-secondary)",
    marginBottom: "28px",
  },
  errorBox: {
    padding: "10px 14px",
    background: "rgba(248,113,113,0.08)",
    border: "1px solid rgba(248,113,113,0.2)",
    borderRadius: "var(--radius)",
    color: "var(--red)",
    fontSize: "13px",
    marginBottom: "20px",
  },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: {
    fontSize: "12px",
    color: "var(--text-secondary)",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  input: {
    padding: "11px 14px",
    background: "var(--bg-input)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  button: {
    padding: "13px",
    borderRadius: "var(--radius)",
    border: "none",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 0.2s",
  },
  spinner: {
    width: "16px", height: "16px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  footer: {
    textAlign: "center",
    color: "var(--text-muted)",
    fontSize: "13px",
    marginTop: "24px",
  },
  link: { color: "var(--accent-light)", textDecoration: "none", fontWeight: "500" },
};