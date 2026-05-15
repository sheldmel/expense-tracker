# Expense Tracker

A full-stack expense tracking application built with React, Spring Boot, and PostgreSQL, deployed on AWS.

## Features
- JWT authentication 
- Expense management (add, edit, delete, filter by date/category)
- Custom categories with colour coding
- AI-powered category suggestions via Spring AI and Ollama
- Dashboard with spending charts and summaries
- Budget limits
- Multi-currency support (USD, INR, GBP)

## Tech Stack
**Frontend:** React, Recharts, Axios, React Router

**Backend:** Spring Boot 3, Spring Security 6, Spring Data JPA, Spring AI

**Database:** PostgreSQL (Neon)

**Cloud:** AWS EC2, Vercel

**Auth:** JWT 

## Architecture
![Architecture Diagram](docs/architecture.png)

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL or Neon account

### Backend Setup
```bash
cd backend
cp src/main/resources/application.example.properties src/main/resources/application.properties
# Fill in your credentials
./mvnw spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Fill in your API URL
npm run dev
```

## Environment Variables

### Backend (application.properties)
