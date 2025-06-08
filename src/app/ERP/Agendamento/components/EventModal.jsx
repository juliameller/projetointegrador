import React, { useState, useEffect } from 'react';
import PopUpDescartar from '../../../Components/PopUp/PopUpDescartar';
import axios from 'axios';

const EventModal = ({ evento, onClose, onDelete, onUpdate }) => {
    const [editedEvent, setEditedEvent] = useState({ ...evento });
    const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);

    useEffect(() => {
        if (evento) {
          setEditedEvent({
            ...evento,
            start: new Date(evento.start),
            end: new Date(evento.end)
          });
        }
      }, [evento]);
      

    console.log('Evento selecionado no modal:', editedEvent.resource);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedEvent({ ...editedEvent, [name]: value });
    };

    const handleStartDateChange = (e) => {
        const currentStart = new Date(editedEvent.start);
        const [year, month, day] = e.target.value.split('-');
        const newStart = new Date(currentStart);
        newStart.setFullYear(year, month - 1, day);
    
        setEditedEvent(prev => ({ ...prev, start: newStart }));
    };    

    const handleEndDateChange = (e) => {
        const currentEnd = new Date(editedEvent.end);
        const [year, month, day] = e.target.value.split('-');
        const newEnd = new Date(currentEnd);
        newEnd.setFullYear(year, month - 1, day);
    
        setEditedEvent(prev => ({ ...prev, end: newEnd }));
    };    

    const handleStartTimeChange = (e) => {
        const currentStart = new Date(editedEvent.start);
        const [hour, minute] = e.target.value.split(':');
        const newStart = new Date(currentStart);
        newStart.setHours(hour, minute);
    
        setEditedEvent(prev => ({ ...prev, start: newStart }));
    };
    
    const handleEndTimeChange = (e) => {
        const currentEnd = new Date(editedEvent.end);
        const [hour, minute] = e.target.value.split(':');
        const newEnd = new Date(currentEnd);
        newEnd.setHours(hour, minute);
        setEditedEvent(prev => ({ ...prev, end: newEnd }));
    };
    
    

    // const handleUpdate = () => {
    //     onUpdate(editedEvent);
    //     onClose();
    // };

    const handleUpdate = () => {
        // if (!editedEvent.id && editedEvent.resource?.id) {
        //     editedEvent.id = editedEvent.resource.id; 
        // }

        const servicosArray = editedEvent.resource?.servicos || [];
        const idsServicos = servicosArray.map(s => s.idServico); 

    
        // Mapear campos para o formato que backend espera
        const eventToUpdate = {
            id: editedEvent.id || editedEvent.resource?.id,
            id_cliente: editedEvent.resource.idCliente || editedEvent.resource.cliente.id,
            id_servicos: idsServicos,
            dataInicial: editedEvent.start,
            dataFinal: editedEvent.end,
            status: editedEvent.status || 1,
            observacoes: editedEvent.observacoes || '',
        };
    
        onUpdate(eventToUpdate);
        onClose();
    };
    

    const adjustDate = (date) => {
        if (!date) return '';
        const adjustedDate = new Date(date);
        if (isNaN(adjustedDate)) return '';
        adjustedDate.setHours(adjustedDate.getHours() - 3);
        return adjustedDate.toISOString().slice(0, 19);
    };
    

    const handleEventDelete = async (event) => {
        try {
            const eventId = event.id || event.resource.id;
            console.log('Deleting event with ID:', eventId);

            if (!eventId) {
                console.error('Event ID is missing');
                return;
            }

            await axios.delete(`http://localhost:8080/agendamento/${eventId}`);

            onDelete(eventId);
            onClose();
        } catch (error) {
            console.error('Erro ao deletar evento:', error);
            onClose();
        }
    };

    const confirmDelete = () => {
        setIsDiscardModalOpen(true);
    };

    const handleDiscard = () => {
        handleEventDelete(editedEvent);
        setIsDiscardModalOpen(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="relative bg-white rounded-lg shadow-lg p-6 w-1/3">
                <button
                onClick={onClose}
                aria-label="Fechar"
                style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    lineHeight: '1',
                }}
                >
                &times;
                </button>
                <h2 className="title text-center">Editar Agendamento</h2>
                <div className="mt-4">
                    <div className="mb-4">
                        <label className="formlabel block text-gray-700">Cliente:</label>
                        <p className="mt-1 w-full border rounded px-3 py-2 bg-gray-100">{editedEvent.title}</p>
                    </div>
                    <div className="mb-4">
                        <label className="formlabel block text-gray-700">Tipo:</label>
                        <p className="mt-1 w-full border rounded px-3 py-2 bg-gray-100">
                        {editedEvent.resource && Array.isArray(editedEvent.resource.servicos) && editedEvent.resource.servicos.length > 0
                        ? editedEvent.resource.servicos.map((servico, index) => (
                            <span key={index}>
                                {servico.nome}
                                {index < editedEvent.resource.servicos.length - 1 && ', '} {/* Adiciona uma vírgula entre os nomes, exceto no último */}
                            </span>
                        ))
                        : 'Tipo não encontrado'}
                        </p>
                    </div>
                    <div className="mb-4 flex justify-between">
                        <div className="w-1/2 pr-2">
                            <label className="formlabel block text-gray-700">Data Inicial:</label>
                            <input
                                type="date"
                                name="date"
                                value={adjustDate(editedEvent.start).slice(0, 10)}
                                onChange={handleStartDateChange}
                                className="mt-1 w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div className="w-1/2 pr-2">
                            <label className="formlabel block text-gray-700">Data Final:</label>
                            <input
                                type="date"
                                name="date"
                                value={editedEvent.end ? new Date(editedEvent.end).toISOString().slice(0, 10) : ''}
                                onChange={handleEndDateChange}
                                className="mt-1 w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div className="w-1/2 pl-2">
                            <label className="formlabel block text-gray-700">Início:</label>
                            <input
                                type="time"
                                name="start"
                                value={adjustDate(editedEvent.start).slice(11, 16)}
                                onChange={handleStartTimeChange}
                                className="mt-1 w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div className="w-1/2 pl-2">
                            <label className="formlabel block text-gray-700">Fim:</label>
                            <input
                                type="time"
                                name="end"
                                value={adjustDate(editedEvent.end).slice(11, 16)}
                                onChange={handleEndTimeChange}
                                className="mt-1 w-full border rounded px-3 py-2"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="formlabel block text-gray-700">Observações:</label>
                        <textarea
                            name="observacoes"
                            value={editedEvent.observacoes || ''} 
                            onChange={handleInputChange}
                            className="mt-1 w-full border rounded px-3 py-2"
                        />
                    </div>
                </div>
                <div className="flex justify-between mt-4">
                    <button
                        onClick={confirmDelete}
                        className="Action"
                    >
                        Cancelar Agendamento
                    </button>
                    <button
                        onClick={handleUpdate}
                        className="save"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </div>

            {isDiscardModalOpen && (
                <PopUpDescartar isOpen={isDiscardModalOpen} onClose={() => setIsDiscardModalOpen(false)} onDiscard={handleDiscard} />
            )}
        </div>
    );
};

export default EventModal;