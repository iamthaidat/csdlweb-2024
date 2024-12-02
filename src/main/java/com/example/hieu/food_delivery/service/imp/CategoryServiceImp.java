package com.example.hieu.food_delivery.service.imp;

import com.example.hieu.food_delivery.dto.CategoryDTO;

import java.util.List;

public interface CategoryServiceImp {
    List<CategoryDTO> getCategoryHomePage();
    boolean addCategory(String nameCate, String createDate); // Thêm danh mục mới
    boolean updateCategory(int id, String nameCate, String createDate); // Cập nhật danh mục
    boolean deleteCategory(int id);  // Xóa danh mục
}
