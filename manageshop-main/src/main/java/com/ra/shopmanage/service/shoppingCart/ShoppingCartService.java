package com.ra.shopmanage.service.shoppingCart;

import com.ra.shopmanage.model.dto.CartItemDTO;
import com.ra.shopmanage.model.dto.CartSummaryDTO;
import com.ra.shopmanage.model.dto.OrderResponseDTO;
import com.ra.shopmanage.model.entity.User;

import java.util.List;

public interface ShoppingCartService {
    CartSummaryDTO findByUser(User user);                     //  đổi trả về summary

    CartItemDTO addProduct(User user, Long productId, Integer quantity);

    CartItemDTO updateQuantity(Long cartId, Integer quantity); // nếu quantity <=0 -> ném NoSuchElement hoặc trả null tùy chọn

    void removeItem(Long cartId);

    int getTotalQuantity(User user);

    void clearCart(User user);

    OrderResponseDTO checkout(User user);
}
