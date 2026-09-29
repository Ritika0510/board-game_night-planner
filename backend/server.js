const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

const PORT = Number(process.env.PORT) || 5000;

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// MYSQL CONNECTION
// ==========================================

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ==========================================
// BASIC ROUTES
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "BoardNight Backend is running!",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "BoardNight API is healthy!",
  });
});

// ==========================================
// DATABASE TEST
// ==========================================

app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS connected");

    res.json({
      success: true,
      message: "BoardNight Backend is connected to MySQL!",
      database: process.env.DB_NAME,
      result: rows[0],
    });
  } catch (error) {
    console.error("MySQL error:", error.message);

    res.status(500).json({
      success: false,
      message: "MySQL connection failed.",
      error: error.message,
    });
  }
});

// ==========================================
// SIGNUP
// ==========================================

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [cleanEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [result] = await db.query(
      `
      INSERT INTO users
      (name, email, password_hash)
      VALUES (?, ?, ?)
      `,
      [name.trim(), cleanEmail, passwordHash]
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      user: {
        id: result.insertId,
        name: name.trim(),
        email: cleanEmail,
      },
    });
  } catch (error) {
    console.error("Signup error:", error.message);

    res.status(500).json({
      success: false,
      message: "Something went wrong while creating the account.",
    });
  }
});

// ==========================================
// LOGIN
// ==========================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const [users] = await db.query(
      `
      SELECT id, name, email, password_hash, phone, location
      FROM users
      WHERE email = ?
      `,
      [cleanEmail]
    );

    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      null;

    const userAgent = req.headers["user-agent"] || null;

    if (users.length === 0) {
      await db.query(
        `
        INSERT INTO login_history
        (user_id, status, ip_address, user_agent)
        VALUES (?, ?, ?, ?)
        `,
        [null, "failed", ipAddress, userAgent]
      );

      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const user = users[0];

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      await db.query(
        `
        INSERT INTO login_history
        (user_id, status, ip_address, user_agent)
        VALUES (?, ?, ?, ?)
        `,
        [user.id, "failed", ipAddress, userAgent]
      );

      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    await db.query(
      `
      INSERT INTO login_history
      (user_id, status, ip_address, user_agent)
      VALUES (?, ?, ?, ?)
      `,
      [user.id, "success", ipAddress, userAgent]
    );

    res.json({
      success: true,
      message: "Login successful!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      success: false,
      message: "Something went wrong during login.",
    });
  }
});

// ==========================================
// CHANGE PASSWORD
// ==========================================

app.put("/api/auth/change-password", async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "User ID, current password and new password are required.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long.",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from the current password.",
      });
    }

    // Find user
    const [users] = await db.query(
      `
      SELECT id, password_hash
      FROM users
      WHERE id = ?
      `,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const user = users[0];

    // Verify current password
    const currentPasswordMatches = await bcrypt.compare(
      currentPassword,
      user.password_hash
    );

    if (!currentPasswordMatches) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(
      newPassword,
      12
    );

    // Update database
    await db.query(
      `
      UPDATE users
      SET password_hash = ?
      WHERE id = ?
      `,
      [newPasswordHash, userId]
    );

    res.json({
      success: true,
      message: "Password changed successfully!",
    });
  } catch (error) {
    console.error("Change password error:", error.message);

    res.status(500).json({
      success: false,
      message: "Something went wrong while changing the password.",
    });
  }
});

// ==========================================
// LOGIN HISTORY
// ==========================================

app.get(
  "/api/auth/login-history/:userId",
  async (req, res) => {
    try {
      const userId = Number(req.params.userId);

      if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID.",
        });
      }

      const [history] = await db.query(
        `
        SELECT
          id,
          login_at,
          status,
          ip_address,
          user_agent
        FROM login_history
        WHERE user_id = ?
        ORDER BY login_at DESC
        LIMIT 20
        `,
        [userId]
      );

      res.json({
        success: true,
        history,
      });
    } catch (error) {
      console.error(
        "Login history error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message: "Unable to load login history.",
      });
    }
  }
);
// ==========================================
// GAMES API
// ==========================================

