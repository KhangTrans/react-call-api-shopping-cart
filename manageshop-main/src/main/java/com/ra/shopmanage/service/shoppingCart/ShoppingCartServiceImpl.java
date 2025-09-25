package com.ra.shopmanage.service.shoppingCart;

import com.ra.shopmanage.model.dto.CartItemDTO;
import com.ra.shopmanage.model.dto.CartSummaryDTO;
import com.ra.shopmanage.model.dto.OrderResponseDTO;
import com.ra.shopmanage.model.entity.*;
import com.ra.shopmanage.model.mapper.CartMapper;
import com.ra.shopmanage.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ShoppingCartServiceImpl implements ShoppingCartService {
    private final ShoppingCartRepository shoppingCartRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;

    @Override
    public CartSummaryDTO findByUser(User user) {
        List<ShoppingCart> items = shoppingCartRepository.findByUser(user);
        return CartMapper.summarize(items);
    }
    @Override
    public int getTotalQuantity(User user) {
        return shoppingCartRepository.findByUser(user).stream()
                .mapToInt(ShoppingCart::getQuantity)
                .sum();
    }
    @Override
    public CartItemDTO addProduct(User user, Long productId, Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be > 0");
        }
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("Product not found: " + productId));

        ShoppingCart saved = shoppingCartRepository.findByUserAndProduct(user, product)
                .map(item -> {
                    item.setQuantity(item.getQuantity() + quantity);
                    return shoppingCartRepository.save(item);
                })
                .orElseGet(() -> shoppingCartRepository.save(new ShoppingCart(null, user, product, quantity)));

        return CartMapper.toDto(saved);
    }

    @Override
    public CartItemDTO updateQuantity(Long cartId, Integer quantity) {
        ShoppingCart saved = shoppingCartRepository.findById(cartId)
                .map(item -> {
                    if (quantity == null || quantity <= 0) {
                        shoppingCartRepository.delete(item);
                        return null; // caller có thể xử lý 204
                    }
                    item.setQuantity(quantity);
                    return shoppingCartRepository.save(item);
                })
                .orElseThrow(() -> new NoSuchElementException("Cart item not found: " + cartId));

        return saved == null ? null : CartMapper.toDto(saved);
    }

    @Override
    public void removeItem(Long cartId) {
        if (!shoppingCartRepository.existsById(cartId)) {
            throw new NoSuchElementException("Cart item not found: " + cartId);
        }
        shoppingCartRepository.deleteById(cartId);
    }

    @Override
    public void clearCart(User user) {
        shoppingCartRepository.deleteByUser(user);
    }

    @Override
    public OrderResponseDTO checkout(User user) {
        List<ShoppingCart> cartItems = shoppingCartRepository.findByUser(user);
        if (cartItems.isEmpty()) {
            return OrderResponseDTO.builder()
                    .orderId(null)
                    .status("EMPTY")
                    .orderDate(LocalDateTime.now())
                    .totalAmount(0.0)
                    .items(List.of())
                    .build();
        }

        Order order = orderRepository.save(new Order(null, user, LocalDateTime.now(), "PENDING", List.of()));
        double total = 0.0;
        for (ShoppingCart item : cartItems) {
            Product p = item.getProduct();
            double line = item.getQuantity() * p.getPrice();
            total += line;
            orderDetailRepository.save(new OrderDetail(null, order, p, item.getQuantity(), p.getPrice()));
        }
        shoppingCartRepository.deleteByUser(user);

        return OrderResponseDTO.builder()
                .orderId(order.getId())
                .status(order.getStatus())
                .orderDate(order.getOrderDate())
                .totalAmount(total)
                .items(CartMapper.toDtoList(cartItems))
                .build();
    }
}
