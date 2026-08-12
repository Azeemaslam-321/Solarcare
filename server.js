const fs = require('fs');
const path = require('path');
const express = require('express');

loadLocalEnv();

let packageVersion = '1.0.1';
try {
  const pkg = require('./package.json');
  if (pkg && pkg.version) packageVersion = pkg.version;
} catch (e) {}

const APP_VERSION = process.env.APP_VERSION || packageVersion;

const app = express();
const port = process.env.PORT || 5000;
const useMySql = Boolean(
  process.env.DB_HOST &&
  process.env.DB_NAME &&
  process.env.DB_USER &&
  process.env.DB_PASSWORD
);
let sqliteDb = null;
let mysqlPool = null;
let activeDatabase = useMySql ? 'mysql' : 'sqlite';
const memoryStore = {
  bookings: [],
  contact_messages: []
};
let memoryIdCounter = 1;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Production Application Version Endpoint (Safely exposes version only, no secrets)
app.get('/api/version', (_req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.set('Pragma', 'no-cache');
  res.json({ version: APP_VERSION });
});

// Express Static middleware with production Cache-Control strategy
const staticOptions = {
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.html') {
      // HTML documents must be revalidated so browsers/CDNs pick up new versions immediately
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
    } else if (['.css', '.js'].includes(ext)) {
      // Versioned CSS and JS are safe to cache with revalidation
      res.setHeader('Cache-Control', 'public, max-age=86400, must-revalidate');
    } else if (['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp', '.ico', '.mp4', '.woff', '.woff2', '.ttf'].includes(ext)) {
      // Media, images, fonts stay cached long-term
      res.setHeader('Cache-Control', 'public, max-age=2592000');
    }
  }
};

app.use(express.static(__dirname, staticOptions));

app.get('/sitemap.xml', (_req, res) => {
  res.type('application/xml');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.sendFile(path.join(__dirname, 'sitemap.xml'));
});

app.get('/robots.txt', (_req, res) => {
  res.type('text/plain');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.sendFile(path.join(__dirname, 'robots.txt'));
});

function loadLocalEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.trim().startsWith('#')) continue;
    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) continue;
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  }
}

async function initializeDatabase() {
  if (useMySql) {
    try {
      const mysql = require('mysql2/promise');
      mysqlPool = mysql.createPool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 10000
      });

      await mysqlPool.query(`CREATE TABLE IF NOT EXISTS bookings (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        service VARCHAR(255) NOT NULL,
        date VARCHAR(100),
        address TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      await mysqlPool.query(`CREATE TABLE IF NOT EXISTS contact_messages (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      activeDatabase = 'mysql';
      return;
    } catch (error) {
      console.error('MySQL initialization failed, falling back to local SQLite.', error);
      mysqlPool = null;
      activeDatabase = 'sqlite';
    }
  }

  try {
    const sqlite3 = require('sqlite3').verbose();
    sqliteDb = new sqlite3.Database(path.join(__dirname, 'bookings.db'));

    await new Promise((resolve, reject) => {
      sqliteDb.serialize(() => {
        sqliteDb.run(`CREATE TABLE IF NOT EXISTS bookings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          service TEXT NOT NULL,
          date TEXT,
          address TEXT,
          notes TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )`, (bookingError) => {
          if (bookingError) {
            reject(bookingError);
            return;
          }

          sqliteDb.run(`CREATE TABLE IF NOT EXISTS contact_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            message TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          )`, (contactError) => {
            if (contactError) {
              reject(contactError);
              return;
            }
            resolve();
          });
        });
      });
    });

    activeDatabase = 'sqlite';
  } catch (error) {
    console.error('SQLite initialization failed, falling back to in-memory storage.', error);
    sqliteDb = null;
    activeDatabase = 'memory';
  }
}

async function runStatement(sql, values) {
  if (mysqlPool) {
    const [result] = await mysqlPool.execute(sql, values);
    return result.insertId || 0;
  }

  if (!sqliteDb) {
    const createdAt = new Date().toISOString();

    if (/INSERT INTO bookings/i.test(sql)) {
      const row = {
        id: memoryIdCounter++,
        name: values[0],
        phone: values[1],
        service: values[2],
        date: values[3],
        address: values[4],
        notes: values[5],
        created_at: createdAt
      };
      memoryStore.bookings.push(row);
      return row.id;
    }

    if (/INSERT INTO contact_messages/i.test(sql)) {
      const row = {
        id: memoryIdCounter++,
        name: values[0],
        phone: values[1],
        message: values[2],
        created_at: createdAt
      };
      memoryStore.contact_messages.push(row);
      return row.id;
    }

    return 0;
  }

  return new Promise((resolve, reject) => {
    sqliteDb.run(sql, values, function (error) {
      if (error) {
        reject(error);
        return;
      }
      resolve(this.lastID);
    });
  });
}

