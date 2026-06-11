import { Link, Outlet } from "react-router-dom";
import { theme } from "../../theme";

export default function AdminLayout() {
  const navStyle = {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
    paddingBottom: "10px",
    borderBottom: "1px solid " + theme.border,
  };

  const linkStyle = {
    textDecoration: "none",
    color: theme.primary,
    fontWeight: "600",
  };

  return (
    <div>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
        System Administration
      </h1>

      <nav style={navStyle}>
        <Link style={linkStyle} to="/admin/questions">
          Manage Questions
        </Link>

        <Link style={linkStyle} to="/admin/users">
          Manage Users
        </Link>

        <Link style={linkStyle} to="/admin/config">
          System Config
        </Link>
      </nav>

      <Outlet />
    </div>
  );
}