package com.onlykei.hotel_management.controllers;

import com.onlykei.hotel_management.models.ExpensesModel;
import com.onlykei.hotel_management.services.ExpensesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin // Allow frontend to call API from other origin
public class ExpensesController {

    private final ExpensesService expenseService;

    @Autowired
    public ExpensesController(ExpensesService expenseService) {
        this.expenseService = expenseService;
    }

    // GET all expenses
    @GetMapping
    public List<ExpensesModel> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    // GET one expense by ID
    @GetMapping("/{id}")
    public ExpensesModel getExpenseById(@PathVariable Long id) {
        return expenseService.getExpenseById(id);
    }

    // CREATE a new expense
    @PostMapping
    public ExpensesModel createExpense(@RequestBody ExpensesModel expense) {
        return expenseService.saveExpense(expense);
    }

    // UPDATE existing expense
    @PutMapping("/{id}")
    public ExpensesModel updateExpense(@PathVariable Long id, @RequestBody ExpensesModel expenseDetails) {
        ExpensesModel existingExpense = expenseService.getExpenseById(id);
        if (existingExpense != null) {
            existingExpense.setDescription(expenseDetails.getDescription());
            existingExpense.setAmount(expenseDetails.getAmount());
            existingExpense.setDateIncurred(expenseDetails.getDateIncurred());
            return expenseService.saveExpense(existingExpense);
        }
        return null;
    }

    // DELETE expense
    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
    }
}
