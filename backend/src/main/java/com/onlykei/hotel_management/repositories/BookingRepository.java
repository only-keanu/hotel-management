package com.onlykei.hotel_management.repositories;

import com.onlykei.hotel_management.models.BookingModel;
import com.onlykei.hotel_management.models.BookingModel.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<BookingModel, Long> {

    // Find bookings by status
    List<BookingModel> findByStatus(BookingStatus status);

    // Find bookings by guest ID
    List<BookingModel> findByGuestId(Long guestId);

    // Find bookings by room ID
    List<BookingModel> findByRoomId(Long roomId);

    // Find bookings with check-in date between range
    List<BookingModel> findByCheckInDateBetween(LocalDate startDate, LocalDate endDate);

    // Find bookings with check-out date between range
    List<BookingModel> findByCheckOutDateBetween(LocalDate startDate, LocalDate endDate);

    // ✅ FIXED: Find overlapping bookings for a room
    @Query("SELECT b FROM BookingModel b WHERE b.room.id = :roomId " +
            "AND b.status IN :statuses " +
            "AND b.checkInDate < :checkOutDate " +
            "AND b.checkOutDate > :checkInDate")
    List<BookingModel> findOverlappingBookings(
            @Param("roomId") Long roomId,
            @Param("statuses") List<BookingStatus> statuses,
            @Param("checkInDate") LocalDate checkInDate,
            @Param("checkOutDate") LocalDate checkOutDate
    );
    //Test commit
    // Find bookings with guest and room details
    @Query("SELECT b FROM BookingModel b " +
            "LEFT JOIN FETCH b.guest " +
            "LEFT JOIN FETCH b.room " +
            "WHERE b.id = :id")
    Optional<BookingModel> findByIdWithDetails(@Param("id") Long id);

    // Find all bookings with guest and room details
    @Query("SELECT b FROM BookingModel b " +
            "LEFT JOIN FETCH b.guest " +
            "LEFT JOIN FETCH b.room " +
            "ORDER BY b.checkInDate ASC")
    List<BookingModel> findAllWithDetails();

    // Find bookings by status with details
    @Query("SELECT b FROM BookingModel b " +
            "LEFT JOIN FETCH b.guest " +
            "LEFT JOIN FETCH b.room " +
            "WHERE b.status = :status " +
            "ORDER BY b.checkInDate ASC")
    List<BookingModel> findByStatusWithDetails(@Param("status") BookingStatus status);

    // ✅ FIXED: Find active bookings (confirmed or checked in)
    List<BookingModel> findByStatusIn(List<BookingStatus> statuses);

    // ✅ FIXED: Find bookings checking in today
    List<BookingModel> findByCheckInDateAndStatus(LocalDate date, BookingStatus status);

    // ✅ FIXED: Find bookings checking out today
    List<BookingModel> findByCheckOutDateAndStatus(LocalDate date, BookingStatus status);

    List<BookingModel> findByRoomIdAndStatusInAndCheckInDateLessThanEqualAndCheckOutDateGreaterThanEqual(Long id, List<BookingStatus> activeStatuses, LocalDate newCheckOutDate, LocalDate localDate);
}