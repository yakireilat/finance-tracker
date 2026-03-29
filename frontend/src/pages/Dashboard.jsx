import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";
import {
  getTransactions, createTransaction, deleteTransaction,
  updateTransaction, getBudgets
} from "../services/api";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import CategoryChart from "../components/CategoryChart";
import MonthlyChart from "../components/MonthlyChart";
import SummaryCards from "../components/SummaryCards";
import ExportButton from "../components/ExportButton";
import BudgetManager from "../components/BudgetManager";

export default function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [txData, budgetData] = await Promise.all([
          getTransactions(),
          getBudgets(),
        ]);
        setTransactions(txData);
        setBudgets(budgetData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch data. Is the backend running?");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function refreshBudgets() {
    const budgetData = await getBudgets();
    setBudgets(budgetData);
  }

  async function handleSubmitTransaction(txData, editingId) {
    try {
      if (editingId) {
        const updated = await updateTransaction(editingId, txData);
        setTransactions(prev => prev.map(t => t.id === editingId ? updated : t));
      } else {
        const newTx = await createTransaction(txData);
        setTransactions(prev => [newTx, ...prev]);
      }
    } catch (err) {
      setError("Failed to save transaction.");
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

  function handleEditTransaction(transaction) {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
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

            <MonthlyChart transactions={transactions} />

            <div style={{ marginBottom: "24px" }}>
              <CategoryChart transactions={transactions} />
            </div>

            <BudgetManager
              budgets={budgets}
              transactions={transactions}
              onBudgetsChange={refreshBudgets}
            />

            <div style={styles.card}>
              <div style={styles.listHeader}>
                <h3 style={styles.cardTitle}>All Transactions</h3>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <ExportButton transactions={transactions} />
                  <button
                    onClick={() => { setEditingTransaction(null); setIsFormOpen(true); }}
                    style={styles.addButton}
                  >
                    + Add Transaction
                  </button>
                </div>
              </div>
              <TransactionList
                transactions={transactions}
                onDelete={handleDeleteTransaction}
                onEdit={handleEditTransaction}
              />
            </div>
          </>
        )}
      </main>

      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingTransaction(null); }}
        onSubmit={handleSubmitTransaction}
        editingTransaction={editingTransaction}
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
    maxWidth: "1600px",
    margin: "0 auto",
  },
  header: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "32px",
    flexWrap: "wrap", gap: "12px",
  },
  title: { fontSize: "clamp(20px, 5vw, 32px)", fontWeight: "700" },
  logoutButton: {
    padding: "10px 20px", borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "transparent", color: "#aaa",
    cursor: "pointer", fontSize: "14px", whiteSpace: "nowrap",
  },
  main: {},
  card: {
    background: "rgba(255,255,255,0.03)",
    borderRadius: "16px", padding: "24px",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  cardTitle: { fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#fff" },
  listHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "16px",
    flexWrap: "wrap", gap: "12px",
  },
  addButton: {
    padding: "10px 16px", borderRadius: "8px", border: "none",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff", fontSize: "14px", fontWeight: "600",
    cursor: "pointer", whiteSpace: "nowrap",
  },
  message: {
    textAlign: "center", fontSize: "16px",
    color: "#888", padding: "20px 0",
  },
};