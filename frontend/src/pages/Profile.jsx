import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Card from "../components/Card";
import api from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
        setFullName(res.data.full_name || "");
      } catch (err) {
        console.error(err);
      }
    }
    fetchProfile();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await api.put("/auth/me", { full_name: fullName });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout>
      <div style={styles.page}>
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Profile</h1>
          <p style={styles.pageSubtitle}>Manage your account settings</p>
        </div>

        <div style={styles.grid}>
          <Card>
            <div style={styles.avatarSection}>
              <div style={styles.avatar}>
                {user?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <p style={styles.userName}>{user?.full_name || "User"}</p>
                <p style={styles.userEmail}>{user?.email}</p>
                <p style={styles.userSince}>
                  Member since {user?.created_at?.split("T")[0]}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 style={styles.sectionTitle}>Personal Info</h3>
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                style={styles.input}
                placeholder="Your name"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                style={{ ...styles.input, opacity: 0.5, cursor: "not-allowed" }}
              />
              <p style={styles.hint}>Email cannot be changed</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                ...styles.saveButton,
                ...(saved ? { background: "var(--green)", color: "#000" } : {}),
              }}
            >
              {saved ? "✓ Saved!" : saving ? "Saving..." : "Save Changes"}
            </button>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  page: { animation: "fadeIn 0.3s ease" },
  pageHeader: { marginBottom: "32px" },
  pageTitle: { fontSize: "28px", fontWeight: "700", letterSpacing: "-0.02em", marginBottom: "4px" },
  pageSubtitle: { color: "var(--text-secondary)", fontSize: "14px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px" },
  avatarSection: { display: "flex", alignItems: "center", gap: "16px" },
  avatar: {
    width: "64px",
    height: "64px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "700",
    color: "#fff",
    flexShrink: 0,
    animation: "glow-pulse 3s ease infinite",
  },
  userName: { fontSize: "16px", fontWeight: "600", marginBottom: "2px" },
  userEmail: { fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" },
  userSince: { fontSize: "11px", color: "var(--text-muted)" },
  sectionTitle: { fontSize: "15px", fontWeight: "600", marginBottom: "20px", color: "var(--text-primary)" },
  field: { marginBottom: "16px" },
  label: { display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.06em" },
  input: {
    width: "100%",
    padding: "10px 14px",
    background: "var(--bg-input)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none",
    transition: "border-color var(--transition)",
  },
  hint: { fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" },
  saveButton: {
    padding: "10px 24px",
    borderRadius: "var(--radius)",
    border: "none",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all var(--transition)",
  },
};