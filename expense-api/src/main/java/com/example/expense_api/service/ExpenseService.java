package com.example.expense_api.service;

import com.example.expense_api.model.Employee;
import com.example.expense_api.model.Expense;
import com.example.expense_api.repository.EmployeeRepository;
import com.example.expense_api.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public Expense saveExpense(Expense expense) {
        Employee employee = employeeRepository.findById(expense.getEmployeeId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid Employee ID"));

        expense.setEmployee(employee);

        // Grade Validation Logic
        int grade = employee.getGrade();
        double maxAllowed = 0;
        
        if (grade <= 5) {
            maxAllowed = 500.0;
        } else if (grade <= 10) {
            maxAllowed = 1000.0;
        } else {
            maxAllowed = 2000.0; // fallback for higher grades
        }

        Double todayTotal = expenseRepository.getDailyTotalByCategoryForEmployee(
                employee.getId(), expense.getCategory(), expense.getDate());

        if (todayTotal + expense.getAmount() > maxAllowed) {
            throw new IllegalArgumentException("Expense exceeds daily cap for Grade " + grade + ". Max allowed: Rs. " + maxAllowed);
        }

        return expenseRepository.save(expense);
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public List<Expense> getExpensesByEmployee(Long employeeId) {
        return expenseRepository.findByEmployeeId(employeeId);
    }
}
