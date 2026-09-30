import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import gamesRoutes from './routes/games.routes.js';
import gameNightsRoutes from './routes/gameNights.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Cross-Origin Resource Sharing configuration
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Healthcheck probe endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Domain route mounts
app.use('/api/auth', authRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/game-nights', gameNightsRoutes);

// Catch-all 404 handler for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized error-handling middleware
app.use(errorHandler);

export default app;