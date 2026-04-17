# Expense Tracker

A full-stack expense tracking application built with React, Spring Boot, and PostgreSQL, deployed on AWS.

## Features
- JWT authentication (register, login, token refresh)
- Expense management (add, edit, delete, filter by date/category)
- Custom categories with colour coding
- AI-powered category suggestions via Anthropic API
- Dashboard with spending charts and summaries
- Budget limits with email alerts via AWS SES
- Multi-currency support (USD, INR, GBP)

## Tech Stack
**Frontend:** React, Recharts, Axios, React Router

**Backend:** Spring Boot 3, Spring Security 6, Spring Data JPA

**Database:** PostgreSQL (Neon for dev, AWS RDS for prod)

**Cloud:** AWS EC2, S3, CloudFront, RDS, SES

**Auth:** JWT (HttpOnly cookies)

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
