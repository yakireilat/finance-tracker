import { Chart, registerables } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import Card from "./Card";
Chart.register(...registerables);

const COLORS = ["#6366f1", "#34d399", "#f87171", "#fbbf24", "#a78bfa", "#22d3ee", "#fb923c", "#4ade80"];

export default function CategoryChart({ transactions }) {
  const expenseData = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const total = Object.values(expenseData).reduce((s, v) => s + v, 0);
  const labels = Object.keys(expenseData);
  const values = Object.values(expenseData);

  const chartData = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: COLORS.slice(0, labels.length),
      borderColor: "transparent",
      borderWidth: 0,
      hoverOffset: 4,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: "72%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => ` ${ctx.label}: $${ctx.parsed.toFixed(2)} (${((ctx.parsed / total) * 100).toFixed(1)}%)`,
        },
        backgroundColor: "#1a1a1a",
        borderColor: "rgba(255,255,255,0.06)",
        borderWidth: 1,
        titleColor: "#888",
        bodyColor: "#f5f5f5",
        padding: 10,
      },
    },
  };

  if (labels.length === 0) {
    return (
      <Card style={{ height: "100%" }}>
        <p style={styles.title}>Spending</p>
        <div style={styles.empty}>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No expenses yet</p>
        </div>
      </Card>
    );
  }

  return (
    <Card style={{ height: "100%" }}>
      <p style={styles.title}>Spending</p>

      <div style={styles.donutWrapper}>
        <Doughnut data={chartData} options={options} />
        <div style={styles.donutCenter}>
          <span style={styles.totalLabel}>Total</span>
          <span style={styles.totalValue}>${total.toFixed(0)}</span>
        </div>
      </div>

      <div style={styles.legend}>
        {labels.map((label, i) => (
          <div key={label} style={styles.legendItem}>
            <div style={{ ...styles.legendDot, background: COLORS[i] }} />
            <span style={styles.legendLabel}>{label}</span>
            <span style={styles.legendValue}>${values[i].toFixed(0)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

const styles = {
  title: {
    fontSize: "13px",
    fontWeight: "500",
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "20px",
  },
  donutWrapper: {
    position: "relative",
    maxWidth: "180px",
    margin: "0 auto 20px",
  },
  donutCenter: {
    position: "absolute",
    top: "50%", left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    pointerEvents: "none",
  },
  totalLabel: {
    display: "block",
    fontSize: "10px",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "2px",
  },
  totalValue: {
    display: "block",
    fontSize: "18px",
    fontWeight: "700",
    color: "var(--text-primary)",
    letterSpacing: "-0.02em",
  },
  legend: { display: "flex", flexDirection: "column", gap: "8px" },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  legendDot: {
    width: "6px", height: "6px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  legendLabel: {
    flex: 1,
    fontSize: "12px",
    color: "var(--text-secondary)",
  },
  legendValue: {
    fontSize: "12px",
    color: "var(--text-primary)",
    fontWeight: "500",
  },
  empty: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "160px",
  },
};