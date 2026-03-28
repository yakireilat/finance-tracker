import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryChart({ transactions }) {
  // Process transactions for the chart
  const expenseData = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const chartData = {
    labels: Object.keys(expenseData),
    datasets: [
      {
        label: "Spending by Category",
        data: Object.values(expenseData),
        backgroundColor: [
          "#6366f1",
          "#8b5cf6",
          "#ec4899",
          "#f43f5e",
          "#f97316",
          "#eab308",
          "#84cc16",
          "#10b981",
          "#14b8a6",
          "#06b6d4",
        ],
        borderColor: "#0f0f1a",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#f0f0f0",
          padding: 15,
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed !== null) {
              label += "$" + context.parsed.toFixed(2);
            }
            return label;
          },
        },
      },
    },
  };

  if (Object.keys(expenseData).length === 0) {
    return (
      <div style={styles.container}>
        <h3 style={styles.header}>Spending by Category</h3>
        <p style={styles.emptyState}>No expense data to display yet.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Spending by Category</h3>
      <Pie style={{ maxHeight: "250px" }} data={chartData} options={options} />
    </div>
  );
}

const styles = {
  container: {
    background: "rgba(255,255,255,0.03)",
    borderRadius: "16px",
    padding: "24px",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  header: { fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#fff" },
  emptyState: {
    textAlign: "center",
    color: "#888",
    padding: "40px 0",
  },
};
