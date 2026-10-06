import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const { Pool } = pg;

// Mock in-memory storage for offline / zero-setup mode
const memoryStore = {
  users: [
    {
      id: 1,
      name: 'Faisal',
      email: 'faisal@example.com',
      password: await bcrypt.hash('password123', 10),
      phone: '+91 9876543210',
      location: 'Ludhiana, Punjab',
      created_at: new Date().toISOString()
    }
  ],
  games: [
    {
      id: 1,
      user_id: 1,
      name: 'Catan',
      description: 'Trade, build, and settle the island of Catan.',
      min_players: 3,
      max_players: 4,
      play_time_minutes: 90,
      category: 'Strategy',
      status: 'available',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      user_id: 1,
      name: 'Exploding Kittens',
      description: 'A card game for people into kittens and explosions.',
      min_players: 2,
      max_players: 5,
      play_time_minutes: 15,
      category: 'Card Game',
      status: 'available',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      user_id: 1,
      name: 'Carcassonne',
      description: 'Tile-placement game building medieval fortifications.',
      min_players: 2,
      max_players: 5,
      play_time_minutes: 45,
      category: 'Strategy',
      status: 'borrowed',
      created_at: new Date().toISOString()
    }
  ],
  game_nights: [
    {
      id: 1,
      user_id: 1,
      game_id: 1,
      title: 'Friday Game Night',
      event_date: '2026-10-02',
      start_time: '19:00:00',
      location: 'Common Room',
      max_players: 8,
      notes: 'Bring snacks!',
      status: 'planned',
      created_at: new Date().toISOString()
    }
  ],
  login_history: []
};

let pgConnected = false;
let pgClientPool = null;

try {
  pgClientPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'boardnight_db',
    connectionTimeoutMillis: 2000,
  });

  pgClientPool.on('error', () => {
    // Suppress unhandled pool errors when falling back
    pgConnected = false;
  });

  // Test connection
  const client = await pgClientPool.connect().catch(() => null);
  if (client) {
    pgConnected = true;
    client.release();
    console.log('✓ Connected to PostgreSQL database.');
  } else {
    console.warn('⚠️ PostgreSQL connection failed. Operating in Resilient Mock DB mode.');
  }
} catch {
  console.warn('⚠️ Operating in Resilient Mock DB mode.');
}

