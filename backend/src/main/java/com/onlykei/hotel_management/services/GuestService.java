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
}
