"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from '../../Components/SideBar/SideBar.jsx';
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./chatbot.css";

const API_KEY = 'AIzaSyCK-MxTLNAI3RJPYitUNtDyI1poIObbWpA'; // SUBSTITUA CONFORME A CRIAÇÃO DE CADA CHAVE DE API NOVA
const genAI = new GoogleGenerativeAI(API_KEY);

function Chatbot() {
    const chatEndRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [agendamentos, setAgendamentos] = useState([]);

    useEffect(() => {
        const carregarAgendamentos = async () => {
            try {
                const response = await axios.get('http://localhost:8080/agendamento');
                const dados = response.data.map(ag => ({
                    cliente: ag.clienteNome,
                    servico: ag.servicos.nome,
                    inicio: new Date(ag.dataInicial).toLocaleString('pt-BR'),
                    fim: new Date(ag.dataFinal).toLocaleString('pt-BR')
                }));
                setAgendamentos(dados);
            } catch (error) {
                console.error('Erro ao carregar agendamentos:', error);
            }
        };

        carregarAgendamentos();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        if (agendamentos.length === 0) {
            alert("Os dados do banco ainda não foram carregados. Aguarde um momento e tente novamente.");
            return;
        }

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        const contextoAgendamentos = agendamentos.map(ag =>
            `Cliente: ${ag.cliente}, Serviço: ${ag.servico}, Início: ${ag.inicio}, Fim: ${ag.fim}`
        ).join('\n');

        const prompt = `
Você é um assistente de uma mecânica móvel. Com base nos agendamentos abaixo, responda de forma clara à minha pergunta levando em consideração os dados que tenho em meu banco:

Agendamentos:
${contextoAgendamentos}

Pergunta: ${input}
        `.trim();

        console.log("PROMPT ENVIADO PARA GEMINI:\n", prompt); // debug

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            const response = result.response.text();

            setMessages(prev => [...prev, { text: response, sender: 'gemini' }]);
        } catch (err) {
            console.error("Erro ao gerar resposta com Gemini:", err);
            setMessages(prev => [...prev, { text: 'Erro ao gerar resposta.', sender: 'gemini' }]);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="chat-container flex flex-col flex-1 p-4">
                <div id="chat-window" className="chat-box">
                    {messages.map((msg, index) => (
                        <div key={index} className={`mb-2 ${msg.sender}`}>
                            {msg.text}
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                <div className="input-container mt-4">
                    <form className="chat-form flex" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Digite sua mensagem..."
                            autoComplete="off"
                            required
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 p-2 rounded-l-lg bg-white text-black"
                        />
                        <button type="submit" className="p-2 bg-blue-700 rounded-r-lg">
                            Enviar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Chatbot;
