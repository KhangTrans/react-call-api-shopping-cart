package com.ra.shopmanage.model.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CartSummaryDTO {
    private List<CartItemDTO> items;
    private Integer totalQuantity;
    private Double totalAmount;
}
