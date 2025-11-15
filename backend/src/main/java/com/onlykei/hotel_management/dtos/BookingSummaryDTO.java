package com.onlykei.hotel_management.dtos;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingSummaryDTO {
    private Long id;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String roomNumber;
}
