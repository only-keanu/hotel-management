package com.onlykei.hotel_management.controllers;

import com.onlykei.hotel_management.models.InventoryItemModel;
import com.onlykei.hotel_management.services.InventoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
public class InventoryController {
    private final InventoryService inventoryService;
    public InventoryController(InventoryService inventoryService){
        this.inventoryService = inventoryService;
    }
    @GetMapping
    public List<InventoryItemModel> getAllInventoryItems(){
        return inventoryService.getAllInventoryItems();
    }
    @GetMapping("/{id}")
    public InventoryItemModel getInventoryItemById(@PathVariable Long id){
        return inventoryService.getInventoryItemById(id);
    }
    @PostMapping
    public InventoryItemModel createInventoryItem(@RequestBody InventoryItemModel inventoryItem){
        return inventoryService.saveInventoryItem(inventoryItem);
    }
    @DeleteMapping
    public void deleteInventoryItem(@PathVariable Long id){
        inventoryService.deleteInventoryItem(id);
    }


}
