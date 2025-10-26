package com.onlykei.hotel_management.repositories;

import com.onlykei.hotel_management.models.InventoryItemModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryRepository extends JpaRepository<InventoryItemModel,Long> {

}