async function allQuery(sql, values = []) {
  if (mysqlPool) {
    const [rows] = await mysqlPool.execute(sql, values);
    return rows;
  }

  if (!sqliteDb) {
    if (/FROM bookings/i.test(sql)) {
      return [...memoryStore.bookings].sort((a, b) => {
        const aTime = new Date(a.created_at || 0).getTime();
        const bTime = new Date(b.created_at || 0).getTime();
        return bTime - aTime || b.id - a.id;
      });
    }

    if (/FROM contact_messages/i.test(sql)) {
      return [...memoryStore.contact_messages]
        .map((row) => ({
          id: row.id,
          name: row.name,
          phone: row.phone,
          service: '',
          date: '',
          address: '',
          notes: row.message,
          created_at: row.created_at,
          type: 'contact'
        }))
        .sort((a, b) => {
          const aTime = new Date(a.created_at || 0).getTime();
          const bTime = new Date(b.created_at || 0).getTime();
          return bTime - aTime || b.id - a.id;
        });
    }

    return [];
  }

  return new Promise((resolve, reject) => {
    sqliteDb.all(sql, values, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(rows);
    });
  });
}

function requireAdminAuth(req, res, next) {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUser || !expectedPassword) {
    next();
    return;
  }

  const header = req.headers.authorization || '';
  if (!header.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="SolarCare Admin"');
    res.status(401).send('Authentication required');
    return;
  }

  const encoded = header.slice('Basic '.length);
  const decoded = Buffer.from(encoded, 'base64').toString('utf8');
  const separatorIndex = decoded.indexOf(':');
  const username = separatorIndex >= 0 ? decoded.slice(0, separatorIndex) : decoded;
  const password = separatorIndex >= 0 ? decoded.slice(separatorIndex + 1) : '';

  if (username !== expectedUser || password !== expectedPassword) {
    res.set('WWW-Authenticate', 'Basic realm="SolarCare Admin"');
    res.status(401).send('Invalid admin credentials');
    return;
  }

  next();
}

async function handleBookingRequest(req, res) {
  const payload = {
    name: String(req.body?.name || '').trim(),
    phone: String(req.body?.phone || '').trim(),
    service: String(req.body?.service || '').trim(),
    date: String(req.body?.pref_date || req.body?.date || '').trim(),
    panels: String(req.body?.panels || '').trim(),
    address: String(req.body?.address || '').trim(),
    notes: String(req.body?.notes || '').trim()
  };

  if (!payload.name || !payload.phone || !payload.service) {
    return res.status(400).json({ error: 'name, phone, and service are required' });
  }

  try {
    const bookingId = await runStatement(
      'INSERT INTO bookings(name, phone, service, date, address, notes) VALUES(?,?,?,?,?,?)',
      [payload.name, payload.phone, payload.service, payload.date, payload.address, payload.notes]
    );
    res.status(201).json({ ok: true, bookingId, whatsappDelivered: false, whatsappProvider: 'direct-only' });
  } catch (error) {
    console.error('Failed to save booking', error);
    res.status(500).json({ error: 'failed to save booking' });
  }
}

// Endpoints
app.post('/api/book', handleBookingRequest);
app.post('/api/bookings', handleBookingRequest); // Compatibility alias
app.post('/book', handleBookingRequest);         // Legacy alias

app.post('/api/contact', async (req, res) => {
  const payload = {
    name: String(req.body?.name || '').trim(),
    phone: String(req.body?.phone || '').trim(),
    message: String(req.body?.message || '').trim()
  };

  if (!payload.name || !payload.phone) {
    return res.status(400).json({ error: 'name and phone are required' });
  }

  try {
    const messageId = await runStatement(
      'INSERT INTO contact_messages(name, phone, message) VALUES(?,?,?)',
      [payload.name, payload.phone, payload.message]
    );
    res.status(201).json({ ok: true, messageId, whatsappDelivered: false, whatsappProvider: 'direct-only' });
  } catch (error) {
    console.error('Failed to save contact message', error);
    res.status(500).json({ error: 'failed to save contact message' });
  }
});

app.get('/api/admin/leads', requireAdminAuth, async (_req, res) => {
  try {
    const bookings = await allQuery(
      `SELECT id, name, phone, service, date, address, notes, created_at, 'booking' AS type
       FROM bookings
       ORDER BY datetime(created_at) DESC, id DESC`
    );

    const contacts = await allQuery(
      `SELECT id, name, phone, '' AS service, '' AS date, '' AS address, message AS notes, created_at, 'contact' AS type
       FROM contact_messages
       ORDER BY datetime(created_at) DESC, id DESC`
    );

    const leads = [...bookings, ...contacts].sort((a, b) => {
      const aTime = new Date(a.created_at || 0).getTime();
      const bTime = new Date(b.created_at || 0).getTime();
      return bTime - aTime || b.id - a.id;
    });

    res.json({ ok: true, leads });
  } catch (error) {
    console.error('Failed to load admin leads', error);
    res.status(500).json({ error: 'failed to load admin leads' });
  }
});

app.get('/', (_req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', requireAdminAuth, (_req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.sendFile(path.join(__dirname, 'admin.html'));
});

async function startServer() {
  try {
    await initializeDatabase();
    if (activeDatabase === 'mysql') {
      console.log('Using MySQL database.');
    } else if (activeDatabase === 'sqlite') {
      console.log('Using local SQLite database.');
    } else {
      console.log('Using in-memory fallback storage.');
    }

    app.listen(port, () => {
      console.log(`SolarCare server running on port ${port} (Version: ${APP_VERSION})`);
    });
  } catch (error) {
    console.error('Failed to initialize server', error);
    process.exit(1);
  }
}

startServer();
