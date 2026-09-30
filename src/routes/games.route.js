import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// Get all games for a specific user
router.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT id, user_id, name, description, min_players, max_players, play_time_minutes, category, status FROM games WHERE user_id = $1 ORDER BY id DESC',
      [userId]
    );

    res.json({
      success: true,
      games: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// Add new game
router.post('/', async (req, res, next) => {
  try {
    const { userId, name, description, minPlayers, maxPlayers, playTimeMinutes, category, status } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ success: false, message: 'User ID and Game Name are required.' });
    }

    const result = await pool.query(
      `INSERT INTO games (user_id, name, description, min_players, max_players, play_time_minutes, category, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, user_id, name, description, min_players, max_players, play_time_minutes, category, status`,
      [userId, name, description || null, minPlayers || 1, maxPlayers || 4, playTimeMinutes || 30, category || null, status || 'available']
    );

    res.status(201).json({
      success: true,
      game: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Update game
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, name, description, minPlayers, maxPlayers, playTimeMinutes, category, status } = req.body;

    const result = await pool.query(
      `UPDATE games 
       SET name = $1, description = $2, min_players = $3, max_players = $4, play_time_minutes = $5, category = $6, status = $7
       WHERE id = $8 AND user_id = $9
       RETURNING id, user_id, name, description, min_players, max_players, play_time_minutes, category, status`,
      [name, description || null, minPlayers, maxPlayers, playTimeMinutes, category || null, status || 'available', id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Game not found or unauthorized.' });
    }

    res.json({
      success: true,
      game: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Delete game
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const result = await pool.query('DELETE FROM games WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Game not found or unauthorized.' });
    }

    res.json({
      success: true,
      message: 'Game deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
});

export default router;