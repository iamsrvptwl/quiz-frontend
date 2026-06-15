// --- CONFIGURATION ---
export const API_URL = 'http://localhost:3000' || 'https://quiz-backend-iota-gules.vercel.app';


// --- DESIGN SYSTEM ---
export const theme = {
  bg: "#F3F4F6",
  surface: "#FFFFFF",
  primary: "#4F46E5",
  primaryHover: "#4338CA",
  success: "#10B981",
  danger: "#EF4444",
  warning: "#F59E0B",
  textMain: "#111827",
  textMuted: "#6B7280",
  border: "#E5E7EB",
  radius: "12px",
  shadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
};

export const CHART_COLORS = [
  "#4F46E5",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
];

export const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: theme.bg,
    color: theme.textMain,
    fontFamily: '"Inter", system-ui, sans-serif',
  },
  container: { maxWidth: "1200px", margin: "0 auto", padding: "20px" },
  card: {
    backgroundColor: theme.surface,
    borderRadius: theme.radius,
    boxShadow: theme.shadow,
    padding: "24px",
    marginBottom: "24px",
    overflowX: "hidden",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid " + theme.border,
    borderRadius: "8px",
    fontSize: "15px",
    marginBottom: "16px",
    boxSizing: "border-box",
    outline: "none",
    color: theme.textMain,
    backgroundColor: theme.surface,
    WebkitAppearance: "none",
  },
  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    boxSizing: "border-box",
  },
  btnPrimary: { backgroundColor: theme.primary, color: "white" },
  btnSuccess: { backgroundColor: theme.success, color: "white" },
  btnDanger: { backgroundColor: theme.danger, color: "white" },
  btnOutline: {
    backgroundColor: "transparent",
    color: theme.textMuted,
    border: "1px solid " + theme.border,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "14px",
  },
  th: {
    padding: "12px",
    backgroundColor: "#F9FAFB",
    borderBottom: "2px solid " + theme.border,
    color: theme.textMuted,
    fontWeight: "600",
  },
  td: { padding: "12px", borderBottom: "1px solid " + theme.border },
};
