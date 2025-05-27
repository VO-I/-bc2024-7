require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Створення пула зʼєднань до БД
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware для парсингу JSON
app.use(express.json());

/**
 * POST /register
 * Реєстрація нового пристрою
 */
app.post('/register', async (req, res) => {
  const { device_name, serial_number } = req.body;

  if (!device_name || !serial_number) {
    return res.status(400).json({ error: 'Device name and serial number are required.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO devices (device_name, serial_number) VALUES ($1, $2) RETURNING *',
      [device_name, serial_number]
    );
    res.status(200).json({ message: 'Device registered successfully', device: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Device with this serial number already exists.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * GET /devices
 * Повертає список усіх пристроїв
 */
app.get('/devices', async (req, res) => {
  try {
    const result = await pool.query('SELECT device_name, serial_number FROM devices');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
