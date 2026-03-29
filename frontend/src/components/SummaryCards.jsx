import { useState, useMemo } from "react";
import Card from "./Card";

export default function SummaryCards({ transactions }) {
  const [period, setPeriod] = useState("month");

  const filtered = useMemo(() => {
    if (period === "all") return transactions;
    const now = new Date();
    const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return transactions.filter(t => t.date?.slice(0, 7) === key);
  }, [transactions, period]);

  const totalIncome = filtered.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = filtered.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const cards = [
    {
      label: "Net Balance",
      value: `${balance >= 0 ? "+" : ""}$${balance.toFixed(2)}`,
      color: balance >= 0 ? "var(--green)" : "var(--red)",
      glow: balance >= 0 ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)",
      icon: "◈",
      sub: period === "all" ? "All time" : "This month",
    },
    {
      label: "Total Income",
      value: `+$${totalIncome.toFixed(2)}`,
      color: "var(--green)",
      glow: "rgba(52,211,153,0.06)",
      icon: "↑",
      sub: `${filtered.filter(t => t.type === "income").length} transactions`,
    },
    {
      label: "Total Expenses",
      value: `-$${totalExpenses.toFixed(2)}`,
      color: "var(--red)",
      glow: "rgba(248,113,113,0.06)",
      icon: "↓",
      sub: `${filtered.filter(t => t.type === "expense").length} transactions`,
    },
    {
      label: "Transactions",
      value: filtered.length,
      color: "var(--accent-light)",
      glow: "rgba(99,102,241,0.06)",
      icon: "≡",
      sub: "Total recorded",
    },
  ];

  return (
    <div style={{ marginBottom: "24px" }}>
      <div style={styles.toggleRow}>
        {[
          { key: "month", label: "This Month" },
          { key: "all", label: "All Time" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setPeriod(key)}
            style={{ ...styles.toggleBtn, ...(period === key ? styles.toggleActive : {}) }}
          >
            {label}
          </button>
        ))}
      </div>
      <div style={styles.grid}>
        {cards.map((card, i) => (
          <Card key={card.label} style={{ animationDelay: `${i * 0.05}s` }}>
            <div style={styles.cardTop}>
              <span style={styles.label}>{card.label}</span>
              <span style={{ ...styles.icon, color: card.color, background: card.glow }}>
                {card.icon}
              </span>
            </div>
            <p style={{ ...styles.value, color: card.color }}>{card.value}</p>
            <p style={styles.sub}>{card.sub}</p>
            <div style={{
              position: "absolute",
              bottom: 0, left: 0, right: 0,
              height: "2px",
              background: `linear-gradient(90deg, transparent, ${card.color}33, transparent)`,
            }} />
          </Card>
        ))}
      </div>
    </div>
  );
}

const styles = {
  toggleRow: {
    display: "flex",
    gap: "6px",
    marginBottom: "16px",
  },
  toggleBtn: {
    padding: "5px 14px",
    borderRadius: "20px",
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--text-muted)",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all var(--transition)",
  },
  toggleActive: {
    background: "var(--accent-glow)",
    borderColor: "var(--accent)",
    color: "var(--accent-light)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  label: {
    fontSize: "12px",
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: "500",
  },
  icon: {
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "700",
  },
  value: {
    fontSize: "28px",
    fontWeight: "700",
    letterSpacing: "-0.02em",
    marginBottom: "4px",
  },
  sub: {
    fontSize: "11px",
    color: "var(--text-muted)",
  },
};
