package com.example.java_service.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "order_status")
public class OrderStatus {

    @Id
    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;

    private Boolean isPrepared;
    private Boolean isDelivered;

    public OrderStatus() {
        this.isPrepared = false;
        this.isDelivered = false;
    }

}
