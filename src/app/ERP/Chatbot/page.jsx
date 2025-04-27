"use client";

import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from '../../Components/SideBar/SideBar.jsx';
import "./chatbot.css"

function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
    
        console.log("Chatbot carregado no cliente.");
    }, []);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!input.trim()) return; 

      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput(''); 
  };


    return (
      <div className="flex">
            <Sidebar />
            <div className="chat-container flex flex-col flex-1 p-4">
                <div id="chat-window" className="chat-box">
                    {messages.map((msg, index) => (
                        <div key={index} className="mb-2 text-white">
                            {msg.text}
                        </div>
                    ))}
                </div>

                <div className="input-container mt-4">
                    <form id="chat-form" className="chat-form flex" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            id="user-input"
                            placeholder="Digite sua mensagem..."
                            autoComplete="off"
                            required
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 p-2 rounded-l-lg bg-white text-black"
                        />
                        <button id="send-button" type="submit" className="p-2 bg-blue-700 text-white rounded-r-lg">
                            Enviar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Chatbot;


    