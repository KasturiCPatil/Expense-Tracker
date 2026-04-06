package com.example.expense_api.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String password;

    private int grade;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private List<Expense> expenses;

    // Constructors, Getters, Setters
    public Employee() {}

    public Employee(String name, int grade) {
        this.name = name;
        this.grade = grade;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public int getGrade() { return grade; }
    public void setGrade(int grade) { this.grade = grade; }
}
