import { theme, styles } from "../theme";

export default function Navbar({
  currentUser,
  setQuizStatus,
  logout,
  setFilterSubject,
  setFilterChapter,
}) {
  return (
    <nav
      style={{
        backgroundColor: theme.surface,
        borderBottom: "1px solid " + theme.border,
        padding: "15px 20px",
        display: "flex",
        flexWrap: "wrap",
        gap: "15px",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "35px",
            height: "35px",
            borderRadius: "50%",
            backgroundColor: theme.primary,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          {currentUser.name.charAt(0).toUpperCase()}
        </div>
        <span style={{ fontWeight: "600", fontSize: "15px" }}>
          {currentUser.name}{" "}
          {currentUser.role === "admin" && (
            <span
              style={{
                color: theme.danger,
                fontSize: "11px",
                background: "#FEE2E2",
                padding: "2px 6px",
                borderRadius: "4px",
                marginLeft: "6px",
              }}
            >
              ADMIN
            </span>
          )}
        </span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        <button
          onClick={() => setQuizStatus("home")}
          style={{
            ...styles.button,
            ...styles.btnOutline,
            padding: "6px 12px",
            fontSize: "14px",
            width: "auto",
          }}
        >
          Home
        </button>
        {currentUser.role === "admin" && (
          <button
            onClick={() => setQuizStatus("admin")}
            style={{
              ...styles.button,
              backgroundColor: "#1F2937",
              color: "white",
              padding: "6px 12px",
              fontSize: "14px",
              width: "auto",
            }}
          >
            Admin
          </button>
        )}
        <button
          onClick={() => {
            setFilterSubject("");
            setFilterChapter("");
            setQuizStatus("reviewErrors");
          }}
          style={{
            ...styles.button,
            ...styles.btnOutline,
            padding: "6px 12px",
            fontSize: "14px",
            width: "auto",
            border: "none",
            color: theme.warning,
            fontWeight: "bold",
          }}
        >
          ⚠️ Review Errors
        </button>
        <button
          onClick={() => setQuizStatus("history")}
          style={{
            ...styles.button,
            ...styles.btnPrimary,
            padding: "6px 12px",
            fontSize: "14px",
            width: "auto",
          }}
        >
          Analytics
        </button>
        <button
          onClick={logout}
          style={{
            ...styles.button,
            ...styles.btnOutline,
            padding: "6px 12px",
            fontSize: "14px",
            width: "auto",
            border: "none",
            color: theme.danger,
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
