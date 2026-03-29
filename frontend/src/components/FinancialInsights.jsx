import { useMemo } from "react";

export default function FinancialInsights({ transactions }) {
  const insights = useMemo(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;

    const thisTx = transactions.filter(t => t.date?.slice(0, 7) === currentMonth);
    const prevTx = transactions.filter(t => t.date?.slice(0, 7) === prevMonth);

    const thisIncome = thisTx.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const thisExpenses = thisTx.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const prevExpenses = prevTx.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);

    const savingsRate = thisIncome > 0 ? ((thisIncome - thisExpenses) / thisIncome) * 100 : 0;

    const categoryTotals = transactions
      .filter(t => t.type === "expense")
      .reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {});
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const dayOfMonth = now.getDate();
    const avgDailySpend = dayOfMonth > 0 ? thisExpenses / dayOfMonth : 0;
    const projectedMonthly = avgDailySpend * daysInMonth;

    const momChange = prevExpenses > 0 ? ((thisExpenses - prevExpenses) / prevExpenses) * 100 : null;

    return { savingsRate, topCategory, avgDailySpend, projectedMonthly, momChange };
  }, [transactions]);

  const items = [
    {
      label: "Savings Rate",
      value: `${insights.savingsRate.toFixed(1)}%`,
      sub: "of income saved",
      color: insights.savingsRate >= 20 ? "var(--green)" : insights.savingsRate >= 5 ? "var(--amber)" : "var(--red)",
      icon: "◎",
    },
    {
      label: "Top Expense",
      value: insights.topCategory ? insights.topCategory[0] : "—",
      sub: insights.topCategory ? `$${insights.topCategory[1].toFixed(0)} total` : "No expenses yet",
      color: "var(--accent-light)",
      icon: "▸",
    },
    {
      label: "Daily Average",
      value: `$${insights.avgDailySpend.toFixed(0)}`,
      sub: `~$${insights.projectedMonthly.toFixed(0)} projected`,
      color: "var(--text-primary)",
      icon: "≈",
    },
    {
      label: "vs Last Month",
      value: insights.momChange !== null ? `${insights.momChange >= 0 ? "+" : ""}${insights.momChange.toFixed(1)}%` : "—",
      sub: "spending change",
      color: insights.momChange === null ? "var(--text-muted)" : insights.momChange <= 0 ? "var(--green)" : "var(--red)",
      icon: insights.momChange !== null && insights.momChange <= 0 ? "↓" : "↑",
    },
  ];

  return (
    <div style={styles.wrapper}>
      <p style={styles.sectionLabel}>This Month's Insights</p>
      <div style={styles.grid}>
        {items.map(item => (
          <div key={item.label} style={styles.item}>
            <div style={styles.itemTop}>
              <span style={styles.itemLabel}>{item.label}</span>
              <span style={{ color: item.color, fontSize: "14px", fontWeight: "600" }}>{item.icon}</span>
            </div>
            <p style={{ ...styles.itemValue, color: item.color }}>{item.value}</p>
            <p style={styles.itemSub}>{item.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    marginBottom: "24px",
  },
  sectionLabel: {
    fontSize: "12px",
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: "500",
    marginBottom: "12px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
  },
  item: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "16px",
    position: "relative",
    overflow: "hidden",
  },
  itemTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  itemLabel: {
    fontSize: "11px",
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: "500",
  },
  itemValue: {
    fontSize: "22px",
    fontWeight: "700",
    letterSpacing: "-0.02em",
    marginBottom: "3px",
  },
  itemSub: {
    fontSize: "11px",
    color: "var(--text-muted)",
  },
};
