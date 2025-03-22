
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import GetStarted from "./pages/GetStarted";
import "./styles.css";
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/getstarted" element={<GetStarted />} />
      </Routes>
    </Router>
  );
}

export default App;
