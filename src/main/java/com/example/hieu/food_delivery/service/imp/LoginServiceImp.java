package com.example.hieu.food_delivery.service.imp;

import com.example.hieu.food_delivery.dto.UserDTO;
import com.example.hieu.food_delivery.payload.request.SignupRequest;

import java.util.List;

public interface LoginServiceImp {
    List<UserDTO> getAllUser();
    boolean checkLogin(String username, String password);
    boolean addUser(SignupRequest signupRequest);
}
