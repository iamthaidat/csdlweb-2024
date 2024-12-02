package com.example.hieu.food_delivery.service.imp;

import com.example.hieu.food_delivery.dto.UserDTO;

import java.util.List;

public interface UserServiceImp {
    List<UserDTO> getAllUser();

    boolean updateUser(int id, UserDTO userDTO);
    boolean deleteUser(int id);


}
