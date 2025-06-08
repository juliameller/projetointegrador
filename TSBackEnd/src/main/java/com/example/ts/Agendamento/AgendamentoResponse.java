package com.example.ts.Agendamento;

import java.time.LocalDateTime;
import java.util.List;

import com.example.ts.Servicos.ServicosModel;

public class AgendamentoResponse {
    private Long id;
    private Long idCliente;
    private String clienteNome;
    private List<ServicosModel> servicos;
    private LocalDateTime dataInicial;
    private LocalDateTime dataFinal;
    private Integer status;
    private String observacoes;

    // Getters e Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdCliente() {
        return idCliente;
    }
    public void setIdCliente(Long idCliente) {
        this.idCliente = idCliente;
    }

    public String getClienteNome() {
        return clienteNome;
    }

    public void setClienteNome(String clienteNome) {
        this.clienteNome = clienteNome;
    }

    public List<ServicosModel> getServicos() {
        return servicos;
    }
    public void setServicos(List<ServicosModel> servicos) {
        this.servicos = servicos;
    }

    public LocalDateTime getDataInicial() {
        return dataInicial;
    }
    public void setDataInicial(LocalDateTime dataInicial) {
        this.dataInicial = dataInicial;
    }

    public LocalDateTime getDataFinal() {
        return dataFinal;
    }
    public void setDataFinal(LocalDateTime dataFinal) {
        this.dataFinal = dataFinal;
    }

    public Integer getStatus() {
        return status;
    }
    public void setStatus(Integer status) {
        this.status = status;
    }
    public String getObservacoes() { return observacoes; }

    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
}
