package com.onlykei.hotel_management.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryItemModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private Integer quantity; // Maximum/total capacity

    @Column(nullable = false)
    private Integer currentLevel; // Current stock level

    @Column(nullable = false)
    private Integer minimumLevel; // Threshold for low stock alerts

    @Column(nullable = false)
    private String unit; // e.g., "piece", "box", "bottle"

    @Column(length = 500)
    private String notes;

    @Column(nullable = false)
    private LocalDateTime lastRestocked;

    @PrePersist
    protected void onCreate() {
        if (lastRestocked == null) {
            lastRestocked = LocalDateTime.now();
        }
    }
}