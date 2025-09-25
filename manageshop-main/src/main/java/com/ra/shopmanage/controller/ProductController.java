package com.ra.shopmanage.controller;

import com.ra.shopmanage.model.dto.ProductResponseDTO;
import com.ra.shopmanage.model.entity.Product;
import com.ra.shopmanage.service.product.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<ProductResponseDTO>> getAllProducts(
            @RequestParam(defaultValue = "") String search, // Tìm kiếm theo tên sản phẩm
            @RequestParam(required = false) Long categoryId, // Tìm kiếm theo category ID
            @RequestParam(required = false) Double minPrice, // Bộ lọc giá min
            @RequestParam(required = false) Double maxPrice, // Bộ lọc giá max
            @RequestParam(defaultValue = "0") int page, // Số trang (mặc định là 0)
            @RequestParam(defaultValue = "10") int size, // Số lượng sản phẩm mỗi trang
            @RequestParam(defaultValue = "id") String sortBy, // Sắp xếp theo trường nào (id, name, price)
            @RequestParam(defaultValue = "asc") String sortOrder // Thứ tự sắp xếp (asc, desc)
    ) {
        // Tạo Pageable từ các tham số trên
        Pageable pageable = PageRequest.of(page, size, sortOrder.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending());

        // Gọi service để lấy dữ liệu phân trang, tìm kiếm và sắp xếp
        Page<ProductResponseDTO> products = productService.findProducts(search, categoryId, minPrice, maxPrice, pageable);

        return ResponseEntity.ok(products);
    }

    @PostMapping
    public ResponseEntity<ProductResponseDTO> createProduct(@RequestBody Product product) {
        Product savedProduct = productService.save(product);
        return ResponseEntity.ok(convertToDTO(savedProduct));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        product.setId(id);
        Product updatedProduct = productService.save(product);
        return ResponseEntity.ok(convertToDTO(updatedProduct));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ProductResponseDTO> changeStatus(@PathVariable Long id, @RequestParam Boolean status) {
        Product updatedProduct = productService.changeStatus(id, status);
        return ResponseEntity.ok(convertToDTO(updatedProduct));
    }

    private ProductResponseDTO convertToDTO(Product product) {
        return ProductResponseDTO.builder()
                .id(product.getId())
                .productName(product.getName())
                .productPrice(product.getPrice())
                .productStock(product.getStock())
                .productStatus(product.getStatus())
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .imageUrl(product.getImageUrl()) // NEW
                .build();
    }
}
