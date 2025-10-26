package com.onlykei.hotel_management.services;

import com.onlykei.hotel_management.models.RoomModel;
import com.onlykei.hotel_management.repositories.RoomRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RoomService {
    private final RoomRepository roomRepository;
    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public List<RoomModel> getAllRooms() {
        return roomRepository.findAll();
    }

    public RoomModel getRoomById(Long id) {
        return roomRepository.findById(id).orElse(null);
    }

    public RoomModel saveRoom(RoomModel room) {
        return roomRepository.save(room);
    }

    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }
}
