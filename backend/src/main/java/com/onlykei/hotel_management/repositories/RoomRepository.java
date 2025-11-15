package com.onlykei.hotel_management.repositories;

import com.onlykei.hotel_management.models.RoomModel;
import com.onlykei.hotel_management.models.RoomModel.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<RoomModel, Long> {

    // Find room by number
    Optional<RoomModel> findByNumber(String number);

    // Find rooms by status
    List<RoomModel> findByStatus(RoomStatus status);

    // Find rooms by type
    List<RoomModel> findByType(String type);

    // Find rooms by type and status
    List<RoomModel> findByTypeAndStatus(String type, RoomStatus status);

    // Find available rooms for date range
    @Query("SELECT r FROM RoomModel r WHERE r.status = 'available' " +
            "AND r.id NOT IN (" +
            "  SELECT b.room.id FROM BookingModel b " +
            "  WHERE b.status IN ('confirmed', 'checked_in') " +
            "  AND ((b.checkInDate <= :checkOutDate AND b.checkOutDate >= :checkInDate))" +
            ")")
    List<RoomModel> findAvailableRooms(
            @Param("checkInDate") LocalDate checkInDate,
            @Param("checkOutDate") LocalDate checkOutDate
    );

    // Find available rooms by type for date range
    @Query("SELECT r FROM RoomModel r WHERE r.type = :type AND r.status = 'available' " +
            "AND r.id NOT IN (" +
            "  SELECT b.room.id FROM BookingModel b " +
            "  WHERE b.status IN ('confirmed', 'checked_in') " +
            "  AND ((b.checkInDate <= :checkOutDate AND b.checkOutDate >= :checkInDate))" +
            ")")
    List<RoomModel> findAvailableRoomsByType(
            @Param("type") String type,
            @Param("checkInDate") LocalDate checkInDate,
            @Param("checkOutDate") LocalDate checkOutDate
    );

    // Count rooms by status
    Long countByStatus(RoomStatus status);
}