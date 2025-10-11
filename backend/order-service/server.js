const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const config = require("./config");

const app = express();
const serviceConfig = config.service;
const dbConfig = config.database;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection(dbConfig);

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log(`Connected to MySQL database: ${dbConfig.database}`);
  }
});

// Routes
app.get("/", (req, res) => {
  res.json({
    message: `${serviceConfig.name} is running`,
    port: serviceConfig.port,
    baseUrl: serviceConfig.baseUrl,
  });
});

app.get("/api/orders", (req, res) => {
  db.query("SELECT * FROM orders", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

app.post("/api/orders", (req, res) => {
  const { user_id, product_id, quantity, total_amount } = req.body;
  db.query(
    "INSERT INTO orders (user_id, product_id, quantity, total_amount) VALUES (?, ?, ?, ?)",
    [user_id, product_id, quantity, total_amount],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({
          id: result.insertId,
          user_id,
          product_id,
          quantity,
          total_amount,
        });
      }
    }
  );
});

app.listen(serviceConfig.port, () => {
  console.log(`${serviceConfig.name} running on port ${serviceConfig.port}`);
  console.log(`Base URL: ${serviceConfig.baseUrl}`);
});
