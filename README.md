RoomOccupancy Management System

- Flask REST API with JWT auth + RBAC
- React frontend with Tailwind CSS
- AWS RDS MySQL cloud database
- 52 Pytest tests
- Waitress production server
- Environment separation (dev/prod)

# 🏠 RoomOccupancy Management System

A production-ready full-stack **Room Occupancy Management System**
built with **Python Flask REST API** + **React SPA** frontend,
featuring JWT authentication, Role-Based Access Control (RBAC),
live dashboards, immutable audit logging, and **AWS RDS** cloud database.

---

## 🌐 Live Demo

> Backend API : http://localhost:5000/api/health
> Frontend App: http://localhost:5173

**Demo Credentials:**

| Role    | Email                        | Password    |
|---------|------------------------------|-------------|
| Admin   | admin@roomoccupancy.com      | password123 |
| Manager | manager1@roomoccupancy.com   | password123 |
| Staff   | staff1@roomoccupancy.com     | password123 |

---

## ✨ Features

### Core Features
- 🔐 **JWT Authentication** — Secure login with access +
  refresh token rotation
- 👥 **RBAC** — 3-tier role system (Admin / Manager / Staff)
  with route-level protection
- 🏠 **Room Management** — Full CRUD with status tracking
  (Available / Occupied / Maintenance)
- 👤 **Resident Management** — Full CRUD + room assignment
  + checkout workflow
- 📊 **Live Dashboard** — Real-time occupancy stats,
  revenue, charts, floor-wise breakdown
- 📋 **Immutable Audit Log** — Every write operation logged
  with user, IP, timestamp
- 🌱 **Seed Data** — 120 rooms + 200 residents generated
  with Faker

### Technical Features
- ☁️ **AWS RDS** — MySQL database hosted on Amazon
  eu-north-1 with automated backups
- 🔄 **Environment Switching** — Separate configs for
  development (local MySQL) and production (AWS RDS)
- 🛡️ **Rate Limiting** — Login endpoint protected against
  brute force (10 req/min)
- 🚀 **Production Server** — Waitress WSGI server
  (not Flask dev server)
- 🧪 **52 Pytest Tests** — Auth, RBAC, and CRUD coverage
- 📄 **API Documentation** — Full endpoint docs in
  `docs/api_docs.md`

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Python | 3.13 | Core language |
| Flask | 3.x | REST API framework |
| SQLAlchemy | 2.x | ORM |
| Flask-Migrate | 4.x | DB schema migrations |
| Flask-JWT-Extended | 4.x | JWT authentication |
| Flask-Bcrypt | 1.x | Password hashing |
| Flask-CORS | 4.x | Cross-origin requests |
| Flask-Limiter | 3.x | Rate limiting |
| PyMySQL | 1.x | MySQL driver |
| Faker | 19.x | Seed data generation |
| Waitress | 3.x | Production WSGI server |
| Pytest | 8.x | Testing framework |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18 | UI framework |
| Vite | 5 | Build tool |
| React Router | 6 | Client-side routing |
| Axios | 1.x | HTTP client + interceptors |
| Recharts | 2.x | Dashboard charts |
| Tailwind CSS | 3 | Styling |

### Infrastructure
| Technology | Purpose |
|-----------|---------|
| AWS RDS (eu-north-1) | Cloud MySQL database |
| MySQL 8.0 | Database engine |
| MySQL Workbench | DB management |

---

## 📁 Project Structure
