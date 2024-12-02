package com.example.hieu.food_delivery.payload.request;

import java.util.List;

public class DeliveryRequest {
    private int deliveryId;
    private String deliveryStatus;

    // Thông tin người nhận
    private String userName;
    private String userPhone;
    private String userAddress;

    // Thông tin nhà hàng
    private String restaurantName;
    private String restaurantAddress;

    // Thông tin shipper
    private String shipperName;
    private String shipperPhone;

    // Thực đơn của đơn hàng
    private List<String> orderItems; // Các món ăn trong đơn hàng
}
