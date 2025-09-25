package com.ra.shopmanage.repository;

import com.ra.shopmanage.model.entity.Order;
import com.ra.shopmanage.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByOrderDateDesc(User user);
}
