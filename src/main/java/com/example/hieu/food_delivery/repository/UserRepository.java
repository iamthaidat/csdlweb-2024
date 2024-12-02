package com.example.hieu.food_delivery.repository;

import com.example.hieu.food_delivery.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<Users, Integer> {


    /**
     * select * from users where username = '' and password = ''
     */
    List<Users> findByUsernameAndPassword(String username, String password);

    Users findByUsername(String username);


}
