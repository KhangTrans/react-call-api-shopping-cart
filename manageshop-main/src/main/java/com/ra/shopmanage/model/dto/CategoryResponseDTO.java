package com.ra.shopmanage.model.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponseDTO {
    private Long id;
    private String categoryName;
    private Boolean categoryStatus;
    private List<ProductResponseDTO> products;
}
