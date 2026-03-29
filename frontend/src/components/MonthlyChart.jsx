import { useState } from "react";
import { Chart, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
Chart.register(...registerables);

function getMonths(count) {
  const months = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleString("default", { month: "short", year: "2-digit" }),
    });
  }
  return months;
}

export default function MonthlyChart({ transactions }) {
  const [monthCount, setMonthCount] = useState(6);
  const months = getMonths(monthCount);

  const income = months.map(({ key }) =>
    transactions.filter(t => t.type === "income" && t.date?.slice(0, 7) === key)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const expenses = months.map(({ key }) =>
    transactions.filter(t => t.type === "expense" && t.date?.slice(0, 7) === key)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const net = income.map((inc, i) => inc - expenses[i]);

  const data = {
    labels: months.map(m => m.label),
    datasets: [
      {
        label: "Income",
        data: income,
        backgroundColor: "rgba(52,211,153,0.7)",
        borderColor: "rgba(52,211,153,1)",
        borderWidth: 1,
        borderRadius: 6,
        type: "bar",
        order: 2,
      },
      {
        label: "Expenses",
        data: expenses,
        backgroundColor: "rgba(248,113,113,0.7)",
        borderColor: "rgba(248,113,113,1)",
        borderWidth: 1,
        borderRadius: 6,
        type: "bar",
        order: 2,
      },
      {
        label: "Net",
        data: net,
        borderColor: "rgba(99,102,241,1)",
        backgroundColor: "rgba(99,102,241,0.08)",
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: "rgba(99,102,241,1)",
        pointBorderColor: "transparent",
        type: "line",
        tension: 0.4,
        fill: true,
        order: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2.8,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#f0f0f0",
          padding: 16,
          font: { size: 12 },
          boxWidth: 12,
        },
      },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: $${ctx.parsed.y.toFixed(2)}`,
        },
        backgroundColor: "#1a1a1a",
        borderColor: "rgba(255,255,255,0.06)",
        borderWidth: 1,
        titleColor: "#888",
        bodyColor: "#f5f5f5",
        padding: 10,
      },
    },
    scales: {
      x: {
        ticks: { color: "#888", font: { size: 11 } },
        grid: { color: "rgba(255,255,255,0.04)" },
      },
      y: {
        ticks: {
          color: "#888",
          font: { size: 11 },
          callback: val => `$${val}`,
          maxTicksLimit: 5,
        },
        grid: { color: "rgba(255,255,255,0.04)" },
      },
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>Monthly Overview</h3>
        <div style={styles.toggleRow}>
          {[6, 12].map(n => (
            <button
              key={n}
              onClick={() => setMonthCount(n)}
              style={{ ...styles.toggleBtn, ...(monthCount === n ? styles.toggleActive : {}) }}
            >
              {n}M
            </button>
          ))}
        </div>
      </div>
      <Bar data={data} options={options} />
    </div>
  );
}

const styles = {
  card: {
    background: "rgba(255,255,255,0.03)",
    borderRadius: "16px",
    padding: "20px 24px",
    border: "1px solid rgba(255,255,255,0.1)",
    marginBottom: "24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  title: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#fff",
  },
  toggleRow: {
    display: "flex",
    gap: "6px",
  },
  toggleBtn: {
    padding: "4px 12px",
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
};
