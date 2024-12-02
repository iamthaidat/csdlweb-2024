package com.example.hieu.food_delivery.entity;

import jakarta.persistence.*;

import java.util.Date;
import java.util.Set;

@Entity(name = "Restaurant")
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "title")
    private String title;

    @Column(name = "subtitle")
    private String subtitle;

    @Column(name = "description")
    private String description;

    @Column(name = "image")
    private String image;

//    @Column(name = "is_fresh")
//    private boolean isFresh;

    @Column(name = "is_freeship")
    private boolean is_freeship;

    @Column(name = "address")
    private String address;

    @Column(name = "open_date")
    private Date open_date;

    @OneToMany(mappedBy = "restaurant")
    private Set<RatingRestaurant> listRatingRestaurant;

    @OneToMany(mappedBy = "restaurant")
    private Set<Orders> listOrder;

    @OneToMany(mappedBy = "restaurant")
    private Set<MenuRestaurant> listMenuRestaurant;

    @OneToMany(mappedBy = "restaurant")
    private Set<Promo> listPromo;

    public Set<Promo> getListPromo() {
        return listPromo;
    }

    public void setListPromo(Set<Promo> listPromo) {
        this.listPromo = listPromo;
    }

    public Set<MenuRestaurant> getListMenuRestaurant() {
        return listMenuRestaurant;
    }

    public void setListMenuRestaurant(Set<MenuRestaurant> listMenuRestaurant) {
        this.listMenuRestaurant = listMenuRestaurant;
    }

    public Set<Orders> getListOrder() {
        return listOrder;
    }

    public void setListOrder(Set<Orders> listOrder) {
        this.listOrder = listOrder;
    }

    public Set<RatingRestaurant> getListRatingRestaurant() {
        return listRatingRestaurant;
    }

    public void setListRatingRestaurant(Set<RatingRestaurant> listRatingRestaurant) {
        this.listRatingRestaurant = listRatingRestaurant;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

//    public boolean isFresh() {
//        return isFresh;
//    }
//
//    public void setFresh(boolean fresh) {
//        isFresh = fresh;
//    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Date getOpen_date() {
        return open_date;
    }

    public void setOpen_date(Date open_date) {
        this.open_date = open_date;
    }

    public boolean isIs_freeship() {
        return is_freeship;
    }

    public void setIs_freeship(boolean is_freeship) {
        this.is_freeship = is_freeship;
    }
}
