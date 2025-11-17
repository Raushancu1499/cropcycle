import { useEffect, useState } from "react";
import api from "../api/axios";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { getDashboardRoute } from "../utils/roleRoute";


export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("kg");
  const [quantity, setQuantity] = useState(0);
  const [basePrice, setBasePrice] = useState(0);
  const [socket, setSocket] = useState(null);

  const fetchInventory = async () => {
    try {
      const res = await api.get("/inventory");
      setItems(res.data.items);
    } catch (err) {
      console.error("fetchInventory error:", err);
    }
  };

  const addItem = async () => {
    try {
      if (!name || !unit || quantity <= 0 || basePrice <= 0) {
        return alert("Fill required fields: name, unit, quantity, price");
      }

      await api.post("/inventory", {
        name,
        description,
        category,
        unit,
        quantity: +quantity,
        basePrice: +basePrice
      });

      setName("");
      setDescription("");
      setCategory("");
      setUnit("kg");
      setQuantity(0);
      setBasePrice(0);

      fetchInventory();
    } catch (err) {
      console.error("addItem error:", err);
      alert("Failed to add item");
    }
  };

  const removeItem = async (id) => {
    try {
      await api.delete(`/inventory/${id}`);
      fetchInventory();
    } catch (err) {
      console.error("removeItem error:", err);
    }
  };

  const toggleList = async (id, isListed) => {
    try {
      const endpoint = isListed
        ? `/marketplace/${id}/unlist`
        : `/marketplace/${id}/list`;

      await api.patch(endpoint);
      fetchInventory();
    } catch (err) {
      console.error("toggleList error:", err);
    }
  };

  // Socket.IO setup for farmer notifications
  useEffect(() => {
    // get auth info
    const stored = localStorage.getItem("auth");
    if (!stored) {
      console.warn("No auth found in localStorage, skipping socket connect");
      return;
    }

    const { token, role, id } = JSON.parse(stored) || {};
    if (!token) {
      console.warn("No token in auth, skipping socket connect");
      return;
    }

    const s = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
      auth: { token }
    });

    setSocket(s);

    s.on("connect", () => {
      console.log("SOCKET CONNECTED:", s.id, "role:", role, "id:", id);
    });

    s.on("connect_error", (err) => {
      console.error("SOCKET CONNECT ERROR:", err.message);
    });

    s.on("new-order", (data) => {
      console.log("NEW ORDER EVENT:", data);
      alert(`New order! Order ID: ${data.orderId}, Buyer: ${data.buyerId}`);
    });

    return () => {
      s.off("connect");
      s.off("connect_error");
      s.off("new-order");
      s.disconnect();
    };
  }, []); // run once when Inventory page mounts

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Farmer Inventory</h2>
     <button onClick={() => nav("/farmer-orders")}>
  My Orders & Chats
</button>


      <h3>Add Item</h3>
      <input
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        placeholder="category (optional)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <select value={unit} onChange={(e) => setUnit(e.target.value)}>
        <option value="kg">kg</option>
        <option value="g">g</option>
        <option value="piece">piece</option>
      </select>

      <input
        type="number"
        placeholder="quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <input
        type="number"
        placeholder="basePrice"
        value={basePrice}
        onChange={(e) => setBasePrice(e.target.value)}
      />

      <button onClick={addItem}>Add Item</button>

      <hr />

      <h3>My Produce</h3>

      {items.length === 0 && <p>No products yet.</p>}

      <ul>
        {items.map((i) => (
          <li key={i.id}>
            <strong>{i.name}</strong> | {i.quantity} {i.unit} | Rs.{i.basePrice}
            {" | "}Listed: {i.isListed ? "Yes" : "No"}
            <button onClick={() => toggleList(i.id, i.isListed)}>
              {i.isListed ? "Unlist" : "List"}
            </button>
            <button onClick={() => removeItem(i.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
