package com.onlykei.hotel_management.controllers;


import com.onlykei.hotel_management.models.GuestModel;
import com.onlykei.hotel_management.services.GuestService;
import org.checkerframework.dataflow.qual.Deterministic;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/v1/guests")
public class GuestController {
    private final GuestService guestService;
    public GuestController(GuestService guestService){
        this.guestService = guestService;
    }
    @GetMapping
    public List<GuestModel> getAllGuests(){
        return guestService.getAllGuests();
    }
    @GetMapping("/{id}")
    public GuestModel getGuestById(@PathVariable Long id){
        return guestService.getGuestById(id);
    }

    @PostMapping
    public GuestModel saveModel(@RequestBody GuestModel guestDetails){
        return guestService.saveGuest(guestDetails);
    }
    @PutMapping("/{id}")
    public GuestModel updateModel(@PathVariable Long id,@RequestBody GuestModel guestDetails){
        GuestModel guest = guestService.getGuestById(id);
        if(guest!=null){
            guest.setId(guestDetails.getId());
            guest.setFullName(guestDetails.getFullName());
            guest.setEmail(guestDetails.getEmail());
            guest.setPhone(guestDetails.getPhone());
            return guestService.saveGuest(guest);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteGuest(@PathVariable Long id){
        guestService.deleteGuest(id);
    }
}
