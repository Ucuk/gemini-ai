import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { type: 'user', content: input }]);

    try {
      const response = await axios.post('http://localhost:5000/api/gemini', {
        text: input,
        sender: 'user123' // Ganti dengan ID pengguna yang sesuai
      });

      setMessages(prev => [...prev, { type: 'bot', content: response.data.answer }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { type: 'error', content: 'Terjadi kesalahan dalam proses AI Gemini.' }]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gemini Chat</h1>
      </header>
      <main>
        <div className="chat-container">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              {message.content}
            </div>
          ))}
          {isLoading && <div className="message bot">Thinking...</div>}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik pesan Anda di sini..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>Kirim</button>
        </form>
      </main>
    </div>
  );
}

export default App;