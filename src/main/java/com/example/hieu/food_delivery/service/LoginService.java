package com.example.hieu.food_delivery.service;

import com.example.hieu.food_delivery.dto.UserDTO;
import com.example.hieu.food_delivery.entity.Roles;
import com.example.hieu.food_delivery.entity.Users;
import com.example.hieu.food_delivery.payload.request.SignupRequest;
import com.example.hieu.food_delivery.repository.UserRepository;
import com.example.hieu.food_delivery.service.imp.LoginServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LoginService implements LoginServiceImp {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

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
    public boolean checkLogin(String username, String password) {
        Users users =  userRepository.findByUsername(username);
        return passwordEncoder.matches(password, users.getPassword());
    }

    @Override
    public boolean addUser(SignupRequest signupRequest) {

        Roles roles = new Roles();
        roles.setId(signupRequest.getRoleId());

        Users users = new Users();
        users.setFullName(signupRequest.getFullName());
        users.setUsername(signupRequest.getEmail());
        users.setPassword(signupRequest.getPassword());
        users.setRoles(roles);
        try {
            userRepository.save(users);
            return true;
        } catch (Exception e) {
            return false;
        }

    }
}
