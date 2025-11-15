package com.onlykei.hotel_management.services;

import com.onlykei.hotel_management.models.ExpensesModel;
import com.onlykei.hotel_management.repositories.ExpensesRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExpensesService {
    private ExpensesRepository expensesRepository = null;
    public ExpensesService(ExpensesRepository expensesRepository){
        this.expensesRepository = expensesRepository;
    }
    public List<ExpensesModel> getAllExpenses() {
        return expensesRepository.findAll();
    }
    public ExpensesModel getExpenseById(Long id){
        return expensesRepository.findById(id).orElse(null);
    }
    public ExpensesModel saveExpense(ExpensesModel expense){
        return saveExpense(expense);
    }

    public void deleteExpense(Long id){
        expensesRepository.deleteById(id);
    }
}
