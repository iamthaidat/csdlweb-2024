package com.example.hieu.food_delivery.service.imp;


import org.springframework.core.io.Resource;

import org.springframework.web.multipart.MultipartFile;

public interface FileServiceImp {
    boolean saveFile(MultipartFile file);

    Resource loadFile(String fileName);

    String uploadFile(MultipartFile file);


}
