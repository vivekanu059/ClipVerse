import { Link, useNavigate } from "react-router-dom";
import { getAuth, clearAuth } from "../utils/auth";
import { logoutUser } from "../api/auth.api";

export default function Header() {
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      clearAuth();
      navigate("/login");
    }
  };

  return (
    <header style={{ display: "flex", gap: 15, padding: 10 }}>
      <Link to="/">Home</Link>

      {auth ? (
        <>
          <Link to="/upload">Upload</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/history">History</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </header>
  );
}
