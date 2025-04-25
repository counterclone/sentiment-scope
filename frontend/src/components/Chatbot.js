import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Chatbot.css';
const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const navigate = useNavigate();

    const sendMessage = async () => {
        if (input.trim() === '') return;

        const userMessage = { sender: 'user', text: input };
        setMessages([...messages, userMessage]);

        try {
            const response = await axios.post('http://localhost:3000/chatbot', { message: input });
            const botMessage = { sender: 'bot', text: response.data.reply };
            setMessages(prevMessages => [...prevMessages, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
        }

        setInput('');
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const goToAnalysis = () => {
        navigate('/analysis');
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Chatbot</h1>
            <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                        <strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                style={{ width: '80%', padding: '10px' }}
            />
            <button onClick={sendMessage} style={{ marginLeft: '10px', padding: '10px' }}>
                Send
            </button>
            <button onClick={goToAnalysis} style={{ marginTop: '20px', padding: '10px' }}>
                Go to Analysis
            </button>
        </div>
    );
};

export default Chatbot;