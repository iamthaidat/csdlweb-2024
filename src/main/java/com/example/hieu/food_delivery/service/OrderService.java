package com.example.hieu.food_delivery.service;

import com.example.hieu.food_delivery.entity.keys.KeyOrderItem;
import com.example.hieu.food_delivery.payload.request.OrderRequest;
import com.example.hieu.food_delivery.repository.OrderItemRepository;
import com.example.hieu.food_delivery.repository.OrderRepository;
import com.example.hieu.food_delivery.service.imp.OrderServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.hieu.food_delivery.entity.*;

import java.util.ArrayList;
import java.util.List;

@Service

public class OrderService implements OrderServiceImp {
    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderItemRepository orderItemRepository;

    @Override
    public boolean insertOrder(OrderRequest orderRequest) {
        try {
            Users users = new Users();
            users.setId(orderRequest.getUserId());

            Restaurant restaurant = new Restaurant();
            restaurant.setId(orderRequest.getRestId());

            Orders orders = new Orders();
            orders.setUsers(users);
            orders.setRestaurant(restaurant);

            orderRepository.save(orders);
            List<OrderItem> items = new ArrayList<>();

            for (int idFood : orderRequest.getFoodIds()) {
                Food food = new Food();
                food.setId(idFood);

                OrderItem orderItem = new OrderItem();
                KeyOrderItem keyOrderItem = new KeyOrderItem(orders.getId(), idFood);
                orderItem.setKeyOrderItem(keyOrderItem);

                items.add(orderItem);
            }

            orderItemRepository.saveAll(items);
            return true;
        } catch (Exception e) {
            System.out.println("Error insert order " + e.getMessage());
            return false;
        }
    }
}
