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
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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
app.use(express.json({ limit: '10mb' }));

// Disable ETag generation (prevents 304 responses for API JSON)
app.set('etag', false);

// Prevent caching of API responses (fixes blank dashboard due to 304 + empty body)
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

const uploadsDir = join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

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
          business_number VARCHAR(255),
          industry VARCHAR(255),
          phone VARCHAR(255),
          address_line1 VARCHAR(255),
          city VARCHAR(255),
          province VARCHAR(255),
          postal_code VARCHAR(50),
          settlement_mode VARCHAR(50) DEFAULT 'cad',
          settlement_assets TEXT,
          bank_name VARCHAR(255),
          bank_transit VARCHAR(50),
          bank_institution VARCHAR(50),
          bank_account VARCHAR(255),
          two_factor_enabled BOOLEAN DEFAULT false,
          notif_payment_received BOOLEAN DEFAULT true,
          notif_payment_failed BOOLEAN DEFAULT true,
          notif_weekly_summary BOOLEAN DEFAULT true,
          notif_compliance_alerts BOOLEAN DEFAULT true,
          notif_marketing_updates BOOLEAN DEFAULT false,
          is_admin BOOLEAN DEFAULT false,
          kyc_status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      const merchantColumns = [
        "business_number VARCHAR(255)",
        "industry VARCHAR(255)",
        "phone VARCHAR(255)",
        "address_line1 VARCHAR(255)",
        "city VARCHAR(255)",
        "province VARCHAR(255)",
        "postal_code VARCHAR(50)",
        "settlement_mode VARCHAR(50) DEFAULT 'cad'",
        "settlement_assets TEXT",
        "bank_name VARCHAR(255)",
        "bank_transit VARCHAR(50)",
        "bank_institution VARCHAR(50)",
        "bank_account VARCHAR(255)",
        "two_factor_enabled BOOLEAN DEFAULT false",
        "notif_payment_received BOOLEAN DEFAULT true",
        "notif_payment_failed BOOLEAN DEFAULT true",
        "notif_weekly_summary BOOLEAN DEFAULT true",
        "notif_compliance_alerts BOOLEAN DEFAULT true",
        "notif_marketing_updates BOOLEAN DEFAULT false",
        "is_admin BOOLEAN DEFAULT false"
      ];
      for (const column of merchantColumns) {
        await pool.query(`ALTER TABLE merchants ADD COLUMN IF NOT EXISTS ${column}`);
      }

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

      await pool.query(`
        CREATE TABLE IF NOT EXISTS kyc_documents (
          id VARCHAR(255) PRIMARY KEY,
          merchant_id VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          document_type VARCHAR(255) NOT NULL,
          status VARCHAR(50) DEFAULT 'uploaded',
          upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          file_path TEXT,
          mime_type VARCHAR(255),
          file_size BIGINT,
          FOREIGN KEY (merchant_id) REFERENCES merchants(id)
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS beneficial_owners (
          id VARCHAR(255) PRIMARY KEY,
          merchant_id VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          role VARCHAR(255),
          ownership VARCHAR(255),
          verified BOOLEAN DEFAULT false,
          FOREIGN KEY (merchant_id) REFERENCES merchants(id)
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS admin_notes (
          id VARCHAR(255) PRIMARY KEY,
          merchant_id VARCHAR(255) NOT NULL,
          author VARCHAR(255),
          text TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (merchant_id) REFERENCES merchants(id)
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS webhooks (
          id VARCHAR(255) PRIMARY KEY,
          merchant_id VARCHAR(255) NOT NULL,
          url TEXT NOT NULL,
          events TEXT NOT NULL,
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_delivery TIMESTAMP,
          FOREIGN KEY (merchant_id) REFERENCES merchants(id)
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS webhook_deliveries (
          id VARCHAR(255) PRIMARY KEY,
          webhook_id VARCHAR(255) NOT NULL,
          event VARCHAR(255) NOT NULL,
          status VARCHAR(50) NOT NULL,
          response_time VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (webhook_id) REFERENCES webhooks(id)
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS team_members (
          id VARCHAR(255) PRIMARY KEY,
          merchant_id VARCHAR(255) NOT NULL,
          name VARCHAR(255),
          email VARCHAR(255) NOT NULL,
          role VARCHAR(255) DEFAULT 'Member',
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (merchant_id) REFERENCES merchants(id)
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS payouts (
          id VARCHAR(255) PRIMARY KEY,
          merchant_id VARCHAR(255) NOT NULL,
          payment_id VARCHAR(255),
          amount_cad DECIMAL(10, 2) NOT NULL,
          asset VARCHAR(10) NOT NULL,
          crypto_amount DECIMAL(20, 8) NOT NULL,
          status VARCHAR(50) DEFAULT 'completed',
          description TEXT,
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
        business_number TEXT,
        industry TEXT,
        phone TEXT,
        address_line1 TEXT,
        city TEXT,
        province TEXT,
        postal_code TEXT,
        settlement_mode TEXT DEFAULT 'cad',
        settlement_assets TEXT,
        bank_name TEXT,
        bank_transit TEXT,
        bank_institution TEXT,
        bank_account TEXT,
        two_factor_enabled INTEGER DEFAULT 0,
        notif_payment_received INTEGER DEFAULT 1,
        notif_payment_failed INTEGER DEFAULT 1,
        notif_weekly_summary INTEGER DEFAULT 1,
        notif_compliance_alerts INTEGER DEFAULT 1,
        notif_marketing_updates INTEGER DEFAULT 0,
        is_admin INTEGER DEFAULT 0,
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

      db.run(`CREATE TABLE IF NOT EXISTS kyc_documents (
        id TEXT PRIMARY KEY,
        merchant_id TEXT NOT NULL,
        name TEXT NOT NULL,
        document_type TEXT NOT NULL,
        status TEXT DEFAULT 'uploaded',
        upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        file_path TEXT,
        mime_type TEXT,
        file_size INTEGER,
        FOREIGN KEY (merchant_id) REFERENCES merchants(id)
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS beneficial_owners (
        id TEXT PRIMARY KEY,
        merchant_id TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT,
        ownership TEXT,
        verified INTEGER DEFAULT 0,
        FOREIGN KEY (merchant_id) REFERENCES merchants(id)
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS admin_notes (
        id TEXT PRIMARY KEY,
        merchant_id TEXT NOT NULL,
        author TEXT,
        text TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (merchant_id) REFERENCES merchants(id)
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS webhooks (
        id TEXT PRIMARY KEY,
        merchant_id TEXT NOT NULL,
        url TEXT NOT NULL,
        events TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_delivery DATETIME,
        FOREIGN KEY (merchant_id) REFERENCES merchants(id)
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS webhook_deliveries (
        id TEXT PRIMARY KEY,
        webhook_id TEXT NOT NULL,
        event TEXT NOT NULL,
        status TEXT NOT NULL,
        response_time TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (webhook_id) REFERENCES webhooks(id)
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS team_members (
        id TEXT PRIMARY KEY,
        merchant_id TEXT NOT NULL,
        name TEXT,
        email TEXT NOT NULL,
        role TEXT DEFAULT 'Member',
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (merchant_id) REFERENCES merchants(id)
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS payouts (
        id TEXT PRIMARY KEY,
        merchant_id TEXT NOT NULL,
        payment_id TEXT,
        amount_cad REAL NOT NULL,
        asset TEXT NOT NULL,
        crypto_amount REAL NOT NULL,
        status TEXT DEFAULT 'completed',
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (merchant_id) REFERENCES merchants(id)
      )`);

      const alterColumns = [
        "ALTER TABLE merchants ADD COLUMN business_number TEXT",
        "ALTER TABLE merchants ADD COLUMN industry TEXT",
        "ALTER TABLE merchants ADD COLUMN phone TEXT",
        "ALTER TABLE merchants ADD COLUMN address_line1 TEXT",
        "ALTER TABLE merchants ADD COLUMN city TEXT",
        "ALTER TABLE merchants ADD COLUMN province TEXT",
        "ALTER TABLE merchants ADD COLUMN postal_code TEXT",
        "ALTER TABLE merchants ADD COLUMN settlement_mode TEXT DEFAULT 'cad'",
        "ALTER TABLE merchants ADD COLUMN settlement_assets TEXT",
        "ALTER TABLE merchants ADD COLUMN bank_name TEXT",
        "ALTER TABLE merchants ADD COLUMN bank_transit TEXT",
        "ALTER TABLE merchants ADD COLUMN bank_institution TEXT",
        "ALTER TABLE merchants ADD COLUMN bank_account TEXT",
        "ALTER TABLE merchants ADD COLUMN two_factor_enabled INTEGER DEFAULT 0",
        "ALTER TABLE merchants ADD COLUMN notif_payment_received INTEGER DEFAULT 1",
        "ALTER TABLE merchants ADD COLUMN notif_payment_failed INTEGER DEFAULT 1",
        "ALTER TABLE merchants ADD COLUMN notif_weekly_summary INTEGER DEFAULT 1",
        "ALTER TABLE merchants ADD COLUMN notif_compliance_alerts INTEGER DEFAULT 1",
        "ALTER TABLE merchants ADD COLUMN notif_marketing_updates INTEGER DEFAULT 0",
        "ALTER TABLE merchants ADD COLUMN is_admin INTEGER DEFAULT 0"
      ];

      alterColumns.forEach((stmt) => {
        db.run(stmt, () => {});
      });
    });
    console.log('✅ SQLite tables initialized');
  }
};

// Initialize database on startup
// Initialize database before starting server
initializeDatabase().catch((error) => {
  console.error('❌ Failed to initialize database:', error);
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ Exiting due to database initialization failure');
    process.exit(1);
  }
});

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'railbit-secret-key-change-in-production';

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).send("Railbit API is running ✅");
});

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

const normalizePayment = (payment) => {
  if (!payment) return payment;
  return {
    ...payment,
    amount_cad: parseFloat(payment.amount_cad) || 0,
    crypto_amount: parseFloat(payment.crypto_amount) || 0
  };
};

const normalizeTransaction = (tx) => {
  if (!tx) return tx;
  return {
    ...tx,
    amount: parseFloat(tx.amount) || 0
  };
};

// ==================== AUTH ROUTES ====================

app.post('/api/auth/register', async (req, res) => {
  try {
    const {
      email,
      password,
      businessName,
      businessNumber,
      industry,
      phone,
      addressLine1,
      city,
      province,
      postalCode,
      twoFactorEnabled = false,
      settlementMode = 'cad',
      settlementAssets = ['btc', 'eth', 'sol'],
      bankName,
      bankTransit,
      bankInstitution,
      bankAccount,
      notifications = {}
    } = req.body;

    if (!email || !password || !businessName) {
      return res.status(400).json({ error: 'Email, password, and business name are required' });
    }

    // Validate JWT_SECRET is set
    if (!JWT_SECRET || JWT_SECRET === 'railbit-secret-key-change-in-production') {
      console.error('❌ JWT_SECRET is not properly configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Check if email already exists
    const existing = await dbGet('SELECT id FROM merchants WHERE email = ?', [email]);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = `merchant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const notifDefaults = {
      payment_received: true,
      payment_failed: true,
      weekly_summary: true,
      compliance_alerts: true,
      marketing_updates: false,
      ...notifications
    };

    await dbRun(
      `INSERT INTO merchants (
        id, email, password, business_name, business_number, industry, phone,
        address_line1, city, province, postal_code,
        settlement_mode, settlement_assets, bank_name, bank_transit, bank_institution, bank_account,
        two_factor_enabled, notif_payment_received, notif_payment_failed, notif_weekly_summary,
        notif_compliance_alerts, notif_marketing_updates, is_admin, kyc_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        email,
        hashedPassword,
        businessName,
        businessNumber || null,
        industry || null,
        phone || null,
        addressLine1 || null,
        city || null,
        province || null,
        postalCode || null,
        settlementMode,
        JSON.stringify(settlementAssets || []),
        bankName || null,
        bankTransit || null,
        bankInstitution || null,
        bankAccount || null,
        twoFactorEnabled ? 1 : 0,
        notifDefaults.payment_received ? 1 : 0,
        notifDefaults.payment_failed ? 1 : 0,
        notifDefaults.weekly_summary ? 1 : 0,
        notifDefaults.compliance_alerts ? 1 : 0,
        notifDefaults.marketing_updates ? 1 : 0,
        0, // is_admin (default to false)
        'pending' // kyc_status (default to pending)
      ]
    );

    const ownerId = `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await dbRun(
      `INSERT INTO team_members (id, merchant_id, name, email, role, status)
       VALUES (?, ?, ?, ?, 'Owner', 'active')`,
      [ownerId, id, businessName || 'Owner', email]
    );

    const token = jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      merchant: {
        id,
        email,
        business_name: businessName,
        kyc_status: 'pending',
        two_factor_enabled: !!twoFactorEnabled
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    // Provide more detailed error message for debugging
    const errorMessage = error.message || 'Registration failed';
    res.status(500).json({ 
      error: 'Registration failed',
      details: process.env.NODE_ENV === 'production' ? undefined : errorMessage
    });
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
        kyc_status: merchant.kyc_status,
        two_factor_enabled: !!merchant.two_factor_enabled
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const merchant = await dbGet(
      `SELECT 
        id, email, business_name, business_number, industry, phone,
        address_line1, city, province, postal_code,
        settlement_mode, settlement_assets, bank_name, bank_transit, bank_institution, bank_account,
        two_factor_enabled, notif_payment_received, notif_payment_failed, notif_weekly_summary,
        notif_compliance_alerts, notif_marketing_updates,
        kyc_status, created_at
       FROM merchants WHERE id = ?`,
      [req.user.id]
    );
    
    if (!merchant) {
      return res.status(404).json({ error: 'Merchant not found' });
    }

    try {
      merchant.settlement_assets = merchant.settlement_assets ? JSON.parse(merchant.settlement_assets) : [];
    } catch {
      merchant.settlement_assets = [];
    }
    merchant.two_factor_enabled = !!merchant.two_factor_enabled;
    merchant.notifications = {
      payment_received: !!merchant.notif_payment_received,
      payment_failed: !!merchant.notif_payment_failed,
      weekly_summary: !!merchant.notif_weekly_summary,
      compliance_alerts: !!merchant.notif_compliance_alerts,
      marketing_updates: !!merchant.notif_marketing_updates
    };

    res.json({ merchant });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ==================== MERCHANT PROFILE & SETTINGS ====================

app.patch('/api/merchants/profile', authenticateToken, async (req, res) => {
  try {
    const {
      businessName,
      businessNumber,
      industry,
      phone,
      addressLine1,
      city,
      province,
      postalCode
    } = req.body;

    await dbRun(
      `UPDATE merchants SET 
        business_name = COALESCE(?, business_name),
        business_number = COALESCE(?, business_number),
        industry = COALESCE(?, industry),
        phone = COALESCE(?, phone),
        address_line1 = COALESCE(?, address_line1),
        city = COALESCE(?, city),
        province = COALESCE(?, province),
        postal_code = COALESCE(?, postal_code)
       WHERE id = ?`,
      [
        businessName || null,
        businessNumber || null,
        industry || null,
        phone || null,
        addressLine1 || null,
        city || null,
        province || null,
        postalCode || null,
        req.user.id
      ]
    );

    const merchant = await dbGet(
      `SELECT 
        id, email, business_name, business_number, industry, phone,
        address_line1, city, province, postal_code,
        settlement_mode, settlement_assets, bank_name, bank_transit, bank_institution, bank_account,
        two_factor_enabled, notif_payment_received, notif_payment_failed, notif_weekly_summary,
        notif_compliance_alerts, notif_marketing_updates,
        kyc_status, created_at
       FROM merchants WHERE id = ?`,
      [req.user.id]
    );
    merchant.settlement_assets = merchant.settlement_assets ? JSON.parse(merchant.settlement_assets) : [];
    merchant.two_factor_enabled = !!merchant.two_factor_enabled;
    merchant.notifications = {
      payment_received: !!merchant.notif_payment_received,
      payment_failed: !!merchant.notif_payment_failed,
      weekly_summary: !!merchant.notif_weekly_summary,
      compliance_alerts: !!merchant.notif_compliance_alerts,
      marketing_updates: !!merchant.notif_marketing_updates
    };

    res.json({ merchant });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

app.get('/api/merchants/settlement', authenticateToken, async (req, res) => {
  try {
    const merchant = await dbGet(
      `SELECT settlement_mode, settlement_assets, bank_name, bank_transit, bank_institution, bank_account 
       FROM merchants WHERE id = ?`,
      [req.user.id]
    );
    if (!merchant) return res.status(404).json({ error: 'Merchant not found' });

    let assets = [];
    try {
      assets = merchant.settlement_assets ? JSON.parse(merchant.settlement_assets) : [];
    } catch {
      assets = [];
    }
    res.json({
      settlement_mode: merchant.settlement_mode || 'cad',
      settlement_assets: assets,
      bank_name: merchant.bank_name,
      bank_transit: merchant.bank_transit,
      bank_institution: merchant.bank_institution,
      bank_account: merchant.bank_account
    });
  } catch (error) {
    console.error('Get settlement error:', error);
    res.status(500).json({ error: 'Failed to fetch settlement preferences' });
  }
});

app.put('/api/merchants/settlement', authenticateToken, async (req, res) => {
  try {
    const {
      settlementMode,
      settlement_mode, // Accept both camelCase and snake_case
      settlementAssets = [],
      settlement_assets = [],
      bankName,
      bank_name,
      bankTransit,
      bank_transit,
      bankInstitution,
      bank_institution,
      bankAccount,
      bank_account
    } = req.body;

    // Use camelCase or snake_case, preferring camelCase
    const mode = settlementMode || settlement_mode || 'cad';
    const assets = settlementAssets.length > 0 ? settlementAssets : settlement_assets;
    const bankNameValue = bankName || bank_name;
    const bankTransitValue = bankTransit || bank_transit;
    const bankInstitutionValue = bankInstitution || bank_institution;
    const bankAccountValue = bankAccount || bank_account;

    await dbRun(
      `UPDATE merchants SET 
        settlement_mode = COALESCE(?, settlement_mode),
        settlement_assets = ?,
        bank_name = COALESCE(?, bank_name),
        bank_transit = COALESCE(?, bank_transit),
        bank_institution = COALESCE(?, bank_institution),
        bank_account = COALESCE(?, bank_account)
       WHERE id = ?`,
      [
        mode,
        JSON.stringify(assets || []),
        bankNameValue || null,
        bankTransitValue || null,
        bankInstitutionValue || null,
        bankAccountValue || null,
        req.user.id
      ]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Update settlement error:', error);
    res.status(500).json({ error: 'Failed to update settlement preferences' });
  }
});

app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const merchant = await dbGet(
      `SELECT 
        notif_payment_received, notif_payment_failed, notif_weekly_summary,
        notif_compliance_alerts, notif_marketing_updates
       FROM merchants WHERE id = ?`,
      [req.user.id]
    );
    if (!merchant) return res.status(404).json({ error: 'Merchant not found' });
    res.json({
      payment_received: !!merchant.notif_payment_received,
      payment_failed: !!merchant.notif_payment_failed,
      weekly_summary: !!merchant.notif_weekly_summary,
      compliance_alerts: !!merchant.notif_compliance_alerts,
      marketing_updates: !!merchant.notif_marketing_updates
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.put('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const {
      payment_received,
      payment_failed,
      weekly_summary,
      compliance_alerts,
      marketing_updates
    } = req.body;

    await dbRun(
      `UPDATE merchants SET 
        notif_payment_received = ?, 
        notif_payment_failed = ?, 
        notif_weekly_summary = ?,
        notif_compliance_alerts = ?, 
        notif_marketing_updates = ?
       WHERE id = ?`,
      [
        payment_received ? 1 : 0,
        payment_failed ? 1 : 0,
        weekly_summary ? 1 : 0,
        compliance_alerts ? 1 : 0,
        marketing_updates ? 1 : 0,
        req.user.id
      ]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Update notifications error:', error);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

app.post('/api/security/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    const merchant = await dbGet('SELECT * FROM merchants WHERE id = ?', [req.user.id]);
    if (!merchant) return res.status(404).json({ error: 'Merchant not found' });

    const valid = await bcrypt.compare(currentPassword, merchant.password);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await dbRun('UPDATE merchants SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

app.post('/api/security/2fa', authenticateToken, async (req, res) => {
  try {
    const { enabled } = req.body;
    await dbRun('UPDATE merchants SET two_factor_enabled = ? WHERE id = ?', [enabled ? 1 : 0, req.user.id]);
    res.json({ success: true, enabled: !!enabled });
  } catch (error) {
    console.error('Update 2FA error:', error);
    res.status(500).json({ error: 'Failed to update 2FA settings' });
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

    const payment = normalizePayment(await dbGet('SELECT * FROM payments WHERE id = ?', [paymentId]));
    
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
    res.json(payments.map(normalizePayment));
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

app.get('/api/payments/:id', async (req, res) => {
  try {
    const payment = normalizePayment(await dbGet('SELECT * FROM payments WHERE id = ?', [req.params.id]));
    
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
    const payment = normalizePayment(await dbGet('SELECT * FROM payments WHERE id = ?', [req.params.id]));
    
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

    const updatedPayment = normalizePayment(await dbGet('SELECT * FROM payments WHERE id = ?', [req.params.id]));
    
    // Emit WebSocket event
    io.emit('payment:paid', { paymentId: req.params.id, payment: updatedPayment });
    
    res.json({ success: true, payment: updatedPayment });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// ==================== KYC DOCUMENTS ====================

app.get('/api/kyc/documents', authenticateToken, async (req, res) => {
  try {
    const documents = await dbAll(
      `SELECT id, name, document_type, status, upload_date, file_path, mime_type, file_size 
       FROM kyc_documents WHERE merchant_id = ? ORDER BY upload_date DESC`,
      [req.user.id]
    );
    res.json(documents);
  } catch (error) {
    console.error('Get KYC documents error:', error);
    res.status(500).json({ error: 'Failed to fetch KYC documents' });
  }
});

app.post('/api/kyc/documents', authenticateToken, async (req, res) => {
  try {
    const { documentType, name, fileName, mimeType, data } = req.body;
    if (!documentType || !name || !fileName || !mimeType || !data) {
      return res.status(400).json({ error: 'Missing required document fields' });
    }

    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const safeFileName = `${documentId}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const filePath = join(uploadsDir, safeFileName);

    const buffer = Buffer.from(data, 'base64');
    fs.writeFileSync(filePath, buffer);

    await dbRun(
      `INSERT INTO kyc_documents 
        (id, merchant_id, name, document_type, status, file_path, mime_type, file_size)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        documentId,
        req.user.id,
        name,
        documentType,
        'uploaded',
        filePath,
        mimeType,
        buffer.length
      ]
    );

    const doc = await dbGet(
      `SELECT id, name, document_type, status, upload_date, file_path, mime_type, file_size 
       FROM kyc_documents WHERE id = ?`,
      [documentId]
    );
    res.json(doc);
  } catch (error) {
    console.error('Upload KYC document error:', error);
    res.status(500).json({ error: 'Failed to upload KYC document' });
  }
});

app.get('/api/kyc/documents/:id/download', authenticateToken, async (req, res) => {
  try {
    const doc = await dbGet(
      `SELECT * FROM kyc_documents WHERE id = ? AND merchant_id = ?`,
      [req.params.id, req.user.id]
    );
    if (!doc || !doc.file_path) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.download(doc.file_path, doc.name);
  } catch (error) {
    console.error('Download KYC document error:', error);
    res.status(500).json({ error: 'Failed to download KYC document' });
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
      total_volume: parseFloat(stats.total_volume) || 0,
      transaction_count: Number(stats.transaction_count) || 0,
      paid_volume: parseFloat(stats.paid_volume) || 0,
      paid_count: Number(stats.paid_count) || 0,
      pending_count: Number(stats.pending_count) || 0,
      balances: (balances || []).map(b => ({
        asset: b.asset,
        balance: parseFloat(b.balance) || 0
      }))
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
    res.json(transactions.map(normalizeTransaction));
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// ==================== ASSETS/BALANCES ROUTES ====================

app.get('/api/assets/balances', authenticateToken, async (req, res) => {
  try {
    const paymentBalances = await dbAll(`
      SELECT 
        asset,
        SUM(CASE WHEN status = 'paid' THEN crypto_amount ELSE 0 END) as balance,
        SUM(CASE WHEN status = 'paid' THEN amount_cad ELSE 0 END) as cad_value
      FROM payments
      WHERE merchant_id = ?
      GROUP BY asset
    `, [req.user.id]);

    const payoutBalances = await dbAll(`
      SELECT 
        asset,
        SUM(crypto_amount) as balance,
        SUM(amount_cad) as cad_value
      FROM payouts
      WHERE merchant_id = ?
      GROUP BY asset
    `, [req.user.id]);

    const payoutMap = new Map(
      payoutBalances.map(p => [p.asset, { balance: parseFloat(p.balance) || 0, cad_value: parseFloat(p.cad_value) || 0 }])
    );

    const rates = { btc: 65000, eth: 3700, sol: 45 };

    const assets = paymentBalances.map(b => {
      const payout = payoutMap.get(b.asset) || { balance: 0, cad_value: 0 };
      const balance = (parseFloat(b.balance) || 0) - payout.balance;
      const cadValue = (parseFloat(b.cad_value) || 0) - payout.cad_value;
      return {
        asset: b.asset,
        balance: Math.max(balance, 0),
        cad_value: Math.max(cadValue, 0),
        rate: rates[b.asset.toLowerCase()] || 0
      };
    });

    res.json({ assets });
  } catch (error) {
    console.error('Get balances error:', error);
    res.status(500).json({ error: 'Failed to fetch balances' });
  }
});

app.post('/api/assets/convert', authenticateToken, async (req, res) => {
  try {
    const { asset, cryptoAmount } = req.body;
    if (!asset || !cryptoAmount || cryptoAmount <= 0) {
      return res.status(400).json({ error: 'Asset and cryptoAmount are required' });
    }

    const normalizedAsset = asset.toLowerCase();
    const rates = { btc: 65000, eth: 3700, sol: 45 };
    if (!rates[normalizedAsset]) {
      return res.status(400).json({ error: 'Unsupported asset' });
    }

    const paymentBalances = await dbAll(`
      SELECT 
        asset,
        SUM(CASE WHEN status = 'paid' THEN crypto_amount ELSE 0 END) as balance,
        SUM(CASE WHEN status = 'paid' THEN amount_cad ELSE 0 END) as cad_value
      FROM payments
      WHERE merchant_id = ?
      GROUP BY asset
    `, [req.user.id]);
    const payoutBalances = await dbAll(`
      SELECT 
        asset,
        SUM(crypto_amount) as balance
      FROM payouts
      WHERE merchant_id = ?
      GROUP BY asset
    `, [req.user.id]);

    const payment = paymentBalances.find(b => b.asset.toLowerCase() === normalizedAsset);
    const payout = payoutBalances.find(b => b.asset.toLowerCase() === normalizedAsset);
    const available = (parseFloat(payment?.balance) || 0) - (parseFloat(payout?.balance) || 0);
    if (cryptoAmount > available) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const payoutId = `payout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const amountCad = parseFloat(cryptoAmount) * rates[normalizedAsset];

    await dbRun(
      `INSERT INTO payouts (id, merchant_id, amount_cad, asset, crypto_amount, status, description)
       VALUES (?, ?, ?, ?, ?, 'completed', ?)`,
      [payoutId, req.user.id, amountCad, normalizedAsset, cryptoAmount, 'Asset conversion']
    );

    const payoutRecord = await dbGet('SELECT * FROM payouts WHERE id = ?', [payoutId]);
    res.json(payoutRecord);
  } catch (error) {
    console.error('Convert asset error:', error);
    res.status(500).json({ error: 'Failed to convert asset' });
  }
});

// ==================== PAYOUTS ROUTES ====================

app.get('/api/payouts', authenticateToken, async (req, res) => {
  try {
    const payouts = await dbAll(
      `SELECT 
        id, payment_id, amount_cad as amount, asset, crypto_amount, status, description, created_at
       FROM payouts
       WHERE merchant_id = ?
       ORDER BY created_at DESC
       LIMIT 100`,
      [req.user.id]
    );

    res.json(
      payouts.map(p => ({
        ...p,
        amount: parseFloat(p.amount) || 0,
        crypto_amount: parseFloat(p.crypto_amount) || 0
      }))
    );
  } catch (error) {
    console.error('Get payouts error:', error);
    res.status(500).json({ error: 'Failed to fetch payouts' });
  }
});

// ==================== API KEYS ROUTES ====================

app.get('/api/api-keys', authenticateToken, async (req, res) => {
  try {
    const keys = await dbAll(
      'SELECT * FROM api_keys WHERE merchant_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(keys);
  } catch (error) {
    console.error('Get API keys error:', error);
    res.status(500).json({ error: 'Failed to fetch API keys' });
  }
});

app.post('/api/api-keys', authenticateToken, async (req, res) => {
  try {
    const { key_type = 'test' } = req.body;
    const keyId = `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const keyValue = `pk_${key_type}_${Math.random().toString(36).substr(2, 32)}`;

    await dbRun(
      'INSERT INTO api_keys (id, merchant_id, key_type, key_value) VALUES (?, ?, ?, ?)',
      [keyId, req.user.id, key_type, keyValue]
    );

    const key = await dbGet('SELECT * FROM api_keys WHERE id = ?', [keyId]);
    res.json(key);
  } catch (error) {
    console.error('Create API key error:', error);
    res.status(500).json({ error: 'Failed to create API key' });
  }
});

app.delete('/api/api-keys/:id', authenticateToken, async (req, res) => {
  try {
    await dbRun(
      'DELETE FROM api_keys WHERE id = ? AND merchant_id = ?',
      [req.params.id, req.user.id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Delete API key error:', error);
    res.status(500).json({ error: 'Failed to delete API key' });
  }
});

// ==================== WEBHOOKS ====================

app.get('/api/webhooks', authenticateToken, async (req, res) => {
  try {
    const webhooks = await dbAll(
      `SELECT id, url, events, status, created_at, last_delivery 
       FROM webhooks WHERE merchant_id = ? ORDER BY created_at DESC`,
      [req.user.id]
    );
    const parsed = webhooks.map(w => ({
      ...w,
      events: w.events ? JSON.parse(w.events) : []
    }));
    res.json(parsed);
  } catch (error) {
    console.error('Get webhooks error:', error);
    res.status(500).json({ error: 'Failed to fetch webhooks' });
  }
});

app.post('/api/webhooks', authenticateToken, async (req, res) => {
  try {
    const { url, events = [] } = req.body;
    if (!url || !Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: 'URL and events are required' });
    }
    const id = `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await dbRun(
      `INSERT INTO webhooks (id, merchant_id, url, events, status) VALUES (?, ?, ?, ?, 'active')`,
      [id, req.user.id, url, JSON.stringify(events)]
    );
    const webhook = await dbGet(
      `SELECT id, url, events, status, created_at, last_delivery FROM webhooks WHERE id = ?`,
      [id]
    );
    webhook.events = webhook.events ? JSON.parse(webhook.events) : [];
    res.json(webhook);
  } catch (error) {
    console.error('Create webhook error:', error);
    res.status(500).json({ error: 'Failed to create webhook' });
  }
});

app.patch('/api/webhooks/:id', authenticateToken, async (req, res) => {
  try {
    const { url, events, status } = req.body;
    await dbRun(
      `UPDATE webhooks SET 
        url = COALESCE(?, url),
        events = COALESCE(?, events),
        status = COALESCE(?, status)
       WHERE id = ? AND merchant_id = ?`,
      [
        url || null,
        events ? JSON.stringify(events) : null,
        status || null,
        req.params.id,
        req.user.id
      ]
    );
    const webhook = await dbGet(
      `SELECT id, url, events, status, created_at, last_delivery FROM webhooks WHERE id = ?`,
      [req.params.id]
    );
    if (!webhook) return res.status(404).json({ error: 'Webhook not found' });
    webhook.events = webhook.events ? JSON.parse(webhook.events) : [];
    res.json(webhook);
  } catch (error) {
    console.error('Update webhook error:', error);
    res.status(500).json({ error: 'Failed to update webhook' });
  }
});

app.delete('/api/webhooks/:id', authenticateToken, async (req, res) => {
  try {
    await dbRun('DELETE FROM webhooks WHERE id = ? AND merchant_id = ?', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete webhook error:', error);
    res.status(500).json({ error: 'Failed to delete webhook' });
  }
});

app.post('/api/webhooks/:id/test', authenticateToken, async (req, res) => {
  try {
    const webhook = await dbGet(
      'SELECT * FROM webhooks WHERE id = ? AND merchant_id = ?',
      [req.params.id, req.user.id]
    );
    if (!webhook) return res.status(404).json({ error: 'Webhook not found' });

    const deliveryId = `whd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const responseTime = `${Math.floor(Math.random() * 400) + 100}ms`;
    await dbRun(
      `INSERT INTO webhook_deliveries (id, webhook_id, event, status, response_time)
       VALUES (?, ?, ?, ?, ?)`,
      [deliveryId, webhook.id, 'payment.completed', 'success', responseTime]
    );
    await dbRun('UPDATE webhooks SET last_delivery = CURRENT_TIMESTAMP WHERE id = ?', [webhook.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Test webhook error:', error);
    res.status(500).json({ error: 'Failed to test webhook' });
  }
});

// ==================== TEAM MEMBERS ====================

app.get('/api/team', authenticateToken, async (req, res) => {
  try {
    const members = await dbAll(
      `SELECT id, name, email, role, status, created_at FROM team_members 
       WHERE merchant_id = ? ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(members);
  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

app.post('/api/team', authenticateToken, async (req, res) => {
  try {
    const { name, email, role = 'Member' } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    const id = `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await dbRun(
      `INSERT INTO team_members (id, merchant_id, name, email, role, status)
       VALUES (?, ?, ?, ?, ?, 'active')`,
      [id, req.user.id, name || null, email, role]
    );
    const member = await dbGet('SELECT id, name, email, role, status, created_at FROM team_members WHERE id = ?', [id]);
    res.json(member);
  } catch (error) {
    console.error('Create team member error:', error);
    res.status(500).json({ error: 'Failed to create team member' });
  }
});

app.patch('/api/team/:id', authenticateToken, async (req, res) => {
  try {
    const { role, status } = req.body;
    await dbRun(
      `UPDATE team_members SET 
        role = COALESCE(?, role),
        status = COALESCE(?, status)
       WHERE id = ? AND merchant_id = ?`,
      [role || null, status || null, req.params.id, req.user.id]
    );
    const member = await dbGet('SELECT id, name, email, role, status, created_at FROM team_members WHERE id = ?', [req.params.id]);
    if (!member) return res.status(404).json({ error: 'Team member not found' });
    res.json(member);
  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({ error: 'Failed to update team member' });
  }
});

app.delete('/api/team/:id', authenticateToken, async (req, res) => {
  try {
    await dbRun('DELETE FROM team_members WHERE id = ? AND merchant_id = ?', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({ error: 'Failed to delete team member' });
  }
});

// ==================== ADMIN ROUTES ====================

// Admin middleware - check if user is admin (you'll need to add admin field to merchants table)
const isAdmin = async (req, res, next) => {
  try {
    const merchant = await dbGet('SELECT id FROM merchants WHERE id = ?', [req.user.id]);
    // For now, allow all authenticated users to access admin routes
    // In production, add an 'is_admin' field and check it here
    next();
  } catch (error) {
    res.status(403).json({ error: 'Admin access required' });
  }
};

app.get('/api/admin/kyc/documents/:id/download', authenticateToken, isAdmin, async (req, res) => {
  try {
    const doc = await dbGet('SELECT * FROM kyc_documents WHERE id = ?', [req.params.id]);
    if (!doc || !doc.file_path) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.download(doc.file_path, doc.name);
  } catch (error) {
    console.error('Admin download KYC document error:', error);
    res.status(500).json({ error: 'Failed to download document' });
  }
});

app.get('/api/admin/merchants', authenticateToken, isAdmin, async (req, res) => {
  try {
    const merchants = await dbAll(`
      SELECT 
        m.id,
        m.email,
        m.business_name,
        m.kyc_status,
        m.created_at,
        COALESCE(SUM(p.amount_cad), 0) as total_volume,
        COUNT(p.id) as transaction_count
      FROM merchants m
      LEFT JOIN payments p ON m.id = p.merchant_id
      GROUP BY m.id, m.email, m.business_name, m.kyc_status, m.created_at
      ORDER BY m.created_at DESC
    `);

    res.json(merchants);
  } catch (error) {
    console.error('Get merchants error:', error);
    res.status(500).json({ error: 'Failed to fetch merchants' });
  }
});

app.get('/api/admin/merchants/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const merchant = await dbGet(
      `SELECT 
        id, email, business_name, business_number, industry, phone,
        address_line1, city, province, postal_code, kyc_status, created_at
       FROM merchants WHERE id = ?`,
      [req.params.id]
    );

    if (!merchant) {
      return res.status(404).json({ error: 'Merchant not found' });
    }

    // Get merchant stats
    const stats = await dbGet(`
      SELECT 
        COALESCE(SUM(amount_cad), 0) as total_volume,
        COUNT(*) as transaction_count
      FROM payments
      WHERE merchant_id = ?
    `, [req.params.id]);

    const beneficialOwners = await dbAll(
      `SELECT name, role, ownership, verified FROM beneficial_owners WHERE merchant_id = ?`,
      [req.params.id]
    );
    const documents = await dbAll(
      `SELECT id, name, document_type as type, status, upload_date as uploadDate FROM kyc_documents WHERE merchant_id = ?`,
      [req.params.id]
    );
    const notes = await dbAll(
      `SELECT author, text, created_at as date FROM admin_notes WHERE merchant_id = ? ORDER BY created_at DESC`,
      [req.params.id]
    );

    res.json({ 
      ...merchant, 
      ...stats,
      beneficialOwners,
      documents,
      notes
    });
  } catch (error) {
    console.error('Get merchant error:', error);
    res.status(500).json({ error: 'Failed to fetch merchant' });
  }
});

app.patch('/api/admin/merchants/:id/kyc-status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { kyc_status } = req.body;
    
    if (!['pending', 'approved', 'rejected', 'in-review'].includes(kyc_status)) {
      return res.status(400).json({ error: 'Invalid KYC status' });
    }

    await dbRun(
      'UPDATE merchants SET kyc_status = ? WHERE id = ?',
      [kyc_status, req.params.id]
    );

    const merchant = await dbGet('SELECT * FROM merchants WHERE id = ?', [req.params.id]);
    res.json(merchant);
  } catch (error) {
    console.error('Update KYC status error:', error);
    res.status(500).json({ error: 'Failed to update KYC status' });
  }
});

// ==================== ADMIN MONITORING ====================

app.get('/api/admin/transactions/monitoring', authenticateToken, isAdmin, async (req, res) => {
  try {
    const dateFilter = usePostgreSQL 
      ? "created_at::date = CURRENT_DATE"
      : "date(created_at) = date('now')";

    const stats = await dbGet(
      `SELECT 
        COALESCE(SUM(amount_cad), 0) as total_today,
        COUNT(*) as count_today,
        COUNT(CASE WHEN amount_cad >= 10000 THEN 1 END) as large_transactions
       FROM payments
       WHERE ${dateFilter}`,
      []
    );

    const recent = await dbAll(`
      SELECT 
        p.id,
        p.merchant_id,
        m.business_name as merchant_name,
        p.amount_cad,
        p.asset,
        p.crypto_amount,
        p.status,
        p.created_at
      FROM payments p
      JOIN merchants m ON p.merchant_id = m.id
      ORDER BY p.created_at DESC
      LIMIT 100
    `);

    const lastHourFilter = usePostgreSQL
      ? "created_at > NOW() - INTERVAL '1 hour'"
      : "created_at > datetime('now', '-1 hour')";

    const velocity = await dbAll(`
      SELECT merchant_id, COUNT(*) as cnt
      FROM payments
      WHERE ${lastHourFilter}
      GROUP BY merchant_id
      HAVING COUNT(*) >= 3
    `);
    const velocitySet = new Set(velocity.map(v => v.merchant_id));

    const recentWithFlags = recent.map(tx => ({
      id: tx.id,
      merchantName: tx.merchant_name || 'Unknown',
      amount: parseFloat(tx.crypto_amount) || 0,
      asset: tx.asset.toUpperCase(),
      cadValue: parseFloat(tx.amount_cad) || 0,
      timestamp: tx.created_at,
      flag: parseFloat(tx.amount_cad) >= 10000 ? 'large-transaction' : (velocitySet.has(tx.merchant_id) ? 'velocity' : null),
      status: tx.status
    }));

    const largeTransactions = recent
      .filter(tx => parseFloat(tx.amount_cad) >= 10000)
      .map(tx => ({
        id: tx.id,
        merchantName: tx.merchant_name || 'Unknown',
        amount: parseFloat(tx.amount_cad) || 0,
        asset: tx.asset.toUpperCase(),
        timestamp: tx.created_at,
        reported: true
      }));

    res.json({
      stats: {
        totalToday: parseFloat(stats.total_today) || 0,
        countToday: Number(stats.count_today) || 0,
        largeTransactions: Number(stats.large_transactions) || 0,
        suspiciousPatterns: velocitySet.size
      },
      recentTransactions: recentWithFlags,
      largeTransactions
    });
  } catch (error) {
    console.error('Admin monitoring error:', error);
    res.status(500).json({ error: 'Failed to fetch monitoring data' });
  }
});

app.get('/api/admin/compliance/events', authenticateToken, isAdmin, async (req, res) => {
  try {
    const events = await dbAll(`
      SELECT 
        p.id,
        p.amount_cad,
        p.created_at,
        m.business_name as merchant_name
      FROM payments p
      JOIN merchants m ON p.merchant_id = m.id
      WHERE p.amount_cad >= 10000
      ORDER BY p.created_at DESC
      LIMIT 100
    `);

    const mappedEvents = events.map((event) => {
      const date = new Date(event.created_at);
      const dateStamp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      return {
        id: event.id,
        type: 'Large Virtual Currency Transaction Report',
        date: dateStamp,
        merchant: event.merchant_name || 'Unknown',
        amount: parseFloat(event.amount_cad) || 0,
        status: 'submitted',
        reportId: `LVCTR-${dateStamp.replace(/-/g, '')}-${event.id.slice(-4).toUpperCase()}`
      };
    });

    res.json(mappedEvents);
  } catch (error) {
    console.error('Compliance events error:', error);
    res.status(500).json({ error: 'Failed to fetch compliance events' });
  }
});

app.get('/api/admin/compliance/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    const monthFilter = usePostgreSQL
      ? "created_at > NOW() - INTERVAL '30 days'"
      : "created_at > datetime('now', '-30 days')";
    const total = await dbGet(
      `SELECT COUNT(*) as total_reports FROM payments WHERE amount_cad >= 10000`,
      []
    );
    const monthly = await dbGet(
      `SELECT COUNT(*) as month_reports FROM payments WHERE amount_cad >= 10000 AND ${monthFilter}`,
      []
    );
    res.json({
      totalReports: Number(total.total_reports) || 0,
      thisMonth: Number(monthly.month_reports) || 0,
      pending: 0,
      submitted: Number(total.total_reports) || 0
    });
  } catch (error) {
    console.error('Compliance stats error:', error);
    res.status(500).json({ error: 'Failed to fetch compliance stats' });
  }
});

app.get('/api/admin/system-health', authenticateToken, isAdmin, async (req, res) => {
  try {
    let dbStatus = 'operational';
    try {
      await dbGet(usePostgreSQL ? 'SELECT 1 as ok' : 'SELECT 1 as ok', []);
    } catch {
      dbStatus = 'degraded';
    }

    const services = [
      {
        name: 'Database',
        status: dbStatus,
        uptime: 'n/a',
        lastCheck: new Date().toISOString(),
        details: {
          engine: usePostgreSQL ? 'PostgreSQL' : 'SQLite'
        }
      },
      {
        name: 'API Server',
        status: 'operational',
        uptime: `${Math.round(process.uptime())}s`,
        lastCheck: new Date().toISOString(),
        details: {
          node: process.version
        }
      },
      {
        name: 'Webhooks',
        status: 'operational',
        uptime: 'n/a',
        lastCheck: new Date().toISOString(),
        details: {
          queued: 0,
          failed: 0
        }
      }
    ];

    res.json({
      overall: dbStatus === 'operational' ? 'operational' : 'degraded',
      services
    });
  } catch (error) {
    console.error('System health error:', error);
    res.status(500).json({ error: 'Failed to fetch system health' });
  }
});

app.get('/api/admin/webhook-deliveries', authenticateToken, isAdmin, async (req, res) => {
  try {
    const logs = await dbAll(`
      SELECT 
        d.id,
        w.url,
        d.event,
        d.status,
        d.response_time,
        d.created_at
      FROM webhook_deliveries d
      JOIN webhooks w ON d.webhook_id = w.id
      ORDER BY d.created_at DESC
      LIMIT 100
    `);
    res.json(logs);
  } catch (error) {
    console.error('Webhook deliveries error:', error);
    res.status(500).json({ error: 'Failed to fetch webhook deliveries' });
  }
});

app.post('/api/admin/merchants/:id/notes', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Note text is required' });
    const noteId = `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await dbRun(
      `INSERT INTO admin_notes (id, merchant_id, author, text) VALUES (?, ?, ?, ?)`,
      [noteId, req.params.id, req.user.email || 'Admin', text]
    );
    const note = await dbGet(
      `SELECT author, text, created_at as date FROM admin_notes WHERE id = ?`,
      [noteId]
    );
    res.json(note);
  } catch (error) {
    console.error('Add admin note error:', error);
    res.status(500).json({ error: 'Failed to add note' });
  }
});

// ==================== COMPLIANCE ROUTES ====================

app.get('/api/compliance/logs', authenticateToken, async (req, res) => {
  try {
    const merchant = await dbGet(
      'SELECT kyc_status FROM merchants WHERE id = ?',
      [req.user.id]
    );
    const documents = await dbAll(
      `SELECT id, name, status, upload_date as uploadDate FROM kyc_documents WHERE merchant_id = ? ORDER BY upload_date DESC`,
      [req.user.id]
    );

    const kycStatus = {
      status: merchant?.kyc_status || 'pending',
      lastReview: documents[0]?.uploadDate || null,
      nextReview: null,
      documents
    };

    const largeTx = await dbAll(
      `SELECT id, amount_cad, asset, created_at FROM payments 
       WHERE merchant_id = ? AND amount_cad >= 10000 ORDER BY created_at DESC LIMIT 50`,
      [req.user.id]
    );
    const transactionMonitoring = largeTx.map(tx => ({
      id: tx.id,
      date: tx.created_at,
      type: 'Large Transaction',
      amount: tx.amount_cad,
      asset: tx.asset.toUpperCase(),
      description: 'Transaction exceeds $10,000 CAD threshold',
      status: 'logged',
      action: 'Reported to FINTRAC'
    }));

    const lastHourFilter = usePostgreSQL
      ? "created_at > NOW() - INTERVAL '1 hour'"
      : "created_at > datetime('now', '-1 hour')";
    const velocity = await dbGet(
      `SELECT COUNT(*) as cnt FROM payments WHERE merchant_id = ? AND ${lastHourFilter}`,
      [req.user.id]
    );
    const amlAlerts = velocity?.cnt >= 3 ? [{
      id: `aml_${Date.now()}`,
      date: new Date().toISOString(),
      severity: 'medium',
      type: 'Velocity Check',
      description: 'Multiple transactions in a short timeframe',
      status: 'under-review',
      assignedTo: 'Compliance Team'
    }] : [];

    const fintracReports = largeTx.map(tx => ({
      id: tx.id,
      type: 'Large Virtual Currency Transaction Report',
      date: tx.created_at,
      amount: tx.amount_cad,
      status: 'submitted',
      reportId: `LVCTR-${String(tx.id).slice(-6).toUpperCase()}`
    }));

    res.json({
      kycStatus,
      transactionMonitoring,
      amlAlerts,
      fintracReports
    });
  } catch (error) {
    console.error('Get compliance logs error:', error);
    res.status(500).json({ error: 'Failed to fetch compliance logs' });
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

// ==================== ERROR HANDLING ====================

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process, just log the error
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  // Don't exit immediately, allow server to continue
});

// ==================== SERVER START ====================

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0'; // Use 0.0.0.0 for Railway/production

// Validate required environment variables
if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'railbit-secret-key-change-in-production') {
    console.error('❌ ERROR: JWT_SECRET must be set in production!');
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL must be set in production!');
    process.exit(1);
  }
}

server.listen(PORT, HOST, () => {
  console.log(`🚀 RailBit Backend Server running on port ${PORT}`);
  console.log(`📡 Listening on ${HOST}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${frontendUrl}`);
  console.log(`💾 Database: ${usePostgreSQL ? 'PostgreSQL' : 'SQLite'}`);
  if (usePostgreSQL) {
    console.log(`🔗 Database URL: ${process.env.DATABASE_URL ? 'Set' : 'Missing'}`);
  }
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
