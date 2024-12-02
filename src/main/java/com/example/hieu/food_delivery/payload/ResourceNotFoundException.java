package com.example.hieu.food_delivery.payload;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);  // Gọi constructor của RuntimeException để lưu thông điệp lỗi
    }
}