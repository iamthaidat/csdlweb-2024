package com.example.hieu.food_delivery.repository;

import com.example.hieu.food_delivery.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryRepository extends JpaRepository<Delivery, Integer> {
}
