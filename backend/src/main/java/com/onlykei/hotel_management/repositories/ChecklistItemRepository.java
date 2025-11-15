package com.onlykei.hotel_management.repositories;

import com.onlykei.hotel_management.models.ChecklistItemModel;
import com.onlykei.hotel_management.models.ChecklistItemModel.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChecklistItemRepository extends JpaRepository<ChecklistItemModel, Long> {

    // Find checklist items by booking ID
    List<ChecklistItemModel> findByBookingId(Long bookingId);

    // Find checklist items by booking ID and category
    List<ChecklistItemModel> findByBookingIdAndCategory(Long bookingId, Category category);

    // Find checklist items by booking ID and completion status
    List<ChecklistItemModel> findByBookingIdAndCompleted(Long bookingId, Boolean completed);

    // Delete all checklist items by booking ID
    void deleteByBookingId(Long bookingId);
}