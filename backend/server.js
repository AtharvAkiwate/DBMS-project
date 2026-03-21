const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// 🔴 IMPORTANT: CHANGE PASSWORD
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root", // <-- your MySQL password
  database: "college_election"
});

// CONNECT DATABASE
db.connect(err => {
  if (err) {
    console.log("DB ERROR:", err);
  } else {
    console.log("MySQL Connected!");
  }
});

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// ==============================
// REGISTER CANDIDATE (ADD HERE)
// ==============================
app.post("/register", (req, res) => {
  const c = req.body;

  const sql = `INSERT INTO candidates 
  (name, branch, year, candidate_id, symbol, image, description)
  VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [
    c.name, c.branch, c.year,
    c.cid, c.symbol, c.image, c.desc
  ], (err) => {
    if (err) {
      console.log(err);
      return res.send("Error occurred");
    }
    res.send("Candidate Registered Successfully!");
  });
});

// GET ALL CANDIDATES
// 1. Get ALL candidates for the Campaign page
app.get("/candidates", (req, res) => {
  const sql = "SELECT * FROM candidates";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 2. Get ONE specific candidate for the Details page
app.get("/candidate/:id", (req, res) => {
  const sql = "SELECT * FROM candidates WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result[0]); // Returns only the object, not an array
  });
});

// START SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000");
});