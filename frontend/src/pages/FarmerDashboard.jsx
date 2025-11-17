import { useNavigate } from "react-router-dom";

export default function FarmerDashboard() {
  const nav = useNavigate();

  return (
    <div style={{ padding: 25 }}>
      <h2>Welcome Farmer</h2>
      <p>Manage your inventory & stay updated on orders.</p>

      <button onClick={() => nav("/inventory")}>My Inventory</button>
      <button onClick={() => nav("/orders")}>Order Requests</button>
    </div>
  );
}
