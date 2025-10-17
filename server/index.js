require('dotenv').config({ path: './.env' });
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');


const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'your-frontend-url' : 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fes_notesdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Initialize database tables
async function initializeDatabase() {
  try {
    // Create users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create notes table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        color VARCHAR(20) DEFAULT 'yellow',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Add color column to existing notes table if it doesn't exist
    try {
      await pool.execute(`
        ALTER TABLE notes ADD COLUMN color VARCHAR(20) DEFAULT 'yellow'
      `);
      console.log('Added color column to notes table');
    } catch (error) {
      // Column might already exist, ignore the error
      if (!error.message.includes('Duplicate column name')) {
        console.log('Color column already exists or other error:', error.message);
      }
    }

    // Create shared_notes table for note sharing
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS shared_notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        note_id INT NOT NULL,
        owner_id INT NOT NULL,
        shared_with_id INT NOT NULL,
        permission ENUM('read', 'edit') DEFAULT 'read',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (shared_with_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_share (note_id, shared_with_id)
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Validation middleware
const validateRegistration = [
  body('username').isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
];

const validateNote = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required')
];

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// User registration
app.post('/api/auth/register', validateRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email or username' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: result.insertId, username, email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login
app.post('/api/auth/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Notes routes

// Get all notes for authenticated user (owned + shared)
app.get('/api/notes', authenticateToken, async (req, res) => {
  try {
    const { search, sort = 'created_at', order = 'DESC' } = req.query;
    
    // Query for owned notes
    let ownedQuery = 'SELECT *, "owner" as note_type, user_id as original_owner_id FROM notes WHERE user_id = ?';
    let ownedParams = [req.user.userId];

    if (search) {
      ownedQuery += ' AND (title LIKE ? OR content LIKE ?)';
      const searchTerm = `%${search}%`;
      ownedParams.push(searchTerm, searchTerm);
    }

    // Query for shared notes
    let sharedQuery = `
      SELECT n.*, "shared" as note_type, n.user_id as original_owner_id, 
             u.username as owner_username, sn.permission
      FROM notes n
      JOIN shared_notes sn ON n.id = sn.note_id
      JOIN users u ON n.user_id = u.id
      WHERE sn.shared_with_id = ?
    `;
    let sharedParams = [req.user.userId];

    if (search) {
      sharedQuery += ' AND (n.title LIKE ? OR n.content LIKE ?)';
      const searchTerm = `%${search}%`;
      sharedParams.push(searchTerm, searchTerm);
    }

    // Execute both queries
    const [ownedNotes] = await pool.execute(ownedQuery, ownedParams);
    const [sharedNotes] = await pool.execute(sharedQuery, sharedParams);

    // Combine and sort all notes
    const allNotes = [...ownedNotes, ...sharedNotes];
    
    // Sort combined results
    allNotes.sort((a, b) => {
      if (order === 'DESC') {
        return new Date(b[sort]) - new Date(a[sort]);
      } else {
        return new Date(a[sort]) - new Date(b[sort]);
      }
    });

    res.json({ notes: allNotes });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Share note with multiple users (MUST be before /api/notes/:id route)
app.post('/api/notes/:id/share', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { usernames, permission = 'read' } = req.body;

    // Support both single username (string) and multiple usernames (array)
    const usernameList = Array.isArray(usernames) ? usernames : [usernames];

    if (!usernameList || usernameList.length === 0) {
      return res.status(400).json({ error: 'At least one username is required' });
    }

    // Validate permission
    if (!['read', 'edit'].includes(permission)) {
      return res.status(400).json({ error: 'Invalid permission. Use "read" or "edit"' });
    }

    // Check if note exists and belongs to user
    const [notes] = await pool.execute(
      'SELECT id, title FROM notes WHERE id = ? AND user_id = ?',
      [id, req.user.userId]
    );

    if (notes.length === 0) {
      return res.status(404).json({ error: 'Note not found or you do not own this note' });
    }

    const results = {
      successful: [],
      failed: []
    };

    // Process each username
    for (const username of usernameList) {
      try {
        const trimmedUsername = username.trim();
        if (!trimmedUsername) continue;

        // Find user to share with
        const [users] = await pool.execute(
          'SELECT id, username FROM users WHERE username = ?',
          [trimmedUsername]
        );

        if (users.length === 0) {
          results.failed.push({ username: trimmedUsername, error: 'User not found' });
          continue;
        }

        const sharedWithUser = users[0];

        // Don't allow sharing with yourself
        if (sharedWithUser.id === req.user.userId) {
          results.failed.push({ username: trimmedUsername, error: 'Cannot share with yourself' });
          continue;
        }

        // Check if already shared
        const [existingShares] = await pool.execute(
          'SELECT id FROM shared_notes WHERE note_id = ? AND shared_with_id = ?',
          [id, sharedWithUser.id]
        );

        if (existingShares.length > 0) {
          // Update existing share
          await pool.execute(
            'UPDATE shared_notes SET permission = ? WHERE note_id = ? AND shared_with_id = ?',
            [permission, id, sharedWithUser.id]
          );
          results.successful.push({ username: trimmedUsername, action: 'updated' });
        } else {
          // Create new share
          await pool.execute(
            'INSERT INTO shared_notes (note_id, owner_id, shared_with_id, permission) VALUES (?, ?, ?, ?)',
            [id, req.user.userId, sharedWithUser.id, permission]
          );
          results.successful.push({ username: trimmedUsername, action: 'shared' });
        }
      } catch (userError) {
        console.error(`Error sharing with ${username}:`, userError);
        results.failed.push({ username: username.trim(), error: 'Failed to share' });
      }
    }

    // Determine response based on results
    if (results.successful.length === 0) {
      return res.status(400).json({ 
        error: 'Failed to share with any users', 
        details: results.failed 
      });
    }

    const message = results.successful.length === 1 
      ? `Note shared successfully with ${results.successful[0].username}`
      : `Note shared successfully with ${results.successful.length} users`;

    res.json({
      message,
      successful: results.successful,
      failed: results.failed,
      permission: permission
    });
  } catch (error) {
    console.error('Share note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single note
app.get('/api/notes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [notes] = await pool.execute(
      'SELECT * FROM notes WHERE id = ? AND user_id = ?',
      [id, req.user.userId]
    );

    if (notes.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ note: notes[0] });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to create a new note
app.post('/api/notes', authenticateToken, validateNote, async (req, res) => {
  try {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract note data from request body (color defaults to yellow)
    const { title, content, color = 'yellow' } = req.body;

    // Insert new note into database
    const [result] = await pool.execute(
      'INSERT INTO notes (user_id, title, content, color) VALUES (?, ?, ?, ?)',
      [req.user.userId, title, content, color]
    );

    // Fetch the newly created note to return to client
    const [newNote] = await pool.execute(
      'SELECT * FROM notes WHERE id = ?',
      [result.insertId]
    );

    // Send success response with created note
    res.status(201).json({
      message: 'Note created successfully',
      note: newNote[0]
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to update an existing note
app.put('/api/notes/:id', authenticateToken, validateNote, async (req, res) => {
  try {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract note ID from URL and data from request body
    const { id } = req.params;
    const { title, content, color = 'yellow' } = req.body;

    // Check if user owns the note
    const [ownedNotes] = await pool.execute(
      'SELECT id FROM notes WHERE id = ? AND user_id = ?',
      [id, req.user.userId]
    );

    let canEdit = ownedNotes.length > 0;

    // If not owner, check if user has edit permission through sharing
    if (!canEdit) {
      const [sharedNotes] = await pool.execute(
        'SELECT permission FROM shared_notes WHERE note_id = ? AND shared_with_id = ? AND permission = "edit"',
        [id, req.user.userId]
      );
      canEdit = sharedNotes.length > 0;
    }

    if (!canEdit) {
      return res.status(403).json({ error: 'You do not have permission to edit this note' });
    }

    // Update note in database (don't change user_id, keep original owner)
    await pool.execute(
      'UPDATE notes SET title = ?, content = ?, color = ? WHERE id = ?',
      [title, content, color, id]
    );

    // Fetch updated note to return to client
    const [updatedNote] = await pool.execute(
      'SELECT * FROM notes WHERE id = ?',
      [id]
    );

    // Send success response with updated note
    res.json({
      message: 'Note updated successfully',
      note: updatedNote[0]
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Get shared notes (notes shared with current user)
app.get('/api/notes/shared', authenticateToken, async (req, res) => {
  try {
    const [sharedNotes] = await pool.execute(`
      SELECT n.*, u.username as owner_username, sn.permission, sn.created_at as shared_at
      FROM notes n
      JOIN shared_notes sn ON n.id = sn.note_id
      JOIN users u ON n.user_id = u.id
      WHERE sn.shared_with_id = ?
      ORDER BY sn.created_at DESC
    `, [req.user.userId]);

    res.json({ notes: sharedNotes });
  } catch (error) {
    console.error('Get shared notes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get users who have access to a specific note (for note owners)
app.get('/api/notes/:id/shares', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if note exists and belongs to user
    const [notes] = await pool.execute(
      'SELECT id, title FROM notes WHERE id = ? AND user_id = ?',
      [id, req.user.userId]
    );

    if (notes.length === 0) {
      return res.status(404).json({ error: 'Note not found or you do not own this note' });
    }

    // Get all users who have access to this note
    const [shares] = await pool.execute(`
      SELECT u.username, sn.permission, sn.created_at as shared_at
      FROM shared_notes sn
      JOIN users u ON sn.shared_with_id = u.id
      WHERE sn.note_id = ?
      ORDER BY sn.created_at DESC
    `, [id]);

    res.json({ shares });
  } catch (error) {
    console.error('Get note shares error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove sharing access from a user
app.delete('/api/notes/:id/shares/:username', authenticateToken, async (req, res) => {
  try {
    const { id, username } = req.params;

    // Check if note exists and belongs to user
    const [notes] = await pool.execute(
      'SELECT id, title FROM notes WHERE id = ? AND user_id = ?',
      [id, req.user.userId]
    );

    if (notes.length === 0) {
      return res.status(404).json({ error: 'Note not found or you do not own this note' });
    }

    // Find user to remove access from
    const [users] = await pool.execute(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove sharing access
    const [result] = await pool.execute(
      'DELETE FROM shared_notes WHERE note_id = ? AND shared_with_id = ?',
      [id, users[0].id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Share not found' });
    }

    res.json({ message: `Removed sharing access for ${username}` });
  } catch (error) {
    console.error('Remove share error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete note
app.delete('/api/notes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if note exists and belongs to user
    const [existingNotes] = await pool.execute(
      'SELECT id FROM notes WHERE id = ? AND user_id = ?',
      [id, req.user.userId]
    );

    if (existingNotes.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    await pool.execute(
      'DELETE FROM notes WHERE id = ? AND user_id = ?',
      [id, req.user.userId]
    );

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
async function startServer() {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
}

startServer().catch(console.error);