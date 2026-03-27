# DBMS-project
This repository was created to collaborate between team members for creation of  DBMS subject
# College Election System

## Setup Instructions

### 1. Clone the repository
git clone <your-repo-link>

### 2. Open project
cd <project-folder>

### 3. Install dependencies
npm install

### 4. Start server
node server.js

### 5. Open website
Open index.html in browser

---

## Database Setup

1. Open MySQL Workbench
2. Create database (e.g., election_db)
3. Run required tables:

### Candidates Table
CREATE TABLE candidates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  branch VARCHAR(50),
  year VARCHAR(10),
  candidate_id VARCHAR(50),
  symbol LONGTEXT,
  image LONGTEXT,
  description TEXT,
  votes INT,
  campaign_media LONGTEXT
);

### Voters Table
CREATE TABLE voters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  student_id VARCHAR(50),
  voted_for INT
);

---

## Notes
- Make sure MySQL is running
- Update DB credentials in server.js
