package com.example.hieu.food_delivery.service;

import com.example.hieu.food_delivery.dto.UserDTO;
import com.example.hieu.food_delivery.entity.Users;
import com.example.hieu.food_delivery.repository.UserRepository;
import com.example.hieu.food_delivery.service.imp.UserServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserServiceImp {

    @Autowired
    UserRepository userRepository;

    @Override
    public List<UserDTO> getAllUser() {
        List<Users> listUser = userRepository.findAll();
        List<UserDTO> userDTOList = new ArrayList<>();

        for (Users users : listUser) {
            UserDTO userDTO = new UserDTO();
            userDTO.setId(users.getId());
            userDTO.setUserName(users.getUsername());
            userDTO.setFullName(users.getFullName());
            userDTO.setPassword(users.getPassword());
            userDTOList.add(userDTO);
        }

        return userDTOList;
    }

    @Override
    public boolean updateUser(int id, UserDTO userDTO) {
        Optional<Users> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            Users user = optionalUser.get();
            user.setUsername(userDTO.getUserName());

            user.setPassword(userDTO.getPassword());
            user.setFullName(userDTO.getFullName());
            userRepository.save(user);
            return true;
        }
        return false;  // Người dùng không tồn tại


    }

    @Override
    public boolean deleteUser(int id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;  // Người dùng không tồn tại
    }
}
