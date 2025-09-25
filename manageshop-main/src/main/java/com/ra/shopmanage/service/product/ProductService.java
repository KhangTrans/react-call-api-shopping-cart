package com.ra.shopmanage.service.product;

import com.ra.shopmanage.model.dto.ProductResponseDTO;
import com.ra.shopmanage.model.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface ProductService {
    // Tìm kiếm sản phẩm với phân trang, sắp xếp
    Page<ProductResponseDTO> findProducts(String search, Long categoryId, Double minPrice, Double maxPrice, Pageable pageable);

    // Lấy sản phẩm theo ID
    Product findById(Long id);

    // Lưu sản phẩm (thêm mới hoặc cập nhật)
    Product save(Product product);

    // Thay đổi trạng thái của sản phẩm
    Product changeStatus(Long id, Boolean status);
}
