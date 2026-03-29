import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../services/auth";

const NAV_ITEMS = [
  { path: "/dashboard", icon: "⬛", label: "Dashboard" },
  { path: "/profile", icon: "◯", label: "Profile" },
];

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div style={styles.root}>
      {/* Ambient background blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, width: collapsed ? "64px" : "240px" }}>
        <div style={styles.sidebarTop}>
          <div style={styles.logo} onClick={() => setCollapsed(c => !c)}>
            {!collapsed && (
              <span style={styles.logoText}>
                <span style={styles.logoAccent}>Finance</span> Tracker
              </span>
            )}
            {collapsed && <span style={{ fontSize: "18px" }}>💸</span>}
            <span style={styles.collapseIcon}>{collapsed ? "▶" : "◀"}</span>
          </div>
        </div>

        <nav style={styles.nav}>
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  ...styles.navItem,
                  ...(active ? styles.navItemActive : {}),
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={styles.navIcon}>{item.icon}</span>
                {!collapsed && <span style={styles.navLabel}>{item.label}</span>}
                {active && <div style={styles.activeIndicator} />}
              </button>
            );
          })}
        </nav>

        <div style={styles.sidebarBottom}>
          <button
            onClick={handleLogout}
            style={styles.logoutButton}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <span style={styles.navIcon}>✕</span>
            {!collapsed && <span style={{ color: "#f87171", fontSize: "13px" }}>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{
        ...styles.content,
        marginLeft: collapsed ? "64px" : "240px",
      }}>
        <div style={styles.contentInner} className="animate-fade">
          {children}
        </div>
      </main>
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
    top: "-200px",
    left: "-100px",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  blob2: {
    position: "fixed",
    bottom: "-200px",
    right: "-100px",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(52,211,153,0.04) 0%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    background: "rgba(10,10,10,0.95)",
    borderRight: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    transition: "width var(--transition)",
    zIndex: 100,
    backdropFilter: "blur(20px)",
    overflow: "hidden",
  },
  sidebarTop: {
    padding: "20px 16px",
    borderBottom: "1px solid var(--border)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "var(--radius)",
    transition: "background var(--transition)",
  },
  logoText: {
    fontSize: "15px",
    fontWeight: "600",
    color: "var(--text-primary)",
    whiteSpace: "nowrap",
  },
  logoAccent: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  collapseIcon: {
    fontSize: "10px",
    color: "var(--text-muted)",
  },
  nav: {
    flex: 1,
    padding: "12px 8px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 12px",
    borderRadius: "var(--radius)",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "var(--text-secondary)",
    fontSize: "13px",
    fontWeight: "500",
    transition: "all var(--transition)",
    width: "100%",
    textAlign: "left",
    position: "relative",
    whiteSpace: "nowrap",
  },
  navItemActive: {
    background: "var(--accent-glow)",
    color: "var(--accent-light)",
  },
  navIcon: { fontSize: "14px", flexShrink: 0 },
  navLabel: { flex: 1 },
  activeIndicator: {
    position: "absolute",
    right: "8px",
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    background: "var(--accent-light)",
  },
  sidebarBottom: {
    padding: "12px 8px",
    borderTop: "1px solid var(--border)",
  },
  logoutButton: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 12px",
    borderRadius: "var(--radius)",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "13px",
    transition: "background var(--transition)",
    width: "100%",
    whiteSpace: "nowrap",
  },
  content: {
    flex: 1,
    transition: "margin-left var(--transition)",
    position: "relative",
    zIndex: 1,
    minHeight: "100vh",
  },
  contentInner: {
    padding: "32px",
    maxWidth: "1400px",
  },
};