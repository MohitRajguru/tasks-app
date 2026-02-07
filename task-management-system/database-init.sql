-- Task Management System Database Initialization Script

-- Create database
CREATE DATABASE IF NOT EXISTS task_management_db 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE task_management_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    assigned_to_id BIGINT,
    created_by_id BIGINT NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    due_date DATE,
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_assigned_to (assigned_to_id),
    INDEX idx_created_by (created_by_id),
    INDEX idx_due_date (due_date),
    FOREIGN KEY (assigned_to_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data (optional - uncomment to use)
-- Note: Password is BCrypt hash of 'password123'

-- INSERT INTO users (username, email, password, full_name) VALUES
-- ('admin', 'admin@example.com', '$2a$10$xqJ4qF2s/fD3p6w5zKxHr.x7tWKGCEKGBCKh5gRWD5JZLXP9yOx2K', 'System Administrator'),
-- ('john_doe', 'john@example.com', '$2a$10$xqJ4qF2s/fD3p6w5zKxHr.x7tWKGCEKGBCKh5gRWD5JZLXP9yOx2K', 'John Doe'),
-- ('jane_smith', 'jane@example.com', '$2a$10$xqJ4qF2s/fD3p6w5zKxHr.x7tWKGCEKGBCKh5gRWD5JZLXP9yOx2K', 'Jane Smith');

-- Sample tasks
-- INSERT INTO tasks (title, description, status, priority, created_by_id, assigned_to_id, due_date) VALUES
-- ('Setup Development Environment', 'Install and configure all necessary tools', 'COMPLETED', 'HIGH', 1, 2, '2026-02-01'),
-- ('Review API Documentation', 'Review and update REST API documentation', 'IN_PROGRESS', 'MEDIUM', 1, 2, '2026-02-10'),
-- ('Fix Login Bug', 'Users unable to login with special characters', 'NEW', 'CRITICAL', 2, 3, '2026-02-08'),
-- ('Database Performance Optimization', 'Optimize slow queries in task module', 'NEW', 'HIGH', 1, NULL, '2026-02-15');

-- Verify tables
SHOW TABLES;

-- Display table structures
DESCRIBE users;
DESCRIBE tasks;
