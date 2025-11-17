import { createContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const socketRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (!stored) return;
    const { token } = JSON.parse(stored);

    socketRef.current = io("http://localhost:5000", {
      transports: ["websocket"],
      auth: { token },
      withCredentials: true
    });

    socketRef.current.on("connect", () => {
      console.log("GLOBAL SOCKET CONNECTED:", socketRef.current.id);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("SOCKET ERROR:", err.message);
    });

    return () => socketRef.current?.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
}
