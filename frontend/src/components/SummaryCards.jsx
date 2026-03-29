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
      label: "Total Income",
      value: `+$${totalIncome.toFixed(2)}`,
      color: "#34d399",
      bg: "rgba(52,211,153,0.08)",
      border: "rgba(52,211,153,0.2)",
    },
    {
      label: "Total Expenses",
      value: `-$${totalExpenses.toFixed(2)}`,
      color: "#f87171",
      bg: "rgba(248,113,113,0.08)",
      border: "rgba(248,113,113,0.2)",
    },
    {
      label: "Net Balance",
      value: `${balance >= 0 ? "+" : ""}$${balance.toFixed(2)}`,
      color: balance >= 0 ? "#34d399" : "#f87171",
      bg: balance >= 0 ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)",
      border: balance >= 0 ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)",
    },
    {
      label: "Transactions",
      value: transactions.length,
      color: "#a78bfa",
      bg: "rgba(167,139,250,0.08)",
      border: "rgba(167,139,250,0.2)",
    },
  ];

  return (
    <div style={styles.grid}>
      {cards.map(card => (
        <div key={card.label} style={{ ...styles.card, background: card.bg, border: `1px solid ${card.border}` }}>
          <p style={styles.label}>{card.label}</p>
          <p style={{ ...styles.value, color: card.color }}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "24px",
  },
  card: {
    borderRadius: "14px",
    padding: "20px",
  },
  label: {
    fontSize: "12px",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "10px",
  },
  value: {
    fontSize: "clamp(18px, 4vw, 26px)",
    fontWeight: "700",
  },
};