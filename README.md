# Rule-Based Discount Eligibility Management System (Frontend)

## Overview
This project is the frontend application for a Rule-Based Discount Eligibility Management System.

It is built using React and Vite, and provides separate user interfaces for ADMIN and CUSTOMER users.

The frontend supports:
- User registration and login
- Role-based navigation (ADMIN and CUSTOMER dashboards)
- Discount rule creation and management for admins
- Discount eligibility checks for customers
- Discount application flow
- Admin usage report viewing

---

## Tech Stack
- React.js
- Vite
- React Router DOM
- Axios
- CSS

---

## Frontend URL
http://localhost:5173

---

## User Roles and Permissions

### CUSTOMER
- Register
- Login
- View discount rules
- Check discount eligibility
- Apply discount

### ADMIN
- Register
- Login
- Create discount rules
- Toggle rule active/inactive
- View all rules
- View discount usage reports

---

## Frontend Routes

### Public Routes
- /register
- /login

### Dashboard Routes
- /customer
- /admin

---

## Notes
- Role-based redirection is handled after login:
  - ADMIN -> /admin
  - CUSTOMER -> /customer