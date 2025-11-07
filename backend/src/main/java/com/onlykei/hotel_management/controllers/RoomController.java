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

    @GetMapping
    public List<RoomModel> getAllRooms() {
        return roomService.getAllRooms();
    }

    @GetMapping("/{id}")
    public RoomModel getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id);
    }

    @PostMapping
    public RoomModel createRoom(@RequestBody RoomModel room) {
        return roomService.saveRoom(room);
    }

    @PutMapping("/{id}")
    public RoomModel updateRoom(@PathVariable Long id, @RequestBody RoomModel roomDetails) {
        RoomModel room = roomService.getRoomById(id);
        if (room != null) {
            room.setId(roomDetails.getId());
            room.setType(roomDetails.getType());
            room.setPricePerNight(roomDetails.getPricePerNight());
            room.setAvailable(roomDetails.isAvailable());
            return roomService.saveRoom(room);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
    }
}
