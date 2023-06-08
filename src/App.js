import { useEffect, useRef, useState } from "react";
import "./App.css";

// import io from socket.io-client for client connection
import { io } from "socket.io-client";

function App() {
  const socket = useRef();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.current = io("http://localhost:5000");

    socket.current.on("connection", () => {
      console.log("connected to server");
    });

    socket.current.on("message", (msg) => {
      setChat((prevChat) => [...prevChat, msg]);
    });
  }, []);

  const send = () => {
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    console.log(date, time);
    socket.current.emit("message", {message, date, time});
    setMessage("")
  };

  return (
    <div className="App">
      <div className="chat-box">
        <h3>Socket.io chat</h3>
        <input placeholder="type..." value={message} onChange={(e) => setMessage(e.target.value)} />
        <button type="button" onClick={send}>
          Send
        </button>

          {chat.map((msg, index) => (
            <div className="receive" key={index}>
              <p>{msg.message}</p>
              <p className="msg-date">{msg.date} {msg.time}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
