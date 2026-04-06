package com.example.expense_api.controller;

import com.example.expense_api.model.Expense;
import com.example.expense_api.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<?> addExpense(@Valid @RequestBody Expense expense) {
        try {
            Expense saved = expenseService.saveExpense(expense);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An unexpected error occurred");
        }
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
        return ResponseEntity.ok(expenseService.getAllExpenses());
    }

    @GetMapping("/employee/{id}")
    public ResponseEntity<List<Expense>> getExpensesByEmployee(@PathVariable Long id) {
        return ResponseEntity.ok(expenseService.getExpensesByEmployee(id));
    }
}
