package com.onlykei.hotel_management.services;

import com.onlykei.hotel_management.models.BookingModel;
import com.onlykei.hotel_management.repositories.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    public BookingService (BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    public List<BookingModel> getAllBookings(){
        return bookingRepository.findAll();
    }
    public BookingModel getBookingById(Long id){
        return bookingRepository.findById(id).orElse(null);
    }
    public BookingModel saveBooking(BookingModel bookingModel){
        return bookingRepository.save(bookingModel);
    }
    public void deleteBooking(Long id){
        bookingRepository.deleteById(id);
    }
}
