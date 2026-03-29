import { useState } from "react";
import { saveBudget, deleteBudget } from "../services/api";

const CATEGORIES = ["Food", "Transport", "Entertainment", "Utilities", "Shopping", "Other"];

export default function BudgetManager({ budgets, transactions, onBudgetsChange }) {
  const [selectedCategory, setSelectedCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const currentMonth = new Date().toISOString().slice(0, 7);

  function getSpent(category) {
    return transactions
      .filter(t => t.type === "expense" &&
        t.category === category &&
        t.date?.slice(0, 7) === currentMonth)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  async function handleSave() {
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;
    setLoading(true);
    try {
      await saveBudget({ category: selectedCategory, amount: Number(amount) });
      await onBudgetsChange();
      setAmount("");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    await deleteBudget(id);
    await onBudgetsChange();
  }

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Monthly Budgets</h3>

      <div style={styles.form}>
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          style={styles.select}
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input
          type="number"
          placeholder="Limit ($)"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSave} disabled={loading} style={styles.saveButton}>
          {loading ? "Saving..." : "Set"}
        </button>
      </div>

      <div style={styles.list}>
        {budgets.length === 0 && (
          <p style={styles.empty}>No budgets set yet. Add one above.</p>
        )}
        {budgets.map(b => {
          const spent = getSpent(b.category);
          const pct = Math.min((spent / b.amount) * 100, 100);
          const over = spent > b.amount;
          const warning = pct >= 80;

          return (
            <div key={b.id} style={styles.budgetItem}>
              <div style={styles.budgetHeader}>
                <div style={styles.budgetLeft}>
                  <span style={styles.categoryName}>{b.category}</span>
                  {over && <span style={styles.overBadge}>Over budget!</span>}
                  {!over && warning && <span style={styles.warningBadge}>Almost there</span>}
                </div>
                <div style={styles.budgetRight}>
                  <span style={{ color: over ? "#f87171" : "#f0f0f0" }}>
                    ${spent.toFixed(2)}
                  </span>
                  <span style={styles.budgetLimit}> / ${b.amount.toFixed(2)}</span>
                  <button
                    onClick={() => handleDelete(b.id)}
                    style={styles.deleteButton}
                    onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
                    onMouseLeave={e => e.currentTarget.style.color = "#555"}
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div style={styles.barTrack}>
                <div style={{
                  ...styles.barFill,
                  width: `${pct}%`,
                  background: over
                    ? "#f87171"
                    : warning
                    ? "#fbbf24"
                    : "#34d399",
                }}/>
              </div>
            </div>
          );
        })}
      </div>
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
  title: { fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#fff" },
  form: { display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" },
  select: {
    flex: 1, minWidth: "120px", padding: "10px 12px",
    borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)",
    background: "#12122a", color: "#f0f0f0", fontSize: "14px", outline: "none",
  },
  input: {
    flex: 1, minWidth: "100px", padding: "10px 12px",
    borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)",
    background: "#12122a", color: "#f0f0f0", fontSize: "14px", outline: "none",
  },
  saveButton: {
    padding: "10px 20px", borderRadius: "8px", border: "none",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer",
  },
  list: { display: "flex", flexDirection: "column", gap: "14px" },
  empty: { color: "#666", fontSize: "14px", textAlign: "center", padding: "16px 0" },
  budgetItem: {},
  budgetHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "6px", flexWrap: "wrap", gap: "8px",
  },
  budgetLeft: { display: "flex", alignItems: "center", gap: "8px" },
  categoryName: { color: "#f0f0f0", fontSize: "14px", fontWeight: "500" },
  overBadge: {
    fontSize: "11px", padding: "2px 8px", borderRadius: "20px",
    background: "rgba(248,113,113,0.2)", color: "#f87171", fontWeight: "600",
  },
  warningBadge: {
    fontSize: "11px", padding: "2px 8px", borderRadius: "20px",
    background: "rgba(251,191,36,0.2)", color: "#fbbf24", fontWeight: "600",
  },
  budgetRight: { display: "flex", alignItems: "center", gap: "4px" },
  budgetLimit: { color: "#666", fontSize: "14px" },
  deleteButton: {
    background: "none", border: "none", color: "#555",
    cursor: "pointer", fontSize: "12px", padding: "2px 6px",
    transition: "color 0.15s",
  },
  barTrack: {
    height: "6px", borderRadius: "3px",
    background: "rgba(255,255,255,0.06)", overflow: "hidden",
  },
  barFill: {
    height: "100%", borderRadius: "3px",
    transition: "width 0.4s ease, background 0.3s ease",
  },
};