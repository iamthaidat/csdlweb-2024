package com.example.hieu.food_delivery.dto;

import java.util.List;

public class CategoryDTO {
    private String name;
    private List<MenuDTO> menus;

    // Constructor chuyển từ Category entity sang CategoryDTO
//    public CategoryDTO(Category category) {
//        this.name = category.getNameCate();
//        // Chuyển đổi Set<Food> thành Set<MenuDTO>
//        this.menus = category.setListFood().stream()
//                .map(food -> new MenuDTO(food)) // Chuyển từ Food thành MenuDTO
//                .collect(Collectors.toSet());
//    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<MenuDTO> getMenus() {
        return menus;
    }

    public void setMenus(List<MenuDTO> menus) {
        this.menus = menus;
    }
}
