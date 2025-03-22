import React from 'react';
import '../styles.css';

const About = () => {
  return (
    <div className="about-container">
      <header className="about-header">
        <h1>About Wallet Shield</h1>
      </header>
      <div className="about-body">
        <section className="about-description">
          <h2>Empowering Students with Crypto Literacy</h2>
          <p>
            Wallet Shield is a comprehensive platform designed to enable students to gain a deeper understanding of cryptocurrencies while providing essential tools to ensure secure, informed transactions. As digital currencies become increasingly integral to global economies, it is crucial for students to not only understand how they work but also learn how to identify and protect themselves from potential threats.
          </p>
          <p>
            Our platform features an intelligent chatbot powered by Google Gemini, which helps students improve their crypto knowledge by answering questions about wallets, scams, fees, and more. Whether you're just starting to explore the world of crypto or you're already managing digital assets, the Wallet Shield chatbot is your guide!
          </p>
        </section>
        <section className="about-features">
          <h2>Key Features</h2>
          <ul>
            <li>
              <strong>AI-Powered Chatbot:</strong> Our chatbot, powered by Google Gemini API, offers personalized, real-time advice on crypto security, helping students navigate the world of digital currencies and avoid common scams.
            </li>
            <li>
              <strong>Transaction Fraud Detection:</strong> Students can upload their crypto wallet transactions and AI is implemented to analyze and detect potential fraud, ensuring that their funds are secure.
            </li>
          </ul>
        </section>
        <section className="about-target">
          <h2>Target Audience</h2>
          <p>
            Wallet Shield is tailored to students at all levels of crypto expertise, from beginners to more advanced users. Whether you are a student just beginning to explore digital wallets or someone actively managing crypto assets, Wallet Shield empowers you to make informed decisions and stay safe while using digital currencies.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
