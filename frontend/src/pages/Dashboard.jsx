import { useState, useEffect } from "react";
import {
  getTransactions, createTransaction, deleteTransaction,
  updateTransaction, getBudgets
} from "../services/api";
import Layout from "../components/Layout";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import CategoryChart from "../components/CategoryChart";
import MonthlyChart from "../components/MonthlyChart";
import SummaryCards from "../components/SummaryCards";
import ExportButton from "../components/ExportButton";
import BudgetManager from "../components/BudgetManager";
import Card from "../components/Card";

export default function Dashboard() {
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
        setError("Failed to fetch data.");
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

  return (
    <Layout>
      <div style={styles.page}>
        {/* Page header */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Dashboard</h1>
            <p style={styles.pageSubtitle}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div style={styles.headerActions}>
            <ExportButton transactions={transactions} />
            <button
              onClick={() => { setEditingTransaction(null); setIsFormOpen(true); }}
              style={styles.addButton}
            >
              + Add Transaction
            </button>
          </div>
        </div>

        {loading && (
          <div style={styles.loadingGrid}>
            {[1,2,3,4].map(i => (
              <div key={i} style={styles.skeleton} />
            ))}
          </div>
        )}

        {error && (
          <Card style={{ borderColor: "rgba(248,113,113,0.2)", marginBottom: "24px" }}>
            <p style={{ color: "var(--red)", fontSize: "14px" }}>⚠ {error}</p>
          </Card>
        )}

        {!loading && !error && (
          <>
            <SummaryCards transactions={transactions} />

            <div style={styles.chartsRow}>
              <div style={{ flex: 2 }}>
                <MonthlyChart transactions={transactions} />
              </div>
              <div style={{ flex: 1 }}>
                <CategoryChart transactions={transactions} />
              </div>
            </div>

            <BudgetManager
              budgets={budgets}
              transactions={transactions}
              onBudgetsChange={refreshBudgets}
            />

            <TransactionList
              transactions={transactions}
              onDelete={handleDeleteTransaction}
              onEdit={handleEditTransaction}
            />
          </>
        )}
      </div>

      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingTransaction(null); }}
        onSubmit={handleSubmitTransaction}
        editingTransaction={editingTransaction}
      />
    </Layout>
  );
}

const styles = {
  page: { animation: "fadeIn 0.3s ease" },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    flexWrap: "wrap",
    gap: "16px",
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: "700",
    letterSpacing: "-0.02em",
    marginBottom: "4px",
  },
  pageSubtitle: { color: "var(--text-secondary)", fontSize: "13px" },
  headerActions: { display: "flex", gap: "12px", alignItems: "center" },
  addButton: {
    padding: "10px 20px",
    borderRadius: "var(--radius)",
    border: "none",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "opacity var(--transition)",
  },
  chartsRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  loadingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "24px",
  },
  skeleton: {
    height: "100px",
    borderRadius: "var(--radius-lg)",
    background: "linear-gradient(90deg, var(--bg-card) 25%, var(--bg-elevated) 50%, var(--bg-card) 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  },
};