import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import styles from "./MarketplacePage.module.css";
import { getDashboardRoute } from "../utils/roleRoute";

export default function MarketplacePage() {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  const fetchItems = async () => {
    const res = await api.get(`/marketplace?search=${search}`);
    setItems(res.data.items);
  };

  const buy = async (id) => {
    const body = { items: [{ itemId: id, quantity: 1 }] };
    await api.post("/orders", body);
    alert("Order placed!");
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Marketplace</h2>

      <div className={styles.searchBox}>
        <input
          placeholder="Search produce..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={fetchItems}>Search</button>
      </div>

      <div className={styles.grid}>
        {items.map((item) => (
          <div key={item.id} className={styles.card}>
            <h3>{item.name}</h3>
            <p className={styles.desc}>{item.description || "Fresh produce"}</p>
            <p><strong>Rs.{item.listedPrice}</strong> / {item.unit}</p>
            <p className={styles.stock}>Stock: {item.quantity}</p>

            {user.role === "BUYER" && (
              <button className={styles.buyBtn}
                onClick={() => buy(item.id)}>
                Buy 1
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
