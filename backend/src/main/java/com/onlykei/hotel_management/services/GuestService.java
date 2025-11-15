package com.onlykei.hotel_management.services;
import com.onlykei.hotel_management.dtos.BookingSummaryDTO;
import com.onlykei.hotel_management.dtos.GuestDTO;
import com.onlykei.hotel_management.models.GuestModel;
import com.onlykei.hotel_management.repositories.GuestRepository;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

import java.util.List;
import java.util.Optional;

@Service
public class GuestService {
    private final GuestRepository guestRepository;
    public GuestService(GuestRepository guestRepository){
        this.guestRepository = guestRepository;
    }
    public List<GuestModel> getAllGuests(){
        return guestRepository.findAll();
    }
    public GuestModel getGuestById(Long id){
        return guestRepository.findById(id).orElse(null);
    }
    public GuestModel saveGuest (GuestModel guest){
        return guestRepository.save(guest);
    }
    public void deleteGuest(Long id){
        guestRepository.deleteById(id);
    }

    public GuestDTO mapToDTO(GuestModel guest) {
        List<BookingSummaryDTO> bookingSummaries = guest.getBookings() == null ?
                List.of() :
                guest.getBookings().stream()
                        .map(b -> BookingSummaryDTO.builder()
                                .id(b.getId())
                                .checkInDate(b.getCheckInDate())
                                .checkOutDate(b.getCheckOutDate())
                                .roomNumber(b.getRoom().getNumber())
                                .build())
                        .collect(Collectors.toList());

        return GuestDTO.builder()
                .id(guest.getId())
                .firstName(guest.getFirstName())
                .middleName(guest.getMiddleName())
                .lastName(guest.getLastName())
                .homeAddress(guest.getHomeAddress())
                .gender(guest.getGender())
                .civilStatus(guest.getCivilStatus())
                .identificationNo(guest.getIdentificationNo())
                .mobileNo(guest.getMobileNo())
                .telephoneNo(guest.getTelephoneNo())
                .emailAddress(guest.getEmailAddress())
                .bookings(bookingSummaries)
                .build();
    }
}
