package com.onlykei.hotel_management.controllers;

import com.onlykei.hotel_management.dtos.BookingDTO;
import com.onlykei.hotel_management.dtos.CreateBookingRequest;
import com.onlykei.hotel_management.dtos.ExtendBookingRequest;
import com.onlykei.hotel_management.services.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Booking Controller - REST API for bookings
 * Base URL: http://localhost:8080/api/v1/bookings
 */
@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")  // Allow requests from React app
public class BookingController {

    private final BookingService bookingService;

    /**
     * GET /api/v1/bookings
     * GET /api/v1/bookings?status=confirmed
     */
    @GetMapping
    public ResponseEntity<List<BookingDTO>> getAllBookings(
            @RequestParam(required = false) String status
    ) {
        if (status != null && !status.isEmpty()) {
            return ResponseEntity.ok(bookingService.getBookingsByStatus(status));
        }
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    /**
     * GET /api/v1/bookings/1
     */
    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    /**
     * POST /api/v1/bookings
     * Body: CreateBookingRequest JSON
     */
    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(
            @RequestBody CreateBookingRequest request
    ) {
        BookingDTO booking = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    /**
     * PUT /api/v1/bookings/1/check-in
     */
    @PutMapping("/{id}/check-in")
    public ResponseEntity<BookingDTO> checkIn(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.checkIn(id));
    }

    /**
     * PUT /api/v1/bookings/1/check-out
     */
    @PutMapping("/{id}/check-out")
    public ResponseEntity<BookingDTO> checkOut(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.checkOut(id));
    }

    /**
     * PUT /api/v1/bookings/1/extend
     * Body: ExtendBookingRequest JSON
     */
    @PutMapping("/{id}/extend")
    public ResponseEntity<BookingDTO> extendBooking(
            @PathVariable Long id,
            @RequestBody ExtendBookingRequest request
    ) {
        return ResponseEntity.ok(bookingService.extendBooking(id, request));
    }

    /**
     * DELETE /api/v1/bookings/1
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/v1/bookings/checking-in-today
     */
    @GetMapping("/checking-in-today")
    public ResponseEntity<List<BookingDTO>> getCheckingInToday() {
        return ResponseEntity.ok(bookingService.getCheckingInToday());
    }

    /**
     * GET /api/v1/bookings/checking-out-today
     */
    @GetMapping("/checking-out-today")
    public ResponseEntity<List<BookingDTO>> getCheckingOutToday() {
        return ResponseEntity.ok(bookingService.getCheckingOutToday());
    }
}