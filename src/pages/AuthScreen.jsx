import  { useState } from "react";
import { API_URL, theme, styles } from "../theme";

export default function AuthScreen({ setCurrentUser, setQuizStatus }) {
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    adminCode: "",
  });
  const [authError, setAuthError] = useState("");

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch(
        `${API_URL}${authMode === "login" ? "/login" : "/register"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            authMode === "login"
              ? { email: authForm.email, password: authForm.password }
              : authForm,
          ),
        },
      );
      if (res.ok) {
        const data = await res.json();
        if (authMode === "register") {
          setAuthError("Registration submitted — wait for admin approval.");
          setAuthMode("login");
        } else {
          setCurrentUser(data.user);
          localStorage.setItem("quiz_user", JSON.stringify(data.user));
          localStorage.setItem("quiz_login_time", Date.now().toString());
          setQuizStatus("home");
        }
      } else {
        const msg = await res.text();
        setAuthError(msg || "Something went wrong.");
      }
    } catch (err) {
      setAuthError("Network error: " + err.message);
    }
  };

  return (
    <div
      style={{
        ...styles.page,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          ...styles.card,
          width: "100%",
          maxWidth: "400px",
          padding: "30px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h2
            style={{
              margin: "0 0 10px 0",
              color: theme.primary,
              fontSize: "28px",
            }}
          >
            Study Portal
          </h2>
          <p style={{ margin: 0, color: theme.textMuted }}>
            {authMode === "login"
              ? "Sign in to continue"
              : "Create your account"}
          </p>
        </div>
        {authError && (
          <div
            style={{
              padding: "10px 14px",
              backgroundColor: authError.includes("submitted")
                ? "#D1FAE5"
                : "#FEE2E2",
              color: authError.includes("submitted")
                ? "#065F46"
                : theme.danger,
              borderRadius: "8px",
              marginBottom: "16px",
              fontSize: "14px",
            }}
          >
            {authError}
          </div>
        )}
        <form onSubmit={handleAuthSubmit}>
          {authMode === "register" && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                required
                value={authForm.name}
                onChange={(e) =>
                  setAuthForm({ ...authForm, name: e.target.value })
                }
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Admin Code (Optional)"
                value={authForm.adminCode}
                onChange={(e) =>
                  setAuthForm({ ...authForm, adminCode: e.target.value })
                }
                style={{ ...styles.input, backgroundColor: "#FEF3C7" }}
              />
            </>
          )}
          <input
            type="email"
            placeholder="Email Address"
            required
            value={authForm.email}
            onChange={(e) =>
              setAuthForm({ ...authForm, email: e.target.value })
            }
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={authForm.password}
            onChange={(e) =>
              setAuthForm({ ...authForm, password: e.target.value })
            }
            style={styles.input}
          />
          <button
            type="submit"
            style={{
              ...styles.button,
              ...styles.btnPrimary,
              marginTop: "10px",
            }}
          >
            {authMode === "login" ? "Login" : "Register"}
          </button>
        </form>
        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            cursor: "pointer",
            color: theme.primary,
            fontWeight: "500",
          }}
          onClick={() => {
            setAuthMode(authMode === "login" ? "register" : "login");
            setAuthError("");
          }}
        >
          {authMode === "login"
            ? "Need an account? Register here."
            : "Already have an account? Login here."}
        </p>
      </div>
    </div>
  );
}