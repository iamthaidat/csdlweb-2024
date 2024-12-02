package com.example.hieu.food_delivery.repository;

import com.example.hieu.food_delivery.entity.OrderItem;
import com.example.hieu.food_delivery.entity.keys.KeyOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, KeyOrderItem> {
}
