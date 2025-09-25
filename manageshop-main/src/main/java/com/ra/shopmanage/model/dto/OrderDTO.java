package com.ra.shopmanage.model.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
    private Long id;
    private String status;
    private String orderDate;
    private List<OrderDetailDTO> items;
}
