package com.ra.shopmanage.model.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponseDTO {
    private Long orderId;
    private String status;
    private LocalDateTime orderDate;  // đổi từ createdAt -> orderDate
    private Double totalAmount;
    private List<CartItemDTO> items;
}

