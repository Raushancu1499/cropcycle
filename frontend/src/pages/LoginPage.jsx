import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const submit = async () => {
  try {
    await login(email, password);
    nav("/marketplace");
  } catch (err) {
    console.log("Frontend Login Catch:");
    console.log("Response:", err.response?.data);
    console.log("Status:", err.response?.status);
    console.log("Message:", err.message);

    alert(
      err.response?.data?.error ||
      err.response?.data?.message ||
      "Login absolutely faceplanted"
    );
  }
};


  return (
    <div style={{ padding: 20 }}>
      <h3>Login</h3>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br/>
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><br/>
      <button onClick={submit}>Login</button>
    </div>
  );
}
