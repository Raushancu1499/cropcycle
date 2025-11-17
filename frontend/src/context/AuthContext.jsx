import { createContext, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const stored = localStorage.getItem("auth");
  const [user, setUser] = useState(stored ? JSON.parse(stored) : null);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const data = {
        token: res.data.token,
        id: res.data.user.id,
        role: res.data.user.role,
      };
      localStorage.setItem("auth", JSON.stringify(data));
      setUser(data);
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
