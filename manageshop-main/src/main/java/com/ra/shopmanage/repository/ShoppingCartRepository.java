package com.ra.shopmanage.repository;

import com.ra.shopmanage.model.entity.Product;
import com.ra.shopmanage.model.entity.ShoppingCart;
import com.ra.shopmanage.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface ShoppingCartRepository extends JpaRepository<ShoppingCart, Long> {
    List<ShoppingCart> findByUser(User user);

    Optional<ShoppingCart> findByUserAndProduct(User user, Product product);

    @Modifying
    @Transactional
    @Query("DELETE FROM ShoppingCart c WHERE c.user = :user")
    void deleteByUser(@Param("user") User user);
    @Query("SELECT COALESCE(SUM(c.quantity), 0) FROM ShoppingCart c WHERE c.user = :user")
    int getTotalQuantityByUser(@Param("user") User user);
}

