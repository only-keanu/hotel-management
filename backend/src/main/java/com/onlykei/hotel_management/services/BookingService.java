package com.onlykei.hotel_management.services;

import com.onlykei.hotel_management.dtos.BookingDTO;
import com.onlykei.hotel_management.dtos.CreateBookingRequest;
import com.onlykei.hotel_management.dtos.ExtendBookingRequest;
import com.onlykei.hotel_management.exceptions.BookingNotFoundException;
import com.onlykei.hotel_management.exceptions.RoomNotAvailableException;
import com.onlykei.hotel_management.models.BookingModel;
import com.onlykei.hotel_management.models.BookingModel.BookingStatus;
import com.onlykei.hotel_management.models.BookingModel.PaymentStatus;
import com.onlykei.hotel_management.models.GuestModel;
import com.onlykei.hotel_management.models.RoomModel;
import com.onlykei.hotel_management.repositories.BookingRepository;
import com.onlykei.hotel_management.repositories.GuestRepository;
import com.onlykei.hotel_management.repositories.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final GuestRepository guestRepository;

    @Transactional(readOnly = true)
    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAllWithDetails()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingDTO> getBookingsByStatus(String status) {
        BookingStatus bookingStatus = BookingStatus.valueOf(status.toLowerCase());
        return bookingRepository.findByStatusWithDetails(bookingStatus)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingDTO getBookingById(Long id) {
        BookingModel booking = bookingRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + id));
        return convertToDTO(booking);
    }

    @Transactional
    public BookingDTO createBooking(CreateBookingRequest request) {
        // Step 1: Validate room exists
        RoomModel room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + request.getRoomId()));

        // Step 2: Validate guest exists
        GuestModel guest = guestRepository.findById(request.getGuestId())
                .orElseThrow(() -> new RuntimeException("Guest not found with id: " + request.getGuestId()));

        // ✅ FIXED: Step 3: Check for overlapping bookings
        List<BookingStatus> activeStatuses = List.of(BookingStatus.confirmed, BookingStatus.checked_in);
        List<BookingModel> overlappingBookings = bookingRepository.findOverlappingBookings(
                request.getRoomId(),
                activeStatuses,
                request.getCheckInDate(),
                request.getCheckOutDate()
        );

        if (!overlappingBookings.isEmpty()) {
            throw new RoomNotAvailableException("Room is not available for the selected dates");
        }

        // Step 4: Calculate total amount (nights × room price)
        long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        Integer totalAmount = room.getPricePerNight() * (int) nights;

        // Step 5: Parse payment status (default to pending)
        PaymentStatus paymentStatus = request.getPaymentStatus() != null
                ? PaymentStatus.valueOf(request.getPaymentStatus().toLowerCase())
                : PaymentStatus.pending;

        // Step 6: Build and save booking
        BookingModel booking = BookingModel.builder()
                .guest(guest)
                .room(room)
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .adults(request.getAdults())
                .children(request.getChildren() != null ? request.getChildren() : 0)
                .totalAmount(totalAmount)
                .status(BookingStatus.confirmed)
                .paymentStatus(paymentStatus)
                .notes(request.getNotes())
                .build();

        BookingModel savedBooking = bookingRepository.save(booking);
        return convertToDTO(savedBooking);
    }

    @Transactional
    public BookingDTO checkIn(Long bookingId) {
        BookingModel booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != BookingStatus.confirmed) {
            throw new IllegalStateException("Only confirmed bookings can be checked in");
        }

        booking.setStatus(BookingStatus.checked_in);

        RoomModel room = booking.getRoom();
        room.setStatus(RoomModel.RoomStatus.occupied);
        roomRepository.save(room);

        BookingModel updatedBooking = bookingRepository.save(booking);
        return convertToDTO(updatedBooking);
    }

    @Transactional
    public BookingDTO checkOut(Long bookingId) {
        BookingModel booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != BookingStatus.checked_in) {
            throw new IllegalStateException("Only checked-in bookings can be checked out");
        }

        booking.setStatus(BookingStatus.checked_out);

        RoomModel room = booking.getRoom();
        room.setStatus(RoomModel.RoomStatus.available);
        roomRepository.save(room);

        BookingModel updatedBooking = bookingRepository.save(booking);
        return convertToDTO(updatedBooking);
    }

    @Transactional
    public BookingDTO extendBooking(Long bookingId, ExtendBookingRequest request) {
        BookingModel booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));

        LocalDate newCheckOutDate = request.getNewCheckOutDate();

        // ✅ FIXED: Check for overlapping bookings with extended dates
        List<BookingStatus> activeStatuses = List.of(BookingStatus.confirmed, BookingStatus.checked_in);
        List<BookingModel> overlappingBookings = bookingRepository
                .findByRoomIdAndStatusInAndCheckInDateLessThanEqualAndCheckOutDateGreaterThanEqual(
                        booking.getRoom().getId(),
                        activeStatuses,
                        newCheckOutDate,
                        booking.getCheckOutDate().plusDays(1)
                );

        // Remove current booking from check
        overlappingBookings.removeIf(b -> b.getId().equals(bookingId));

        if (!overlappingBookings.isEmpty()) {
            throw new RoomNotAvailableException("Room is not available for the extended dates");
        }

        // Calculate additional cost
        long additionalNights = ChronoUnit.DAYS.between(booking.getCheckOutDate(), newCheckOutDate);
        Integer additionalAmount = booking.getRoom().getPricePerNight() * (int) additionalNights;

        // Update booking
        booking.setCheckOutDate(newCheckOutDate);
        booking.setTotalAmount(booking.getTotalAmount() + additionalAmount);

        BookingModel updatedBooking = bookingRepository.save(booking);
        return convertToDTO(updatedBooking);
    }

    @Transactional
    public void cancelBooking(Long bookingId) {
        BookingModel booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));

        booking.setStatus(BookingStatus.cancelled);

        if (booking.getRoom().getStatus() == RoomModel.RoomStatus.occupied) {
            RoomModel room = booking.getRoom();
            room.setStatus(RoomModel.RoomStatus.available);
            roomRepository.save(room);
        }

        bookingRepository.save(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingDTO> getCheckingInToday() {
        // ✅ FIXED: Using simplified method
        return bookingRepository.findByCheckInDateAndStatus(LocalDate.now(), BookingStatus.confirmed)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingDTO> getCheckingOutToday() {
        // ✅ FIXED: Using simplified method
        return bookingRepository.findByCheckOutDateAndStatus(LocalDate.now(), BookingStatus.checked_in)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    private BookingDTO convertToDTO(BookingModel booking) {
        return BookingDTO.builder()
                .id(booking.getId())
                .guestId(booking.getGuest().getId())
                .roomId(booking.getRoom().getId())
                .checkInDate(booking.getCheckInDate())
                .checkOutDate(booking.getCheckOutDate())
                .adults(booking.getAdults())
                .children(booking.getChildren())
                .totalAmount(booking.getTotalAmount())
                .status(booking.getStatus().name())
                .paymentStatus(booking.getPaymentStatus().name())
                .notes(booking.getNotes())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }
}