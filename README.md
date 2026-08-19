# Online Clinic System (OCS) - Full Stack Application

Enterprise-grade outpatient healthcare management platform built with **Spring Boot**, **React.js**, **Spring Security (JWT)**, and **MySQL**.

## Project Architecture

```
OCS/
├── backend/    # Spring Boot 3 Java REST API
└── frontend/   # React 18 Single Page Application (Vite)
```

## Setup & Running Instructions

### 1. Database Configuration
1. Open MySQL Workbench or MySQL CLI.
2. Create database:
   ```sql
   CREATE DATABASE ocs_db;
   ```
3. Update database credentials in `backend/src/main/resources/application.properties` if your MySQL root password is not `root`.

---

### 2. Run Spring Boot Backend
Open terminal in the `backend` folder:
```bash
cd backend
mvn spring-boot:run
```
The backend server will start at: `http://localhost:8080`
*Default Admin Account (Auto-created on startup):*
- **Email:** `admin@ocs.com`
- **Password:** `Admin123!`

---

### 3. Run React Frontend
Open another terminal in the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```
The React development server will start at: `http://localhost:5173`

---

## Features
- 🔒 **Stateless JWT Security**: Role-based access control for Admin, Doctor, and Patient.
- 👨‍⚕️ **Admin Portal**: Doctor onboarding, schedule allocation, leave approvals, and smart alternate doctor reassignment.
- 🩺 **Doctor Portal**: Patient consultation queue, leave applications, availability toggle.
- 🏥 **Patient Portal**: Search doctors by specialization, 30-min time slot picker, appointment booking & cancellation.
