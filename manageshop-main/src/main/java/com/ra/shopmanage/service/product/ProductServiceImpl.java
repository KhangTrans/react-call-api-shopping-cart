package com.ra.shopmanage.service.product;

import com.ra.shopmanage.model.dto.ProductResponseDTO;
import com.ra.shopmanage.model.entity.Product;
import com.ra.shopmanage.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public Page<ProductResponseDTO> findProducts(String search, Long categoryId, Double minPrice, Double maxPrice, Pageable pageable) {
        // Kiểm tra bộ lọc tìm kiếm
        Page<Product> productsPage;

        if (categoryId != null && minPrice != null && maxPrice != null) {
            productsPage = productRepository.findByCategoryIdAndPriceBetween(categoryId, minPrice, maxPrice, pageable);
        } else if (categoryId != null) {
            productsPage = productRepository.findByCategoryId(categoryId, pageable);
        } else if (minPrice != null && maxPrice != null) {
            productsPage = productRepository.findByPriceBetween(minPrice, maxPrice, pageable);
        } else if (!search.isEmpty()) {
            productsPage = productRepository.findByNameContainingIgnoreCase(search, pageable);
        } else {
            productsPage = productRepository.findAll(pageable);
        }

        // Chuyển đổi sản phẩm sang DTO
        return productsPage.map(this::convertToDTO);
    }

    @Override
    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
    }

    @Override
    public Product save(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product changeStatus(Long id, Boolean status) {
        Product p = findById(id);
        p.setStatus(status);
        return productRepository.save(p);
    }

    // Helper method để chuyển đổi từ Product thành ProductResponseDTO
    private ProductResponseDTO convertToDTO(Product product) {
        return ProductResponseDTO.builder()
                .id(product.getId())
                .productName(product.getName())
                .productPrice(product.getPrice())
                .productStock(product.getStock())
                .productStatus(product.getStatus())
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .build();
    }
}
