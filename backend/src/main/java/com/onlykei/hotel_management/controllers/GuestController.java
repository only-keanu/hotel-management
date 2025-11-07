package com.onlykei.hotel_management.controllers;

import com.onlykei.hotel_management.models.GuestModel;
import com.onlykei.hotel_management.services.GuestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/v1/guests")
public class GuestController {

    private final GuestService guestService;

    public GuestController(GuestService guestService) {
        this.guestService = guestService;
    }

    // GET all guests
    @GetMapping
    public List<GuestModel> getAllGuests() {
        return guestService.getAllGuests();
    }

    // GET guest by ID
    @GetMapping("/{id}")
    public GuestModel getGuestById(@PathVariable Long id) {
        return guestService.getGuestById(id);
    }

    // POST - Create a new guest
    @PostMapping
    public GuestModel saveGuest(@RequestBody GuestModel guestDetails) {
        return guestService.saveGuest(guestDetails);
    }

    // PUT - Update existing guest
    @PutMapping("/{id}")
    public GuestModel updateGuest(@PathVariable Long id, @RequestBody GuestModel guestDetails) {
        GuestModel guest = guestService.getGuestById(id);
        if (guest != null) {
            guest.setFirstName(guestDetails.getFirstName());
            guest.setMiddleName(guestDetails.getMiddleName());
            guest.setLastName(guestDetails.getLastName());
            guest.setHomeAddress(guestDetails.getHomeAddress());
            guest.setGender(guestDetails.getGender());
            guest.setCivilStatus(guestDetails.getCivilStatus());
            guest.setBirthDate(guestDetails.getBirthDate());
            guest.setPlaceOfBirth(guestDetails.getPlaceOfBirth());
            guest.setIdentificationNo(guestDetails.getIdentificationNo());
            guest.setCountry(guestDetails.getCountry());
            guest.setCitizenship(guestDetails.getCitizenship());
            guest.setMobileNo(guestDetails.getMobileNo());
            guest.setTelephoneNo(guestDetails.getTelephoneNo());
            guest.setEmailAddress(guestDetails.getEmailAddress());
            guest.setCompanyName(guestDetails.getCompanyName());
            guest.setCompanyAddress(guestDetails.getCompanyAddress());
            guest.setCompanyTelephoneNo(guestDetails.getCompanyTelephoneNo());
            guest.setCompanyZipCode(guestDetails.getCompanyZipCode());
            guest.setCompanyEmailAddress(guestDetails.getCompanyEmailAddress());
            guest.setEmergencyContactFirstName(guestDetails.getEmergencyContactFirstName());
            guest.setEmergencyContactLastName(guestDetails.getEmergencyContactLastName());
            guest.setEmergencyContactNumber(guestDetails.getEmergencyContactNumber());
            guest.setEmergencyContactAddress(guestDetails.getEmergencyContactAddress());
            return guestService.saveGuest(guest);
        }
        return null;
    }

    // DELETE guest
    @DeleteMapping("/{id}")
    public void deleteGuest(@PathVariable Long id) {
        guestService.deleteGuest(id);
    }
}
