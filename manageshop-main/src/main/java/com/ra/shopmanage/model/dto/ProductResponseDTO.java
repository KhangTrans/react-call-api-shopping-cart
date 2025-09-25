package com.ra.shopmanage.model.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponseDTO {
    private Long id;
    private String productName;
    private Double productPrice;
    private int productStock;
    private Boolean productStatus;
    private String categoryName;
    private String imageUrl;
}
