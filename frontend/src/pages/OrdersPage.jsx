import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function OrdersPage() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const nav = useNavigate();

  const fetchOrders = async () => {
    const res = await api.get("/orders");
    setOrders(res.data.orders);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>My Orders</h2>
      {orders.length === 0 && <p>No orders yet</p>}

      <h2>My Orders for User #{user.id}</h2>


     <ul>
  {orders.map((o) => (
    <li key={o.id} style={{ marginBottom: "12px" }}>
      Order #{o.id} | Status: {o.status} | Total: Rs.{o.totalPrice}
      
      <button
        onClick={() => nav(`/chat/${o.id}`)}
        style={{ marginLeft: "10px" }}
      >
        Chat
      </button>

      <ul style={{ marginLeft: "20px", marginTop: "6px" }}>
        {o.items.map((it) => (
          <li key={it.id}>
            Item #{it.itemId} x {it.quantity} = Rs.{it.subtotal}
          </li>
        ))}
      </ul>
    </li>
  ))}
</ul>

    </div>
  );
}
