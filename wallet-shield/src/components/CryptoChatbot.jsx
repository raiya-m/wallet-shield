import React, { useState } from 'react';
import '../styles.css';

const CryptoChatbot = () => {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/gemini_suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      const botMessage = {
        text: data.response || 'Sorry, Gemini did not return an answer.',
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { text: 'Error contacting Gemini.', sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container" style={{ transform: expanded ? 'scale(1)' : 'scale(0.85)' }}>
      <div className="chatbot-header" onClick={() => setExpanded(!expanded)}>
        <h4>💬 Learn about Crypto</h4>
        <span>{expanded ? '−' : '+'}</span>
      </div>

      {expanded && (
        <div className="chatbot-body">
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
