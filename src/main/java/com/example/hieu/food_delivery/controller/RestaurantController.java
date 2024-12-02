package com.example.hieu.food_delivery.controller;

import com.example.hieu.food_delivery.payload.ResponseData;
import com.example.hieu.food_delivery.service.imp.FileServiceImp;
import com.example.hieu.food_delivery.service.imp.RestaurantServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/restaurant")
public class RestaurantController {

    @Autowired
    FileServiceImp fileServiceImp;

    @Autowired
    RestaurantServiceImp restaurantServiceImp;

    // Thêm nhà hàng
    @PostMapping("")
    public ResponseEntity<?> createRestaurant(
            @RequestParam MultipartFile file,
            @RequestParam String title,
            @RequestParam String subtitle,
            @RequestParam String description,

            @RequestParam boolean is_freeship,
            @RequestParam String address,
            @RequestParam String open_date) {

        ResponseData responseData = new ResponseData();
        boolean isSuccess = restaurantServiceImp.insertRestaurant(file, title, subtitle, description, is_freeship, address, open_date);
        responseData.setData(isSuccess);

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("")
    public ResponseEntity<?> getHomeRestaurant() {
        ResponseData responseData = new ResponseData();
        responseData.setData(restaurantServiceImp.getHomePageRestaurant());
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("/")
    public ResponseEntity<?> createRestaurant(@RequestParam MultipartFile file) {
        ResponseData responseData = new ResponseData();
        boolean isSuccess = fileServiceImp.saveFile(file);
        responseData.setData(isSuccess);

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }



//    @GetMapping("/file/{filename:.+}")
//    public ResponseEntity<?> getFileRestaurant(@PathVariable String filename) {
//        Resource resource = fileServiceImp.loadFile(filename);
//
//        return ResponseEntity.ok()
//                .header(HttpHeaders.CONTENT_DISPOSITION,
//                        "attachment; filename=\"" + resource.getFilename() + "\"")
//                .body(resource);
//    }

    // Xem chi tiết danh sách
    @GetMapping("/detail")
    public ResponseEntity<?> getDetailRestaurant(@RequestParam int id) {
        ResponseData responseData = new ResponseData();
        responseData.setData(restaurantServiceImp.getDetailRestaurant(id));
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // Cập nhật thông tin nhà hàng
    @PutMapping("/{id}")
    public ResponseEntity<String> updateRestaurant(
            @PathVariable int id,
            @RequestParam MultipartFile file,
            @RequestParam String title,
            @RequestParam String subtitle,
            @RequestParam String description,
            @RequestParam boolean is_freeship,
            @RequestParam String address,
            @RequestParam String open_date
    ) {
        boolean isSuccess = restaurantServiceImp.updateRestaurant(id, file, title, subtitle, description, is_freeship, address, open_date);
        return isSuccess ? ResponseEntity.ok("Restaurant updated successfully") : ResponseEntity.status(500).body("Failed to update restaurant");
    }

    // Phương thức xóa nhà hàng
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRestaurant(@PathVariable int id) {
        ResponseData responseData = new ResponseData();

        // Xóa nhà hàng
        boolean isDeleted = restaurantServiceImp.deleteRestaurant(id);
        if (isDeleted) {
            responseData.setDesc("Restaurant deleted successfully.");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } else {
            responseData.setDesc("Restaurant not found.");
            return new ResponseEntity<>(responseData, HttpStatus.NOT_FOUND);
        }
    }
}



