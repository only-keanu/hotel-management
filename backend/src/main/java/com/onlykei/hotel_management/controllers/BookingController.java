package com.onlykei.hotel_management.controllers;

import com.onlykei.hotel_management.models.BookingModel;
import com.onlykei.hotel_management.models.GuestModel;
import com.onlykei.hotel_management.models.RoomModel;
import com.onlykei.hotel_management.services.BookingService;
import com.onlykei.hotel_management.services.GuestService;
import com.onlykei.hotel_management.services.RoomService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@CrossOrigin
public class BookingController {

    private final BookingService bookingService;
    private final GuestService guestService;
    private final RoomService roomService;

    public BookingController(BookingService bookingService, GuestService guestService, RoomService roomService) {
        this.bookingService = bookingService;
        this.guestService = guestService;
        this.roomService = roomService;
    }

    // GET all bookings
    @GetMapping
    public List<BookingModel> getAllBookings() {
        return bookingService.getAllBookings();
    }

    // GET one booking by ID
    @GetMapping("/{id}")
    public BookingModel getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id);
    }

    // CREATE new booking
    @PostMapping
    public BookingModel createBooking(@RequestBody BookingModel booking) {
        // Optional: verify that Guest and Room exist
        GuestModel guest = guestService.getGuestById(booking.getGuest().getId());
        RoomModel room = roomService.getRoomById(booking.getRoom().getId());

        if (guest == null || room == null) {
            throw new IllegalArgumentException("Guest or Room not found.");
        }

        booking.setGuest(guest);
        booking.setRoom(room);

        return bookingService.saveBooking(booking);
    }

    // UPDATE existing booking
    @PutMapping("/{id}")
    public BookingModel updateBooking(@PathVariable Long id, @RequestBody BookingModel bookingDetails) {
        BookingModel existingBooking = bookingService.getBookingById(id);
        if (existingBooking != null) {
            existingBooking.setCheckInDate(bookingDetails.getCheckInDate());
            existingBooking.setCheckOutDate(bookingDetails.getCheckOutDate());
            existingBooking.setTotalAmount(bookingDetails.getTotalAmount());

            // Optionally update room/guest if changed
            if (bookingDetails.getGuest() != null)
                existingBooking.setGuest(bookingDetails.getGuest());
            if (bookingDetails.getRoom() != null)
                existingBooking.setRoom(bookingDetails.getRoom());

            return bookingService.saveBooking(existingBooking);
        }
        return null;
    }

    // DELETE booking
    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
    }
}