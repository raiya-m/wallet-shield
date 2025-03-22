import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import GetStarted from "./pages/GetStarted";
import "./styles.css";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/getstarted" element={<GetStarted />} />
        <Route path="/aianalysis" element={<AIAnalysis />} />
      </Routes>
    </>
  );
}

export default App;