package com.onlykei.hotel_management.services;
import com.onlykei.hotel_management.models.GuestModel;
import com.onlykei.hotel_management.repositories.GuestRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GuestService {
    private final GuestRepository guestRepository;
    public GuestService(GuestRepository guestRepository){
        this.guestRepository = guestRepository;
    }
    List<GuestModel> getAllGuests(){
        return guestRepository.findAll();
    }
    Optional<GuestModel> getGuestById(Long id){
        return guestRepository.findById(id);
    }
    public GuestModel saveGuest (GuestModel guest){
        return guestRepository.save(guest);
    }
    public void deleteGuest(Long id){
        guestRepository.deleteById(id);
    }
}
