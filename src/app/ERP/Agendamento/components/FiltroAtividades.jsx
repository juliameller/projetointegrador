import React, { useEffect, useState } from 'react';
import Select from 'react-select';

function FiltroAtividades({ atividades, onSelecionarAtividades }) {
    const [servicos, setServicos] = useState([]);
    const [clientes, setClientes] = useState([]);

    const [filtros, setFiltros] = useState({
        servicos: [],
        clientes: []
    });

    // Carregar serviços e clientes da API
    useEffect(() => {
        const fetchDados = async () => {
            try {
                const [servicosRes, clientesRes] = await Promise.all([
                    fetch('http://localhost:8080/servicos'),
                    fetch('http://localhost:8080/cliente')
                ]);

                const servicosData = await servicosRes.json();
                const clientesData = await clientesRes.json();

                setServicos(servicosData);
                setClientes(clientesData);
            } catch (error) {
                console.error('Erro ao carregar dados para filtro:', error);
            }
        };

        fetchDados();
    }, []);

    // Mapear para react-select
    const opcoesServicos = servicos.map(s => ({ value: s.nome, label: s.nome }));
    const opcoesClientes = clientes.map(c => ({ value: c.nome, label: c.nome }));

    const handleFiltroChange = (selected, tipo) => {
        const nomes = selected ? selected.map(op => op.value) : [];
        const novosFiltros = { ...filtros, [tipo]: nomes };
        setFiltros(novosFiltros);
        onSelecionarAtividades(novosFiltros);
    };

    const limparFiltros = () => {
        const filtrosVazios = { servicos: [], clientes: [] };
        setFiltros(filtrosVazios);
        onSelecionarAtividades(filtrosVazios);
    };

    return (
        <div className="formfilter">
            <h3 className="title-h3 text-center">Filtrar Eventos</h3>

            <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>Tipo de Serviço</label>
            <Select
                options={opcoesServicos}
                isMulti
                onChange={(e) => handleFiltroChange(e, 'servicos')}
                value={opcoesServicos.filter(opt => filtros.servicos.includes(opt.value))}
                placeholder="Selecione os serviços..."
                className="mb-3"
            />

            <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>Cliente</label>
            <Select
                options={opcoesClientes}
                isMulti
                onChange={(e) => handleFiltroChange(e, 'clientes')}
                value={opcoesClientes.filter(opt => filtros.clientes.includes(opt.value))}
                placeholder="Selecione os clientes..."
                className="mb-3"
            />

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className="save" onClick={limparFiltros}>Limpar Filtro</button>
            </div>
        </div>
    );
}

export default FiltroAtividades;
