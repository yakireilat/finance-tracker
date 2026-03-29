import { useState, useEffect } from "react";
import { getTransactions, getBudgets } from "../services/api";
import Layout from "../components/Layout";
import SummaryCards from "../components/SummaryCards";
import CategoryChart from "../components/CategoryChart";
import MonthlyChart from "../components/MonthlyChart";
import Card from "../components/Card";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const txData = await getTransactions();
        setTransactions(txData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <Layout>
      <div style={styles.page}>
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Dashboard</h1>
            <p style={styles.pageSubtitle}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long", year: "numeric",
                month: "long", day: "numeric"
              })}
            </p>
          </div>
        </div>

        {loading && (
          <div style={styles.skeletonGrid}>
            {[1,2,3,4].map(i => <div key={i} style={styles.skeleton} />)}
          </div>
        )}

        {error && (
          <Card style={{ borderColor: "rgba(248,113,113,0.2)", marginBottom: "24px" }}>
            <p style={{ color: "var(--red)", fontSize: "14px" }}>⚠ {error}</p>
          </Card>
        )}

        {!loading && !error && (
          <>
            <SummaryCards transactions={transactions} />

            <div style={styles.chartsRow}>
              <div style={{ flex: 2, minWidth: 0 }}>
                <MonthlyChart transactions={transactions} />
              </div>
              <div style={{ flex: 1, minWidth: "260px" }}>
                <CategoryChart transactions={transactions} />
              </div>
            </div>

            {/* Recent transactions preview */}
            <Card>
              <div style={styles.recentHeader}>
                <p style={styles.recentTitle}>Recent Activity</p>
                <a href="/transactions" style={styles.viewAll}>View all →</a>
              </div>
              {transactions.slice(0, 5).map(t => (
                <div key={t.id} style={styles.recentItem}>
                  <div style={{
                    ...styles.recentDot,
                    background: t.type === "expense"
                      ? "rgba(248,113,113,0.12)"
                      : "rgba(52,211,153,0.12)",
                  }}>
                    <span style={{ color: t.type === "expense" ? "var(--red)" : "var(--green)", fontSize: "11px", fontWeight: "700" }}>
                      {t.type === "expense" ? "↓" : "↑"}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={styles.recentDesc}>{t.description || t.category}</p>
                    <p style={styles.recentMeta}>{t.category} · {t.date?.split("T")[0]}</p>
                  </div>
                  <span style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: t.type === "expense" ? "var(--red)" : "var(--green)",
                  }}>
                    {t.type === "expense" ? "-" : "+"}${t.amount.toFixed(2)}
                  </span>
                </div>
              ))}
              {transactions.length === 0 && (
                <p style={{ color: "var(--text-muted)", fontSize: "13px", textAlign: "center", padding: "24px 0" }}>
                  No transactions yet
                </p>
              )}
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}

const styles = {
  page: { animation: "fadeIn 0.3s ease" },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    flexWrap: "wrap",
    gap: "16px",
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: "700",
    letterSpacing: "-0.02em",
    marginBottom: "4px",
  },
  pageSubtitle: { color: "var(--text-secondary)", fontSize: "13px" },
  chartsRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "24px",
    flexWrap: "wrap",
    alignItems: "stretch",
  },
  skeletonGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "24px",
  },
  skeleton: {
    height: "100px",
    borderRadius: "var(--radius-lg)",
    background: "linear-gradient(90deg, var(--bg-card) 25%, var(--bg-elevated) 50%, var(--bg-card) 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  },
  recentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  recentTitle: {
    fontSize: "13px",
    fontWeight: "500",
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  viewAll: {
    fontSize: "12px",
    color: "var(--accent-light)",
    textDecoration: "none",
    fontWeight: "500",
  },
  recentItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 0",
    borderBottom: "1px solid var(--border)",
  },
  recentDot: {
    width: "30px", height: "30px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  recentDesc: { fontSize: "13px", color: "var(--text-primary)", fontWeight: "500", marginBottom: "2px" },
  recentMeta: { fontSize: "11px", color: "var(--text-muted)" },
};