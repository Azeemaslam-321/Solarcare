-- IMSOLARCARE database queries
-- Use these in MySQL / phpMyAdmin for setup and checking leads.

CREATE TABLE IF NOT EXISTS bookings (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  service VARCHAR(255) NOT NULL,
  date VARCHAR(100),
  address TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Show latest booking leads
SELECT id, name, phone, service, date, address, notes, created_at
FROM bookings
ORDER BY created_at DESC, id DESC;

-- Show latest contact leads
SELECT id, name, phone, message, created_at
FROM contact_messages
ORDER BY created_at DESC, id DESC;

-- Combined latest leads view
SELECT id, name, phone, service, date, address, notes, created_at, 'booking' AS type
FROM bookings
UNION ALL
SELECT id, name, phone, '' AS service, '' AS date, '' AS address, message AS notes, created_at, 'contact' AS type
FROM contact_messages
ORDER BY created_at DESC, id DESC;

-- Insert test booking row
INSERT INTO bookings (name, phone, service, date, address, notes)
VALUES ('Test User', '9999999999', 'Solar Panel Cleaning', 'Tomorrow', 'Lucknow', 'Test booking row');

-- Insert test contact row
INSERT INTO contact_messages (name, phone, message)
VALUES ('Test User', '9999999999', 'This is a test contact message');

-- Count rows
SELECT COUNT(*) AS total_bookings FROM bookings;
SELECT COUNT(*) AS total_contact_messages FROM contact_messages;

-- Delete only test rows if needed
DELETE FROM bookings WHERE name = 'Test User' AND phone = '9999999999';
DELETE FROM contact_messages WHERE name = 'Test User' AND phone = '9999999999';
