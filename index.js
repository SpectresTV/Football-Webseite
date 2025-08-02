const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('football.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      eventDate TEXT,
      description TEXT,
      user_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

app.get('/', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  res.redirect('/schedule');
});

app.get('/register', (req, res) => {
  res.render('register', { error: null });
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  db.run('INSERT INTO users(username, password) VALUES(?, ?)', [username, hash], function(err) {
    if (err) {
      return res.render('register', { error: 'Nutzer existiert bereits' });
    }
    req.session.userId = this.lastID;
    res.redirect('/schedule');
  });
});

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT id, password FROM users WHERE username = ?', [username], async (err, row) => {
    if (err || !row) {
      return res.render('login', { error: 'Ungültige Anmeldedaten' });
    }
    const match = await bcrypt.compare(password, row.password);
    if (!match) {
      return res.render('login', { error: 'Ungültige Anmeldedaten' });
    }
    req.session.userId = row.id;
    res.redirect('/schedule');
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

app.get('/schedule', requireLogin, (req, res) => {
  db.all('SELECT id, title, eventDate, description FROM events WHERE user_id = ?', [req.session.userId], (err, rows) => {
    res.render('schedule', { events: rows || [] });
  });
});

app.post('/schedule', requireLogin, (req, res) => {
  const { title, eventDate, description } = req.body;
  db.run('INSERT INTO events(title, eventDate, description, user_id) VALUES(?, ?, ?, ?)',
    [title, eventDate, description, req.session.userId], (err) => {
      res.redirect('/schedule');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
