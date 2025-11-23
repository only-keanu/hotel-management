package com.onlykei.hotel_management.repositories;

import com.onlykei.hotel_management.models.InventoryItemModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryRepository extends JpaRepository<InventoryItemModel, Long> {
    // JpaRepository provides all basic CRUD operations
    // You can add custom query methods here if needed

    // Examples of custom queries you might want:
    // List<InventoryItemModel> findByCategory(String category);
    // List<InventoryItemModel> findByCurrentLevelLessThanEqual(Integer level);
}