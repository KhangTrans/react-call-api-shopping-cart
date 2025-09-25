package com.ra.shopmanage.controller;

import com.ra.shopmanage.model.entity.OrderDetail;
import com.ra.shopmanage.repository.OrderDetailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders/{orderId}/details")
@RequiredArgsConstructor
public class OrderDetailController {
    private final OrderDetailRepository orderDetailRepository;

    @GetMapping
    public ResponseEntity<List<OrderDetail>> getDetails(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderDetailRepository.findByOrderId(orderId));
    }
}
