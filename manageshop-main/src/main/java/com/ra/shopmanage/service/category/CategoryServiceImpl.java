package com.ra.shopmanage.service.category;

import com.ra.shopmanage.model.dto.CategoryResponseDTO;
import com.ra.shopmanage.model.dto.ProductResponseDTO;
import com.ra.shopmanage.model.entity.Category;
import com.ra.shopmanage.model.entity.Product;
import com.ra.shopmanage.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryResponseDTO> findAll() {
        return categoryRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public CategoryResponseDTO findById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Category not found with id: " + id));
        return mapToDTO(category);
    }

    @Override
    public CategoryResponseDTO saveOrUpdate(Category category) {
        Category saved = categoryRepository.save(category);
        return mapToDTO(saved);
    }

    @Override
    public CategoryResponseDTO changeStatus(Long id, Boolean status) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Category not found with id: " + id));
        existing.setStatus(status);
        return mapToDTO(categoryRepository.save(existing));
    }

    @Override
    public void delete(Long id) {
        categoryRepository.deleteById(id);
    }

    private CategoryResponseDTO mapToDTO(Category category) {
        List<Product> products = category.getProducts() == null ? List.of() : category.getProducts();

        List<ProductResponseDTO> productDTOs = products.stream()
                .map(p -> ProductResponseDTO.builder()
                        .id(p.getId())
                        .productName(p.getName())
                        .productPrice(p.getPrice())
                        .productStock(p.getStock())
                        .productStatus(p.getStatus())
                        .categoryName(category.getName())
                        .build())
                .toList();

        return CategoryResponseDTO.builder()
                .id(category.getId())
                .categoryName(category.getName())
                .categoryStatus(category.getStatus())
                .products(productDTOs)
                .build();
    }
}
