package com.example.hieu.food_delivery.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "Shipper")
public class Shipper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name")
    private String name;  // Tên shipper

    @Column(name = "phone")
    private String phoneNumber;  // Số điện thoại

    @Column(name = "email")
    private String email;  // Email của shipper


    @Column(name = "is_active")
    private boolean status;  // Trạng thái của shipper (Active/Inactive)

    @OneToMany(mappedBy = "shipper")  // Một shipper có thể giao nhiều đơn hàng
    private List<Delivery> deliveries;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public List<Delivery> getDeliveries() {
        return deliveries;
    }

    public void setDeliveries(List<Delivery> deliveries) {
        this.deliveries = deliveries;
    }
}