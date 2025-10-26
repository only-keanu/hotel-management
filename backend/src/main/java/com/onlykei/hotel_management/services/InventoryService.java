package com.onlykei.hotel_management.services;

import com.onlykei.hotel_management.models.InventoryItemModel;
import com.onlykei.hotel_management.repositories.InventoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    public InventoryService(InventoryRepository inventoryRepository){
        this.inventoryRepository = inventoryRepository;
    }

    public List<InventoryItemModel> getAllInventoryItems(){
        return inventoryRepository.findAll();
    }
    public InventoryItemModel getInventoryItemById(Long id){
        return inventoryRepository.findById(id).orElse(null);
    }
    public InventoryItemModel saveInventoryItem(InventoryItemModel inventoryItem){
        return inventoryRepository.save(inventoryItem);
    }
    public void deleteInventoryItem(Long id){
        inventoryRepository.deleteById(id);
    }

}
