package com.ra.shopmanage.repository;

import com.ra.shopmanage.model.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Tìm sản phẩm theo tên, phân trang và sắp xếp
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);

    // Tìm sản phẩm theo category, phân trang và sắp xếp
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);

    // Tìm sản phẩm theo khoảng giá, phân trang và sắp xếp
    Page<Product> findByPriceBetween(Double minPrice, Double maxPrice, Pageable pageable);

    // Tìm sản phẩm theo category và khoảng giá, phân trang và sắp xếp
    Page<Product> findByCategoryIdAndPriceBetween(Long categoryId, Double minPrice, Double maxPrice, Pageable pageable);
}
