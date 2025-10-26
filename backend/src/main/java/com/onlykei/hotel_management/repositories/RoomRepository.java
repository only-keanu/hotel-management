package com.onlykei.hotel_management.repositories;

import com.onlykei.hotel_management.models.RoomModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<RoomModel, Long> {}
