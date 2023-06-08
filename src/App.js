import { useEffect, useRef, useState } from "react";
import "./App.css";

import { io } from "socket.io-client";

function App() {
  const socket = useRef();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]); // Use state hook to manage chat messages

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
    socket.current.emit("message", message);
    setMessage("")
  };

  return (
    <div className="App">
      <div className="chat-box">
        <p>Socket.io app</p>
        <input placeholder="..." value={message} onChange={(e) => setMessage(e.target.value)} />
        <button type="button" onClick={send}>
          Send
        </button>

        <div>
          {chat.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
