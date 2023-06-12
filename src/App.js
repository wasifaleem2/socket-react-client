import { useEffect, useRef, useState } from "react";
import "./App.css";

// import io from socket.io-client for client connection
import { io } from "socket.io-client";

function App() {
  const socket = useRef();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [usersList, setUserList] = useState([]);
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("")

  useEffect(() => {
    socket.current = io("http://localhost:5000");

    // for socket connention with server
    socket.current.on("connection", () => {
      console.log("connected to server");
    });
    
    // getting my id from socket
    socket.current.on("socket_id", (id)=>{
      console.log("user id", id)
      setSender(id);
    })

    // getting ids of all the conected clients
    socket.current.on("connected_users", (data)=>{
      console.log("connected Users", data.connectedUsers)
      setUserList(data.connectedUsers)
    })

    // sending message to client through server
    socket.current.on("message", (msg) => {
      setChat((prevChat) => [...prevChat, msg]);
    });
  }, []);

  const send = () => {
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    console.log(date, time);
    socket.current.emit("message", {message, date, time, recipient, sender});
    setMessage("")
  };

  return (
    <div className="App">
      <div className="chat-box">
        <h3>Socket.io chat</h3>
        <label className="select-label">RECIPIENT </label>
        <select className="select" name="cars" id="cars" onChange={(e)=>{setRecipient(e.target.value)}}>
          {usersList.map((option, index) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <input placeholder="type..." value={message} onChange={(e) => setMessage(e.target.value)} />
        <button type="button" onClick={send}>
          Send
        </button>

          {chat.map((msg, index) => (
            <div className={sender == msg.sender ? "send" : "receive"} key={index}>
              <p className="msg-sender">{sender == msg.sender? "you" : `from: ${msg.sender}`}</p>
              <p className="msg-message">{msg.message}</p>
              <p className="msg-date">{msg.date} {msg.time}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
