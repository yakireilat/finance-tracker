import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../services/auth";

const Logo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
      stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DashboardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const TransactionsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const ProfileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const NAV_ITEMS = [
  { path: "/dashboard", icon: <DashboardIcon />, label: "Dashboard" },
  { path: "/transactions", icon: <TransactionsIcon />, label: "Transactions" },
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
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <aside style={{ ...styles.sidebar, width: collapsed ? "64px" : "240px" }}>
        <div style={styles.sidebarTop}>
          <div style={styles.logo} onClick={() => setCollapsed(c => !c)}>
            <div style={styles.logoMark}><Logo /></div>
            {!collapsed && (
              <span style={styles.logoText}>
                <span style={styles.logoAccent}>Finance</span> Tracker
              </span>
            )}
            <span style={styles.collapseBtn}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {collapsed
                  ? <polyline points="9 18 15 12 9 6"/>
                  : <polyline points="15 18 9 12 15 6"/>}
              </svg>
            </span>
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
                  color: active ? "var(--accent-light)" : "var(--text-secondary)",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "var(--text-primary)"; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}}
              >
                <span style={styles.navIcon}>{item.icon}</span>
                {!collapsed && <span style={styles.navLabel}>{item.label}</span>}
                {active && <div style={styles.activeIndicator} />}
              </button>
            );
          })}
        </nav>

        <div style={styles.sidebarBottom}>
          {/* Profile above logout */}
          <button
            onClick={() => navigate("/profile")}
            style={{
              ...styles.navItem,
              ...(location.pathname === "/profile" ? styles.navItemActive : {}),
              color: location.pathname === "/profile" ? "var(--accent-light)" : "var(--text-secondary)",
              marginBottom: "4px",
            }}
            onMouseEnter={e => { if (location.pathname !== "/profile") { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "var(--text-primary)"; }}}
            onMouseLeave={e => { if (location.pathname !== "/profile") { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}}
          >
            <span style={styles.navIcon}><ProfileIcon /></span>
            {!collapsed && <span style={styles.navLabel}>Profile</span>}
            {location.pathname === "/profile" && <div style={styles.activeIndicator} />}
          </button>

          <button
            onClick={handleLogout}
            style={{ ...styles.navItem, color: "#666" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(248,113,113,0.06)"; e.currentTarget.style.color = "var(--red)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#666"; }}
          >
            <span style={styles.navIcon}><LogoutIcon /></span>
            {!collapsed && <span style={styles.navLabel}>Log Out</span>}
          </button>
        </div>
      </aside>

      <main style={{ ...styles.content, marginLeft: collapsed ? "64px" : "240px" }}>
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
    top: "-200px", left: "-100px",
    width: "600px", height: "600px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)",
    pointerEvents: "none", zIndex: 0,
  },
  blob2: {
    position: "fixed",
    bottom: "-200px", right: "-100px",
    width: "500px", height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(52,211,153,0.03) 0%, transparent 70%)",
    pointerEvents: "none", zIndex: 0,
  },
  sidebar: {
    position: "fixed",
    top: 0, left: 0,
    height: "100vh",
    background: "rgba(8,8,8,0.97)",
    borderRight: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    transition: "width 0.2s cubic-bezier(0.4,0,0.2,1)",
    zIndex: 100,
    backdropFilter: "blur(20px)",
    overflow: "hidden",
  },
  sidebarTop: {
    padding: "16px 12px",
    borderBottom: "1px solid var(--border)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "var(--radius)",
    transition: "background 0.2s",
  },
  logoMark: {
    width: "32px", height: "32px",
    background: "var(--accent-glow)",
    border: "1px solid rgba(99,102,241,0.25)",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoText: {
    fontSize: "14px",
    fontWeight: "600",
    color: "var(--text-primary)",
    whiteSpace: "nowrap",
    flex: 1,
  },
  logoAccent: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  collapseBtn: { color: "var(--text-muted)", flexShrink: 0 },
  nav: {
    flex: 1,
    padding: "12px 8px",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "9px 10px",
    borderRadius: "var(--radius)",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    transition: "all 0.15s ease",
    width: "100%",
    textAlign: "left",
    position: "relative",
    whiteSpace: "nowrap",
  },
  navItemActive: { background: "var(--accent-glow)" },
  navIcon: { flexShrink: 0, display: "flex", alignItems: "center" },
  navLabel: { flex: 1 },
  activeIndicator: {
    position: "absolute",
    right: "8px",
    width: "4px", height: "4px",
    borderRadius: "50%",
    background: "var(--accent-light)",
  },
  sidebarBottom: {
    padding: "8px",
    borderTop: "1px solid var(--border)",
  },
  content: {
    flex: 1,
    transition: "margin-left 0.2s cubic-bezier(0.4,0,0.2,1)",
    position: "relative",
    zIndex: 1,
    minHeight: "100vh",
  },
  contentInner: {
    padding: "32px",
    maxWidth: "1400px",
  },
};