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
    List<BookingModel> getAllBooks(){
        return bookingRepository.findAll();
    }
    Optional<BookingModel> getBookById(Long id){
        return bookingRepository.findById(id);
    }
    BookingModel saveModel(BookingModel bookingModel){
        return bookingRepository.save(bookingModel);
    }
    public void deleteModel(Long id){
        bookingRepository.deleteById(id);
    }
}
