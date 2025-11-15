package com.onlykei.hotel_management.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "checklist_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChecklistItemModel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private BookingModel booking;

    @Column(nullable = false)
    private String item;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Category category;

    @Column(nullable = false)
    private Boolean completed = false;

    @Column(columnDefinition = "TEXT")
    private String notes;

    public enum Category {
        ROOM_INSPECTION,
        AMENITIES,
        CLEANING,
        MAINTENANCE,
        GUEST_SERVICES
    }
}