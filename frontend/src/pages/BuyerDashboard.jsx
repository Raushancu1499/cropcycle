import { useNavigate } from "react-router-dom";

export default function BuyerDashboard() {
  const nav = useNavigate();

  return (
    <div style={{ padding: 25 }}>
      <h2>Welcome Buyer</h2>
      <p>Explore fresh produce & track your orders.</p>

      <button onClick={() => nav("/marketplace")}>Marketplace</button>
      <button onClick={() => nav("/orders")}>My Orders</button>
    </div>
  );
}
