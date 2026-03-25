
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

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
  app.use(express.json({ limit: "10mb" }));
  const c = req.body;

  const sql = `
  INSERT INTO candidates 
  (name, branch, year, candidate_id, symbol, image, description, campaign_media)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

  db.query(sql, [
  c.name,
  c.branch,
  c.year,
  c.cid,
  c.symbol,
  c.image,
  c.desc,
  c.media || null
], (err) => {

    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.send("Candidate already registered!");
      }
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

// ==============================
// VOTING SYSTEM
// ==============================

app.post("/vote", (req, res) => {
  const { name, student_id, candidate_id } = req.body;

  if (!name || !student_id || !candidate_id) {
    return res.send("Missing fields");
  }

  // Check if already voted
  const checkSql = "SELECT * FROM voters WHERE student_id = ?";
  
  db.query(checkSql, [student_id], (err, result) => {
    if (err) {
      console.log(err);
      return res.send("Server error");
    }

    if (result.length > 0) {
      return res.send("You have already voted!");
    }

    // Insert vote
    const insertSql = `
      INSERT INTO voters (name, student_id, voted_for)
      VALUES (?, ?, ?)
    `;

    db.query(insertSql, [name, student_id, candidate_id], (err) => {
      if (err) {
        console.log(err);
        return res.send("Vote failed");
      }

      res.send("Vote recorded successfully!");
    });
  });
});

// ==============================
// GET RESULTS (VOTES COUNT)
// ==============================

app.get("/results", (req, res) => {
  const sql = `
    SELECT c.id, c.name, COUNT(v.id) AS votes
    FROM candidates c
    LEFT JOIN voters v ON c.id = v.voted_for
    GROUP BY c.id
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }
    res.json(result);
  });
});

// ==============================
// CHECK IF VOTER ALREADY VOTED
// ==============================

app.get("/check-voter/:id", (req, res) => {
  const studentId = req.params.id;

  const sql = "SELECT * FROM voters WHERE student_id = ?";

  db.query(sql, [studentId], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ exists: false });
    }

    res.json({ exists: result.length > 0 });
  });
});

// START SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
