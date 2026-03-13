const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 5000;
const db = new sqlite3.Database(path.join(__dirname, 'bookings.db'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    service TEXT NOT NULL,
    date TEXT,
    address TEXT,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);
});

function saveBooking(req, res) {
  const payload = req.body || {};
  const name = String(payload.name || '').trim();
  const phone = String(payload.phone || '').trim();
  const service = String(payload.service || '').trim();
  const date = String(payload.pref_date || payload.date || '').trim();
  const address = String(payload.address || '').trim();
  const notes = String(payload.notes || '').trim();

  if (!name || !phone || !service) {
    return res.status(400).json({ error: 'name, phone, and service are required' });
  }

  db.run(
    'INSERT INTO bookings(name, phone, service, date, address, notes) VALUES(?,?,?,?,?,?)',
    [name, phone, service, date, address, notes],
    function (error) {
      if (error) {
        console.error('Failed to save booking', error);
        return res.status(500).json({ error: 'failed to save booking' });
      }

      res.status(201).json({ ok: true, bookingId: this.lastID });
    }
  );
}

app.post('/api/book', saveBooking);
app.post('/book', saveBooking);

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`SolarCare server running on port ${port}`);
});
