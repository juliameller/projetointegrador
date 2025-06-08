package com.example.ts.Agendamento;

import java.util.List;

public class AgendamentoRequest {
    private Long id_cliente;
    private List<Long> id_servicos;
    private String dataInicial;
    private String dataFinal;
    private Integer status;
    private String observacoes;

    // Construtor vazio é necessário para deserialização
    public AgendamentoRequest() {}

    // Getters e Setters
    public Long getId_cliente() {
        return id_cliente;
    }

    public void setId_cliente(Long id_cliente) {
        this.id_cliente = id_cliente;
    }

    public List<Long> getId_servicos() {
        return id_servicos;
    }

    public void setId_servicos(List<Long> id_servicos) {
        this.id_servicos = id_servicos;
    }

    public String getDataInicial() {
        return dataInicial;
    }

    public void setDataInicial(String dataInicial) {
        this.dataInicial = dataInicial;
    }

    public String getDataFinal() {
        return dataFinal;
    }

    public void setDataFinal(String dataFinal) {
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