// Emulate Postgres query interface over in-memory store
function runMemoryQuery(text, params = []) {
  const sql = text.trim();

  // 1. SELECT users BY email
  if (/SELECT .* FROM users WHERE email\s*=\s*\$1/i.test(sql)) {
    const email = String(params[0]).toLowerCase();
    const found = memoryStore.users.filter((u) => u.email.toLowerCase() === email);
    return { rows: found, rowCount: found.length };
  }

  // 2. INSERT INTO users
  if (/INSERT INTO users/i.test(sql)) {
    const [name, email, password] = params;
    const newId = memoryStore.users.length > 0 ? Math.max(...memoryStore.users.map((u) => u.id)) + 1 : 1;
    const newUser = {
      id: newId,
      name,
      email: email.toLowerCase(),
      password,
      phone: '',
      location: '',
      created_at: new Date().toISOString()
    };
    memoryStore.users.push(newUser);
    return { rows: [{ id: newId, name, email: newUser.email, phone: '', location: '' }], rowCount: 1 };
  }

  // 3. SELECT user by id
  if (/SELECT password FROM users WHERE id\s*=\s*\$1/i.test(sql)) {
    const userId = parseInt(params[0], 10);
    const found = memoryStore.users.filter((u) => u.id === userId);
    return { rows: found, rowCount: found.length };
  }

  // 4. UPDATE password
  if (/UPDATE users SET password\s*=\s*\$1 WHERE id\s*=\s*\$2/i.test(sql)) {
    const [password, userId] = params;
    const user = memoryStore.users.find((u) => u.id === parseInt(userId, 10));
    if (user) user.password = password;
    return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
  }

  // 5. INSERT login_history
  if (/INSERT INTO login_history/i.test(sql)) {
    const [userId, status, ip, ua] = params;
    const newHistory = {
      id: memoryStore.login_history.length + 1,
      user_id: userId,
      status,
      ip_address: ip,
      user_agent: ua,
      login_at: new Date().toISOString()
    };
    memoryStore.login_history.push(newHistory);
    return { rows: [newHistory], rowCount: 1 };
  }

  // 6. SELECT login_history
  if (/SELECT .* FROM login_history WHERE user_id\s*=\s*\$1/i.test(sql)) {
    const userId = parseInt(params[0], 10);
    const history = memoryStore.login_history
      .filter((h) => h.user_id === userId)
      .sort((a, b) => new Date(b.login_at) - new Date(a.login_at))
      .slice(0, 20);
    return { rows: history, rowCount: history.length };
  }

  // 7. SELECT games
  if (/SELECT .* FROM games WHERE user_id\s*=\s*\$1/i.test(sql)) {
    const userId = parseInt(params[0], 10);
    const found = memoryStore.games.filter((g) => g.user_id === userId);
    return { rows: found, rowCount: found.length };
  }

  // 8. INSERT game
  if (/INSERT INTO games/i.test(sql)) {
    const [userId, name, description, minPlayers, maxPlayers, playTimeMinutes, category, status] = params;
    const newId = memoryStore.games.length > 0 ? Math.max(...memoryStore.games.map((g) => g.id)) + 1 : 1;
    const newGame = {
      id: newId,
      user_id: parseInt(userId, 10),
      name,
      description,
      min_players: minPlayers,
      max_players: maxPlayers,
      play_time_minutes: playTimeMinutes,
      category,
      status,
      created_at: new Date().toISOString()
    };
    memoryStore.games.unshift(newGame);
    return { rows: [newGame], rowCount: 1 };
  }

  // 9. UPDATE game
  if (/UPDATE games/i.test(sql)) {
    const [name, description, minPlayers, maxPlayers, playTimeMinutes, category, status, id, userId] = params;
    const g = memoryStore.games.find((x) => x.id === parseInt(id, 10) && x.user_id === parseInt(userId, 10));
    if (g) {
      g.name = name;
      g.description = description;
      g.min_players = minPlayers;
      g.max_players = maxPlayers;
      g.play_time_minutes = playTimeMinutes;
      g.category = category;
      g.status = status;
      return { rows: [g], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // 10. DELETE game
  if (/DELETE FROM games WHERE id\s*=\s*\$1 AND user_id\s*=\s*\$2/i.test(sql)) {
    const [id, userId] = params;
    const idx = memoryStore.games.findIndex((x) => x.id === parseInt(id, 10) && x.user_id === parseInt(userId, 10));
    if (idx !== -1) {
      const deleted = memoryStore.games.splice(idx, 1);
      return { rows: deleted, rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // 11. SELECT game_nights
  if (/SELECT .* FROM game_nights gn/i.test(sql)) {
    const userId = parseInt(params[0], 10);
    const events = memoryStore.game_nights
      .filter((gn) => gn.user_id === userId)
      .map((gn) => {
        const game = memoryStore.games.find((g) => g.id === gn.game_id);
        return {
          ...gn,
          game_names: game ? game.name : null
        };
      });
    return { rows: events, rowCount: events.length };
  }

  // 12. INSERT game_nights
  if (/INSERT INTO game_nights/i.test(sql)) {
    const [userId, title, gameId, eventDate, startTime, location, maxPlayers, notes, status] = params;
    const newId = memoryStore.game_nights.length > 0 ? Math.max(...memoryStore.game_nights.map((n) => n.id)) + 1 : 1;
    const newEvent = {
      id: newId,
      user_id: parseInt(userId, 10),
      title,
      game_id: gameId,
      event_date: eventDate,
      start_time: startTime,
      location,
      max_players: maxPlayers,
      notes,
      status,
      created_at: new Date().toISOString()
    };
    memoryStore.game_nights.push(newEvent);
    return { rows: [newEvent], rowCount: 1 };
  }

  // 13. UPDATE game_nights
  if (/UPDATE game_nights/i.test(sql)) {
    const [title, gameId, eventDate, startTime, location, maxPlayers, notes, status, id, userId] = params;
    const ev = memoryStore.game_nights.find((x) => x.id === parseInt(id, 10) && x.user_id === parseInt(userId, 10));
    if (ev) {
      ev.title = title;
      ev.game_id = gameId;
      ev.event_date = eventDate;
      ev.start_time = startTime;
      ev.location = location;
      ev.max_players = maxPlayers;
      ev.notes = notes;
      ev.status = status;
      return { rows: [ev], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // 14. DELETE game_nights
  if (/DELETE FROM game_nights/i.test(sql)) {
    const [id, userId] = params;
    const idx = memoryStore.game_nights.findIndex((x) => x.id === parseInt(id, 10) && x.user_id === parseInt(userId, 10));
    if (idx !== -1) {
      const deleted = memoryStore.game_nights.splice(idx, 1);
      return { rows: deleted, rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  return { rows: [], rowCount: 0 };
}

export const pool = {
  query: async (text, params) => {
    if (pgConnected && pgClientPool) {
      try {
        return await pgClientPool.query(text, params);
      } catch (err) {
        console.warn('Postgres query error, falling back to memory store:', err.message);
        return runMemoryQuery(text, params);
      }
    }
    return runMemoryQuery(text, params);
  }
};