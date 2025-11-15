package com.onlykei.hotel_management.repositories;

import com.onlykei.hotel_management.models.GuestModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Step 3.1: GuestRepository Interface
 *
 * FILE LOCATION: src/main/java/com/onlykei/hotel_management/repositories/GuestRepository.java
 *
 * INSTRUCTIONS:
 * 1. Create a new package called "repositories" if it doesn't exist
 * 2. Create a new file called "GuestRepository.java" in the repositories package
 * 3. Copy this ENTIRE file
 * 4. Save the file
 *
 * NOTE: This is an INTERFACE, not a class. Spring will auto-implement it!
 */

@Repository
public interface GuestRepository extends JpaRepository<GuestModel, Long> {

    // Find guest by identification number
    // Example: findByIdentificationNo("123456789")
    Optional<GuestModel> findByIdentificationNo(String identificationNo);

    // Find guests by last name (case-insensitive search)
    // Example: findByLastNameContainingIgnoreCase("Smith") returns all Smiths
    List<GuestModel> findByLastNameContainingIgnoreCase(String lastName);

    // Find guests by first name (case-insensitive search)
    // Example: findByFirstNameContainingIgnoreCase("John")
    List<GuestModel> findByFirstNameContainingIgnoreCase(String firstName);

    // Find guest by email
    // Example: findByEmailAddress("john@example.com")
    Optional<GuestModel> findByEmailAddress(String emailAddress);

    // Find guests by country
    // Example: findByCountry("Philippines")
    List<GuestModel> findByCountry(String country);
}

/*
==================================================
✅ STEP 3.1 COMPLETE!
==================================================

What this repository does:
- Provides basic CRUD operations (inherited from JpaRepository)
  - save(), findById(), findAll(), deleteById(), etc.
- Custom queries for finding guests by:
  - Identification number
  - Name (last name, first name)
  - Email
  - Country

Spring Boot will automatically implement all these methods!

NEXT: Create RoomRepository.java (Step 3.2) 👇
==================================================
*/