package com.example.hieu.food_delivery.controller;

import com.example.hieu.food_delivery.payload.ResponseData;
import com.example.hieu.food_delivery.payload.request.SignupRequest;
import com.example.hieu.food_delivery.service.imp.LoginServiceImp;
import com.example.hieu.food_delivery.utils.JwtUtilsHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")
public class LoginController {

    @Autowired
    LoginServiceImp loginServiceImp;

    @Autowired
    JwtUtilsHelper jwtUtilsHelper;

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestParam String username, @RequestParam String password) {
        ResponseData responseData = new ResponseData();



        if (loginServiceImp.checkLogin(username, password)) {
            String token = jwtUtilsHelper.generateToken(username);
            responseData.setData(token);
        } else {
            responseData.setData("");
            responseData.setSuccess(false);
        }


        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) {
        ResponseData responseData = new ResponseData();
        responseData.setData(loginServiceImp.addUser(signupRequest));
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

//    @GetMapping("/getAllUser")
//    public ResponseEntity<?> getAllUser() {
//        ResponseData responseData = new ResponseData();
//        responseData.setData(loginServiceImp.getAllUser());
//
//        return new ResponseEntity<>(responseData, HttpStatus.OK);
//    }

}
