package com.onlykei.hotel_management.controllers;

import com.onlykei.hotel_management.models.InventoryItemModel;
import com.onlykei.hotel_management.services.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/inventory")
public class InventoryController {
    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public ResponseEntity<List<InventoryItemModel>> getAllInventoryItems() {
        return ResponseEntity.ok(inventoryService.getAllInventoryItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryItemModel> getInventoryItemById(@PathVariable Long id) {
        return ResponseEntity.ok(inventoryService.getInventoryItemById(id));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<InventoryItemModel>> getItemsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(inventoryService.getItemsByCategory(category));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryItemModel>> getLowStockItems() {
        return ResponseEntity.ok(inventoryService.getLowStockItems());
    }

    @PostMapping
    public ResponseEntity<InventoryItemModel> createInventoryItem(@RequestBody InventoryItemModel inventoryItem) {
        return ResponseEntity.ok(inventoryService.saveInventoryItem(inventoryItem));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventoryItemModel> updateInventoryItem(
            @PathVariable Long id,
            @RequestBody InventoryItemModel inventoryItem
    ) {
        inventoryItem.setId(id);
        return ResponseEntity.ok(inventoryService.updateInventoryItem(inventoryItem));
    }

    @PatchMapping("/{id}/quantity")
    public ResponseEntity<InventoryItemModel> updateQuantity(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> request
    ) {
        return ResponseEntity.ok(inventoryService.updateQuantity(id, request.get("quantity")));
    }

    @PostMapping("/{id}/restock")
    public ResponseEntity<InventoryItemModel> restockItem(@PathVariable Long id) {
        return ResponseEntity.ok(inventoryService.restockItem(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInventoryItem(@PathVariable Long id) {
        inventoryService.deleteInventoryItem(id);
        return ResponseEntity.noContent().build();
    }
}