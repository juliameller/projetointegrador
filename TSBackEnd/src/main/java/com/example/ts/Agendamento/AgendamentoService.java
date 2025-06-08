package com.example.ts.Agendamento;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.ts.Clientes.ClientModel;
import com.example.ts.Clientes.ClientService;
import com.example.ts.Servicos.ServicosModel;
import com.example.ts.Servicos.ServicosRepository;

@Service
public class AgendamentoService {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private ServicosRepository servicoRepository;

    @Autowired
    private ClientService clientService;

    public AgendamentoModel agendar(Long id_cliente, List<Long> id_servicos, LocalDateTime dataInicial,
    LocalDateTime dataFinal, Integer status) {
    Optional<ClientModel> cliente = clientService.buscarPorId(id_cliente);

    if (cliente.isEmpty()) {
    throw new RuntimeException("Cliente não encontrado");
    }

    // Carregar os serviços usando os IDs fornecidos
    List<ServicosModel> servicos = servicoRepository.findAllById(id_servicos);
    if (servicos.isEmpty()) {
        throw new RuntimeException("Serviços não encontrados");
    }

    List<AgendamentoModel> agendamentos = agendamentoRepository.findByDataInicial(dataInicial);
    if (!agendamentos.isEmpty()) {
    throw new RuntimeException("Horário já agendado");
    }

    AgendamentoModel agendamento = new AgendamentoModel();
    agendamento.setCliente(cliente.get());
    agendamento.setServicos(servicos);
    agendamento.setDataInicial(dataInicial);
    agendamento.setDataFinal(dataFinal);
    agendamento.setStatus(status);  // Agora o status está sendo usado

    return agendamentoRepository.save(agendamento);
    }

    public List<AgendamentoModel> listarTodos() {
        return agendamentoRepository.findAll();
    }

    public AgendamentoModel atualizar(Long id, Long id_cliente, List<Long> id_servicos, LocalDateTime dataInicial, LocalDateTime dataFinal, Integer status, String observacoes) {
        Optional<AgendamentoModel> agendamentoExistente = agendamentoRepository.findById(id);
    
        if (agendamentoExistente.isEmpty()) {
            throw new RuntimeException("Agendamento não encontrado");
        }
    
        Optional<ClientModel> cliente = clientService.buscarPorId(id_cliente);
        if (cliente.isEmpty()) {
            throw new RuntimeException("Cliente não encontrado");
        }

        List<ServicosModel> servicos = servicoRepository.findAllById(id_servicos);
        if (servicos.isEmpty()) {
            throw new RuntimeException("Um ou mais serviços não encontrados");
        }
    
        List<AgendamentoModel> agendamentos = agendamentoRepository.findByDataInicial(dataInicial)
            .stream()
            .filter(a -> !a.getId().equals(id))
            .toList();
            
        if (!agendamentos.isEmpty()) {
            throw new RuntimeException("Horário já agendado");
        }
    
        AgendamentoModel agendamento = agendamentoExistente.get();
        agendamento.setCliente(cliente.get());
        agendamento.setServicos(servicos);
        agendamento.setDataInicial(dataInicial);
        agendamento.setDataFinal(dataFinal);
        agendamento.setStatus(status);
        agendamento.setObservacoes(observacoes);
    
        return agendamentoRepository.save(agendamento);
    }

    public void deletar(Long id) {
        Optional<AgendamentoModel> agendamentoExistente = agendamentoRepository.findById(id);

        if (agendamentoExistente.isEmpty()) {
            throw new RuntimeException("Agendamento não encontrado");
        }

        agendamentoRepository.deleteById(id);
    }
}