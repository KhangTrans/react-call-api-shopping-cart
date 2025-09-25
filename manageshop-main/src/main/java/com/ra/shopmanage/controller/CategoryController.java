package com.ra.shopmanage.controller;

import com.ra.shopmanage.model.dto.CategoryResponseDTO;
import com.ra.shopmanage.model.entity.Category;
import com.ra.shopmanage.service.category.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryResponseDTO>> getAll() {
        return ResponseEntity.ok(categoryService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.findById(id));
    }

    @PostMapping
    public ResponseEntity<CategoryResponseDTO> create(@RequestBody Category category) {
        return ResponseEntity.ok(categoryService.saveOrUpdate(category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> update(@PathVariable Long id, @RequestBody Category category) {
        category.setId(id);
        return ResponseEntity.ok(categoryService.saveOrUpdate(category));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<CategoryResponseDTO> changeStatus(@PathVariable Long id, @RequestParam Boolean status) {
        return ResponseEntity.ok(categoryService.changeStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
