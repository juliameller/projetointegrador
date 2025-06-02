"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from '../../Components/SideBar/SideBar.jsx';
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./chatbot.css";

const API_KEY = 'AIzaSyCK-MxTLNAI3RJPYitUNtDyI1poIObbWpA'; // SUA CHAVE
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
                    inicio: new Date(ag.dataInicial),
                    fim: new Date(ag.dataFinal)
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

    const filtrarAgendamentosPorMes = (lista, texto) => {
        const meses = {
            janeiro: 0, fevereiro: 1, março: 2, abril: 3, maio: 4, junho: 5,
            julho: 6, agosto: 7, setembro: 8, outubro: 9, novembro: 10, dezembro: 11
        };
        const textoLower = texto.toLowerCase();
        const hoje = new Date();
        let mes = null;
        let ano = hoje.getFullYear();

        for (let nome in meses) {
            if (textoLower.includes(nome)) {
                mes = meses[nome];
                break;
            }
        }

        if (textoLower.includes("esse mês") || textoLower.includes("este mês")) {
            mes = hoje.getMonth();
        }

        if (textoLower.includes("próximo mês")) {
            mes = (hoje.getMonth() + 1) % 12;
            if (mes === 0) ano += 1;
        }

        if (mes === null) return lista;

        return lista.filter(ag =>
            ag.inicio.getMonth() === mes && ag.inicio.getFullYear() === ano
        );
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

        const agFiltrados = filtrarAgendamentosPorMes(agendamentos, input);

        const contextoAgendamentos = agFiltrados.map(ag =>
            `Cliente: ${ag.cliente}, Início: ${ag.inicio.toLocaleString('pt-BR')}, Fim: ${ag.fim.toLocaleString('pt-BR')}`
        ).join('\n');

        const prompt = `
            Você é um assistente de uma mecânica móvel. Seu papel é ajudar o usuário a entender os dados de agendamentos, serviços e clientes da empresa com base nas informações extraídas do banco.

            Responda de forma clara, direta e amigável. Use os agendamentos abaixo (já filtrados) para responder à pergunta:

            ${contextoAgendamentos || 'Nenhum agendamento correspondente foi encontrado.'}

            Pergunta: ${input}
        `.trim();

        console.log("PROMPT ENVIADO PARA GEMINI:\n", prompt);

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
            <div className="chat-container">
                <div className="chat-header">
                <span style={{ fontSize: '20px' }}>🔧</span>
                Assistente Virtual T-Solution
            </div>
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
                        <button type="submit" className="p-2 bg-blue-600 rounded-r-lg">
                            Enviar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Chatbot;
