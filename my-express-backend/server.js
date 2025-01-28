const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize, User, List, Todo } = require('./models');

const app = express();
const port = 3001;
const cors = require('cors');

// JWT Secret
const JWT_SECRET = 'your_jwt_secret'; // Use a more secure secret in production

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to the database
sequelize.sync({ force: false })
  .then(() => {
    console.log('Database connected\n');
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });

// Signup Route
app.post('/signup', async (req, res) => {
  console.log(`Attempting signup with body: ${JSON.stringify(req.body)}\n`);
  
  const { username, password } = req.body;

  // Check if username is already taken
  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    console.log(`Signup failed: User with username '${username}' already exists\n`);
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ username, password: hashedPassword });
    console.log(`User created with ID: ${user.id}\n`);

    // Create JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ message: 'User created', token });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(400).json({ message: 'Invalid data' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  console.log(`Login attempt with username: ${req.body.username}\n`);

  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });

  if (user) {
    console.log(`User found: ${user.username}\n`);
    if (await bcrypt.compare(password, user.password)) {
      // Create JWT
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });
      console.log(`Login successful for user ID: ${user.id}\n`);
      return res.status(200).json({ message: 'Login successful', token });
    } else {
      console.log('Login failed: Incorrect password\n');
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  } else {
    console.log('Login failed: User not found\n');
    return res.status(401).json({ message: 'Invalid username or password' });
  }
});

// Middleware to verify JWT and authenticate user
function isAuthenticated(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, no token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('Token verification failed', err);
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Attach user ID to request for later use
    req.userId = decoded.userId;
    next();
  });
}

// List Routes (Authenticated)
app.get('/lists', isAuthenticated, async (req, res) => {
  console.log(`Fetching lists for user ID: ${req.userId}\n`);
  const lists = await List.findAll({ where: { userId: req.userId } });
  console.log(`Found ${lists.length} lists for user ID: ${req.userId}\n`);
  res.json(lists);
});

app.post('/lists', isAuthenticated, async (req, res) => {
  const { name } = req.body;
  console.log(`Creating list with name: ${name} for user ID: ${req.userId}\n`);
  const list = await List.create({ name, userId: req.userId });
  console.log(`Created list with ID: ${list.id}\n`);
  res.status(201).json(list);
});

// Todo Routes (Authenticated)
app.get('/todos/:listId', isAuthenticated, async (req, res) => {
  const { listId } = req.params;
  console.log(`Fetching todos for list ID: ${listId} for user ID: ${req.userId}\n`);
  const todos = await Todo.findAll({ where: { listId } });
  console.log(`Found ${todos.length} todos for list ID: ${listId}\n`);
  res.json(todos);
});

app.post('/todos/:listId', isAuthenticated, async (req, res) => {
  const { listId } = req.params;
  const { task } = req.body;
  console.log(`Creating todo for list ID: ${listId} with task: ${task} for user ID: ${req.userId}\n`);
  const todo = await Todo.create({ task, listId, completed: false });
  console.log(`Created todo with ID: ${todo.id}\n`);
  res.status(201).json(todo);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}\n`);
});
