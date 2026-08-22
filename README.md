# CAVÉNO — Cinematic Dark-Mode MERN Roastery & Tasting Experience

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-gold.svg)](https://mongodb.com)
[![React 18](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev)
[![Node Express](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green.svg)](https://expressjs.com)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-forestgreen.svg)](https://mongodb.com/atlas)
[![GSAP Animations](https://img.shields.io/badge/Animation-GSAP%20ScrollTrigger-darkgreen.svg)](https://greensock.com)

**CAVÉNO** is an ultra-premium, dark-mode digital roastery platform engineered to blend high-fashion editorial storytelling with a robust full-stack architecture. Built as a flagship project for Phase 1 internship evaluation, CAVÉNO delivers interactive coffee customization, real-time cupping reservation management, an Apple Wallet-inspired customer Digital Pass system, and a dual-subsystem Admin Telemetry Control Center.

---

## 🌟 Key Highlights & Architecture

- **Visual Aesthetics:** Dark obsidian luxury design system built with custom HSL color tokens (`#0B0A0A`), ambient radial glows, glassmorphism containers, and smooth Lenis momentum scrolling.
- **Theatrical Curtain Preloader:** Synchronized GSAP Master Timeline preloader with numeric countdown (0-100), brand keyword rotation, split-curtains, and smooth hero coffee video reveal.
- **Interactive Floor Plan Engine:** SVG interactive table selection engine allowing guests to reserve specific salon zones (*Velvet Lounge*, *Barista Bar*, *Roastery Terrace*, *Private Salon*).
- **Dual Subsystems (RBAC):**
  - **Customer Subsystem:** User registration/login, order history tracking, and Apple Wallet-style Digital Reservation Pass card generation with dynamic QR placeholders.
  - **Admin Subsystem:** Password-protected dashboard featuring real-time revenue telemetry, reservation status management, live barista order Kanban board, and full Menu CRUD capabilities.

---

## 🛠️ Technology Stack Breakdown

| Layer | Technologies & Libraries Used |
| :--- | :--- |
| **Frontend UI/UX** | React 18, Vite, Tailwind CSS, Lucide Icons, Framer Motion |
| **Animations & Scroll** | GSAP 3 (ScrollTrigger), Lenis Smooth Scroll, Canvas Confetti |
| **Backend API** | Node.js, Express.js, CORS, Morgan Logger, Dotenv |
| **Database & ODM** | MongoDB Atlas, Mongoose Schemas & Middleware |
| **Authentication & Security** | JSON Web Tokens (JWT), BcryptJS Password Hashing, Role-Based Route Guards |

---

## 📁 Repository Directory Structure

```
Cafe Project/
├── backend/                  # Node.js / Express REST API Server
│   ├── config/               # Database connection (db.js)
│   ├── controllers/          # Business logic handlers (auth, menu, reservation, order)
│   ├── middleware/           # JWT protect & admin role guards, error handlers
│   ├── models/               # Mongoose data schemas (User, MenuItem, Reservation, Order)
│   ├── routes/               # Express API endpoints
│   ├── server.js             # Express app setup & route mounting
│   └── package.json
│
├── frontend/                 # React 18 / Vite Single Page Application
│   ├── src/
│   │   ├── assets/           # High-resolution video and images
│   │   ├── components/       # UI components (Header, Footer, Preloader, CartDrawer, CheckoutModal)
│   │   ├── context/          # State management (CartContext, UserAuthContext, AdminAuthContext)
│   │   ├── pages/            # Page views (Home, Menu, Reservation, UserDashboard, AdminDashboard)
│   │   └── main.jsx
│   ├── vite.config.js        # Vite configuration with /api proxy setup
│   └── package.json
│
├── package.json              # Root package runner (concurrent dev & build scripts)
├── README.md                 # System overview and quickstart guide
└── PROJECT_REPORT.md         # Comprehensive internship evaluation report
```

---

## 🚀 Quickstart & Setup Guide

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **npm** installed on your machine.

### 2. Installation
Clone the repository and install dependencies in both `frontend` and `backend`:

```bash
# Install root orchestrator dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Configuration
Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://suyogkumbhar087_db_user:root@cluster0.wsey7bc.mongodb.net/caveno_db?retryWrites=true&w=majority&appName=Cluster0
CLIENT_URL=http://localhost:5173
JWT_SECRET=caveno_super_secret_jwt_key_2026_luxury_roastery
```

### 4. Running the Application Locally
Run backend and frontend concurrently from the root directory:

```bash
# From the root directory:
npm run dev
```
- **Frontend URL:** `http://localhost:5173`
- **Backend API URL:** `http://localhost:5000`

---

## 🔑 Administrative Credentials (Demo)

To access the Admin Subsystem (`/admin`):
- **Email:** `admin@caveno.com`
- **Password:** `admin1234`

---

## 📡 REST API Endpoint Documentation

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new customer account |
| `POST` | `/api/auth/login` | Public | Customer authentication & JWT retrieval |
| `POST` | `/api/auth/admin-login` | Public | Admin login & JWT retrieval |
| `POST` | `/api/auth/init-admin` | Public | Auto-initialize admin@caveno.com with password admin1234 |
| `GET` | `/api/menu` | Public | Fetch master reserve menu items |
| `POST` | `/api/menu` | Admin | Add new menu item to collection |
| `DELETE` | `/api/menu/:id` | Admin | Remove menu item |
| `POST` | `/api/reservations` | Public | Create new cupping reservation |
| `GET` | `/api/reservations/track/:bookingRef` | Public | Track live booking pass status |
| `GET` | `/api/user/reservations` | Protected User | Fetch customer's personal bookings |
| `GET` | `/api/user/orders` | Protected User | Fetch customer's order history |
| `GET` | `/api/admin/stats` | Protected Admin | Fetch aggregated revenue & reservation analytics |

---

## 📄 License & Evaluation Notice
This project is developed as part of a Web Development Portfolio & Internship Technical Assessment. All rights reserved by the lead creative developer.
