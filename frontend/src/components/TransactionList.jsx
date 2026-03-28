export default function TransactionList({ transactions, onDelete }) {
  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Transaction History</h3>
      <div style={styles.listContainer}>
        {transactions.length === 0 ? (
          <p style={styles.emptyState}>No transactions yet. Add one to get started!</p>
        ) : (
          transactions.map((t) => (
            <div key={t.id} style={styles.item}>
              <div style={styles.details}>
                <p style={styles.description}>{t.description}</p>
                <p style={styles.category}>{t.category} · {t.date?.split("T")[0]}</p>
              </div>
              <div style={styles.right}>
                <p style={{ ...styles.amount, color: t.type === "expense" ? "#f87171" : "#34d399" }}>
                  {t.type === "expense" ? "-" : "+"}${Math.abs(t.amount).toFixed(2)}
                </p>
                <button
                  onClick={() => onDelete(t.id)}
                  style={styles.deleteButton}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.15)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "rgba(0,0,0,0.2)",
    borderRadius: "16px",
    padding: "24px",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  header: {
    fontSize: "18px", fontWeight: "600",
    marginBottom: "16px", color: "#ffffff",
  },
  listContainer: { maxHeight: "400px", overflowY: "auto" },
  emptyState: {
    textAlign: "center", color: "#a0a0a0", padding: "40px 0",
  },
  item: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  details: {},
  description: { color: "#f0f0f0", fontSize: "16px" },
  category: { color: "#a0a0a0", fontSize: "12px", marginTop: "4px" },
  right: { display: "flex", alignItems: "center", gap: "16px" },
  amount: { fontSize: "16px", fontWeight: "700" },
  deleteButton: {
    background: "transparent",
    border: "none",
    color: "#f87171",
    fontSize: "14px",
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: "6px",
    transition: "background 0.15s",
    lineHeight: 1,
  },
};