package com.onlykei.hotel_management.controllers;

import com.onlykei.hotel_management.models.RoomModel;
import com.onlykei.hotel_management.services.RoomService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    // GET all rooms
    @GetMapping
    public List<RoomModel> getAllRooms() {
        return roomService.getAllRooms();
    }

    // GET a specific room by ID
    @GetMapping("/{id}")
    public RoomModel getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id);
    }

    // CREATE a new room
    @PostMapping
    public RoomModel createRoom(@RequestBody RoomModel room) {
        return roomService.saveRoom(room);
    }

    // UPDATE an existing room
    @PutMapping("/{id}")
    public RoomModel updateRoom(@PathVariable Long id, @RequestBody RoomModel roomDetails) {
        RoomModel room = roomService.getRoomById(id);
        if (room != null) {
            // Update all modifiable fields
            room.setNumber(roomDetails.getNumber());
            room.setType(roomDetails.getType());
            room.setPricePerNight(roomDetails.getPricePerNight());
            room.setAmenities(roomDetails.getAmenities());
            room.setStatus(roomDetails.getStatus());
            room.setDescription(roomDetails.getDescription());
            room.setCapacity(roomDetails.getCapacity());

            return roomService.saveRoom(room);
        }
        return null;
    }

    // DELETE a room by ID
    @DeleteMapping("/{id}")
    public void deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
    }
}
