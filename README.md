# BoardNight — Final Project

BoardNight is a board-game night planning and collection-management web application.

## Technology stack

- Frontend: React, Vite, JavaScript, CSS, React Router
- Backend: Node.js, Express.js
- Database: MySQL
- Authentication: bcryptjs password hashing
- Database driver: mysql2
- UI reference: Stitch design files in `docs/stitch-reference/`

## Main features

- Signup and login
- Dashboard/workspace
- My Games collection with MySQL-backed CRUD
- Game Planner with MySQL-backed game-night CRUD
- Borrowed/Lent tracker
- Match History
- Player leaderboard (local player summary)
- Communities and Tournaments
- Profile and login history

## Important feature-storage note

The current implementation is partly database-backed and partly browser-local:
- Signup/login, login history, My Games and Game Planner use the Express API and MySQL.
- Borrowed/Lent, Match History, Communities and Tournaments use browser `localStorage`.
- Some profile contact details and player progress are local to the browser.
- Leaderboard currently displays a local summary, not a shared multi-user ranking.

Do not describe the localStorage modules as shared database features unless they are later migrated to MySQL.

## Requirements

- Node.js 20.19+ and npm
- MySQL Server 8.x (XAMPP can be used to start MySQL; the SQL database is still MySQL)

## 1. Set up the database

1. Start MySQL Server.
2. Open `database/schema.sql` in MySQL Workbench or phpMyAdmin.
3. Execute the complete SQL script. It creates the `boardnight` database and required core tables.

If you already have a database with important data, take a backup before applying schema changes.

## 2. Configure the backend

Open a terminal in `backend/` and create `.env` by copying `.env.example`.

Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

Edit `backend/.env` and set your actual MySQL username and password. Never upload `.env` to GitHub.

Install dependencies and start the API:
```bash
npm install
npm start
```

Backend URL: `http://localhost:5000`

Health check: `http://localhost:5000/api/health`

Database check: `http://localhost:5000/api/db-test`

## 3. Start the frontend

Open a second terminal in `frontend/`:
```bash
npm install
npm run dev
```

Open the Local URL printed by Vite (usually `http://localhost:5173`).

Keep both terminals and MySQL running while using the application.

## 4. Upload to GitHub

From the project root:
```bash
git init
git add .
git commit -m "Final BoardNight project"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Before pushing, confirm `backend/.env` is not staged:
```bash
git status
```

## Project structure

```text
Board Game/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── database/
│   └── schema.sql
├── docs/
│   ├── FEATURE_STATUS.md
│   └── stitch-reference/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Team roles

- Ritika — Project Lead & Frontend Lead
- Khushi — Frontend Developer
- Saanya — Presentation
- Karan — Database Lead
- Faisal — Database Developer
- Gulshan — Backend Developer


## Current status

- Login uses a full-screen animated pastel dithering sphere with BYTE SQUAD centered over it and a light glass-style login card on the right.
- The full application uses a bright light theme with lavender, sky-blue, blush-pink and peach accents, responsive cards, and playful button feedback.
- Core app modules are included in this package; test each module against your local MySQL database before submission.
- Real-time public/private game-room chat with automatic room closure is a planned feature and is not included in this ZIP yet.

## Run locally

1. Start your MySQL 8 server and import `database/schema.sql` if the required tables are not already present.
2. In `backend`, copy `.env.example` to `.env`, enter your MySQL password, then run `npm install` and `npm start`.
3. In a second terminal, open `frontend`, run `npm install` and `npm run dev`.
4. Open the Vite `Local` URL shown in the terminal.
