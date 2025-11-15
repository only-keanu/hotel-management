package com.onlykei.hotel_management.controllers;

import com.onlykei.hotel_management.models.RoomModel;
import com.onlykei.hotel_management.services.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Room Controller - REST API for rooms
 * Base URL: http://localhost:8080/api/rooms
 */
@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RoomController {

    private final RoomService roomService;

    /**
     * GET /api/rooms
     * GET /api/rooms?status=available
     */
    @GetMapping
    public ResponseEntity<List<RoomModel>> getAllRooms(
            @RequestParam(required = false) String status
    ) {
        if (status != null && !status.isEmpty()) {
            return ResponseEntity.ok(roomService.getRoomsByStatus(status));
        }
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @PostMapping
    public ResponseEntity<RoomModel> createRoom(@RequestBody RoomModel room) {
        RoomModel savedRoom = roomService.createRoom(room);
        return ResponseEntity.ok(savedRoom);
    }

    /**
     * GET /api/rooms/1
     */
    @GetMapping("/{id}")
    public ResponseEntity<RoomModel> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    /**
     * GET /api/rooms/available?checkInDate=2024-12-25&checkOutDate=2024-12-28
     */
    @GetMapping("/available")
    public ResponseEntity<List<RoomModel>> getAvailableRooms(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate
    ) {
        return ResponseEntity.ok(roomService.getAvailableRooms(checkInDate, checkOutDate));
    }

    /**
     * PUT /api/rooms/1/status?status=maintenance
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<RoomModel> updateRoomStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        return ResponseEntity.ok(roomService.updateRoomStatus(id, status));
    }
}