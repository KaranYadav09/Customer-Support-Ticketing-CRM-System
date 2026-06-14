const express = require('express');
const cors = require('cors');
const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Database setup ---
const dbPath = process.env.DB_PATH || path.join(__dirname, 'tickets.db');
const db = new DatabaseSync(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open',
  priority TEXT NOT NULL DEFAULT 'Medium',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id TEXT NOT NULL,
  note_text TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id)
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL
);
`);

// Migration
try {
  db.exec(`ALTER TABLE tickets ADD COLUMN priority TEXT NOT NULL DEFAULT 'Medium'`);
} catch (e) {

}

// Seed default user if not exists
try {
  const hasUser = db.prepare(`SELECT count(*) as count FROM users WHERE email = 'karan@gmail.com'`).get();
  if (hasUser.count === 0) {
    db.prepare(`INSERT INTO users (email, password, name) VALUES ('karan@gmail.com', 'password123', 'Karan Yadav')`).run();
  }
} catch (e) {

}

//  generate ticket id 
function generateTicketId() {
  const row = db.prepare(`SELECT ticket_id FROM tickets ORDER BY id DESC LIMIT 1`).get();
  let nextNum = 1;
  if (row && row.ticket_id) {
    const match = row.ticket_id.match(/(\d+)$/);
    if (match) nextNum = parseInt(match[1], 10) + 1;
  }
  return `TKT-${String(nextNum).padStart(3, '0')}`;
}

// Health check 
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// POST /api/tickets 
app.post('/api/tickets', (req, res) => {
  const { customer_name, customer_email, subject, description, priority } = req.body;

  if (!customer_name || !customer_email || !subject || !description) {
    return res.status(400).json({ error: 'customer_name, customer_email, subject, and description are required' });
  }

  const ticket_id = generateTicketId();
  const now = new Date().toISOString();
  const tktPriority = priority || 'Medium';

  db.prepare(`
    INSERT INTO tickets (ticket_id, customer_name, customer_email, subject, description, status, priority, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 'Open', ?, ?, ?)
  `).run(ticket_id, customer_name, customer_email, subject, description, tktPriority, now, now);

  res.status(201).json({ ticket_id, created_at: now, priority: tktPriority });
});

//  GET /api/tickets 
app.get('/api/tickets', (req, res) => {
  const { status, search } = req.query;

  let query = `SELECT ticket_id, customer_name, customer_email, subject, status, priority, created_at FROM tickets WHERE 1=1`;
  const params = [];

  if (status) {
    query += ` AND status = ?`;
    params.push(status);
  }

  if (search) {
    query += ` AND (
      ticket_id LIKE ? OR
      customer_name LIKE ? OR
      customer_email LIKE ? OR
      subject LIKE ? OR
      description LIKE ?
    )`;
    const term = `%${search}%`;
    params.push(term, term, term, term, term);
  }

  query += ` ORDER BY created_at DESC`;

  const rows = db.prepare(query).all(...params);

  const result = rows.map(r => ({
    ticket_id: r.ticket_id,
    customer_name: r.customer_name,
    customer_email: r.customer_email,
    subject: r.subject,
    status: r.status,
    priority: r.priority || 'Medium',
    created_at: r.created_at
  }));

  res.json(result);
});

// GET /api/tickets/:ticket_id 
app.get('/api/tickets/:ticket_id', (req, res) => {
  const { ticket_id } = req.params;

  const ticket = db.prepare(`SELECT * FROM tickets WHERE ticket_id = ?`).get(ticket_id);
  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  const notes = db.prepare(`SELECT id, note_text, created_at FROM notes WHERE ticket_id = ? ORDER BY created_at ASC`).all(ticket_id);

  res.json({
    ticket_id: ticket.ticket_id,
    customer_name: ticket.customer_name,
    customer_email: ticket.customer_email,
    subject: ticket.subject,
    description: ticket.description,
    status: ticket.status,
    priority: ticket.priority || 'Medium',
    created_at: ticket.created_at,
    updated_at: ticket.updated_at,
    notes
  });
});

// PUT /api/tickets/:ticket_id 
app.put('/api/tickets/:ticket_id', (req, res) => {
  const { ticket_id } = req.params;
  const { status, priority, notes } = req.body;

  const ticket = db.prepare(`SELECT * FROM tickets WHERE ticket_id = ?`).get(ticket_id);
  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  const validStatuses = ['Open', 'In Progress', 'Closed'];
  const validPriorities = ['Low', 'Medium', 'High'];
  const now = new Date().toISOString();

  if (status) {
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` });
    }
    db.prepare(`UPDATE tickets SET status = ?, updated_at = ? WHERE ticket_id = ?`).run(status, now, ticket_id);
  }

  if (priority) {
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ error: `priority must be one of: ${validPriorities.join(', ')}` });
    }
    db.prepare(`UPDATE tickets SET priority = ?, updated_at = ? WHERE ticket_id = ?`).run(priority, now, ticket_id);
  }

  if (!status && !priority) {
    db.prepare(`UPDATE tickets SET updated_at = ? WHERE ticket_id = ?`).run(now, ticket_id);
  }

  if (notes && notes.trim()) {
    db.prepare(`INSERT INTO notes (ticket_id, note_text, created_at) VALUES (?, ?, ?)`).run(ticket_id, notes.trim(), now);
  }

  res.json({ success: true, updated_at: now });
});

// --- Authentication Endpoints ---
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }
  try {
    db.prepare(`INSERT INTO users (email, password, name) VALUES (?, ?, ?)`).run(email, password, name);
    res.status(201).json({ success: true });
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const user = db.prepare(`SELECT id, email, password, name FROM users WHERE email = ?`).get(email);
    if (!user || user.password !== password) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    res.json({ token: 'mock-jwt-token-12345', user: { email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
