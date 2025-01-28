const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const { sequelize, User, List, Todo } = require('./models');

const app = express();
const port = 3001;

const cors = require('cors');

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3000',  // Allow requests from your React frontend
  methods: ['GET', 'POST'],        // Allow only GET and POST requests
}));


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret',  // Use a more secure secret in production
  resave: false,
  saveUninitialized: true,
}));

// Connect to the database
sequelize.sync({ force: false })  // Set force: true only for fresh setups
  .then(() => {
    console.log('Database connected');
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });

// Signup Route
app.post('/signup', async (req, res) => {
  console.log(`Attempting signup with body ${req.body}`)
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const user = await User.create({ username, password: hashedPassword });
    req.session.userId = user.id;  // Set session
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ message: 'User already exists or invalid data' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  const user = await User.findOne({ where: { username } });
  
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user.id;  // Set session
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

// Check if user is logged in
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
}

// List Routes (Authenticated)
app.get('/lists', isAuthenticated, async (req, res) => {
  const lists = await List.findAll({ where: { userId: req.session.userId } });
  res.json(lists);
});

app.post('/lists', isAuthenticated, async (req, res) => {
  const { name } = req.body;
  const list = await List.create({ name, userId: req.session.userId });
  res.status(201).json(list);
});

// Todo Routes (Authenticated)
app.get('/todos/:listId', isAuthenticated, async (req, res) => {
  const { listId } = req.params;
  const todos = await Todo.findAll({ where: { listId } });
  res.json(todos);
});

app.post('/todos/:listId', isAuthenticated, async (req, res) => {
  const { listId } = req.params;
  const { task } = req.body;
  const todo = await Todo.create({ task, listId, completed: false });
  res.status(201).json(todo);
});

app.put('/todos/:listId/:todoId', isAuthenticated, async (req, res) => {
  const { todoId } = req.params;
  const { completed } = req.body;
  
  const todo = await Todo.findByPk(todoId);
  if (todo && todo.listId === parseInt(req.params.listId)) {
    todo.completed = completed;
    await todo.save();
    res.json(todo);
  } else {
    res.status(404).json({ message: 'Todo not found or unauthorized' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
