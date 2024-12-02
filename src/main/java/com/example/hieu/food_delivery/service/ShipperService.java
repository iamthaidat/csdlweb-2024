package com.example.hieu.food_delivery.service;

import com.example.hieu.food_delivery.entity.Restaurant;
import com.example.hieu.food_delivery.entity.Shipper;
import com.example.hieu.food_delivery.repository.ShipperRepository;
import com.example.hieu.food_delivery.service.imp.ShipperServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;

@Service
public class ShipperService implements ShipperServiceImp {

    @Autowired
    ShipperRepository shipperRepository;

    @Override
    public boolean createShipper(String name, String phone, String email, boolean status) {
//        boolean isInsertSuccess = false;
//        try {
//            boolean isSaveFileSuccess = fileServiceImp.saveFile(file);
//            if (isSaveFileSuccess) {
//                Restaurant restaurant = new Restaurant();
//                restaurant.setTitle(title);
//                restaurant.setSubtitle(subtitle);
//                restaurant.setDescription(description);
//                restaurant.setImage(file.getOriginalFilename());
//                restaurant.setIs_freeship(is_freeship);
//                restaurant.setAddress(address);
//
//                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
//                Date openDate = simpleDateFormat.parse(open_date);
//                restaurant.setOpen_date(openDate);
//
//                restaurantRepository.save(restaurant);
//                isInsertSuccess = true;
//            }
//        } catch (Exception e) {
//            System.out.println("Error insert restaurant: " + e.getMessage());
//        }
//        return isInsertSuccess;

        Shipper shipper = new Shipper();
        shipper.setName(name);
        shipper.setPhoneNumber(phone);
        shipper.setEmail(email);
        shipper.setStatus(status);

        try {
            shipperRepository.save(shipper);
            return true;
        } catch (Exception e) {
            return false;
        }

    }
}
