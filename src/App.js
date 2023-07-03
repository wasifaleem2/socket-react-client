import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MessageScreen from "./messageScreen";
import Signin from "./signin";

function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/message" element={<MessageScreen />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
