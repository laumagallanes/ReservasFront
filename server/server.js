const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// DB Connection
let db;
const connectDB = async () => {
    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'admin_pass',
            database: process.env.DB_NAME || 'latteame'
        });
        console.log('Connected to MySQL');
        await initSchema();
    } catch (err) {
        console.error('MySQL Connection Error:', err);
        setTimeout(connectDB, 5000);
    }
};

const initSchema = async () => {
    // Users table
    await db.execute(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        )
    `);

    // Categories table
    await db.execute(`
        CREATE TABLE IF NOT EXISTS categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            display_order INT DEFAULT 0
        )
    `);

    // Products table
    await db.execute(`
        CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            category_id INT,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            price DECIMAL(10, 2),
            image_url TEXT,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
        )
    `);

    // Seed Admin
    const [users] = await db.execute('SELECT * FROM users WHERE username = ?', ['ADMINISTRATOR']);
    if (users.length === 0) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await db.execute('INSERT INTO users (username, password) VALUES (?, ?)', ['ADMINISTRATOR', hashedPassword]);
    }

    // Seed Categories if empty
    const [cats] = await db.execute('SELECT * FROM categories');
    if (cats.length === 0) {
        await db.execute('INSERT INTO categories (name, display_order) VALUES (?, ?)', ['Coffee', 1]);
        await db.execute('INSERT INTO categories (name, display_order) VALUES (?, ?)', ['Pastries', 2]);

        const [newCats] = await db.execute('SELECT * FROM categories');
        const coffeeId = newCats.find(c => c.name === 'Coffee').id;
        const pastriesId = newCats.find(c => c.name === 'Pastries').id;

        await db.execute('INSERT INTO products (category_id, name, description, price, image_url) VALUES (?, ?, ?, ?, ?)',
            [coffeeId, 'Cappuccino', 'Rich and foamy.', 4.50, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&q=80']);
        await db.execute('INSERT INTO products (category_id, name, description, price, image_url) VALUES (?, ?, ?, ?, ?)',
            [pastriesId, 'Croissant', 'Buttery and flaky.', 3.00, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80']);
    }
};

connectDB();

// Middleware for Auth
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// API Endpoints
app.get('/', (req, res) => res.send('Latteame API running...'));

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, users[0].password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: users[0].id, username: users[0].username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
});

app.get('/api/settings', (req, res) => {
    const dataDir = path.join(__dirname, 'data');
    const settingsPath = path.join(dataDir, 'settings.json');
    let settings = {};

    if (fs.existsSync(settingsPath)) {
        try {
            settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        } catch (e) {
            console.error('Error parsing settings.json', e);
        }
    }

    // Inject env var if present
    if (process.env.RESERVATION_URL) {
        settings.reservationUrl = process.env.RESERVATION_URL;
    }

    if (Object.keys(settings).length > 0) {
        res.json(settings);
    } else {
        res.status(404).json({ error: 'Settings not found' });
    }
});

app.get('/api/categories', async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM categories ORDER BY display_order');
    res.json(rows);
});

app.get('/api/products', async (req, res) => {
    const [rows] = await db.execute('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id');
    res.json(rows);
});

// Admin CRUDS
app.post('/api/categories', authenticateToken, async (req, res) => {
    const { name, display_order } = req.body;
    await db.execute('INSERT INTO categories (name, display_order) VALUES (?, ?)', [name, display_order || 0]);
    res.json({ success: true });
});

app.put('/api/categories/:id', authenticateToken, async (req, res) => {
    try {
        const { name, display_order } = req.body;
        await db.execute('UPDATE categories SET name = ?, display_order = ? WHERE id = ?', [name, display_order, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error('PUT CATEGORY ERROR:', err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/categories/:id', authenticateToken, async (req, res) => {
    try {
        const id = req.params.id;
        // Manually nullify products to be safe in case the schema constraint wasn't applied correctly on an existing DB
        await db.execute('UPDATE products SET category_id = NULL WHERE category_id = ?', [id]);
        await db.execute('DELETE FROM categories WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (err) {
        console.error('DELETE CATEGORY ERROR:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/products', authenticateToken, async (req, res) => {
    try {
        const { category_id, name, description, price, image_url } = req.body;
        // Ensure price is a number and category_id is valid
        const finalPrice = parseFloat(price) || 0;
        const finalCategoryId = category_id || null;

        await db.execute('INSERT INTO products (category_id, name, description, price, image_url) VALUES (?, ?, ?, ?, ?)',
            [finalCategoryId, name, description, finalPrice, image_url]);
        res.json({ success: true });
    } catch (err) {
        console.error('POST PRODUCT ERROR:', err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/products/:id', authenticateToken, async (req, res) => {
    const { category_id, name, description, price, image_url } = req.body;
    await db.execute(
        'UPDATE products SET category_id = ?, name = ?, description = ?, price = ?, image_url = ? WHERE id = ?',
        [category_id, name, description, price, image_url, req.params.id]
    );
    res.json({ success: true });
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
    await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
