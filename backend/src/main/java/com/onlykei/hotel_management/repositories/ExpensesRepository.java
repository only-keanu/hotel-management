package com.onlykei.hotel_management.repositories;

import com.onlykei.hotel_management.models.ExpensesModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpensesRepository extends JpaRepository<ExpensesModel,Long> {
}
