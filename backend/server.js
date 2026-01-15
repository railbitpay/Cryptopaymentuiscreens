import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Server } from 'socket.io';
import http from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);

// CORS configuration - use environment variable for production
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const io = new Server(server, {
  cors: {
    origin: frontendUrl,
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: frontendUrl,
  credentials: true
}));
app.use(express.json());

// Database setup - Use PostgreSQL in production, SQLite in development
const usePostgreSQL = process.env.DATABASE_URL && process.env.NODE_ENV === 'production';
let db, pool;

if (usePostgreSQL) {
  // PostgreSQL setup for production
  const { Pool } = pg;
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
  });

  pool.on('error', (err) => {
    console.error('❌ PostgreSQL error:', err);
  });
} else {
  // SQLite setup for development
  const dbPath = join(__dirname, 'railbit.db');
  db = new sqlite3.Database(dbPath);
  console.log('✅ Using SQLite database for development');
}

// Initialize database tables
const initializeDatabase = async () => {
  if (usePostgreSQL) {
    // PostgreSQL table creation
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS merchants (
          id VARCHAR(255) PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          business_name VARCHAR(255),
          kyc_status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS payments (
          id VARCHAR(255) PRIMARY KEY,
          merchant_id VARCHAR(255) NOT NULL,
          amount_cad DECIMAL(10, 2) NOT NULL,
          asset VARCHAR(10) NOT NULL,
          crypto_amount DECIMAL(20, 8) NOT NULL,
          address TEXT NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          description TEXT,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (merchant_id) REFERENCES merchants(id)
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS transactions (
          id VARCHAR(255) PRIMARY KEY,
          payment_id VARCHAR(255),
          merchant_id VARCHAR(255) NOT NULL,
          type VARCHAR(50) NOT NULL,
          amount DECIMAL(10, 2) NOT NULL,
          asset VARCHAR(10) NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (payment_id) REFERENCES payments(id),
          FOREIGN KEY (merchant_id) REFERENCES merchants(id)
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS api_keys (
          id VARCHAR(255) PRIMARY KEY,
          merchant_id VARCHAR(255) NOT NULL,
          key_type VARCHAR(50) DEFAULT 'test',
          key_value VARCHAR(255) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (merchant_id) REFERENCES merchants(id)
        )
      `);

      console.log('✅ PostgreSQL tables initialized');
    } catch (error) {
      console.error('❌ PostgreSQL initialization error:', error);
    }
  } else {
    // SQLite table creation
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS merchants (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        business_name TEXT,
        kyc_status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY,
        merchant_id TEXT NOT NULL,
        amount_cad REAL NOT NULL,
        asset TEXT NOT NULL,
        crypto_amount REAL NOT NULL,
        address TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        description TEXT,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (merchant_id) REFERENCES merchants(id)
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        payment_id TEXT,
        merchant_id TEXT NOT NULL,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        asset TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (payment_id) REFERENCES payments(id),
        FOREIGN KEY (merchant_id) REFERENCES merchants(id)
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS api_keys (
        id TEXT PRIMARY KEY,
        merchant_id TEXT NOT NULL,
        key_type TEXT DEFAULT 'test',
        key_value TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (merchant_id) REFERENCES merchants(id)
      )`);
    });
    console.log('✅ SQLite tables initialized');
  }
};

// Initialize database on startup
initializeDatabase();

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'railbit-secret-key-change-in-production';

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Helper function to convert SQLite-style queries (?) to PostgreSQL-style ($1, $2, ...)
const convertQuery = (query) => {
  if (!usePostgreSQL) return query;
  
  let paramIndex = 1;
  return query.replace(/\?/g, () => `$${paramIndex++}`);
};

