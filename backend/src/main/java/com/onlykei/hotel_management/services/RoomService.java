package com.onlykei.hotel_management.services;

import com.onlykei.hotel_management.models.RoomModel;
import com.onlykei.hotel_management.models.RoomModel.RoomStatus;
import com.onlykei.hotel_management.repositories.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    @Transactional(readOnly = true)
    public List<RoomModel> getAllRooms() {
        return roomRepository.findAll();
    }

    @Transactional(readOnly = true)
    public RoomModel getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }

    @Transactional(readOnly = true)
    public List<RoomModel> getAvailableRooms(LocalDate checkInDate, LocalDate checkOutDate) {
        return roomRepository.findAvailableRooms(checkInDate, checkOutDate);
    }

    @Transactional(readOnly = true)
    public List<RoomModel> getRoomsByStatus(String status) {
        RoomStatus roomStatus = RoomStatus.valueOf(status.toLowerCase());
        return roomRepository.findByStatus(roomStatus);
    }

    @Transactional(readOnly = true)
    public List<RoomModel> getRoomsByType(String type) {
        return roomRepository.findByType(type);
    }

    @Transactional
    public RoomModel updateRoomStatus(Long roomId, String status) {
        RoomModel room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        RoomStatus roomStatus = RoomStatus.valueOf(status.toLowerCase());
        room.setStatus(roomStatus);
        return roomRepository.save(room);
    }

    @Transactional
    public RoomModel createRoom(RoomModel room) {
        // Default status if null
        if (room.getStatus() == null) {
            room.setStatus(RoomModel.RoomStatus.available);
        }
        return roomRepository.save(room);
    }
}