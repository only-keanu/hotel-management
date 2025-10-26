package com.onlykei.hotel_management.models;
import jakarta.persistence.*;
import jdk.jfr.BooleanFlag;
import lombok.*;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @BooleanFlag
    boolean isAvailable = false;
    private int pricePerNight;
    private String type;
}
