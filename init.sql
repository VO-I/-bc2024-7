-- init.sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE devices (
    serial_number VARCHAR(255) PRIMARY KEY,
    device_name VARCHAR(255) NOT NULL,
    taken_by_user_id INTEGER REFERENCES users(id) DEFAULT NULL
);

-- Додаємо користувача за замовчуванням
INSERT INTO users (user_name) VALUES ('admin');
