package com.ra.shopmanage.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.validator.constraints.URL; // cần spring-boot-starter-validation

@Entity
@Table(name = "product")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false)
    private Boolean status = true;

    // NEW: ảnh sản phẩm dạng URL
    @Column(name = "image_url", length = 512)
    @URL(message = "imageUrl phải là URL hợp lệ")
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
}
