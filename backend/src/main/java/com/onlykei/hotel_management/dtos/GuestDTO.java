package com.onlykei.hotel_management.dtos;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuestDTO {
    private Long id;
    private String firstName;
    private String middleName;
    private String lastName;
    private String homeAddress;
    private String gender;
    private String civilStatus;
    private String identificationNo;
    private String mobileNo;
    private String telephoneNo;
    private String emailAddress;
    private List<BookingSummaryDTO> bookings;
}