// GET ALL GAMES FOR A USER
app.get("/api/games/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const [games] = await db.query(
      `
      SELECT
        id,
        user_id,
        name,
        description,
        min_players,
        max_players,
        play_time_minutes,
        category,
        status,
        created_at,
        updated_at
      FROM games
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json({
      success: true,
      games,
    });
  } catch (error) {
    console.error("Get games error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to load games.",
    });
  }
});


// ADD NEW GAME
app.post("/api/games", async (req, res) => {
  try {
    const {
      userId,
      name,
      description,
      minPlayers,
      maxPlayers,
      playTimeMinutes,
      category,
      status,
    } = req.body;

    if (!userId || !name) {
      return res.status(400).json({
        success: false,
        message: "User ID and game name are required.",
      });
    }

    const numericUserId = Number(userId);

    if (!Number.isInteger(numericUserId) || numericUserId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const cleanName = String(name).trim();

    if (!cleanName) {
      return res.status(400).json({
        success: false,
        message: "Game name cannot be empty.",
      });
    }

    const min = minPlayers
      ? Number(minPlayers)
      : null;

    const max = maxPlayers
      ? Number(maxPlayers)
      : null;

    const playTime = playTimeMinutes
      ? Number(playTimeMinutes)
      : null;

    if (
      min !== null &&
      (!Number.isInteger(min) || min <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Minimum players must be a positive number.",
      });
    }

    if (
      max !== null &&
      (!Number.isInteger(max) || max <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Maximum players must be a positive number.",
      });
    }

    if (
      min !== null &&
      max !== null &&
      min > max
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Minimum players cannot be greater than maximum players.",
      });
    }

    if (
      playTime !== null &&
      (!Number.isInteger(playTime) || playTime <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Play time must be a positive number.",
      });
    }

    const gameStatus =
      status === "borrowed"
        ? "borrowed"
        : "available";

    const [result] = await db.query(
      `
      INSERT INTO games
      (
        user_id,
        name,
        description,
        min_players,
        max_players,
        play_time_minutes,
        category,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        numericUserId,
        cleanName,
        description?.trim() || null,
        min,
        max,
        playTime,
        category?.trim() || null,
        gameStatus,
      ]
    );

    const [games] = await db.query(
      `
      SELECT
        id,
        user_id,
        name,
        description,
        min_players,
        max_players,
        play_time_minutes,
        category,
        status,
        created_at,
        updated_at
      FROM games
      WHERE id = ?
      `,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Game added successfully!",
      game: games[0],
    });
  } catch (error) {
    console.error("Add game error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to add game.",
    });
  }
});


// UPDATE GAME
app.put("/api/games/:id", async (req, res) => {
  try {
    const gameId = Number(req.params.id);

    const {
      userId,
      name,
      description,
      minPlayers,
      maxPlayers,
      playTimeMinutes,
      category,
      status,
    } = req.body;

    if (!Number.isInteger(gameId) || gameId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid game ID.",
      });
    }

    const numericUserId = Number(userId);

    if (
      !Number.isInteger(numericUserId) ||
      numericUserId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: "Game name is required.",
      });
    }

    const min =
      minPlayers !== undefined &&
      minPlayers !== null &&
      minPlayers !== ""
        ? Number(minPlayers)
        : null;

    const max =
      maxPlayers !== undefined &&
      maxPlayers !== null &&
      maxPlayers !== ""
        ? Number(maxPlayers)
        : null;

    const playTime =
      playTimeMinutes !== undefined &&
      playTimeMinutes !== null &&
      playTimeMinutes !== ""
        ? Number(playTimeMinutes)
        : null;

    if (
      min !== null &&
      (!Number.isInteger(min) || min <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Minimum players must be a positive number.",
      });
    }

    if (
      max !== null &&
      (!Number.isInteger(max) || max <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Maximum players must be a positive number.",
      });
    }

    if (
      min !== null &&
      max !== null &&
      min > max
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Minimum players cannot be greater than maximum players.",
      });
    }

    if (
      playTime !== null &&
      (!Number.isInteger(playTime) || playTime <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Play time must be a positive number.",
      });
    }

    const gameStatus =
      status === "borrowed"
        ? "borrowed"
        : "available";

    const [result] = await db.query(
      `
      UPDATE games
      SET
        name = ?,
        description = ?,
        min_players = ?,
        max_players = ?,
        play_time_minutes = ?,
        category = ?,
        status = ?
      WHERE id = ?
        AND user_id = ?
      `,
      [
        String(name).trim(),
        description?.trim() || null,
        min,
        max,
        playTime,
        category?.trim() || null,
        gameStatus,
        gameId,
        numericUserId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Game not found.",
      });
    }

    const [games] = await db.query(
      `
      SELECT
        id,
        user_id,
        name,
        description,
        min_players,
        max_players,
        play_time_minutes,
        category,
        status,
        created_at,
        updated_at
      FROM games
      WHERE id = ?
        AND user_id = ?
      `,
      [gameId, numericUserId]
    );

    res.json({
      success: true,
      message: "Game updated successfully!",
      game: games[0],
    });
  } catch (error) {
    console.error("Update game error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to update game.",
    });
  }
});


// DELETE GAME
app.delete("/api/games/:id", async (req, res) => {
  try {
    const gameId = Number(req.params.id);
    const userId = Number(req.query.userId);

    if (!Number.isInteger(gameId) || gameId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid game ID.",
      });
    }

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const [result] = await db.query(
      `
      DELETE FROM games
      WHERE id = ?
        AND user_id = ?
      `,
      [gameId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Game not found.",
      });
    }

    res.json({
      success: true,
      message: "Game deleted successfully!",
    });
  } catch (error) {
    console.error("Delete game error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to delete game.",
    });
  }
});


