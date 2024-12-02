package com.example.hieu.food_delivery.entity;

import jakarta.persistence.*;

@Entity(name = "Payment")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne
    @JoinColumn(name = "order_id")
    private Orders orders;  // Mỗi đơn hàng sẽ có một phương thức thanh toán

    @Column(name = "payment_method")
    private String paymentMethod;  // Phương thức thanh toán (ví dụ: "Tiền mặt", "Chuyển khoản", "Thẻ tín dụng")

    @Column(name = "payment_status")
    private boolean paymentStatus;  // Trạng thái thanh toán (ví dụ: "Chưa thanh toán", "Đã thanh toán", "Thanh toán thất bại")

    @Column(name = "amount")
    private int amount;  // Số tiền thanh toán


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }


    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public boolean isPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(boolean paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public Orders getOrders() {
        return orders;
    }

    public void setOrders(Orders orders) {
        this.orders = orders;
    }
}

