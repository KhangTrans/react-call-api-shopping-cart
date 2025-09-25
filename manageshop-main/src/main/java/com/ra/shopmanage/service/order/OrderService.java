package com.ra.shopmanage.service.order;

import com.ra.shopmanage.model.entity.Order;
import com.ra.shopmanage.model.entity.User;

import java.util.List;

public interface OrderService {
    List<Order> getOrdersOf(User user);
    Order createOrder(User user);
    Order changeStatus(Long orderId, String status);
}
