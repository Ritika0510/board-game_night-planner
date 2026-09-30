-- Seed default demo user (password is: 'password123')
INSERT INTO users (id, name, email, password, phone, location)
VALUES (
    1,
    'Faisal',
    'faisal@example.com',
    '$2b$10$wN9iL6U6d0sCg1aGZkRz3u6a1KSm7wUfNcm4wN7Xz0uP1S0a7xT2O',
    '+91 9876543210',
    'Ludhiana, Punjab'
) ON CONFLICT (id) DO NOTHING;

-- Seed default games
INSERT INTO games (id, user_id, name, description, min_players, max_players, play_time_minutes, category, status)
VALUES 
    (1, 1, 'Catan', 'Trade, build, and settle the island of Catan.', 3, 4, 90, 'Strategy', 'available'),
    (2, 1, 'Exploding Kittens', 'A card game for people into kittens and explosions.', 2, 5, 15, 'Card Game', 'available'),
    (3, 1, 'Carcassonne', 'Tile-placement game building medieval fortifications.', 2, 5, 45, 'Strategy', 'borrowed')
ON CONFLICT (id) DO NOTHING;

-- Seed default game night
INSERT INTO game_nights (id, user_id, game_id, title, event_date, start_time, location, max_players, notes, status)
VALUES 
    (1, 1, 1, 'Friday Game Night', '2026-10-02', '19:00:00', 'Common Room', 8, 'Bring snacks!', 'planned')
ON CONFLICT (id) DO NOTHING;

-- Reset sequence IDs
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('games_id_seq', (SELECT MAX(id) FROM games));
SELECT setval('game_nights_id_seq', (SELECT MAX(id) FROM game_nights));