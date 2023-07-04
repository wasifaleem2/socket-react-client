import { useEffect, useRef, useState } from "react";
import "./App.css";
import axios from "axios"
import { useLocation } from "react-router-dom";
// import io from socket.io-client for client connection
import { io } from "socket.io-client";

function MessageScreen() {
  const location = useLocation();
  const token = location?.state?.token;
  const phoneNo = location?.state?.phoneNo;
  // console.log("token", token)
  const socket = useRef();
  const [message, setMessage] = useState("");
  const [typingPlaceholder, setTypingPlaceholder] = useState("type");
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState([]);
  const [usersList, setUserList] = useState([]);
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("")
  const [senderPhone, setSenderPhone] = useState("")
  const [messageCount, setMessageCount] = useState(0)

  // let senderPhone = 333;
  let URL = "http://localhost:3002/api/message/get"
  const getALLMessages = async () => {
    await axios.get(URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: {
        phone: phoneNo,
      }
    }).then((response) => {
      try {
        setMessages(response.data);
        console.log("api response", response.data)
      } catch (error) {
        console.log(error);
      }
    });
  }
  useEffect(() => {
    // getALLMessages();
    // scrollToBottom();
  }, [])

  // const scrollableRef = useRef(null);
  // const scrollToBottom = () => {
  //   const myDiv = scrollableRef.current;
  //   myDiv.scrollTop = myDiv.scrollHeight;
  // };

  useEffect(() => {
    setSenderPhone(phoneNo)
    socket.current = io("http://localhost:5000", {
      query: {
        userPhone: phoneNo,
      }
    });

    // for socket connention with server
    socket.current.on("connection", () => {
      console.log("connected to server");
    });

    // getting my id from socket
    socket.current.on("socket_id", (id) => {
      console.log("user id", id)
      setSender(id);
    })

    // getting ids of all the conected clients
    socket.current.on("connected_users", (data) => {
      console.log("connected Users", data.connectedUsers)
      setUserList(data.connectedUsers)
    })


    getALLMessages(phoneNo);
    // sending message to client through server
    socket.current.on("receive-message", (msg) => {
      setChat((prevChat) => [...prevChat, msg]);
      setTypingPlaceholder("type")
      if(msg.senderNumber == phoneNo ){
        // do nothing
      }
      else{
        setMessageCount(messageCount + 1)
      }

    });
  }, []);

  useEffect(() => {
    // getting typing indication
    socket.current.on("typing-indicator", (data) => {
      setTypingPlaceholder("typing....")
      let t = setTimeout(() => {
        setTypingPlaceholder("type")
        clearTimeout(t);
      }, 5000);
      // clearTimeout(t);
      return () => {
        clearTimeout(t);
      }
    })
  }, [typingPlaceholder])

  const send = () => {
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString();
    console.log(date, time);
    socket.current.emit("message", { message, date, time, recipient, sender, senderPhone });
    setMessage("")
  };

  const onChangeText = (e) => {
    let time = new Date().toLocaleTimeString();
    setMessage(e.target.value)
    socket.current.emit("typing", { time, recipient });
  };


  return (
    <div className="App">
      <div className="chat-box">
        <h3>messges {messageCount}</h3>
        <label className="select-label">RECIPIENT </label>
        <select className="select" name="cars" id="cars" onChange={(e) => { setRecipient(e.target.value) }}>
          {usersList.map((option, index) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <input className={typingPlaceholder == "typing...." ? "typing" : null} placeholder={typingPlaceholder} value={message} onChange={onChangeText} />
        <button type="button" onClick={send}>
          Send
        </button>
        <div className="messages">
          {messages.map((msg, index) => (
            <div className={senderPhone == msg.senderNumber ? "send message_container" : "receive message_container"} key={index}>
              <p className="msg-sender">{sender == msg.sender ? "you" : `from: ${msg.senderNumber}`}</p>
              <p className="msg-message">{msg.text}</p>
              <p className="msg-date">{msg.date} {msg.time}</p>
            </div>
          ))}
          {chat.map((msg, index) => (
            <div className={`message_container ${sender === msg.sender ? "send message_container" : "receive message_container"}`} key={index}>
              <p className="msg-sender">{senderPhone == msg.senderPhone ? "you" : `from: ${msg.senderPhone}`}</p>
              <p className="msg-message">{msg.message}</p>
              <p className="msg-date">{msg.date} {msg.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MessageScreen;
