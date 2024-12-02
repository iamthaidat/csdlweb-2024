package com.example.hieu.food_delivery.dto;

public class MenuDTO {
    private int id;
    private String title;
    private String image;
    private boolean isfree_ship;

    private String desc;

    private double price;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public boolean isIsfree_ship() {
        return isfree_ship;
    }

    // Constructor chuyển từ Food entity sang MenuDTO
//    public MenuDTO(Food food) {
//        this.title = food.getTitle();
//        this.image = food.getImage();
//        this.isfree_ship = food.isIs_freeship();
//       // this.desc = food.getDesc();
//        this.price = food.getPrice();
//    }

    public void setIsfree_ship(boolean isfree_ship) {
        this.isfree_ship = isfree_ship;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}
