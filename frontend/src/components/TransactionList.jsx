export default function TransactionList({ transactions, onDelete, onEdit }) {
  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Transaction History</h3>
      <div style={styles.listContainer}>
        {transactions.length === 0 ? (
          <p style={styles.emptyState}>No transactions yet. Add one to get started!</p>
        ) : (
          transactions.map((t) => (
            <div key={t.id} style={styles.item}>
              <div style={styles.left}>
                <div style={{
                  ...styles.typeBadge,
                  background: t.type === "expense" ? "rgba(248,113,113,0.15)" : "rgba(52,211,153,0.15)",
                  color: t.type === "expense" ? "#f87171" : "#34d399",
                }}>
                  {t.type === "expense" ? "↓" : "↑"}
                </div>
                <div style={styles.details}>
                  <p style={styles.description}>{t.description}</p>
                  <p style={styles.category}>{t.category} · {t.date?.split("T")[0]}</p>
                </div>
              </div>
              <div style={styles.right}>
                <p style={{ ...styles.amount, color: t.type === "expense" ? "#f87171" : "#34d399" }}>
                  {t.type === "expense" ? "-" : "+"}${Math.abs(t.amount).toFixed(2)}
                </p>
                <button
                  onClick={() => onEdit(t)}
                  style={styles.editButton}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.15)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  ✎
                </button>
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
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "16px",
    color: "#ffffff",
  },
  listContainer: {
    maxHeight: "500px",
    overflowY: "auto",
  },
  emptyState: {
    textAlign: "center",
    color: "#a0a0a0",
    padding: "40px 0",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    gap: "12px",
    flexWrap: "wrap",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flex: 1,
    minWidth: "0",
  },
  typeBadge: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "700",
    flexShrink: 0,
  },
  details: {
    minWidth: 0,
  },
  description: {
    color: "#f0f0f0",
    fontSize: "15px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  category: {
    color: "#a0a0a0",
    fontSize: "12px",
    marginTop: "2px",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexShrink: 0,
  },
  amount: {
    fontSize: "15px",
    fontWeight: "700",
    minWidth: "80px",
    textAlign: "right",
  },
  editButton: {
    background: "transparent",
    border: "none",
    color: "#a78bfa",
    fontSize: "16px",
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: "6px",
    transition: "background 0.15s",
    lineHeight: 1,
  },
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