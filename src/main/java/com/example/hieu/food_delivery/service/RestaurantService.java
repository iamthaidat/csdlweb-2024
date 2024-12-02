package com.example.hieu.food_delivery.service;

import com.example.hieu.food_delivery.dto.CategoryDTO;
import com.example.hieu.food_delivery.dto.MenuDTO;
import com.example.hieu.food_delivery.dto.RestaurantDTO;
import com.example.hieu.food_delivery.entity.Food;
import com.example.hieu.food_delivery.entity.MenuRestaurant;
import com.example.hieu.food_delivery.entity.RatingRestaurant;
import com.example.hieu.food_delivery.entity.Restaurant;
import com.example.hieu.food_delivery.repository.RestaurantRepository;
import com.example.hieu.food_delivery.service.imp.FileServiceImp;
import com.example.hieu.food_delivery.service.imp.RestaurantServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class RestaurantService implements RestaurantServiceImp {

    @Autowired
    FileServiceImp fileServiceImp;

    @Autowired
    RestaurantRepository restaurantRepository;

    @Override
    public boolean insertRestaurant(MultipartFile file, String title, String subtitle, String description, boolean is_freeship, String address, String open_date) {

        boolean isInsertSuccess = false;
        try {
            boolean isSaveFileSuccess = fileServiceImp.saveFile(file);
            if (isSaveFileSuccess) {
                Restaurant restaurant = new Restaurant();
                restaurant.setTitle(title);
                restaurant.setSubtitle(subtitle);
                restaurant.setDescription(description);
                restaurant.setImage(file.getOriginalFilename());
                restaurant.setIs_freeship(is_freeship);
                restaurant.setAddress(address);

                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
                Date openDate = simpleDateFormat.parse(open_date);
                restaurant.setOpen_date(openDate);

                restaurantRepository.save(restaurant);
                isInsertSuccess = true;
            }
        } catch (Exception e) {
            System.out.println("Error insert restaurant: " + e.getMessage());
        }
        return isInsertSuccess;
    }

    @Override
    public List<RestaurantDTO> getHomePageRestaurant() {
        List<RestaurantDTO> restaurantDTOS = new ArrayList<>();
        PageRequest pageRequest = PageRequest.of(0, 6);
        Page<Restaurant> listData = restaurantRepository.findAll(pageRequest);
        for (Restaurant data : listData) {
            RestaurantDTO restaurantDTO = new RestaurantDTO();
            restaurantDTO.setImage(data.getImage());
            restaurantDTO.setTitle(data.getTitle());
            restaurantDTO.setSubtitle(data.getSubtitle());
            restaurantDTO.setFreeShip(data.isIs_freeship());
            restaurantDTO.setRating(calculateRating(data.getListRatingRestaurant()));
            restaurantDTOS.add(restaurantDTO);
        }

        return restaurantDTOS;
    }



    private double calculateRating(Set<RatingRestaurant> listRating) {
        double totalPoint = 0;
        for (RatingRestaurant data : listRating) {
            totalPoint += data.getRatePoint();
        }
        return totalPoint / listRating.size();
    }
    @Override
    public RestaurantDTO getDetailRestaurant(int id) {

        Optional<Restaurant> restaurant = restaurantRepository.findById(id);
        RestaurantDTO restaurantDTO = new RestaurantDTO();

        //kiểm tra restaurant có null hay không
        if(restaurant.isPresent()){
            List<CategoryDTO> categoryDTOList = new ArrayList<>();
            Restaurant data = restaurant.get(); //.get: để hủy optional đi về lại entity

            restaurantDTO.setTitle(data.getTitle());
            restaurantDTO.setSubtitle(data.getSubtitle());
            restaurantDTO.setImage(data.getImage());
            restaurantDTO.setRating(calculateRating(data.getListRatingRestaurant()));
            restaurantDTO.setFreeShip(data.isIs_freeship());
            restaurantDTO.setDesc(data.getDescription());
            restaurantDTO.setOpenDate(data.getOpen_date());

            //category
            for (MenuRestaurant menuRestaurant : data.getListMenuRestaurant()) {
                List<MenuDTO> menuDTOList = new ArrayList<>();
                CategoryDTO categoryDTO = new CategoryDTO();
                categoryDTO.setName(menuRestaurant.getCategory().getNameCate());

                //menu
                for (Food food : menuRestaurant.getCategory().getListFood()) {
                    MenuDTO menuDTO = new MenuDTO();
                    menuDTO.setId(food.getId());
                    menuDTO.setImage(food.getImage());
                    menuDTO.setIsfree_ship(food.isIs_freeship());
                    menuDTO.setTitle(food.getTitle());
//                    menuDTO.setDesc(food.get());
                    menuDTO.setPrice(food.getPrice());

                    menuDTOList.add(menuDTO);
                }
                categoryDTO.setMenus(menuDTOList);
                categoryDTOList.add(categoryDTO);
            }
            restaurantDTO.setCategories(categoryDTOList);
        }
        return restaurantDTO;
    }

    @Override
    public boolean updateRestaurant(int id, MultipartFile file, String title, String subtitle, String description, boolean is_freeship, String address, String open_date) {
        Optional<Restaurant> restaurantOptional = restaurantRepository.findById(id);
        boolean isUpdateSuccess = false;
        try {
            if (restaurantOptional.isPresent()) {
                Restaurant restaurant = restaurantOptional.get();
                restaurant.setTitle(title);
                restaurant.setSubtitle(subtitle);
                restaurant.setDescription(description);
                restaurant.setIs_freeship(is_freeship);
                restaurant.setAddress(address);
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
                Date openDate = simpleDateFormat.parse(open_date);
                restaurant.setOpen_date(openDate);

                // Nếu có file mới, tải lên ảnh mới
            if (file != null && !file.isEmpty()) {
                String imageUrl = fileServiceImp.uploadFile(file);
                restaurant.setImage(imageUrl);
            }


                restaurantRepository.save(restaurant);
                return isUpdateSuccess = true;
            }
        } catch (Exception e) {
            System.out.println("Error insert restaurant: " + e.getMessage());
            }
        return isUpdateSuccess;
        }






    @Override
    public boolean deleteRestaurant(int id) {
        Optional<Restaurant> restaurantOpt = restaurantRepository.findById(id);

        if (restaurantOpt.isPresent()) {
            restaurantRepository.deleteById(id);  // Xóa nhà hàng khỏi cơ sở dữ liệu
            return true;
        }

        // Nếu không tìm thấy nhà hàng, trả về false
        return false;

    }



}

