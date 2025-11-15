package com.onlykei.hotel_management.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuestModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Basic Guest Information
    @NotBlank(message = "Last name is required")
    @Column(nullable = false)
    private String lastName;

    @NotBlank(message = "First name is required")
    @Column(nullable = false)
    private String firstName;

    private String middleName;
    private String homeAddress;
    private String gender;
    private String civilStatus;
    private LocalDate birthDate;
    private String placeOfBirth;

    @NotBlank(message = "Identification number is required")
    @Column(nullable = false, unique = true)
    private String identificationNo;

    private String country;
    private String citizenship;

    // Contact Information
    private String mobileNo;
    private String telephoneNo;

    @Email(message = "Invalid email address")
    private String emailAddress;

    // Company Information
    private String companyName;
    private String companyAddress;
    private String companyTelephoneNo;
    private String companyZipCode;

    @Email(message = "Invalid company email address")
    private String companyEmailAddress;

    // Emergency Contact
    private String emergencyContactFirstName;
    private String emergencyContactLastName;
    private String emergencyContactNumber;
    private String emergencyContactAddress;

    @OneToMany(mappedBy = "guest", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"room", "guest"})
    private List<BookingModel> bookings;
}