// UPDATE GAME STATUS
app.patch("/api/games/:id/status", async (req, res) => {
  try {
    const gameId = Number(req.params.id);
    const { userId, status } = req.body;

    const numericUserId = Number(userId);

    if (!Number.isInteger(gameId) || gameId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid game ID.",
      });
    }

    if (
      !Number.isInteger(numericUserId) ||
      numericUserId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    if (
      status !== "available" &&
      status !== "borrowed"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Status must be either available or borrowed.",
      });
    }

    const [result] = await db.query(
      `
      UPDATE games
      SET status = ?
      WHERE id = ?
        AND user_id = ?
      `,
      [status, gameId, numericUserId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Game not found.",
      });
    }

    res.json({
      success: true,
      message: "Game status updated successfully!",
      status,
    });
  } catch (error) {
    console.error(
      "Update game status error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Unable to update game status.",
    });
  }
});

// ==========================================
// GAME NIGHT PLANNER
// ==========================================

// GET GAME NIGHTS FOR USER
app.get("/api/game-nights/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const [nights] = await db.query(
      `
      SELECT
        gn.id,
        gn.user_id,
        gn.title,
        gn.event_date,
        gn.start_time,
        gn.location,
        gn.max_players,
        gn.notes,
        gn.status,
        GROUP_CONCAT(
          DISTINCT g.name
          ORDER BY g.name
          SEPARATOR ', '
        ) AS game_names
      FROM game_nights gn
      LEFT JOIN game_night_games gng
        ON gn.id = gng.game_night_id
      LEFT JOIN games g
        ON gng.game_id = g.id
      WHERE gn.user_id = ?
      GROUP BY
        gn.id,
        gn.user_id,
        gn.title,
        gn.event_date,
        gn.start_time,
        gn.location,
        gn.max_players,
        gn.notes,
        gn.status
      ORDER BY gn.event_date ASC, gn.start_time ASC
      `,
      [userId]
    );

    res.json({
      success: true,
      events: nights,
    });
  } catch (error) {
    console.error(
      "Get game nights error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Unable to load game nights.",
    });
  }
});


// CREATE GAME NIGHT
app.post("/api/game-nights", async (req, res) => {
  const connection = await db.getConnection();

  try {
    const {
      userId,
      title,
      gameId,
      eventDate,
      startTime,
      location,
      maxPlayers,
      notes,
    } = req.body;

    if (
      !userId ||
      !title ||
      !gameId ||
      !eventDate ||
      !startTime
    ) {
      return res.status(400).json({
        success: false,
        message:
          "User, title, game, date and time are required.",
      });
    }

    const numericUserId = Number(userId);
    const numericGameId = Number(gameId);
    const numericMaxPlayers = Number(maxPlayers);

    if (
      !Number.isInteger(numericUserId) ||
      numericUserId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    if (
      !Number.isInteger(numericGameId) ||
      numericGameId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid game ID.",
      });
    }

    if (
      !Number.isInteger(numericMaxPlayers) ||
      numericMaxPlayers < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid number of players.",
      });
    }

    // Make sure the selected game belongs to this user
    const [games] = await connection.query(
      `
      SELECT id
      FROM games
      WHERE id = ?
        AND user_id = ?
      `,
      [numericGameId, numericUserId]
    );

    if (games.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Selected game was not found in your collection.",
      });
    }

    await connection.beginTransaction();

    const [result] = await connection.query(
      `
      INSERT INTO game_nights
      (
        user_id,
        title,
        event_date,
        start_time,
        location,
        max_players,
        notes,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 'planned')
      `,
      [
        numericUserId,
        title.trim(),
        eventDate,
        startTime,
        location?.trim() || null,
        numericMaxPlayers,
        notes?.trim() || null,
      ]
    );

    const gameNightId = result.insertId;

    await connection.query(
      `
      INSERT INTO game_night_games
      (
        game_night_id,
        game_id
      )
      VALUES (?, ?)
      `,
      [gameNightId, numericGameId]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Game night created successfully!",
      event: {
        id: gameNightId,
        user_id: numericUserId,
        title: title.trim(),
        event_date: eventDate,
        start_time: startTime,
        location: location?.trim() || null,
        max_players: numericMaxPlayers,
        notes: notes?.trim() || null,
        status: "planned",
      },
    });
  } catch (error) {
    await connection.rollback();

    console.error(
      "Create game night error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Something went wrong while creating the game night.",
    });
  } finally {
    connection.release();
  }
});


