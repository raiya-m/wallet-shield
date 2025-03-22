// filepath: c:\Users\anush\OneDrive\Documents\GitHub\wallet-shield\wallet-shield\src\components\HeroSection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/getstarted");
  };

  return (
    <div className="hero">
      <h1>Welcome to Wallet Shield</h1>
      <button onClick={handleClick}>Get Started</button>
    </div>
  );
};

export default HeroSection;