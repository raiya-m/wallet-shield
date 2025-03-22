import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CryptoChatbot from './components/CryptoChatbot';
import Home from "./pages/Home";
import GetStarted from "./pages/GetStarted";
import "./styles.css";
import Aiananalysis from "./pages/Aiananalysis";
 

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/getstarted" element={<GetStarted />} />
        <Route path="/aianalysis" element={<Aiananalysis />} />
      </Routes>
    </>
  );
}

export default App;