// UPDATE GAME NIGHT
app.put("/api/game-nights/:id", async (req, res) => {
  const connection = await db.getConnection();

  try {
    const nightId = Number(req.params.id);

    const {
      userId,
      title,
      gameId,
      eventDate,
      startTime,
      location,
      maxPlayers,
      notes,
      status,
    } = req.body;

    if (
      !Number.isInteger(nightId) ||
      nightId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid game night ID.",
      });
    }

    if (
      !userId ||
      !title ||
      !gameId ||
      !eventDate ||
      !startTime
    ) {
      return res.status(400).json({
        success: false,
        message:
          "User, title, game, date and time are required.",
      });
    }

    const numericUserId = Number(userId);
    const numericGameId = Number(gameId);
    const numericMaxPlayers = Number(maxPlayers);

    if (
      !Number.isInteger(numericUserId) ||
      numericUserId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    if (
      !Number.isInteger(numericGameId) ||
      numericGameId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid game ID.",
      });
    }

    if (
      !Number.isInteger(numericMaxPlayers) ||
      numericMaxPlayers < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid number of players.",
      });
    }

    const allowedStatuses = [
      "planned",
      "completed",
      "cancelled",
    ];

    const cleanStatus = allowedStatuses.includes(status)
      ? status
      : "planned";

    // Check game night belongs to user
    const [existingNights] = await connection.query(
      `
      SELECT id
      FROM game_nights
      WHERE id = ?
        AND user_id = ?
      `,
      [nightId, numericUserId]
    );

    if (existingNights.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Game night not found.",
      });
    }

    // Check game belongs to user
    const [games] = await connection.query(
      `
      SELECT id
      FROM games
      WHERE id = ?
        AND user_id = ?
      `,
      [numericGameId, numericUserId]
    );

    if (games.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Selected game was not found in your collection.",
      });
    }

    await connection.beginTransaction();

    await connection.query(
      `
      UPDATE game_nights
      SET
        title = ?,
        event_date = ?,
        start_time = ?,
        location = ?,
        max_players = ?,
        notes = ?,
        status = ?
      WHERE id = ?
        AND user_id = ?
      `,
      [
        title.trim(),
        eventDate,
        startTime,
        location?.trim() || null,
        numericMaxPlayers,
        notes?.trim() || null,
        cleanStatus,
        nightId,
        numericUserId,
      ]
    );

    // Replace selected game
    await connection.query(
      `
      DELETE FROM game_night_games
      WHERE game_night_id = ?
      `,
      [nightId]
    );

    await connection.query(
      `
      INSERT INTO game_night_games
      (
        game_night_id,
        game_id
      )
      VALUES (?, ?)
      `,
      [nightId, numericGameId]
    );

    await connection.commit();

    res.json({
      success: true,
      message: "Game night updated successfully!",
    });
  } catch (error) {
    await connection.rollback();

    console.error(
      "Update game night error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Something went wrong while updating the game night.",
    });
  } finally {
    connection.release();
  }
});


// DELETE GAME NIGHT
app.delete(
  "/api/game-nights/:id",
  async (req, res) => {
    const connection = await db.getConnection();

    try {
      const nightId = Number(req.params.id);
      const userId = Number(req.query.userId);

      if (
        !Number.isInteger(nightId) ||
        nightId <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid game night ID.",
        });
      }

      if (
        !Number.isInteger(userId) ||
        userId <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID.",
        });
      }

      const [existing] = await connection.query(
        `
        SELECT id
        FROM game_nights
        WHERE id = ?
          AND user_id = ?
        `,
        [nightId, userId]
      );

      if (existing.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Game night not found.",
        });
      }

      await connection.beginTransaction();

      await connection.query(
        `
        DELETE FROM game_night_games
        WHERE game_night_id = ?
        `,
        [nightId]
      );

      await connection.query(
        `
        DELETE FROM game_nights
        WHERE id = ?
          AND user_id = ?
        `,
        [nightId, userId]
      );

      await connection.commit();

      res.json({
        success: true,
        message: "Game night deleted successfully!",
      });
    } catch (error) {
      await connection.rollback();

      console.error(
        "Delete game night error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Something went wrong while deleting the game night.",
      });
    } finally {
      connection.release();
    }
  }
);
// ==========================================
// START SERVER
// ==========================================

const server = app.listen(
  PORT,
  "127.0.0.1",
  () => {
    console.log("");
    console.log(
      "======================================"
    );
    console.log(
      "      BoardNight Backend Started"
    );
    console.log(
      "======================================"
    );
    console.log(`Server: http://localhost:${PORT}`);
    console.log(
      `Database: ${process.env.DB_NAME}`
    );
    console.log(
      "======================================"
    );
    console.log("");
  }
);

server.on("error", (error) => {
  console.error("SERVER ERROR:", error);
});

process.stdin.resume();