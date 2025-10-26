package com.onlykei.hotel_management.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Double totalAmount;

    @ManyToOne
    @JoinColumn(name = "guest_id")
    private GuestModel guest;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private RoomModel room;
}
