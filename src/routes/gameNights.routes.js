import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// Get all planned game nights for a user (with joined game name)
router.get('/:userId', async (req, res, next) => {
  try {
    const targetUserId = parseInt(req.params.userId, 10);
    const effectiveUserId = req.user?.id || targetUserId;

    const query = `
      SELECT 
        gn.id, 
        gn.user_id, 
        gn.game_id, 
        gn.title, 
        gn.event_date, 
        gn.start_time, 
        gn.location, 
        gn.max_players, 
        gn.notes, 
        gn.status,
        g.name AS game_names
      FROM game_nights gn
      LEFT JOIN games g ON gn.game_id = g.id
      WHERE gn.user_id = $1
      ORDER BY gn.event_date ASC, gn.start_time ASC;
    `;
    const result = await pool.query(query, [effectiveUserId]);

    res.json({
      success: true,
      events: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// Create new game night
router.post('/', async (req, res, next) => {
  try {
    const { title, gameId, eventDate, startTime, location, maxPlayers, notes, status } = req.body;
    const userId = req.user?.id || req.body.userId;

    if (!userId || !title || !title.trim() || !eventDate || !startTime) {
      return res.status(400).json({ success: false, message: 'Missing required event fields (title, date, start time).' });
    }

    const players = parseInt(maxPlayers, 10) || 2;

    const result = await pool.query(
      `INSERT INTO game_nights (user_id, title, game_id, event_date, start_time, location, max_players, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [userId, title.trim(), gameId ? parseInt(gameId, 10) : null, eventDate, startTime, location?.trim() || null, players, notes?.trim() || null, status || 'planned']
    );

    res.status(201).json({
      success: true,
      event: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Update game night
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, gameId, eventDate, startTime, location, maxPlayers, notes, status } = req.body;
    const userId = req.user?.id || req.body.userId;

    if (!title || !title.trim() || !eventDate || !startTime) {
      return res.status(400).json({ success: false, message: 'Missing required event fields (title, date, start time).' });
    }

    const players = parseInt(maxPlayers, 10) || 2;

    const result = await pool.query(
      `UPDATE game_nights
       SET title = $1, game_id = $2, event_date = $3, start_time = $4, location = $5, max_players = $6, notes = $7, status = $8
       WHERE id = $9 AND user_id = $10
       RETURNING *`,
      [title.trim(), gameId ? parseInt(gameId, 10) : null, eventDate, startTime, location?.trim() || null, players, notes?.trim() || null, status || 'planned', id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Event not found or unauthorized.' });
    }

    res.json({
      success: true,
      event: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Delete game night
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.query.userId;

    const result = await pool.query('DELETE FROM game_nights WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Event not found or unauthorized.' });
    }

    res.json({
      success: true,
      message: 'Game night deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
});


export default router;