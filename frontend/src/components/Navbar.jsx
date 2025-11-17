import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getDashboardRoute } from "../utils/roleRoute";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();

  const goHome = () => {
  if (!user) return nav("/");
  nav(getDashboardRoute(user.role));
};

  return (
    <nav style={{
      padding: "10px 20px",
      background: "#3c6e71",
      color: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <h3 style={{ cursor: "pointer" }} onClick={goHome}>
        CropCycle
      </h3>

      {user && (
        <div style={{ display: "flex", gap: "15px" }}>
          {user.role === "BUYER" && <Link to="/marketplace" style={{ color: "white" }}>Marketplace</Link>}
          <Link to="/orders" style={{ color: "white" }}>Orders</Link>
          {user.role === "FARMER" && <Link to="/inventory" style={{ color: "white" }}>Inventory</Link>}

          <button onClick={logout} style={{ background: "#e63946", color: "white" }}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
