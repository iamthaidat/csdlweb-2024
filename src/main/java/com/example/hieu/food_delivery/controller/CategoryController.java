package com.example.hieu.food_delivery.controller;

import com.example.hieu.food_delivery.payload.ResponseData;
import com.example.hieu.food_delivery.service.imp.CategoryServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/category")
public class CategoryController {

    @Autowired
    CategoryServiceImp categoryServiceImp;

    @GetMapping("")
    public ResponseEntity<?> getHomeCategory() {
        ResponseData responseData = new ResponseData();

        responseData.setData(categoryServiceImp.getCategoryHomePage());

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<String> addCategory(@RequestParam String nameCate,
                                              @RequestParam String createDate) {
        boolean isAdded = categoryServiceImp.addCategory(nameCate, createDate);


        if (isAdded) {
            return ResponseEntity.ok("Category added successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to add category.");
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateCategory(@PathVariable int id,
                                                 @RequestParam String nameCate,
                                                 @RequestParam String createDate) {
        boolean isUpdated = categoryServiceImp.updateCategory(id, nameCate, createDate);
        // In giá trị isUpdated để kiểm tra
        System.out.println("isUpdated: " + isUpdated);

        if (isUpdated) {
            return ResponseEntity.ok("Category updated successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update category.");
        }
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable int id) {
        boolean isDeleted = categoryServiceImp.deleteCategory(id);

        if (isDeleted) {
            return ResponseEntity.ok("Category deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to delete category.");
        }
    }
}
