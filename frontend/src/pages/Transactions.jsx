import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import TransactionList from "../components/TransactionList";
import TransactionForm from "../components/TransactionForm";
import BudgetManager from "../components/BudgetManager";
import ExportButton from "../components/ExportButton";
import Card from "../components/Card";
import {
  getTransactions, createTransaction, deleteTransaction,
  updateTransaction, getBudgets
} from "../services/api";

export default function Transactions() {
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
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Transactions</h1>
            <p style={styles.pageSubtitle}>Manage your spending and budgets</p>
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

        {loading && <p style={styles.message}>Loading...</p>}
        {error && (
          <Card style={{ borderColor: "rgba(248,113,113,0.2)", marginBottom: "24px" }}>
            <p style={{ color: "var(--red)", fontSize: "14px" }}>⚠ {error}</p>
          </Card>
        )}

        {!loading && !error && (
          <>
            <div style={{ marginBottom: "24px" }}>
              <BudgetManager
                budgets={budgets}
                transactions={transactions}
                onBudgetsChange={refreshBudgets}
              />
            </div>
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
  },
  message: { color: "var(--text-secondary)", fontSize: "14px" },
};
