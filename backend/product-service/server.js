const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const config = require("../config");

const app = express();
const serviceConfig = config.getServiceConfig("product");
const dbConfig = config.getDatabaseConfig("product");

// Middleware
app.use(cors(config.cors));
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

app.get("/api/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

app.post("/api/products", (req, res) => {
  const { name, price, description } = req.body;
  db.query(
    "INSERT INTO products (name, price, description) VALUES (?, ?, ?)",
    [name, price, description],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: result.insertId, name, price, description });
      }
    }
  );
});

app.listen(serviceConfig.port, () => {
  console.log(`${serviceConfig.name} running on port ${serviceConfig.port}`);
  console.log(`Base URL: ${serviceConfig.baseUrl}`);
});
