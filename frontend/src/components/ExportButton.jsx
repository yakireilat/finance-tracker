export default function ExportButton({ transactions }) {
  function exportToCSV() {
    const headers = ["Date", "Type", "Category", "Description", "Amount"];

    const rows = transactions.map(t => [
      t.date?.split("T")[0] || "",
      t.type,
      t.category,
      `"${(t.description || "").replace(/"/g, '""')}"`,
      t.type === "expense" ? -t.amount : t.amount,
    ]);

    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={exportToCSV}
      style={styles.button}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.15)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      ↓ Export CSV
    </button>
  );
}

const styles = {
  button: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid rgba(99,102,241,0.4)",
    background: "transparent",
    color: "#a78bfa",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.15s",
    whiteSpace: "nowrap",
  },
};