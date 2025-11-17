import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import Navbar from "./components/Navbar";
import BuyerDashboard from "./pages/BuyerDashboard";
import FarmerDashboard from "./pages/FarmerDashboard";



import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MarketplacePage from "./pages/MarketplacePage";
import OrdersPage from "./pages/OrdersPage";
import InventoryPage from "./pages/InventoryPage";
import ChatPage from "./pages/ChatPage";

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/" />;

  if (window.location.pathname === "/") {
    return <Navigate to={user.role === "BUYER" ? "/buyer" : "/farmer"} />;
  }

  return children;
}


export default function App() {
  return (
    <BrowserRouter>
     <Navbar />
      <Routes>

        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/marketplace"
          element={<PrivateRoute><MarketplacePage /></PrivateRoute>}
        />

        <Route
  path="/buyer"
  element={<PrivateRoute><BuyerDashboard /></PrivateRoute>}
/>

<Route
  path="/farmer"
  element={<PrivateRoute><FarmerDashboard /></PrivateRoute>}
/>


        <Route
          path="/orders"
          element={<PrivateRoute><OrdersPage /></PrivateRoute>}
        />

        <Route
          path="/inventory"
          element={<PrivateRoute><InventoryPage /></PrivateRoute>}
        />

        <Route
          path="/chat/:orderId"
          element={<PrivateRoute><ChatPage /></PrivateRoute>}
        />

      </Routes>
    </BrowserRouter>
  );
}
