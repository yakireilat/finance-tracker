import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

function getLast6Months() {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleString("default", { month: "short", year: "2-digit" }),
    });
  }
  return months;
}

export default function MonthlyChart({ transactions }) {
  const months = getLast6Months();

  const income = months.map(({ key }) =>
    transactions
      .filter(t => t.type === "income" && t.date?.startsWith(key))
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const expenses = months.map(({ key }) =>
    transactions
      .filter(t => t.type === "expense" && t.date?.startsWith(key))
      .reduce((sum, t) => sum + t.amount, 0)
  );

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
      },
      {
        label: "Expenses",
        data: expenses,
        backgroundColor: "rgba(248,113,113,0.7)",
        borderColor: "rgba(248,113,113,1)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#f0f0f0",
          padding: 20,
          font: { size: 13 },
        },
      },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: $${ctx.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#888", font: { size: 12 } },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
      y: {
        ticks: {
          color: "#888",
          font: { size: 12 },
          callback: val => `$${val}`,
        },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Monthly Overview</h3>
      <Bar data={data} options={options} />
    </div>
  );
}

const styles = {
  card: {
    background: "rgba(255,255,255,0.03)",
    borderRadius: "16px",
    padding: "24px",
    border: "1px solid rgba(255,255,255,0.1)",
    marginBottom: "24px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "16px",
    color: "#fff",
  },
};