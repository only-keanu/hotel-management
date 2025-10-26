package com.onlykei.hotel_management.repositories;

import com.onlykei.hotel_management.models.BookingModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<BookingModel, Long> {}
