import { useState, useRef, useEffect } from "react";

const TRANSACTION_TYPES = ["expense", "income"];
const DEFAULT_CATEGORIES = {
  expense: ["Food", "Transport", "Entertainment", "Utilities", "Shopping", "Other"],
  income: ["Salary", "Freelance", "Investment", "Other"],
};

function CustomSelect({ name, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function select(val) {
    onChange({ target: { name, value: val } });
    setOpen(false);
  }

  const label = options.find(o => o.value === value)?.label || value;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div onClick={() => setOpen(o => !o)} style={dropStyles.trigger}>
        <span>{label}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      {open && (
        <div style={dropStyles.list}>
          {options.map(o => (
            <div
              key={o.value}
              onClick={() => select(o.value)}
              style={{ ...dropStyles.item, ...(o.value === value ? dropStyles.active : {}) }}
              onMouseEnter={e => { if (o.value !== value) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { if (o.value !== value) e.currentTarget.style.background = "transparent"; }}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const dropStyles = {
  trigger: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "11px 16px", borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "#12122a", color: "#f0f0f0",
    fontSize: "15px", cursor: "pointer", userSelect: "none",
  },
  list: {
    position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
    background: "#1e1e3a", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px", overflow: "hidden", zIndex: 999,
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  },
  item: {
    padding: "11px 16px", color: "#d0d0e8",
    fontSize: "15px", cursor: "pointer",
    transition: "background 0.15s",
    background: "transparent",
  },
  active: {
    background: "rgba(99,102,241,0.25)", color: "#a78bfa", fontWeight: "600",
  },
};

const emptyForm = {
  amount: "",
  description: "",
  type: "expense",
  category: "Food",
  date: new Date().toISOString().split("T")[0],
};

export default function TransactionForm({ isOpen, onClose, onSubmit, editingTransaction }) {
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  // When editingTransaction changes, pre-fill the form
  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        amount: editingTransaction.amount,
        description: editingTransaction.description || "",
        type: editingTransaction.type,
        category: editingTransaction.category,
        date: editingTransaction.date?.split("T")[0] || new Date().toISOString().split("T")[0],
      });
    } else {
      setFormData(emptyForm);
    }
  }, [editingTransaction]);

  const categoryOptions = DEFAULT_CATEGORIES[formData.type];

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === "type") {
        updated.category = DEFAULT_CATEGORIES[value][0];
      }
      return updated;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData, editingTransaction?.id);
    setLoading(false);
    setFormData(emptyForm);
    onClose();
  }

  if (!isOpen) return null;

  const isEditing = !!editingTransaction;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>{isEditing ? "Edit Transaction" : "Add Transaction"}</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Type</label>
            <CustomSelect
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={TRANSACTION_TYPES.map(t => ({
                value: t,
                label: t.charAt(0).toUpperCase() + t.slice(1),
              }))}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Category</label>
            <CustomSelect
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={categoryOptions.map(c => ({ value: c, label: c }))}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Amount ($)</label>
            <input
              type="number" step="0.01" name="amount"
              value={formData.amount} onChange={handleChange}
              required style={styles.input} placeholder="0.00"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <input
              type="text" name="description"
              value={formData.description} onChange={handleChange}
              placeholder="e.g., Dinner with friends" style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Date</label>
            <input
              type="date" name="date"
              value={formData.date} onChange={handleChange}
              required style={styles.input}
            />
          </div>

          <div style={styles.buttonGroup}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={styles.submitButton}>
              {loading ? "Saving..." : isEditing ? "Save Changes" : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.75)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "16px",
},
  modal: {
  background: "#1a1a2e",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "20px",
  padding: "32px 24px",
  width: "calc(100% - 32px)",
  maxWidth: "450px",
  maxHeight: "90vh",
  overflowY: "auto",
},
  title: {
    fontSize: "24px", marginBottom: "24px",
    color: "#fff", textAlign: "center", fontWeight: "700",
  },
  field: { display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" },
  label: {
    fontSize: "13px", color: "#888", fontWeight: "500",
    textTransform: "uppercase", letterSpacing: "0.05em",
  },
  input: {
    padding: "11px 16px", borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "#12122a", color: "#f0f0f0",
    fontSize: "15px", outline: "none",
  },
  buttonGroup: { display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" },
  cancelButton: {
    padding: "12px 20px", borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "transparent", color: "#888",
    fontSize: "14px", cursor: "pointer",
  },
  submitButton: {
    padding: "12px 24px", borderRadius: "10px", border: "none",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer",
  },
};