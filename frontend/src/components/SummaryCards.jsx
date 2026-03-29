import Card from "./Card";

export default function SummaryCards({ transactions }) {
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const cards = [
    {
      label: "Net Balance",
      value: `${balance >= 0 ? "+" : ""}$${balance.toFixed(2)}`,
      change: balance >= 0 ? "positive" : "negative",
      color: balance >= 0 ? "var(--green)" : "var(--red)",
      glow: balance >= 0 ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)",
      icon: "◈",
      sub: "All time",
    },
    {
      label: "Total Income",
      value: `+$${totalIncome.toFixed(2)}`,
      color: "var(--green)",
      glow: "rgba(52,211,153,0.06)",
      icon: "↑",
      sub: `${transactions.filter(t => t.type === "income").length} transactions`,
    },
    {
      label: "Total Expenses",
      value: `-$${totalExpenses.toFixed(2)}`,
      color: "var(--red)",
      glow: "rgba(248,113,113,0.06)",
      icon: "↓",
      sub: `${transactions.filter(t => t.type === "expense").length} transactions`,
    },
    {
      label: "Transactions",
      value: transactions.length,
      color: "var(--accent-light)",
      glow: "rgba(99,102,241,0.06)",
      icon: "≡",
      sub: "Total recorded",
    },
  ];

  return (
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
          {/* Bottom gradient line */}
          <div style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: "2px",
            background: `linear-gradient(90deg, transparent, ${card.color}33, transparent)`,
          }} />
        </Card>
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
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