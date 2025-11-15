package com.onlykei.hotel_management.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExtendBookingRequest {
    private LocalDate newCheckOutDate;  // New checkout date
}