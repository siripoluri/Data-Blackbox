// server/index.ts
import express, { RequestHandler } from "express";
import cors from "cors";
import Database from "better-sqlite3";

const app = express();

// 1) CORS + Private Network Access middleware
const pnaCors: RequestHandler = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Private-Network", "true");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.sendStatus(204);
    return; // void
  }
  next();
};

// 2) Global middleware
app.use(cors());
app.use(express.json());
app.use(pnaCors);

// 3) Initialize SQLite & ensure table exists
const db = new Database("data.db");
db.prepare(`
  CREATE TABLE IF NOT EXISTS domains (
    domain TEXT PRIMARY KEY,
    firstParty INTEGER,
    count INTEGER
  )
`).run();

// 4) Upsert statement
const upsert = db.prepare(`
  INSERT INTO domains (domain, firstParty, count)
  VALUES (?, ?, 1)
  ON CONFLICT(domain) DO UPDATE SET count = count + 1
`);

// 5) POST /event handler – records one domain hit
const recordEvent: RequestHandler = (req, res) => {
  const { domain, firstParty } = req.body;
  if (!domain) {
    res.status(400).json({ error: "domain required" });
    return; // void
  }
  upsert.run(domain, firstParty ? 1 : 0);
  res.json({ success: true });
};

// 6) GET /domains handler – returns all stored domains
const fetchDomains: RequestHandler = (_req, res) => {
  const rows = db.prepare("SELECT * FROM domains").all();
  res.json(rows);
};

// 7) Mount routes
app.post("/event", recordEvent);
app.get("/domains", fetchDomains);

// 8) Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`→ Server running at http://localhost:${PORT}`);
});
