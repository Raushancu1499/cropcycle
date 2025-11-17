import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const { register } = useContext(AuthContext);
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [role, setRole] = useState("BUYER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    try {
      await register(name, email, password, role);
      alert("Registered! You can now login");
      nav("/");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>

      <input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} /><br/>
      <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} /><br/>
      <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><br/>

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="BUYER">BUYER</option>
        <option value="FARMER">FARMER</option>
      </select><br/>

      <button onClick={submit}>Register</button>
    </div>
  );
}
