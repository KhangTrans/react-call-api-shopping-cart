package com.ra.shopmanage.model.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartUpdateRequest {
    @NotNull
    @Min(0)
    private Integer quantity;
}
