package com.example.hieu.food_delivery.service.imp;

import org.springframework.web.multipart.MultipartFile;

public interface MenuServiceImp {
    boolean createMenu(MultipartFile file, String title, boolean is_freeship, String time_ship, double price, int cate_id);
}
