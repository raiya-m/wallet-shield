import React, { useState } from 'react';
import '../styles.css';

const CryptoChatbot = () => {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatResponse, setChatResponse] = useState('');

  const backendUrl = "http://127.0.0.1:5000"; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/gemini_suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setChatResponse(data.response);
      const botMessage = {
        text: data.response || 'Sorry, Gemini did not return an answer.',
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { text: 'Error contacting Gemini.', sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container" style={{ transform: expanded ? 'scale(1)' : 'scale(0.85)' }}>
      <div className="chatbot-header" onClick={() => setExpanded(!expanded)}>
        <h4>💬 Gemini-powered advice on avoiding scams, fees, and risky wallets -- ask me questions!</h4>
        <span>{expanded ? '−' : '+'}</span>
      </div>

      {expanded && (
        <div className="chatbot-body">
          {chatResponse && <div className="chat-response">{chatResponse}</div>}
          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          <div className="chatbot-input">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
            />
            <button onClick={handleSubmit} disabled={loading}>
              {loading ? '...' : 'Ask'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoChatbot;
