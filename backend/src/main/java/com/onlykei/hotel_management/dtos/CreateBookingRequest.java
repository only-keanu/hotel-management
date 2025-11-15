package com.onlykei.hotel_management.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookingRequest {
    private Long guestId;           // ID of the guest making the booking
    private Long roomId;            // ID of the room being booked
    private LocalDate checkInDate;  // Format: "2024-12-25"
    private LocalDate checkOutDate; // Format: "2024-12-28"
    private Integer adults;         // Number of adults
    private Integer children;       // Number of children (optional, defaults to 0)
    private String paymentStatus;   // "pending", "paid", etc. (optional)
    private String notes;           // Additional notes (optional)
}
