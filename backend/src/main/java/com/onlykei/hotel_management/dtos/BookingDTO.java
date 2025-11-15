package com.onlykei.hotel_management.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

// BookingDTO
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
    private Long id;
    private Long guestId;           // Instead of entire GuestModel object
    private Long roomId;            // Instead of entire RoomModel object
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer adults;
    private Integer children;
    private Integer totalAmount;
    private String status;          // "confirmed", "checked_in", etc.
    private String paymentStatus;   // "pending", "paid", etc.
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ChecklistItemDTO> checklist;  // Optional: include checklist
}