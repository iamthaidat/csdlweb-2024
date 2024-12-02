package com.example.hieu.food_delivery.service;

import com.example.hieu.food_delivery.entity.Category;
import com.example.hieu.food_delivery.entity.Food;
import com.example.hieu.food_delivery.repository.FoodRepository;
import com.example.hieu.food_delivery.service.imp.FileServiceImp;
import com.example.hieu.food_delivery.service.imp.MenuServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class MenuService implements MenuServiceImp {
    @Autowired
    FileServiceImp fileServiceImp;

    @Autowired
    FoodRepository foodRepository;

    @Override
    public boolean createMenu(MultipartFile file, String title, boolean is_freeship, String time_ship, double price, int cate_id) {
        boolean isInsertSuccess = false;
        try {
            boolean isSaveFileSuccess = fileServiceImp.saveFile(file);
            if (isSaveFileSuccess) {
                Food food = new Food();
                food.setTitle(title);
                food.setIs_freeship(is_freeship);
                food.setTimeShip(time_ship);
                food.setPrice(price);
                food.setImage(file.getOriginalFilename());
                Category category = new Category();
                category.setId(cate_id);
                food.setCategory(category);

                foodRepository.save(food);

                isInsertSuccess = true;
            }
        } catch (Exception e) {
            System.out.println("Error insert Menu = " + e.getMessage());
        }
        return isInsertSuccess;
    }
}
