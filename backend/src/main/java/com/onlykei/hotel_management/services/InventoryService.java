package com.onlykei.hotel_management.services;

import com.onlykei.hotel_management.exceptions.ResourceNotFoundException;
import com.onlykei.hotel_management.models.InventoryItemModel;
import com.onlykei.hotel_management.repositories.InventoryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {
    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    public List<InventoryItemModel> getAllInventoryItems() {
        return inventoryRepository.findAll();
    }

    public InventoryItemModel getInventoryItemById(Long id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found with id: " + id));
    }

    public List<InventoryItemModel> getItemsByCategory(String category) {
        return inventoryRepository.findAll().stream()
                .filter(item -> item.getCategory().equalsIgnoreCase(category))
                .collect(Collectors.toList());
    }

    public List<InventoryItemModel> getLowStockItems() {
        return inventoryRepository.findAll().stream()
                .filter(item -> item.getCurrentLevel() <= item.getMinimumLevel())
                .collect(Collectors.toList());
    }

    public InventoryItemModel saveInventoryItem(InventoryItemModel inventoryItem) {
        // Set lastRestocked if not provided (for new items)
        if (inventoryItem.getLastRestocked() == null) {
            inventoryItem.setLastRestocked(LocalDateTime.now());
        }
        return inventoryRepository.save(inventoryItem);
    }

    public InventoryItemModel updateInventoryItem(InventoryItemModel inventoryItem) {
        // Verify item exists
        InventoryItemModel existing = getInventoryItemById(inventoryItem.getId());

        // Preserve lastRestocked if not changed
        if (inventoryItem.getLastRestocked() == null) {
            inventoryItem.setLastRestocked(existing.getLastRestocked());
        }

        return inventoryRepository.save(inventoryItem);
    }

    public InventoryItemModel updateQuantity(Long id, Integer newQuantity) {
        InventoryItemModel item = getInventoryItemById(id);

        // Validate quantity
        if (newQuantity < 0) {
            throw new IllegalArgumentException("Quantity cannot be negative");
        }
        if (newQuantity > item.getQuantity()) {
            throw new IllegalArgumentException("Current level cannot exceed total quantity");
        }

        item.setCurrentLevel(newQuantity);
        return inventoryRepository.save(item);
    }

    public InventoryItemModel restockItem(Long id) {
        InventoryItemModel item = getInventoryItemById(id);

        // Set to maximum capacity
        item.setCurrentLevel(item.getQuantity());
        item.setLastRestocked(LocalDateTime.now());

        return inventoryRepository.save(item);
    }

    public void deleteInventoryItem(Long id) {
        // Verify item exists before deleting
        getInventoryItemById(id);
        inventoryRepository.deleteById(id);
    }
}