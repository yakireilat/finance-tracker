export default function Card({ children, style, glow, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
        transition: "all var(--transition)",
        cursor: onClick ? "pointer" : "default",
        ...(glow && {
          boxShadow: `0 0 30px ${glow}`,
          borderColor: `${glow}`,
        }),
        ...style,
      }}
      onMouseEnter={e => {
        if (onClick) {
          e.currentTarget.style.border = "1px solid var(--border-hover)";
          e.currentTarget.style.background = "var(--bg-card-hover)";
        }
      }}
      onMouseLeave={e => {
        if (onClick) {
          e.currentTarget.style.border = "1px solid var(--border)";
          e.currentTarget.style.background = "var(--bg-card)";
        }
      }}
    >
      {/* Subtle top gradient line */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
      }} />
      {children}
    </div>
  );
}