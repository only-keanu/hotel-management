package com.onlykei.hotel_management.models;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Room number (e.g. "101")
    @Column(nullable = false, unique = true)
    private String number;

    // Room type (e.g. "single", "double", "suite", "family")
    @Column(nullable = false)
    private String type;

    // Price per night
    @Column(nullable = false)
    private int pricePerNight;

    // List of amenities (stored as comma-separated values)
    @ElementCollection
    @CollectionTable(name = "room_amenities", joinColumns = @JoinColumn(name = "room_id"))
    @Column(name = "amenity")
    private List<String> amenities;

    // Room status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomStatus status;

    // Optional fields
    private String description;
    private Integer capacity;

    public enum RoomStatus {
        available,
        occupied,
        maintenance
    }
}
