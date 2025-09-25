package com.ra.shopmanage.service.category;

import com.ra.shopmanage.model.dto.CategoryResponseDTO;
import com.ra.shopmanage.model.entity.Category;

import java.util.List;

public interface CategoryService {
    List<CategoryResponseDTO> findAll();
    CategoryResponseDTO findById(Long id);
    CategoryResponseDTO saveOrUpdate(Category category);
    CategoryResponseDTO changeStatus(Long id, Boolean status);
    void delete(Long id);
}
