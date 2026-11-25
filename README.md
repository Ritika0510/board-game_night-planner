# BoardNight

**BoardNight** is a board-game night planner for managing a game
collection, planning game nights, tracking borrowed games, and recording
match results.

## Features

-   User sign-up and login
-   Dashboard for accessing the application
-   My Games: add and manage board games
-   Game Planner: create and manage game-night events
-   Borrowed Games: track borrowed and returned games
-   Profile management
-   Match History and XP
-   Tournament-related functionality

> **Data storage note:** MySQL stores data handled by the backend APIs.
> Features that use browser `localStorage` store data only in that
> browser; it is not automatically shared with other users or devices.
> Browser-local data should not be described as a shared database
> feature.

## Technology Stack

  Layer      Technology
  ---------- ------------------------------
  Frontend   React, Vite, JavaScript, CSS
  Backend    Node.js, Express.js
  Database   MySQL
  Tools      npm, Git, GitHub

## Project Structure

``` text
BoardNight/
├── backend/       # Backend application and dependencies
├── frontend/      # React + Vite frontend
├── database/      # MySQL schema
├── docs/          # Project documentation and design references
├── server.js      # Root-level server file
├── start-backend.bat
├── start-frontend.bat
└── README.md
```

## Setup

### Requirements

-   Node.js and npm
-   MySQL Server (or a local MySQL environment such as XAMPP)
-   Visual Studio Code or another code editor

### 1. Set up the database

1.  Start the MySQL service.
2.  Open MySQL Workbench or phpMyAdmin.
3.  Create the database expected by the backend configuration.
4.  Import and execute `database/schema.sql`.

If the database already contains important data, take a backup before
applying schema changes.

### 2. Configure the backend

1.  Open the `backend` folder.
2.  Create a local `.env` file using the variable names expected by
    `backend/server.js`.
3.  Add your local MySQL connection details.
4.  Keep `.env` private. Do not upload it to GitHub.

### 3. Install dependencies

In a terminal:

``` bash
cd backend
npm install
```

In a second terminal:

``` bash
cd frontend
npm install
```

### 4. Start the application

Start the backend from the `backend` folder:

``` bash
npm start
```

If `backend/package.json` does not define a `start` script, use the
start command defined by that project (for example, `node server.js`).

Create the .env file in the local host: 
`PORT=5000
DB_HOST=localhost`
`
DB_PORT=3306`
`
DB_USER=root`

`DB_PASSWORD=`
`DB_NAME=boardnight
`

Start the frontend from the `frontend` folder:

``` bash
npm run dev
```

Open the local URL printed by Vite in your browser.

The project also includes `start-backend.bat` and `start-frontend.bat`
for starting the services on the configured local machine.

## Security and Data Notes

-   Keep database passwords and secrets in your local `.env` file.
-   Never commit `.env` files or credentials to GitHub.
-   The root `.gitignore` excludes environment files and dependency
    folders.
-   Back up an existing database before applying schema changes.
-   Browser `localStorage` data is browser-specific and separate from
    MySQL data.

## Project Information

BoardNight is a student RDBMS project. Feature behavior depends on the
current application implementation and database configuration.
