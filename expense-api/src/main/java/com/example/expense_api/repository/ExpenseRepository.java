package com.example.expense_api.repository;

import com.example.expense_api.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.employee.id = :employeeId AND e.category = :category AND e.date = :date")
    Double getDailyTotalByCategoryForEmployee(@Param("employeeId") Long employeeId, @Param("category") String category, @Param("date") LocalDate date);

    List<Expense> findByEmployeeId(Long employeeId);
}
