package com.example.ts.Agendamento;

import java.time.LocalDateTime;
import java.util.List;

import com.example.ts.Servicos.ServicosModel;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ts.Clientes.ClientModel;

public interface AgendamentoRepository extends JpaRepository<AgendamentoModel, Long> {
    List<AgendamentoModel> findByDataInicial(LocalDateTime dataInicial);
    List<AgendamentoModel> findByCliente(ClientModel cliente);
    List<AgendamentoModel> findByServicosIn(List<ServicosModel> servicos);
    List<AgendamentoModel> findByClienteAndDataInicial(ClientModel cliente, LocalDateTime dataInicial);
    List<AgendamentoModel> findByServicosInAndDataInicial(List<ServicosModel> servicos, LocalDateTime dataInicial);
}