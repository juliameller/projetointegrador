import React, { useState, useEffect, useMemo } from 'react';
import Table from '../../Components/Table/Table.jsx';
import ClienteForm from './ClientForm';

const DataTable = () => {
    const [clientes, setClientes] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await fetch('http://localhost:8080/cliente');
                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status}`);
                }
                const data = await response.json();
                setClientes(data);
            } catch (error) {
                console.error("Erro ao buscar clientes:", error);
            }
        };

        fetchClientes();
    }, []);

    const openEditModal = (cliente) => {
        setSelectedCliente(cliente);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedCliente(null);
        setFormErrors({});
    };

    const handleCancel = () => {
        closeEditModal();
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        const clienteId = selectedCliente.id_cliente || selectedCliente.id;

        if (!clienteId) {
            console.error("ID do cliente não encontrado");
            alert("Erro: ID do cliente não encontrado");
            return;
        }

        const errors = {};
        if (!selectedCliente.nome || !selectedCliente.nome.trim()) {
            errors.nome = 'Nome é obrigatório';
        }
        if (!selectedCliente.telefone || !selectedCliente.telefone.trim()) {
            errors.telefone = 'Telefone é obrigatório';
        }
        if (!selectedCliente.cpf || !selectedCliente.cpf.trim()) {
            errors.cpf = 'CPF/CNPJ é obrigatório';
        }

        const cleanTelefone = selectedCliente.telefone.replace(/\D/g, '');
        const cleanCPF = selectedCliente.cpf.replace(/\D/g, '');

        if (cleanTelefone && !/^\d{10,11}$/.test(cleanTelefone)) {
            errors.telefone = 'Telefone inválido';
        }

        // Valida se CPF (11 dígitos) ou CNPJ (14 dígitos)
        if (cleanCPF && !/^(\d{11}|\d{14})$/.test(cleanCPF)) {
            errors.cpf = 'CPF ou CNPJ inválido';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            const parsedClienteId = Number(clienteId);

            const clientePayload = {
                id_cliente: parsedClienteId,
                nome: selectedCliente.nome,
                telefone: cleanTelefone,
                cpf: cleanCPF,
                endereco: selectedCliente.endereco || '',
                email: selectedCliente.email || '',
                veiculo: selectedCliente.veiculo || null
            };

            const response = await fetch(`http://localhost:8080/cliente/${parsedClienteId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clientePayload),
            });

            if (response.ok) {
                const updatedCliente = await response.json();

                setClientes((prevClientes) =>
                    prevClientes.map((cliente) =>
                        cliente.id === updatedCliente.id
                            ? updatedCliente
                            : cliente
                    )
                );

                closeEditModal();
                setFormErrors({});
                setIsSuccessModalOpen(true);

                setTimeout(() => {
                    setIsSuccessModalOpen(false);
                }, 1000);
            } else {
                const errorText = await response.text();
                console.error("Erro na resposta do servidor:", errorText);
                alert(`Erro ao atualizar cliente: ${errorText}`);
            }
        } catch (error) {
            console.error("Erro ao enviar os dados editados:", error);
            alert("Erro ao atualizar cliente. Verifique os dados e tente novamente.");
        }
    };

    const formatTelefone = (telefone) => {
        return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    };

    const formatDocumento = (doc) => {
        const cleaned = doc.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (cleaned.length === 14) {
            return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
        return doc;
    };

    const [modalType, setModalType] = useState('editar');
    const columns = useMemo(
        () => [
            { Header: 'Nome', accessor: 'nome' },
            {
                Header: 'Telefone',
                accessor: 'telefone',
                Cell: ({ value }) => formatTelefone(value),
            },
            { Header: 'Endereço', accessor: 'endereco' },
            {
                Header: 'CPF/CNPJ',
                accessor: 'cpf',
                Cell: ({ value }) => formatDocumento(value),
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
                        >
                            👁
                        </button>
                        <button
                            onClick={() => {
                                setModalType('editar');
                                openEditModal(row.original);
                            }}
                            className="text-white bg-blue-900 hover:bg-indigo-400 rounded px-2 py-1"
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
            <Table key={clientes.length} columns={columns} data={clientes} />
            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
                    <h2 className="title text-center">
                        {modalType === 'visualizar' ? 'Visualizar Cliente' : 'Editar Cliente'}
                    </h2>
                        <ClienteForm
                            handleSubmit={handleEditSubmit}
                            handleChange={(e) =>
                                setSelectedCliente({
                                    ...selectedCliente,
                                    [e.target.name]: e.target.value,
                                })
                            }
                            formData={selectedCliente}
                            formErrors={formErrors}
                        />
                        <div className="flex justify-between mt-4">
                            <button onClick={handleCancel} className="Action bg-gray-500 hover:bg-gray-600 text-white rounded px-4 py-2">
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
            {isSuccessModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
                        <h2 className="text-lg font-semibold text-green-600 mb-4">Cliente editado com sucesso!</h2>
                    </div>
                </div>
            )}
        </>
    );
};

export default DataTable;
