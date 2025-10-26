package com.onlykei.hotel_management.repositories;

import com.onlykei.hotel_management.models.GuestModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestRepository extends JpaRepository<GuestModel,Long> {
}
