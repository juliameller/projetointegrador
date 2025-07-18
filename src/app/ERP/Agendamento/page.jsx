"use client";
import React, { useState, useCallback, useEffect } from 'react';
import moment from 'moment-timezone';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './agendamento.css';
import Sidebar from '../../Components/SideBar/SideBar.jsx';
import EventModal from './components/EventModal';
import Adicionar from './components/Adicionar';
import FiltroAtividades from './components/FiltroAtividades.jsx';
import 'moment/locale/pt-br';
import axios from 'axios';

const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

function Agendamento() {
    const [eventos, setEventos] = useState([]);
    const [eventoSelecionado, setEventoSelecionado] = useState(null);
    const [eventosFiltrados, setEventosFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);

    moment.locale('pt-br');

    const [view, setView] = useState(Views.MONTH);
    const [date, setDate] = useState(moment().toDate());

    const carregarAgendamentos = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/agendamento');
            // console.log('Resposta da API:', response.data);

            const eventosFormatados = response.data.map(agendamento => {
                const startDate = moment(agendamento.dataInicial).tz('America/Sao_Paulo', true).toDate();
                const endDate = moment(agendamento.dataFinal).tz('America/Sao_Paulo', true).toDate();

                
                return {
                    id: agendamento.id_agendamento,
                    title: agendamento.clienteNome,
                    start: startDate,
                    end: endDate,
                    resource: agendamento,
                    tipo: agendamento.servicos.nome,
                    observacoes: agendamento.observacoes
                };
            });
            
            setEventos(eventosFormatados);
            setEventosFiltrados(eventosFormatados);
            
        } catch (error) {
            console.error('Erro ao carregar agendamentos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarAgendamentos();
    }, []);

    const moverEventos = async (data) => {
        console.log('moverEventos data:', data);
        const { start, end, event } = data;
        if (!event.resource.id) {
            console.error('Event resource ID is undefined');
            return;
        }

        const id_servicos = event.resource.servicos?.map((s) => s.idServico) || [];

        const payload = {
            id_cliente: event.resource.idCliente,
            id_servicos: id_servicos,
            dataInicial: moment(start).format('YYYY-MM-DDTHH:mm:ss'),
            dataFinal: moment(end).format('YYYY-MM-DDTHH:mm:ss'),
            status: event.resource.status,
            observacoes: event.resource.observacoes || '',
        };
        console.log('Payload for PUT request:', payload);
        try {
            const response = await axios.put(`http://localhost:8080/agendamento/${event.resource.id}`, payload);
            
            if (response.data) {
                await carregarAgendamentos();
            }
        } catch (error) {
            console.log('dados passados:', data);
            console.error('Erro ao mover evento:', error);
        }
    };

    

    const handleEventClick = (evento) => {
        setEventoSelecionado(evento);
    };

    const handleEventClose = () => {
        setEventoSelecionado(null);
    };

   const handleAdicionar = (eventoAdicionado) => {
    setEventos(prev => [...prev, eventoAdicionado]);
    setEventosFiltrados(prev => [...prev, eventoAdicionado]);
};


    const handleEventDelete = async (eventId) => {
        try {
            await axios.delete(`http://localhost:8080/agendamento/${eventId}`);
            await carregarAgendamentos();
            setEventoSelecionado(null);
        } catch (error) {
            console.error('Erro ao deletar evento:', error);
        }
    };

    const handleEventUpdate = async (updatedEvent) => {
        try {

            const payload = {
                id_cliente: updatedEvent.id_cliente,
                id_servicos: updatedEvent.id_servicos,
                dataInicial: moment(updatedEvent.dataInicial || updatedEvent.start).format('YYYY-MM-DDTHH:mm:ss'),
                dataFinal: moment(updatedEvent.dataFinal || updatedEvent.end).format('YYYY-MM-DDTHH:mm:ss'),
                status: updatedEvent.status,
                observacoes: updatedEvent.observacoes || ''
            };
        
            console.log('Payload final para PUT:', payload);            

            await axios.put(`http://localhost:8080/agendamento/${updatedEvent.id}`, payload);
    
            await carregarAgendamentos();
        } catch (error) {
            console.error('Erro ao atualizar evento:', error);
        }
    };
    

    const handleSelecionarAtividades = (filtros) => {
        const { servicos: servicosSelecionados, clientes: clientesSelecionados } = filtros;
    
        const filtrados = eventos.filter(evento => {
            const clienteOK = clientesSelecionados.length === 0 || clientesSelecionados.includes(evento.resource.clienteNome);
            const servicoOK = servicosSelecionados.length === 0 || evento.resource.servicos?.some(servico =>
                servicosSelecionados.includes(servico.nome)
            );
            return clienteOK && servicoOK;
        });
    
        setEventosFiltrados(filtrados);
    };       

    const handleOnChangeView = (selectedView) => {
        setView(selectedView);
    };

    const onNavigate = useCallback((newDate) => {
        setDate(newDate);
    }, []);

    const messages = {
        today: 'Hoje',
        previous: 'Voltar',
        next: 'Próximo',
        month: 'Mês',
        week: 'Semana',
        day: 'Dia',
        agenda: 'Eventos',
        date: 'Data',
        time: 'Hora',
        event: 'Evento',
        noEventsInRange: 'Nenhum evento neste período',
        showMore: total => `+ Ver mais (${total})`
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="flex">
            <Sidebar />
            <div className="calendariocontainer">
                <div className="calendario">
                    <DragAndDropCalendar
                        defaultDate={date}
                        date={date}
                        onNavigate={onNavigate}
                        view={view}
                        onView={handleOnChangeView}
                        events={eventosFiltrados}
                        localizer={localizer}
                        resizable
                        onEventDrop={moverEventos}
                        onEventResize={moverEventos}
                        onSelectEvent={handleEventClick}
                        toolbar={true} // Desativa a toolbar padrão
                        messages={messages} // Adicione 'as mensagens aqui
                        className="calendar"
                        timezone="local"
                    />
                </div>
                {eventoSelecionado && (
                    <EventModal
                        evento={eventoSelecionado}
                        onClose={handleEventClose}
                        onDelete={handleEventDelete}
                        onUpdate={handleEventUpdate}
                        style={{ display: 'flex' }}
                    />
                )}
            </div>
            <div className='containerfilters'>
                <Adicionar onAdicionar={handleAdicionar} />
                <FiltroAtividades atividades={eventos} onSelecionarAtividades={handleSelecionarAtividades} />
            </div>
        </div>
    );
}

export default Agendamento;
