import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CryptoChatbot from './components/CryptoChatbot';
import Home from "./pages/Home";
import GetStarted from "./pages/GetStarted";
import Aiananalysis from "./pages/Aiananalysis";
import About from "./pages/About";
import "./styles.css";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/getstarted" element={<GetStarted />} />
        <Route path="/aianalysis" element={<Aiananalysis />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <CryptoChatbot />
    </>
  );
}

export default App;
