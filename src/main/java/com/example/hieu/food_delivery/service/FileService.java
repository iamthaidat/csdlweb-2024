package com.example.hieu.food_delivery.service;

import com.example.hieu.food_delivery.service.imp.FileServiceImp;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileService implements FileServiceImp {

    @Value("${fileUpload.rootPath}")
    private String rootPath;
    private Path root;

    private void init() {
        try {
            root = Paths.get(rootPath);
            if (Files.notExists(root)) {
                Files.createDirectories(root);
            }
        } catch (Exception e) {
            System.out.println("Error create folder root - " + e.getMessage());
        }
    }

    @Override
    public boolean saveFile(MultipartFile file) {
        try {
            init();
            Files.copy(file.getInputStream(), root.resolve(file.getOriginalFilename()), StandardCopyOption.REPLACE_EXISTING);
            return true;
        } catch (Exception e) {
            System.out.println("Error save file: " + e.getMessage());
            return false;
        }

    }

    @Override
    public Resource loadFile(String fileName) {
        try{
            init();
            Path file = root.resolve(fileName);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            }
        } catch (Exception e) {
            System.out.println("Error load file: " + e.getMessage());
        }
        return null;
    }

    @Override
    public String uploadFile(MultipartFile file) {
        try {
            // Đảm bảo thư mục đã được khởi tạo
            init();

            // Lấy tên tệp
            String fileName = file.getOriginalFilename();
            if (fileName == null || fileName.isEmpty()) {
                throw new Exception("File name is empty");
            }

            // Tạo đường dẫn đầy đủ cho tệp
            Path targetLocation = root.resolve(fileName);

            // Sao chép tệp từ MultipartFile vào vị trí đã định
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Trả về tên file sau khi upload thành công
            return fileName;

        } catch (Exception e) {
            System.out.println("Error uploading file: " + e.getMessage());
            return null;  // Hoặc có thể ném ngoại lệ nếu muốn xử lý theo cách khác
        }
    }


}
