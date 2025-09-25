package com.ra.shopmanage.model.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDetailDTO {
    private Long productId;
    private String productName;
    private Integer quantity;
    private Double price;
}
