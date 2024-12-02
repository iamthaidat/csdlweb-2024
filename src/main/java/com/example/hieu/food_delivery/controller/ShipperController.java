package com.example.hieu.food_delivery.controller;

import com.example.hieu.food_delivery.payload.ResponseData;
import com.example.hieu.food_delivery.service.imp.ShipperServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/shipper")
public class ShipperController {

    @Autowired
    ShipperServiceImp shipperServiceImp;

    @PostMapping("")
    public ResponseEntity<?> createShipper(
            @RequestParam String name,
            @RequestParam String phone,
            @RequestParam String email,
            @RequestParam boolean status
            ) {

        ResponseData responseData = new ResponseData();
        boolean isSuccess = shipperServiceImp.createShipper(name, phone, email, status);
        responseData.setData(isSuccess);

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
