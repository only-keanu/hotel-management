package com.onlykei.hotel_management.services;

import com.onlykei.hotel_management.dtos.ChecklistItemDTO;
import com.onlykei.hotel_management.models.BookingModel;
import com.onlykei.hotel_management.models.ChecklistItemModel;
import com.onlykei.hotel_management.models.ChecklistItemModel.Category;
import com.onlykei.hotel_management.repositories.BookingRepository;
import com.onlykei.hotel_management.repositories.ChecklistItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChecklistService {

    private final ChecklistItemRepository checklistItemRepository;
    private final BookingRepository bookingRepository;

    @Transactional(readOnly = true)
    public List<ChecklistItemDTO> getChecklistByBookingId(Long bookingId) {
        return checklistItemRepository.findByBookingId(bookingId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ChecklistItemDTO createChecklistItem(Long bookingId, ChecklistItemDTO dto) {
        BookingModel booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        ChecklistItemModel item = ChecklistItemModel.builder()
                .booking(booking)
                .item(dto.getItem())
                .category(Category.valueOf(dto.getCategory().toLowerCase()))
                .completed(dto.getCompleted() != null ? dto.getCompleted() : false)
                .notes(dto.getNotes())
                .build();

        return convertToDTO(checklistItemRepository.save(item));
    }

    @Transactional
    public ChecklistItemDTO updateChecklistItem(Long itemId, ChecklistItemDTO dto) {
        ChecklistItemModel item = checklistItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Checklist item not found"));

        item.setItem(dto.getItem());
        item.setCategory(Category.valueOf(dto.getCategory().toLowerCase()));
        item.setCompleted(dto.getCompleted());
        item.setNotes(dto.getNotes());

        return convertToDTO(checklistItemRepository.save(item));
    }

    @Transactional
    public void toggleChecklistItem(Long itemId) {
        ChecklistItemModel item = checklistItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Checklist item not found"));

        item.setCompleted(!item.getCompleted());
        checklistItemRepository.save(item);
    }

    @Transactional
    public void deleteChecklistItem(Long itemId) {
        checklistItemRepository.deleteById(itemId);
    }

    @Transactional
    public List<ChecklistItemDTO> saveChecklistForBooking(Long bookingId, List<ChecklistItemDTO> checklistDTOs) {
        BookingModel booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Delete existing items
        checklistItemRepository.deleteByBookingId(bookingId);

        // Create new items
        List<ChecklistItemModel> items = checklistDTOs.stream()
                .map(dto -> ChecklistItemModel.builder()
                        .booking(booking)
                        .item(dto.getItem())
                        .category(Category.valueOf(dto.getCategory().toLowerCase()))
                        .completed(dto.getCompleted() != null ? dto.getCompleted() : false)
                        .notes(dto.getNotes())
                        .build())
                .collect(Collectors.toList());

        return checklistItemRepository.saveAll(items).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ChecklistItemDTO convertToDTO(ChecklistItemModel item) {
        return ChecklistItemDTO.builder()
                .id(Long.valueOf(item.getId()))
                .item(item.getItem())
                .category(item.getCategory().name())
                .completed(item.getCompleted())
                .notes(item.getNotes())
                .build();
    }
}