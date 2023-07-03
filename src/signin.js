import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import MessageScreen from "./messageScreen";

function Signin() {
    const [senderPhone, setSenderPhone] = useState("");
    const navigate = useNavigate();

    function verify() {
        axios
            .post("http://localhost:3002/api/verify", {
                phone: senderPhone,
            })
            .then((response) => {
                try {
                    console.log("API response", response.data);
                    navigate("/message", { state: { token: response.data, phoneNo: senderPhone } });
                } catch (error) {
                    console.log(error);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    return (
        <div className="chat-box">
            <label>Enter Phone</label>
            <input onChange={(e) => setSenderPhone(e.target.value)} />
            <button onClick={verify}>login</button>
        </div>
    );
}

export default Signin;
