"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from '../../Components/SideBar/SideBar.jsx';
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./chatbot.css";

const API_KEY = 'AIzaSyCK-MxTLNAI3RJPYitUNtDyI1poIObbWpA';
const genAI = new GoogleGenerativeAI(API_KEY);

function Chatbot() {
    const chatEndRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [agendamentos, setAgendamentos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [aguardandoConfirmacao, setAguardandoConfirmacao] = useState(null);

    // Função para formatar data no horário de Brasília
    const formatarDataBrasilia = (data) => {
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        const horas = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');
        const segundos = String(data.getSeconds()).padStart(2, '0');
        
        return `${ano}-${mes}-${dia}T${horas}:${minutos}:${segundos}`;
    };

    // Função para converter data de Brasília para Date local
    const criarDataBrasilia = (ano, mes, dia, hora, minuto) => {
        // Cria a data como se fosse no fuso local (que assumimos ser Brasília)
        return new Date(ano, mes - 1, dia, hora, minuto, 0);
    };

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const [agendamentosRes, clientesRes, servicosRes] = await Promise.all([
                    axios.get('http://localhost:8080/agendamento'),
                    axios.get('http://localhost:8080/cliente'),
                    axios.get('http://localhost:8080/servicos')
                ]);

                // Melhorar o mapeamento dos agendamentos para incluir corretamente os serviços
                const dados = agendamentosRes.data.map(ag => {
                    // Encontrar o serviço correspondente
                    let nomeServico = 'Serviço não especificado';
                    let idServico = null;
                    
                    if (ag.servicos) {
                        if (typeof ag.servicos === 'object' && ag.servicos.nome) {
                            nomeServico = ag.servicos.nome;
                            idServico = ag.servicos.idServico;
                        } else if (typeof ag.servicos === 'string') {
                            nomeServico = ag.servicos;
                        }
                    } else if (ag.id_servicos && ag.id_servicos.length > 0) {
                        const servicoId = ag.id_servicos[0];
                        const servicoEncontrado = servicosRes.data.find(s => s.idServico === servicoId);
                        if (servicoEncontrado) {
                            nomeServico = servicoEncontrado.nome;
                            idServico = servicoEncontrado.idServico;
                        }
                    }

                    return {
                        id: ag.id_agendamento,
                        cliente: ag.clienteNome,
                        idCliente: ag.id_cliente,
                        inicio: new Date(ag.dataInicial),
                        fim: new Date(ag.dataFinal),
                        servicos: nomeServico,
                        idServico: idServico,
                        observacoes: ag.observacoes || '',
                        status: ag.status
                    };
                });

                setAgendamentos(dados);
                setClientes(clientesRes.data);
                setServicos(servicosRes.data);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        };

        carregarDados();
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

    const extrairDadosAgendamento = (texto) => {
        const textoLower = texto.toLowerCase();
        
        // Buscar cliente pelo nome
        let clienteEncontrado = null;
        for (let cliente of clientes) {
            if (textoLower.includes(cliente.nome.toLowerCase())) {
                clienteEncontrado = cliente;
                break;
            }
        }

        // Buscar serviço pelo nome
        let servicoEncontrado = null;
        for (let servico of servicos) {
            if (textoLower.includes(servico.nome.toLowerCase())) {
                servicoEncontrado = servico;
                break;
            }
        }

        // Extrair datas e horas (formato melhorado)
        const regexDataHora = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\s+(\d{1,2}):(\d{2})/g;
        const matches = [...texto.matchAll(regexDataHora)];

        let dados = {};

        if (matches.length >= 1) {
            const [, dia1, mes1, ano1, hora1, min1] = matches[0];
            // Usar a função criarDataBrasilia para manter o horário local
            dados.dataInicio = criarDataBrasilia(
                parseInt(ano1), 
                parseInt(mes1), 
                parseInt(dia1), 
                parseInt(hora1), 
                parseInt(min1)
            );
        }

        if (matches.length >= 2) {
            const [, dia2, mes2, ano2, hora2, min2] = matches[1];
            // Usar a função criarDataBrasilia para manter o horário local
            dados.dataFim = criarDataBrasilia(
                parseInt(ano2), 
                parseInt(mes2), 
                parseInt(dia2), 
                parseInt(hora2), 
                parseInt(min2)
            );
        }

        // Se só tiver uma data/hora, calcular o fim automaticamente (2 horas depois)
        if (dados.dataInicio && !dados.dataFim) {
            dados.dataFim = new Date(dados.dataInicio.getTime() + (2 * 60 * 60 * 1000));
        }

        if (clienteEncontrado) {
            dados.cliente = clienteEncontrado;
        }

        if (servicoEncontrado) {
            dados.servico = servicoEncontrado;
        }

        return dados;
    };

    const criarAgendamento = async (dadosAgendamento) => {
        try {
            const agendamentoData = {
                id_cliente: dadosAgendamento.cliente.id,
                id_servicos: [dadosAgendamento.servico.idServico],
                // Usar formatarDataBrasilia para manter o horário informado
                dataInicial: formatarDataBrasilia(dadosAgendamento.dataInicio),
                dataFinal: formatarDataBrasilia(dadosAgendamento.dataFim),
                status: 1,
                observacoes: dadosAgendamento.observacoes || ''
            };

            console.log('Dados do agendamento enviados:', agendamentoData);

            const response = await axios.post('http://localhost:8080/agendamento', agendamentoData);
            
            if (response.status === 200 || response.status === 201) {
                await recarregarAgendamentos();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Erro ao criar agendamento:', error);
            return false;
        }
    };

    const recarregarAgendamentos = async () => {
        try {
            const responseAgendamentos = await axios.get('http://localhost:8080/agendamento');
            const responseServicos = await axios.get('http://localhost:8080/servicos');
            
            const dados = responseAgendamentos.data.map(ag => {
                let nomeServico = 'Serviço não especificado';
                let idServico = null;
                
                if (ag.servicos) {
                    if (typeof ag.servicos === 'object' && ag.servicos.nome) {
                        nomeServico = ag.servicos.nome;
                        idServico = ag.servicos.idServico;
                    } else if (typeof ag.servicos === 'string') {
                        nomeServico = ag.servicos;
                    }
                } else if (ag.id_servicos && ag.id_servicos.length > 0) {
                    const servicoId = ag.id_servicos[0];
                    const servicoEncontrado = responseServicos.data.find(s => s.idServico === servicoId);
                    if (servicoEncontrado) {
                        nomeServico = servicoEncontrado.nome;
                        idServico = servicoEncontrado.idServico;
                    }
                }

                return {
                    id: ag.id_agendamento,
                    cliente: ag.clienteNome,
                    idCliente: ag.id_cliente,
                    inicio: new Date(ag.dataInicial),
                    fim: new Date(ag.dataFinal),
                    servicos: nomeServico,
                    idServico: idServico,
                    observacoes: ag.observacoes || '',
                    status: ag.status
                };
            });
            
            setAgendamentos(dados);
        } catch (error) {
            console.error('Erro ao recarregar agendamentos:', error);
        }
    };

    const processarComandoAgendamento = (texto) => {
        const textoLower = texto.toLowerCase();
        
        if (textoLower.includes('agendar') || textoLower.includes('marcar') || 
            textoLower.includes('novo agendamento')) {
            
            const dados = extrairDadosAgendamento(texto);
            
            if (dados.dataInicio && dados.dataFim && dados.cliente && dados.servico) {
                return {
                    cliente: dados.cliente,
                    servico: dados.servico,
                    dataInicio: dados.dataInicio,
                    dataFim: dados.dataFim
                };
            }
        }
        
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        
        const inputOriginal = input;
        setInput('');

        // Verificar confirmação de agendamento
        if (aguardandoConfirmacao && (inputOriginal.toLowerCase().includes('sim') || inputOriginal.toLowerCase().includes('confirmar'))) {
            const sucesso = await criarAgendamento(aguardandoConfirmacao);
            setAguardandoConfirmacao(null);
            
            if (sucesso) {
                setMessages(prev => [...prev, { 
                    text: '✅ Agendamento criado com sucesso!', 
                    sender: 'gemini' 
                }]);
            } else {
                setMessages(prev => [...prev, { 
                    text: '❌ Erro ao criar agendamento. Tente novamente.', 
                    sender: 'gemini' 
                }]);
            }
            return;
        }

        // Verificar cancelamento
        if (aguardandoConfirmacao && 
            (inputOriginal.toLowerCase().includes('não') || inputOriginal.toLowerCase().includes('cancelar'))) {
            setAguardandoConfirmacao(null);
            setMessages(prev => [...prev, { 
                text: 'Operação cancelada. Como posso ajudá-lo?', 
                sender: 'gemini' 
            }]);
            return;
        }

        // Verificar comando de agendamento
        const novoAgendamento = processarComandoAgendamento(inputOriginal);
        if (novoAgendamento) {
            setAguardandoConfirmacao(novoAgendamento);
            
            const mensagemConfirmacao = `
📅 Confirme os dados do agendamento:

👤 Cliente: ${novoAgendamento.cliente.nome}
🔧 Serviço: ${novoAgendamento.servico.nome}
📅 Data/Hora Inicial: ${novoAgendamento.dataInicio.toLocaleString('pt-BR')} (Horário de Brasília)
📅 Data/Hora Final: ${novoAgendamento.dataFim.toLocaleString('pt-BR')} (Horário de Brasília)

Digite "sim" para confirmar ou "não" para cancelar.
            `;
            
            setMessages(prev => [...prev, { text: mensagemConfirmacao, sender: 'gemini' }]);
            return;
        }

        // Consulta normal
        if (agendamentos.length === 0) {
            setMessages(prev => [...prev, { 
                text: "Os dados ainda não foram carregados. Aguarde um momento.", 
                sender: 'gemini' 
            }]);
            return;
        }

        const agFiltrados = filtrarAgendamentosPorMes(agendamentos, inputOriginal);
        const contextoAgendamentos = agFiltrados.map(ag =>
            `Cliente: ${ag.cliente}, Data: ${ag.inicio.toLocaleDateString('pt-BR')} ${ag.inicio.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} até ${ag.fim.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}, Observações: ${ag.observacoes || 'Nenhuma'}`
        ).join('\n');

        // Lista de clientes e serviços disponíveis
        const listaClientes = clientes.map(c => c.nome).join(', ');
        const listaServicos = servicos.map(s => s.nome).join(', ');

        const prompt = `
            Você é um assistente de uma mecânica móvel. 

            PARA CRIAR AGENDAMENTOS:
            - Use o formato: "Agendar [nome do cliente] para [data/hora inicial] até [data/hora final] serviço [nome do serviço]"
            - Exemplo: "Agendar João Silva para 15/12/2024 14:00 até 15/12/2024 16:00 serviço Troca de óleo"
            - IMPORTANTE: Todos os horários são no fuso horário de Brasília
            
            CLIENTES DISPONÍVEIS: ${listaClientes}
            SERVIÇOS DISPONÍVEIS: ${listaServicos}

            AGENDAMENTOS EXISTENTES:
            ${contextoAgendamentos || 'Nenhum agendamento encontrado.'}

            Pergunta: ${inputOriginal}

            IMPORTANTE: 
            - NUNCA mostre o tipo de serviço nas consultas de agendamentos
            - NUNCA inclua o nome do serviço nas respostas sobre consultas de agendamentos
            - Formate as respostas de forma clara e organizada
            - Use emojis para deixar mais visual: 👤 para cliente, 📅 para data, 📝 para observações
            - Para consultas de agendamentos, mostre apenas: Cliente, Data/Hora e Observações (se houver)
            - Todos os horários são considerados no fuso horário de Brasília (GMT-3)
        `.trim();

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            const response = result.response.text();

            setMessages(prev => [...prev, { text: response, sender: 'gemini' }]);
        } catch (err) {
            console.error("Erro ao gerar resposta com Gemini:", err);
            setMessages(prev => [...prev, { text: '❌ Erro ao gerar resposta.', sender: 'gemini' }]);
        }
    };

    return (
        <div className="chatbot-layout">
            <Sidebar />
            <div className="chatbot-container">
                <div className="chatbot-header">
                    <div className="header-content">
                        <div className="header-icon">🔧</div>
                        <div className="header-text">
                            <h1>Assistente Virtual T-Solution</h1>
                            <p>Seu assistente inteligente para agendamentos (Horário de Brasília)</p>
                        </div>
                    </div>
                </div>
                
                {messages.length === 0 && (
                    <div className="welcome-section">
                        <div className="welcome-header">
                            <h2>🤖 Olá! Como posso ajudá-lo hoje?</h2>
                            <p style={{color: '#666', fontSize: '14px'}}>⏰ Todos os horários são considerados no fuso horário de Brasília (GMT-3)</p>
                        </div>
                        
                        <div className="instructions-grid">
                            <div className="instruction-card">
                                <div className="card-icon">📅</div>
                                <h3>Criar Agendamento</h3>
                                <p>Agendar [cliente] para [data/hora inicial] até [data/hora final] serviço [tipo]</p>
                                <div className="example">
                                    <strong>Exemplo:</strong> "Agendar João da Silva para 15/06/2025 17:00 até 15/06/2025 19:00 serviço Revisão Alinhamento e balanceamento"
                                </div>
                            </div>
                        </div>
                        
                        <div className="info-section">
                            <div className="info-item">
                                <strong>👥 Clientes disponíveis:</strong>
                                <span>{clientes.map(c => c.nome).join(', ')}</span>
                            </div>
                            <div className="info-item">
                                <strong>🔧 Serviços disponíveis:</strong>
                                <span>{servicos.map(s => s.nome).join(', ')}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message-wrapper ${msg.sender}`}>
                            <div className={`message-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                                <div className="message-content">
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                <div className="chat-input-section">
                    <form className="chat-input-form" onSubmit={handleSubmit}>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                placeholder={
                                    aguardandoConfirmacao 
                                        ? "Digite 'sim' para confirmar ou 'não' para cancelar..." 
                                        : "Digite sua mensagem aqui... (Horário de Brasília)"
                                }
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="chat-input"
                                autoComplete="off"
                                required
                            />
                            <button type="submit" className="send-button">
                                <span>📤</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Chatbot;