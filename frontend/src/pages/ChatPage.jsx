import { useEffect, useState, useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import api from "../api/axios";
import { useParams } from "react-router-dom";

export default function ChatPage() {
  const { orderId } = useParams();
  const socket = useContext(SocketContext);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const storedAuth = JSON.parse(localStorage.getItem("auth"));
  const userId = storedAuth?.id;

  useEffect(() => {
    if (!socket) return;

    console.log("Joining room for order:", orderId);
    socket.emit("join-order", Number(orderId));

    // Load chat history
    api.get(`/chat/${orderId}`).then((res) => {
      setMessages(res.data.messages);
    });

    socket.on("chat-message", (msg) => {
      if (msg.orderId === Number(orderId)) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("chat-message");
    };
  }, [socket, orderId]);

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("chat-message", {
      orderId: Number(orderId),
      message: text
    });

    setText("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Chat for Order #{orderId}</h3>

      <div
        style={{
          border: "1px solid #aaa",
          height: 300,
          overflowY: "auto",
          padding: "10px",
          marginBottom: "10px"
        }}
      >
        {messages.map((m, i) => (
          <p key={i} style={{ color: m.senderId === userId ? "green" : "blue" }}>
            <strong>{m.senderId === userId ? "You" : "Them"}:</strong> {m.message}
          </p>
        ))}
      </div>

      <input
        style={{ width: "70%", marginRight: "10px" }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
