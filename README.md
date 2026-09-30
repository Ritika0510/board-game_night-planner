<div align="center">

  <h1><img src="https://api.iconify.design/lucide:dice-5.svg?color=%238c5cff" width="28" height="28" align="center" /> BoardNight Backend API</h1>

  <p><strong>A robust, RESTful service powering collection management, game night event coordination, and borrower tracking for the BoardNight platform[cite: 2].</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Node.js-20+-0a0a0a?style=flat-square&logo=node.js&logoColor=339933" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express-4.19-0a0a0a?style=flat-square&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/PostgreSQL-15-0a0a0a?style=flat-square&logo=postgresql&logoColor=4169E1" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Docker-Ready-0a0a0a?style=flat-square&logo=docker&logoColor=2496ED" alt="Docker" />
    <img src="https://img.shields.io/badge/Auth-JWT_%26_Bcrypt-0a0a0a?style=flat-square&logo=jsonwebtokens&logoColor=white" alt="Auth" />
  </p>

</div>

---

## <img src="https://api.iconify.design/lucide:info.svg?color=%23888888" width="18" height="18" align="center" /> Overview

The **BoardNight Backend** handles user authentication, board game inventory tracking, event planning, and session audits[cite: 2]. Engineered specifically to interface with the BoardNight React client, it delivers relational data joins, password hashing, and security audit trails[cite: 2].

---

## <img src="https://api.iconify.design/lucide:layers.svg?color=%23888888" width="18" height="18" align="center" /> Architecture & Core Entities


```

┌────────────────────────────────────────────────────────┐
│                   BoardNight Client                    │
└───────────────────────────┬────────────────────────────┘
│ HTTP / JSON
┌───────────────────────────▼────────────────────────────┐
│                    Express REST API                    │
│   • Auth (JWT/Bcrypt)        • Collection Manager      │
│   • Event Planner Engine     • Login History Auditor   │
└───────────────────────────┬────────────────────────────┘
│ pg Pool
┌───────────────────────────▼────────────────────────────┐
│                  PostgreSQL Database                   │
│   • users        • games        • game_nights          │
│   • login_history                                      │
└────────────────────────────────────────────────────────┘

```

* <img src="https://api.iconify.design/lucide:shield-check.svg?color=%23888888" width="15" height="15" align="center" /> **Users & Security**: JWT-authenticated sessions with Bcrypt hashing and failed/successful login audit history[cite: 2].
* <img src="https://api.iconify.design/lucide:grid.svg?color=%23888888" width="15" height="15" align="center" /> **Game Collection**: Personal library tracking with play times, player caps, categories, and loan availability[cite: 2].
* <img src="https://api.iconify.design/lucide:calendar.svg?color=%23888888" width="15" height="15" align="center" /> **Event Planner**: Scheduled sessions with relational joins that map games, hosts, locations, and seat limits[cite: 2].

---

## <img src="https://api.iconify.design/lucide:container.svg?color=%23888888" width="18" height="18" align="center" /> Quick Start (Docker)

Run the API service and pre-seeded PostgreSQL instance with a single command:

```bash
docker compose up --build

```

The database initializes with schemas and default fixtures automatically. The API will be active at `http://localhost:5000`.


##  Local Development Setup

### Prerequisites

* **Node.js** >= 18.0.0
* **PostgreSQL** instance running locally

### 1. Install Dependencies

```bash
npm install

```

### 2. Configure Environment

Create a `.env` file in the root directory:

```bash
cp .env.example .env

```

Update database credentials if your local PostgreSQL settings differ from the defaults:

```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=boardnight_db

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

```

### 3. Initialize Database Schema & Seed Data

```bash
psql -U postgres -d boardnight_db -f schema.sql
psql -U postgres -d boardnight_db -f seed.sql

```
### 4. Run Server

```bash
# Development mode with hot-reload
npm run dev

# Production start
npm start

```

---

##  Pre-Seeded Test Credentials

| Field | Value |
| --- | --- |
| **Email** | `faisal@example.com` |
| **Password** | `password123` |
| **User ID** | `1` |



##  API Reference

### Health Probe

* `GET /health` - Service status and server uptime probe.

### Authentication (`/api/auth`)

* `POST /api/auth/signup` - Register a new account (`name`, `email`, `password`).


* `POST /api/auth/login` - Authenticate credentials and receive a JWT Bearer token.


* `PUT /api/auth/change-password` - Update password (`userId`, `currentPassword`, `newPassword`).


* `GET /api/auth/login-history/:userId` - Retrieve the recent 20 audit events for an account.



### Game Collection (`/api/games`)

* `GET /api/games/:userId` - Retrieve all cataloged games for a user.


* `POST /api/games` - Add a new title to the collection.


* `PUT /api/games/:id` - Update game metadata and loan status (`available` / `borrowed`).


* `DELETE /api/games/:id?userId=:userId` - Delete a game record.



### Game Planner (`/api/game-nights`)

* `GET /api/game-nights/:userId` - Retrieve scheduled game nights with joined game names.


* `POST /api/game-nights` - Schedule a new session (`title`, `gameId`, `eventDate`, `startTime`, `location`, `maxPlayers`, `notes`).


* `PUT /api/game-nights/:id` - Reschedule or update event details.


* `DELETE /api/game-nights/:id?userId=:userId` - Cancel and delete a game night event.



##  Postman Collection

Import `postman_collection.json` into Postman to test every route. The login endpoint automatically captures the session token and populates the `{{authToken}}` variable across all authenticated endpoints.
