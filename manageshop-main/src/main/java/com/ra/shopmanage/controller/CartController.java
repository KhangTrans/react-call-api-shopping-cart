package com.ra.shopmanage.controller;

import com.ra.shopmanage.model.dto.*;
import com.ra.shopmanage.model.entity.User;
import com.ra.shopmanage.service.shoppingCart.ShoppingCartService;
import com.ra.shopmanage.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/{userId}/cart")
@RequiredArgsConstructor
public class CartController {
    private final ShoppingCartService cartService;
    private final UserService userService;

    private User getUser(Long userId) {
        return userService.getAllUsers().stream()
                .filter(u -> u.getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
    }

    @GetMapping
    public ResponseEntity<CartSummaryDTO> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.findByUser(getUser(userId)));
    }

    @PostMapping
    public ResponseEntity<CartItemDTO> addToCart(@PathVariable Long userId,
                                                 @Valid @RequestBody CartAddRequest req) {
        return new ResponseEntity<>(
                cartService.addProduct(getUser(userId), req.getProductId(), req.getQuantity()),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{cartId}")
    public ResponseEntity<?> updateQty(@PathVariable Long userId,
                                       @PathVariable Long cartId,
                                       @Valid @RequestBody CartUpdateRequest req) {
        var dto = cartService.updateQuantity(cartId, req.getQuantity());
        // Nếu quantity <= 0 -> service trả null (đã xóa). Trả 204.
        return dto == null ? ResponseEntity.noContent().build() : ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<Void> removeItem(@PathVariable Long userId, @PathVariable Long cartId) {
        cartService.removeItem(cartId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/total-quantity")
    public ResponseEntity<Integer> getTotalQuantity(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getTotalQuantity(getUser(userId)));
    }
    @DeleteMapping
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        cartService.clearCart(getUser(userId));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponseDTO> checkout(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.checkout(getUser(userId)));
    }
}
