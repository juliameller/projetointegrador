import React, { useState, useEffect, useMemo } from 'react';
import Table from '../../Components/Table/Table.jsx';
import ServiceForm from './ServiceForm';

const ServicosDataTable = () => {
    const [servicos, setServicos] = useState([]);
    const [selectedServico, setSelectedServico] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // Estado de pesquisa

    useEffect(() => {
        const fetchServicos = async () => {
            try {
                const response = await fetch('http://localhost:8080/servicos');
                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status}`);
                }
                const data = await response.json();
                setServicos(data);
            } catch (error) {
                console.error("Erro ao buscar serviços:", error);
            }
        };

        fetchServicos();
    }, []);

    const openEditModal = (servico) => {
        setSelectedServico(servico);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedServico(null);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        console.log("Iniciando submissão de edição:", selectedServico);
    
        if (!selectedServico || !selectedServico.idServico) {
            console.error("Erro: serviço selecionado inválido ou ID ausente.");
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8080/servicos/${selectedServico.idServico}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedServico),
            });
    
            if (response.ok) {
                console.log("Serviço editado com sucesso");
                const updatedServico = await response.json();
    
                setServicos((prevServicos) =>
                    prevServicos.map((servico) =>
                        servico.idServico === updatedServico.idServico ? updatedServico : servico
                    )
                );
                closeEditModal();
            } else {
                console.error("Erro ao editar serviço, status:", response.status);
            }
        } catch (error) {
            console.error("Erro ao enviar os dados editados:", error);
        }
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8080/servicos/${selectedServico.idServico}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setServicos((prevServicos) =>
                    prevServicos.filter((servico) => servico.idServico !== selectedServico.idServico)
                );
                closeEditModal();
            } else {
                console.error("Erro ao excluir serviço");
            }
        } catch (error) {
            console.error("Erro ao excluir serviço:", error);
        }
    };

    const [modalType, setModalType] = useState('editar');
    
    // Filtrando os serviços com base na pesquisa
    const filteredServicos = servicos.filter(servico =>
        servico.nome.toLowerCase().includes(searchQuery.toLowerCase()) // Pode filtrar por outros campos
    );

    const columns = useMemo(
        () => [
            {
                Header: 'Nome',
                accessor: 'nome',
            },
            {
                Header: 'Duração',
                accessor: 'duracao',
                Cell: ({ value }) => {
                    if (!value) return '';
                    const [horas, minutos] = value.split(':');
                    const hh = horas.padStart(2, '0');
                    const mm = minutos.padStart(2, '0');
                    return `${hh}:${mm}h`;
                },
            },
            {
                Header: 'Valor',
                accessor: 'valor',
                Cell: ({ value }) =>
                    value !== undefined && value !== null
                        ? `R$ ${parseFloat(value).toFixed(2).replace('.', ',')}`
                        : 'R$ 0,00',
            },
            {
                Header: 'Ações',
                accessor: 'acoes',
                Cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setModalType('visualizar');
                                openEditModal(row.original);
                            }}
                            className="text-white bg-blue-900 hover:bg-indigo-400 rounded px-2 py-1"
                            title="Visualizar"
                        >
                            👁
                        </button>
                        <button
                            onClick={() => {
                                setModalType('editar');
                                openEditModal(row.original);
                            }}
                            className="text-white bg-blue-900 hover:bg-indigo-400 rounded px-2 py-1"
                            title="Editar"
                        >
                            🖊
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    return (
        <>
            {/* Barra de Pesquisa */}
            <div className="mb-8 flex justify-end items-center gap-4">
                <input
                    type="text"
                    placeholder="Pesquisar serviço..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 border-2 border-blue-500 rounded-lg "
                />
            </div>

            {/* Tabela de Serviços */}
            <Table columns={columns} data={filteredServicos} />

            {/* Modal de Edição */}
            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
                    <h2 className="title text-center">
                        {modalType === 'visualizar' ? 'Visualizar Serviço' : 'Editar Serviço'}
                    </h2>
                        <ServiceForm
                            handleSubmit={handleEditSubmit}
                            handleChange={(e) =>
                                setSelectedServico({
                                    ...selectedServico,
                                    [e.target.name]: e.target.value,
                                })
                            }
                            formData={selectedServico}
                        />
                        <div className="flex justify-between mt-4">
                            <button onClick={closeEditModal} className="Action bg-gray-500 hover:bg-gray-600 text-white rounded px-4 py-2">
                                Cancelar
                            </button>
                            {modalType !== 'visualizar' && (
                                <button
                                    onClick={handleEditSubmit}
                                    className="Action bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2"
                                >
                                    Salvar Edição
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ServicosDataTable;
