package com.example.ts.Agendamento;

import java.time.LocalDateTime;
import java.util.List;

import com.example.ts.Clientes.ClientModel;
import com.example.ts.Servicos.ServicosModel;

import jakarta.persistence.*;

@Entity
@Table(name = "agenda")
public class AgendamentoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_agenda")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_cliente", referencedColumnName = "id_cliente")
    private ClientModel cliente;

    @ManyToMany
    @JoinTable(
            name = "agendamento_servicos",
            joinColumns = @JoinColumn(name = "id_agenda"),
            inverseJoinColumns = @JoinColumn(name = "id_servico")
    )
    private List<ServicosModel> servicos;

    @Column(name = "data_inicial")
    private LocalDateTime dataInicial;

    @Column(name = "data_final")
    private LocalDateTime dataFinal;

    @Column(name = "status")
    private Integer status;

    @Column(name = "observacoes")
    private String observacoes;


    // Getters e Setters atualizados
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ClientModel getCliente() {
        return cliente;
    }

    public void setCliente(ClientModel cliente) {
        this.cliente = cliente;
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
