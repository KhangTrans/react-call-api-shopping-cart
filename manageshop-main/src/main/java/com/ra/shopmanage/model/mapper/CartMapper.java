package com.ra.shopmanage.model.mapper;

import com.ra.shopmanage.model.dto.CartItemDTO;
import com.ra.shopmanage.model.dto.CartSummaryDTO;
import com.ra.shopmanage.model.entity.ShoppingCart;

import java.util.List;
import java.util.stream.Collectors;

public final class CartMapper {
    private CartMapper() {}

    public static CartItemDTO toDto(ShoppingCart e) {
        return CartItemDTO.builder()
                .id(e.getId())
                .productId(e.getProduct().getId())
                .productName(e.getProduct().getName())
                .quantity(e.getQuantity())
                .unitPrice(e.getProduct().getPrice())
                .build();
    }

    public static List<CartItemDTO> toDtoList(List<ShoppingCart> entities) {
        return entities.stream().map(CartMapper::toDto).collect(Collectors.toList());
    }

    public static CartSummaryDTO summarize(List<ShoppingCart> entities) {
        List<CartItemDTO> items = toDtoList(entities);
        int totalQty = entities.stream().mapToInt(ShoppingCart::getQuantity).sum();
        double totalAmt = entities.stream()
                .mapToDouble(i -> i.getQuantity() * i.getProduct().getPrice())
                .sum();
        return CartSummaryDTO.builder()
                .items(items)
                .totalQuantity(totalQty)
                .totalAmount(totalAmt)
                .build();
    }
}
