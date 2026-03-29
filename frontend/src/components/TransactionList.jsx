import { useState, useMemo } from "react";
import Card from "./Card";

const PAGE_SIZE = 20;

export default function TransactionList({ transactions, onDelete, onEdit }) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const categories = useMemo(() =>
    ["all", ...new Set(transactions.map(t => t.category))],
    [transactions]
  );

  const filtered = useMemo(() => {
    let result = [...transactions];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.description?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q)
      );
    }

    if (filterType !== "all") result = result.filter(t => t.type === filterType);
    if (filterCategory !== "all") result = result.filter(t => t.category === filterCategory);
    if (dateFrom) result = result.filter(t => t.date?.slice(0, 10) >= dateFrom);
    if (dateTo) result = result.filter(t => t.date?.slice(0, 10) <= dateTo);

    switch (sortBy) {
      case "date_desc": result.sort((a, b) => new Date(b.date) - new Date(a.date)); break;
      case "date_asc": result.sort((a, b) => new Date(a.date) - new Date(b.date)); break;
      case "amount_desc": result.sort((a, b) => b.amount - a.amount); break;
      case "amount_asc": result.sort((a, b) => a.amount - b.amount); break;
    }

    return result;
  }, [transactions, search, filterType, filterCategory, sortBy, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleFilterChange(setter) {
    return (e) => { setter(e.target.value); setPage(1); };
  }

  return (
    <Card>
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>Transactions</h3>
          <p style={styles.count}>{filtered.length} of {transactions.length} shown</p>
        </div>
      </div>

      {/* Primary filters */}
      <div style={styles.filters}>
        <div style={styles.searchWrapper}>
          <span style={styles.searchIcon}>⌕</span>
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={styles.searchInput}
          />
          {search && (
            <button onClick={() => { setSearch(""); setPage(1); }} style={styles.clearSearch}>✕</button>
          )}
        </div>

        <select value={filterType} onChange={handleFilterChange(setFilterType)} style={styles.select}>
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select value={filterCategory} onChange={handleFilterChange(setFilterCategory)} style={styles.select}>
          {categories.map(c => (
            <option key={c} value={c}>{c === "all" ? "All categories" : c}</option>
          ))}
        </select>

        <select value={sortBy} onChange={handleFilterChange(setSortBy)} style={styles.select}>
          <option value="date_desc">Newest first</option>
          <option value="date_asc">Oldest first</option>
          <option value="amount_desc">Highest amount</option>
          <option value="amount_asc">Lowest amount</option>
        </select>
      </div>

      {/* Date range filter */}
      <div style={styles.dateRange}>
        <span style={styles.dateLabel}>Date range:</span>
        <div style={styles.dateInputWrapper}>
          <input
            type="date"
            value={dateFrom}
            onChange={e => { setDateFrom(e.target.value); setPage(1); }}
            style={styles.dateInput}
          />
        </div>
        <span style={styles.dateSep}>→</span>
        <div style={styles.dateInputWrapper}>
          <input
            type="date"
            value={dateTo}
            onChange={e => { setDateTo(e.target.value); setPage(1); }}
            style={styles.dateInput}
          />
        </div>
        {(dateFrom || dateTo) && (
          <button
            onClick={() => { setDateFrom(""); setDateTo(""); setPage(1); }}
            style={styles.clearDate}
          >
            Clear
          </button>
        )}
      </div>

      {/* List */}
      <div style={styles.list}>
        {paginated.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyIcon}>◎</p>
            <p style={styles.emptyText}>No transactions found</p>
          </div>
        ) : (
          paginated.map((t, i) => (
            <div
              key={t.id}
              style={{ ...styles.item, animationDelay: `${i * 0.02}s` }}
              className="animate-fade"
            >
              <div style={styles.itemLeft}>
                <div style={{
                  ...styles.typeDot,
                  background: t.type === "expense"
                    ? "rgba(248,113,113,0.12)"
                    : "rgba(52,211,153,0.12)",
                }}>
                  <span style={{
                    color: t.type === "expense" ? "var(--red)" : "var(--green)",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}>
                    {t.type === "expense" ? "↓" : "↑"}
                  </span>
                </div>
                <div>
                  <p style={styles.desc}>{t.description || "—"}</p>
                  <div style={styles.meta}>
                    <span style={styles.categoryPill}>{t.category}</span>
                    <span style={styles.date}>{t.date?.split("T")[0]}</span>
                  </div>
                </div>
              </div>

              <div style={styles.itemRight}>
                <span style={{
                  ...styles.amount,
                  color: t.type === "expense" ? "var(--red)" : "var(--green)",
                }}>
                  {t.type === "expense" ? "-" : "+"}${Math.abs(t.amount).toFixed(2)}
                </span>
                <div style={styles.actions}>
                  <button
                    onClick={() => onEdit(t)}
                    style={styles.actionBtn}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--accent-light)"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                  >✎</button>
                  <button
                    onClick={() => onDelete(t.id)}
                    style={styles.actionBtn}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--red)"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                  >✕</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{ ...styles.pageBtn, ...(currentPage === 1 ? styles.pageBtnDisabled : {}) }}
          >
            ← Prev
          </button>
          <div style={styles.pageInfo}>
            <span style={styles.pageNum}>Page {currentPage} of {totalPages}</span>
            <span style={styles.pageRange}>
              {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{ ...styles.pageBtn, ...(currentPage === totalPages ? styles.pageBtnDisabled : {}) }}
          >
            Next →
          </button>
        </div>
      )}
    </Card>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  },
  title: { fontSize: "16px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "2px" },
  count: { fontSize: "12px", color: "var(--text-muted)" },
  filters: {
    display: "flex",
    gap: "10px",
    marginBottom: "12px",
    flexWrap: "wrap",
  },
  searchWrapper: {
    position: "relative",
    flex: "1",
    minWidth: "180px",
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    left: "12px",
    color: "var(--text-muted)",
    fontSize: "16px",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    padding: "9px 12px 9px 36px",
    background: "var(--bg-input)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--text-primary)",
    fontSize: "13px",
    outline: "none",
    transition: "border-color var(--transition)",
  },
  clearSearch: {
    position: "absolute",
    right: "10px",
    background: "none",
    border: "none",
    color: "var(--text-muted)",
    cursor: "pointer",
    fontSize: "12px",
  },
  select: {
    padding: "9px 12px",
    background: "var(--bg-input)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--text-secondary)",
    fontSize: "13px",
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23555' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    paddingRight: "30px",
  },
  dateRange: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  dateLabel: {
    fontSize: "12px",
    color: "var(--text-muted)",
    whiteSpace: "nowrap",
  },
  dateInputWrapper: {
    position: "relative",
  },
  dateInput: {
    padding: "7px 10px",
    background: "var(--bg-input)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--text-secondary)",
    fontSize: "12px",
    outline: "none",
    colorScheme: "dark",
  },
  dateSep: {
    color: "var(--text-muted)",
    fontSize: "12px",
  },
  clearDate: {
    padding: "6px 12px",
    background: "transparent",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--text-muted)",
    fontSize: "12px",
    cursor: "pointer",
  },
  list: {},
  empty: { textAlign: "center", padding: "48px 0" },
  emptyIcon: { fontSize: "32px", color: "var(--text-muted)", marginBottom: "8px" },
  emptyText: { color: "var(--text-muted)", fontSize: "14px" },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid var(--border)",
    gap: "12px",
    transition: "background var(--transition)",
  },
  itemLeft: { display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 },
  typeDot: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  desc: {
    fontSize: "14px",
    color: "var(--text-primary)",
    fontWeight: "500",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "240px",
  },
  meta: { display: "flex", alignItems: "center", gap: "8px", marginTop: "3px" },
  categoryPill: {
    fontSize: "11px",
    padding: "2px 8px",
    borderRadius: "20px",
    background: "var(--accent-glow)",
    color: "var(--accent-light)",
    fontWeight: "500",
  },
  date: { fontSize: "11px", color: "var(--text-muted)" },
  itemRight: { display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 },
  amount: { fontSize: "15px", fontWeight: "700", letterSpacing: "-0.02em", minWidth: "90px", textAlign: "right" },
  actions: { display: "flex", gap: "4px" },
  actionBtn: {
    background: "none",
    border: "none",
    color: "var(--text-muted)",
    cursor: "pointer",
    fontSize: "14px",
    padding: "4px 6px",
    borderRadius: "6px",
    transition: "color var(--transition)",
  },
  pagination: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
    paddingTop: "16px",
    borderTop: "1px solid var(--border)",
  },
  pageBtn: {
    padding: "7px 16px",
    borderRadius: "var(--radius)",
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--text-secondary)",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all var(--transition)",
  },
  pageBtnDisabled: {
    opacity: 0.3,
    cursor: "not-allowed",
  },
  pageInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2px",
  },
  pageNum: {
    fontSize: "13px",
    color: "var(--text-primary)",
    fontWeight: "500",
  },
  pageRange: {
    fontSize: "11px",
    color: "var(--text-muted)",
  },
};
