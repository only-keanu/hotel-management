package com.onlykei.hotel_management.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChecklistItemDTO {
    private Long id;                // Can be null for new items
    private String item;            // Description: "Check smoke detector"
    private String category;        // "room_inspection", "cleaning", etc.
    private Boolean completed;      // true/false
    private String notes;           // Additional notes (optional)
}