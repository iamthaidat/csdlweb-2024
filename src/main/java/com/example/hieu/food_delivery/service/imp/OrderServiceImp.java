package com.example.hieu.food_delivery.service.imp;

import com.example.hieu.food_delivery.payload.request.OrderRequest;

public interface OrderServiceImp {
    boolean insertOrder(OrderRequest orderRequest);
}
