package com.example.expense_api.controller;

import com.example.expense_api.model.Employee;
import com.example.expense_api.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body("Username and password are required.");
        }

        // Hardcoded Admin Auth
        if (username.equals("admin") && password.equals("admin123")) {
            Map<String, Object> response = new HashMap<>();
            response.put("role", "ADMIN");
            response.put("name", "System Administrator");
            return ResponseEntity.ok(response);
        }

        // Employee Auth
        Optional<Employee> empOpt = employeeRepository.findByName(username);
        if (empOpt.isPresent()) {
            Employee emp = empOpt.get();
            // Validate password natively
            if (password.equals(emp.getPassword())) {
                Map<String, Object> response = new HashMap<>();
                response.put("role", "EMPLOYEE");
                response.put("id", emp.getId());
                response.put("name", emp.getName());
                response.put("grade", emp.getGrade());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(401).body("Invalid password.");
            }
        }

        return ResponseEntity.status(404).body("User not found.");
    }
}
