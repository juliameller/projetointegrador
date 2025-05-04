import { useEffect, useMemo, useState } from 'react';
import Table from '../Table.jsx';

const DataTable = ({ searchQuery }) => {
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/cliente');
                const data = await response.json();
                setClientes(data);
            } catch (error) {
                console.error('Erro ao buscar clientes:', error);
            }
        };

        fetchData();
    }, []);

    const columns = useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'id',
            },
            {
                Header: 'Nome',
                accessor: 'nome',
            },
            {
                Header: 'Email',
                accessor: 'email',
            },
        ],
        []
    );

    const filteredData = useMemo(() => {
        return clientes.filter(cliente =>
            cliente.nome.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [clientes, searchQuery]);

    return (
        <div className="mb-8">
            <h2 className="formlabel">Clientes</h2>
            <Table columns={columns} data={filteredData} />
        </div>
    );
};

export default DataTable;
