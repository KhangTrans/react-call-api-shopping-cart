package com.ra.shopmanage.controller;

import com.ra.shopmanage.model.entity.Order;
import com.ra.shopmanage.model.entity.User;
import com.ra.shopmanage.service.order.OrderService;
import com.ra.shopmanage.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final UserService userService;

    private User getUser(Long userId) {
        return userService.getAllUsers().stream()
                .filter(u -> u.getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrdersOf(getUser(userId)));
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.createOrder(getUser(userId)));
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<Order> changeStatus(@PathVariable Long orderId, @RequestParam String status) {
        return ResponseEntity.ok(orderService.changeStatus(orderId, status));
    }
}
