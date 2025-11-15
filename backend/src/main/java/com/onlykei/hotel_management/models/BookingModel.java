package com.onlykei.hotel_management.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Step 2.1: BookingModel Entity
 *
 * FILE LOCATION: src/main/java/com/onlykei/hotel_management/models/BookingModel.java
 *
 * INSTRUCTIONS:
 * 1. Create a new file called "BookingModel.java" in the models package
 * 2. Copy this ENTIRE file
 * 3. Save the file
 * 4. Your IDE should auto-import if you have auto-import enabled
 * 5. If you see red underlines, hover and click "Import class"
 */

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "bookings")
public class BookingModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relationship to Guest (Many bookings can belong to one guest)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guest_id", nullable = false)
    private GuestModel guest;

    // Relationship to Room (Many bookings can be for one room)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    @JsonIgnoreProperties({"bookings"})
    private RoomModel room;

    // Booking dates
    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;

    @Column(name = "check_out_date", nullable = false)
    private LocalDate checkOutDate;

    // Guest counts
    @Column(nullable = false)
    private Integer adults;

    @Column(nullable = false)
    @Builder.Default
    private Integer children = 0;

    // Payment information
    @Column(name = "total_amount", nullable = false)
    private Integer totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private BookingStatus status = BookingStatus.confirmed;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 20)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.pending;

    // Additional information
    @Column(columnDefinition = "TEXT")
    private String notes;

    // Relationship to Checklist (One booking can have many checklist items)
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"booking"})
    private List<ChecklistItemModel> checklist;

    // Timestamps (auto-managed by Hibernate)
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Enums for booking status
    public enum BookingStatus {
        confirmed,      // Booking is confirmed but guest hasn't arrived
        checked_in,     // Guest has checked in
        checked_out,    // Guest has checked out
        cancelled       // Booking was cancelled
    }

    // Enums for payment status
    public enum PaymentStatus {
        pending,        // Payment not yet received
        paid,           // Fully paid
        partially_paid, // Partially paid
        refunded        // Payment was refunded
    }
}

/*
==================================================
✅ STEP 2.1 COMPLETE!
==================================================

What this model does:
- Stores booking information (dates, guests, amount)
- Links to GuestModel and RoomModel
- Tracks booking status (confirmed → checked_in → checked_out)
- Tracks payment status
- Auto-generates created_at and updated_at timestamps

Database table that will be created: "bookings"

NEXT: Create ChecklistItemModel.java (Step 2.2) 👇
==================================================
*/