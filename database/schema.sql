CREATE DATABASE IF NOT EXISTS boardnight CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE boardnight;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(40) NULL,
  location VARCHAR(120) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS login_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('success','failed') NOT NULL,
  ip_address VARCHAR(64) NULL,
  user_agent TEXT NULL,
  INDEX idx_login_user_time(user_id, login_at),
  CONSTRAINT fk_login_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(160) NOT NULL,
  description TEXT NULL,
  min_players INT NULL,
  max_players INT NULL,
  play_time_minutes INT NULL,
  category VARCHAR(80) NULL,
  status ENUM('available','borrowed') NOT NULL DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_games_user(user_id),
  CONSTRAINT fk_games_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS game_nights (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(160) NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  location VARCHAR(180) NULL,
  max_players INT DEFAULT 4,
  notes TEXT NULL,
  status ENUM('planned','completed','cancelled') NOT NULL DEFAULT 'planned',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_nights_user_date(user_id,event_date),
  CONSTRAINT fk_nights_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS game_night_games (
  game_night_id INT NOT NULL,
  game_id INT NOT NULL,
  PRIMARY KEY(game_night_id,game_id),
  CONSTRAINT fk_gng_night FOREIGN KEY(game_night_id) REFERENCES game_nights(id) ON DELETE CASCADE,
  CONSTRAINT fk_gng_game FOREIGN KEY(game_id) REFERENCES games(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS communities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT NULL,
  favourite_game VARCHAR(100) NULL,
  rules TEXT NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_communities_creator FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS community_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  community_id INT NOT NULL,
  user_id INT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_community_member (community_id, user_id),
  CONSTRAINT fk_cm_community FOREIGN KEY(community_id) REFERENCES communities(id) ON DELETE CASCADE,
  CONSTRAINT fk_cm_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS community_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  community_id INT NOT NULL,
  user_id INT NOT NULL,
  message VARCHAR(500) NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_community_messages (community_id, sent_at),
  CONSTRAINT fk_cmsg_community FOREIGN KEY(community_id) REFERENCES communities(id) ON DELETE CASCADE,
  CONSTRAINT fk_cmsg_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
