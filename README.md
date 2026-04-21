# Expense Tracker — Full-Stack Application

A lightweight, production-ready expense management platform built with React and Java Spring Boot.

## 🚀 Live Demo
- **Live Frontend**: [https://expense-tracker-g4faxcmoj-kasturi-patils-projects.vercel.app](https://expense-tracker-g4faxcmoj-kasturi-patils-projects.vercel.app)
- **Live Backend API**: [https://expense-tracker-production-8630.up.railway.app/api](https://expense-tracker-production-8630.up.railway.app/api)

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Recharts (for data visualization), Lucide React (for icons).
- **Backend**: Java 17, Spring Boot, Spring Data JPA, Spring Web.
- **Database**: H2 In-Memory Database (for zero-config cloud deployment).
- **Deployment**: Vercel (Frontend), Railway (Backend).

## 🛠️ Key Features

- **Role-Based Authentication**: Distinct access levels and dashboards for Employees and Administrators.
- **Expense Logging**: Easily capture and track personal or corporate expenses.
- **Data Visualization**: Integrated charts to analyze expense distributions and trends.
- **Embedded Database Setup**: Uses H2 database for seamless cloud hosting without external database dependencies.

## 💻 Local Quick Start

Before running locally, ensure you have **Java 17+** and **Node.js** installed.

### Back-End (Spring Boot API)
1. Navigate to the backend directory:
   ```bash
   cd expense-api
   ```
2. Run the Spring Boot application using Maven:
   ```bash
   ./mvnw spring-boot:run
   ```
   *The backend will start at `http://localhost:8080/api`*

### Front-End (React UI)
1. Navigate to the frontend directory:
   ```bash
   cd expense-ui
   ```
2. Install dependencies & start the Vite server:
   ```bash
   npm install
   npm run dev
   ```
   *The frontend will start at `http://localhost:5173`*
