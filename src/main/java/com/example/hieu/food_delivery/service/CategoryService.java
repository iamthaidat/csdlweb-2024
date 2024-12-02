package com.example.hieu.food_delivery.service;



import com.example.hieu.food_delivery.dto.CategoryDTO;
import com.example.hieu.food_delivery.dto.MenuDTO;
import com.example.hieu.food_delivery.entity.Category;
import com.example.hieu.food_delivery.entity.Food;
import com.example.hieu.food_delivery.repository.CategoryRepository;
import com.example.hieu.food_delivery.service.imp.CategoryServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class CategoryService implements CategoryServiceImp {
    @Autowired
    CategoryRepository categoryRepository;



    @Override
    public List<CategoryDTO> getCategoryHomePage() {
        PageRequest pageRequest = PageRequest.of(0, 6, Sort.by("id"));
        Page<Category> listCategory = categoryRepository.findAll(pageRequest);
        List<CategoryDTO> listCategoryDTOs = new ArrayList<>();

        for (Category data : listCategory) {
            CategoryDTO categoryDTO = new CategoryDTO();
            categoryDTO.setName(data.getNameCate());

            List<MenuDTO> menuDTOs = new ArrayList<>();
            for (Food dataFood : data.getListFood()) {
                MenuDTO menuDTO = new MenuDTO();
                menuDTO.setTitle(dataFood.getTitle());
                menuDTO.setIsfree_ship(dataFood.isIs_freeship());
                menuDTO.setImage(dataFood.getImage());
                menuDTO.setPrice(dataFood.getPrice());
                menuDTOs.add(menuDTO);
            }

            categoryDTO.setMenus(menuDTOs);
            listCategoryDTOs.add(categoryDTO);
        }

        return listCategoryDTOs;
    }


    @Override
    public boolean addCategory(String nameCate, String createDate) {
        boolean isSucces = false;
        try {
            Category category = new Category();
            category.setNameCate(nameCate);  // Gán tên danh mục từ tham số

            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date create_Date = simpleDateFormat.parse(createDate);
            category.setCreateDate(create_Date);
            categoryRepository.save(category);  // Lưu vào cơ sở dữ liệu
            isSucces = true;  // Trả về true nếu lưu thành công
        } catch (Exception e) {
            System.out.println("Error insert category: " + e.getMessage());
        }

        return isSucces;



        }


    @Override
    public boolean updateCategory(int id, String nameCate, String createDate) {
        boolean isUpdateSuccess = false;
        // Tìm Category theo id
        Optional<Category> optionalCategory = categoryRepository.findById(id);

        try {

            // Kiểm tra xem Category có tồn tại hay không
            if (optionalCategory.isPresent()) {


                // 4. Lấy Category từ Optional
                Category category = optionalCategory.get();

                // Cập nhật các thuộc tính của Category
                category.setNameCate(nameCate);  // Cập nhật tên danh mục
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
                Date create_Date = simpleDateFormat.parse(createDate);
                category.setCreateDate(create_Date);
                categoryRepository.save(category);
                isUpdateSuccess = true;
            }
        } catch (Exception e) {
            System.out.println("Error update category" + e.getMessage());
        }

        return isUpdateSuccess;

    }


    @Override
    public boolean deleteCategory(int id) {
        // Tìm Category theo id
        Optional<Category> optionalCategory = categoryRepository.findById(id);

        // Kiểm tra xem Category có tồn tại hay không
        if (!optionalCategory.isPresent()) {
            return false; // Trả về false nếu không tìm thấy Category với id đã cho
        }

        try {
            // Lấy Category từ Optional
            Category category = optionalCategory.get();

            // Xóa Category
            categoryRepository.delete(category);

            // Trả về true nếu xóa thành công
            return true;
        } catch (Exception e) {
            System.out.println("Error deleting category: " + e.getMessage());
            return false; // Trả về false nếu có lỗi xảy ra
        }
    }
}