// Helper functions for database operations - supports both SQLite and PostgreSQL
const dbGet = async (query, params = []) => {
  const finalQuery = convertQuery(query);
  
  if (usePostgreSQL) {
    try {
      const result = await pool.query(finalQuery, params);
      return result.rows[0] || null;
    } catch (error) {
      console.error('PostgreSQL query error:', error);
      throw error;
    }
  } else {
    return new Promise((resolve, reject) => {
      db.get(query, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
};

const dbAll = async (query, params = []) => {
  const finalQuery = convertQuery(query);
  
  if (usePostgreSQL) {
    try {
      const result = await pool.query(finalQuery, params);
      return result.rows;
    } catch (error) {
      console.error('PostgreSQL query error:', error);
      throw error;
    }
  } else {
    return new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

const dbRun = async (query, params = []) => {
  const finalQuery = convertQuery(query);
  
  if (usePostgreSQL) {
    try {
      const result = await pool.query(finalQuery, params);
      return { lastID: null, changes: result.rowCount };
    } catch (error) {
      console.error('PostgreSQL query error:', error);
      throw error;
    }
  } else {
    return new Promise((resolve, reject) => {
      db.run(query, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }
};

// ==================== AUTH ROUTES ====================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, businessName } = req.body;

    if (!email || !password || !businessName) {
      return res.status(400).json({ error: 'Email, password, and business name are required' });
    }

    // Check if email already exists
    const existing = await dbGet('SELECT id FROM merchants WHERE email = ?', [email]);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = `merchant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await dbRun(
      'INSERT INTO merchants (id, email, password, business_name) VALUES (?, ?, ?, ?)',
      [id, email, hashedPassword, businessName]
    );

    const token = jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      merchant: {
        id,
        email,
        business_name: businessName,
        kyc_status: 'pending'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const merchant = await dbGet('SELECT * FROM merchants WHERE email = ?', [email]);
    
    if (!merchant) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, merchant.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: merchant.id, email: merchant.email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      merchant: {
        id: merchant.id,
        email: merchant.email,
        business_name: merchant.business_name,
        kyc_status: merchant.kyc_status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const merchant = await dbGet('SELECT id, email, business_name, kyc_status FROM merchants WHERE id = ?', [req.user.id]);
    
    if (!merchant) {
      return res.status(404).json({ error: 'Merchant not found' });
    }

    res.json({ merchant });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ==================== PAYMENT ROUTES ====================

app.post('/api/payments', authenticateToken, async (req, res) => {
  try {
    const { amount_cad, asset, description } = req.body;

    if (!amount_cad || !asset) {
      return res.status(400).json({ error: 'Amount and asset are required' });
    }

    if (!['btc', 'eth', 'sol'].includes(asset)) {
      return res.status(400).json({ error: 'Invalid asset. Must be btc, eth, or sol' });
    }

    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Crypto exchange rates (mock - in production, fetch from exchange API)
    const rates = { btc: 65000, eth: 3700, sol: 45 };
    const cryptoAmount = amount_cad / rates[asset];
    
    // Generate mock addresses
    const addresses = {
      btc: `lnbc${Math.random().toString(36).substr(2, 20)}...${Math.random().toString(36).substr(2, 10)}`,
      eth: `0x${Math.random().toString(16).substr(2, 40)}`,
      sol: `${Math.random().toString(36).substr(2, 32)}`
    };

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await dbRun(
      `INSERT INTO payments (id, merchant_id, amount_cad, asset, crypto_amount, address, status, description, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
      [paymentId, req.user.id, amount_cad, asset, cryptoAmount, addresses[asset], description || null, expiresAt]
    );

    const payment = await dbGet('SELECT * FROM payments WHERE id = ?', [paymentId]);
    
    // Emit WebSocket event
    io.emit('payment:created', { paymentId, merchantId: req.user.id, payment });
    
    // Generate payment URL - use environment variable or default to localhost
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const paymentUrl = `${frontendUrl}/payment/${paymentId}`;
    
    res.json({
      ...payment,
      payment_url: paymentUrl
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

app.get('/api/payments', authenticateToken, async (req, res) => {
  try {
    const payments = await dbAll(
      'SELECT * FROM payments WHERE merchant_id = ? ORDER BY created_at DESC LIMIT 100',
      [req.user.id]
    );
    res.json(payments);
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

app.get('/api/payments/:id', async (req, res) => {
  try {
    const payment = await dbGet('SELECT * FROM payments WHERE id = ?', [req.params.id]);
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    res.json(payment);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

app.post('/api/payments/:id/verify', async (req, res) => {
  try {
    const payment = await dbGet('SELECT * FROM payments WHERE id = ?', [req.params.id]);
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.status === 'paid') {
      return res.json({ success: true, payment, message: 'Payment already verified' });
    }

    // Update payment status
    await dbRun('UPDATE payments SET status = ? WHERE id = ?', ['paid', req.params.id]);
    
    // Create transaction record
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await dbRun(
      `INSERT INTO transactions (id, payment_id, merchant_id, type, amount, asset, status)
       VALUES (?, ?, ?, 'received', ?, ?, 'completed')`,
      [transactionId, req.params.id, payment.merchant_id, payment.amount_cad, payment.asset]
    );

    const updatedPayment = await dbGet('SELECT * FROM payments WHERE id = ?', [req.params.id]);
    
    // Emit WebSocket event
    io.emit('payment:paid', { paymentId: req.params.id, payment: updatedPayment });
    
    res.json({ success: true, payment: updatedPayment });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// ==================== DASHBOARD ROUTES ====================

app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    // Use appropriate date function for database type
    const dateFilter = usePostgreSQL 
      ? "created_at > NOW() - INTERVAL '30 days'"
      : "created_at > datetime('now', '-30 days')";
    
    const stats = await dbGet(`
      SELECT 
        COALESCE(SUM(amount_cad), 0) as total_volume,
        COUNT(*) as transaction_count,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN amount_cad ELSE 0 END), 0) as paid_volume,
        COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_count,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count
      FROM payments 
      WHERE merchant_id = ? AND ${dateFilter}
    `, [req.user.id]);

    // Get crypto balances (mock for now)
    const balances = await dbAll(`
      SELECT 
        asset,
        SUM(CASE WHEN status = 'paid' THEN crypto_amount ELSE 0 END) as balance
      FROM payments
      WHERE merchant_id = ?
      GROUP BY asset
    `, [req.user.id]);

    res.json({
      ...stats,
      balances: balances || []
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const transactions = await dbAll(
      `SELECT * FROM transactions 
       WHERE merchant_id = ? 
       ORDER BY created_at DESC 
       LIMIT 100`,
      [req.user.id]
    );
    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// ==================== WEBSOCKET CONNECTIONS ====================

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  socket.on('subscribe:payment', (paymentId) => {
    socket.join(`payment:${paymentId}`);
    console.log(`Client ${socket.id} subscribed to payment ${paymentId}`);
  });
});

// ==================== SERVER START ====================

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 RailBit Backend Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${frontendUrl}`);
  console.log(`💾 Database: ${usePostgreSQL ? 'PostgreSQL' : 'SQLite'}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  if (usePostgreSQL) {
    await pool.end();
    console.log('✅ PostgreSQL connection closed');
  } else {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('✅ SQLite database closed');
      }
    });
  }
  process.exit(0);
});

