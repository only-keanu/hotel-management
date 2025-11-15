package com.onlykei.hotel_management.controllers;

import com.onlykei.hotel_management.dtos.ChecklistItemDTO;
import com.onlykei.hotel_management.services.ChecklistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Checklist Controller - REST API for checklists
 * Base URL: http://localhost:8080/api/v1/bookings/{bookingId}/checklist
 */
@RestController
@RequestMapping("/api/v1/bookings/{bookingId}/checklist")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChecklistController {

    private final ChecklistService checklistService;

    /**
     * GET /api/v1/bookings/1/checklist
     */
    @GetMapping
    public ResponseEntity<List<ChecklistItemDTO>> getChecklist(
            @PathVariable Long bookingId
    ) {
        return ResponseEntity.ok(checklistService.getChecklistByBookingId(bookingId));
    }

    /**
     * POST /api/v1/bookings/1/checklist
     * Body: ChecklistItemDTO JSON
     */
    @PostMapping
    public ResponseEntity<ChecklistItemDTO> createChecklistItem(
            @PathVariable Long bookingId,
            @RequestBody ChecklistItemDTO dto
    ) {
        ChecklistItemDTO created = checklistService.createChecklistItem(bookingId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/v1/bookings/1/checklist
     * Body: List<ChecklistItemDTO> JSON (replaces entire checklist)
     */
    @PutMapping
    public ResponseEntity<List<ChecklistItemDTO>> saveChecklist(
            @PathVariable Long bookingId,
            @RequestBody List<ChecklistItemDTO> checklist
    ) {
        List<ChecklistItemDTO> saved = checklistService.saveChecklistForBooking(
                bookingId,
                checklist
        );
        return ResponseEntity.ok(saved);
    }

    /**
     * PUT /api/v1/bookings/1/checklist/5
     * Body: ChecklistItemDTO JSON
     */
    @PutMapping("/{itemId}")
    public ResponseEntity<ChecklistItemDTO> updateChecklistItem(
            @PathVariable Long bookingId,
            @PathVariable Long itemId,
            @RequestBody ChecklistItemDTO dto
    ) {
        return ResponseEntity.ok(checklistService.updateChecklistItem(itemId, dto));
    }

    /**
     * PUT /api/v1/bookings/1/checklist/5/toggle
     */
    @PutMapping("/{itemId}/toggle")
    public ResponseEntity<Void> toggleChecklistItem(
            @PathVariable Long bookingId,
            @PathVariable Long itemId
    ) {
        checklistService.toggleChecklistItem(itemId);
        return ResponseEntity.noContent().build();
    }

    /**
     * DELETE /api/v1/bookings/1/checklist/5
     */
    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> deleteChecklistItem(
            @PathVariable Long bookingId,
            @PathVariable Long itemId
    ) {
        checklistService.deleteChecklistItem(itemId);
        return ResponseEntity.noContent().build();
    }
}