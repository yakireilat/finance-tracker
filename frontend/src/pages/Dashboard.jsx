import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";
import { getTransactions, createTransaction, deleteTransaction } from "../services/api";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import CategoryChart from "../components/CategoryChart";
import SummaryCards from "../components/SummaryCards";


export default function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // This effect runs once when the component mounts to fetch initial data
  useEffect(() => {
    async function fetchTransactions() {
      try {
        setLoading(true);
        const txData = await getTransactions(); // We are only fetching transactions for now
        setTransactions(txData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch transactions. Is the backend running?");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  async function handleAddTransaction(txData) {
    try {
      const newTx = await createTransaction(txData);
      setTransactions((prev) => [newTx, ...prev]); // Add new transaction to the top of the list
    } catch (err) {
      setError("Failed to add transaction.");
      console.error(err);
    }
  }

  async function handleDeleteTransaction(id) {
  try {
    await deleteTransaction(id);
    setTransactions(prev => prev.filter(t => t.id !== id));
  } catch (err) {
    setError("Failed to delete transaction.");
  }
}

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Finance Tracker</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Log Out
        </button>
      </header>

      <main style={styles.main}>
        {loading && <p style={styles.message}>Loading your data...</p>}
        {error && <p style={styles.message}>{error}</p>}
        {!loading && !error && (
          <>
            <SummaryCards transactions={transactions} />
            <div style={styles.topRow}></div>
            <div style={{ marginBottom: "24px" }}>
             <CategoryChart transactions={transactions} />
            </div>
            <div style={styles.card}>
              <div style={styles.listHeader}>
                <h3 style={styles.cardTitle}>All Transactions</h3>
                <button onClick={() => setIsFormOpen(true)} style={styles.addButton}>
                  + Add Transaction
                </button>
              </div>
              <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
            </div>
          </>
        )}
      </main>

      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddTransaction}
      />
    </div>
  );
}

const styles = {
  page: {
    padding: "24px",
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#0f0f1a",
    color: "#f0f0f0",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  },
  title: { fontSize: "32px", fontWeight: "700" },
  logoutButton: {
    padding: "10px 20px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "transparent",
    color: "#aaa",
    cursor: "pointer",
    fontSize: "14px",
  },
  main: {},
  topRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "24px",
    marginBottom: "24px",
  },
  card: {
    background: "rgba(255,255,255,0.03)",
    borderRadius: "16px",
    padding: "24px",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  cardTitle: { fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#fff" },
  balance: { fontSize: "36px", fontWeight: "700" },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  addButton: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  message: {
    textAlign: "center",
    fontSize: "16px",
    color: "#888",
    padding: "20px 0",
  },
};

