const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sequelize, User, List, Todo } = require("./models");

const app = express();
const port = 3001;
const cors = require("cors");

// JWT Secret
const JWT_SECRET = "your_jwt_secret"; // Use a more secure secret in production

// Use CORS middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to the database
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database connected\n");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

// Signup Route
app.post("/signup", async (req, res) => {
  console.log(`Attempting signup with body: ${JSON.stringify(req.body)}\n`);

  const { username, password } = req.body;

  // Check if username is already taken
  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    console.log(
      `Signup failed: User with username '${username}' already exists\n`
    );
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ username, password: hashedPassword });
    console.log(`User created with ID: ${user.id}\n`);

    // Create JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({ message: "User created", token });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(400).json({ message: "Invalid data" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  console.log(`Login attempt with username: ${req.body.username}\n`);

  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });

  if (user) {
    console.log(`User found: ${user.username}\n`);
    if (await bcrypt.compare(password, user.password)) {
      // Create JWT
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "1d",
      });
      console.log(`Login successful for user ID: ${user.id}\n`);
      return res.status(200).json({ message: "Login successful", token });
    } else {
      console.log("Login failed: Incorrect password\n");
      return res.status(401).json({ message: "Invalid username or password" });
    }
  } else {
    console.log("Login failed: User not found\n");
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Middleware to verify JWT and authenticate user
function isAuthenticated(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err); // Log error for debugging
      return res.status(401).json({ message: "Unauthorized, invalid token" });
    }

    // Attach user ID from decoded token to the request object
    req.userId = decoded.userId;
    next(); // Continue to the next middleware or route handler
  });
}

// List Routes (Authenticated)
app.get("/lists", isAuthenticated, async (req, res) => {
  try {
    console.log(`Fetching lists for user ID: ${req.userId}`);
    const lists = await List.findAll({
      where: { userId: req.userId },
      include: { model: Todo, as: "tasksList" },
    });
    console.log(`Found ${lists.length} lists for user ID: ${req.userId}`);
    res.json(lists);
  } catch (err) {
    console.error("Error fetching lists:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/lists", isAuthenticated, async (req, res) => {
  const name = req.body.name;
  console.log(`Title: ${name}`);
  if (!name) {
    return res.status(400).json({ message: "List name is required" });
  }

  try {
    console.log(`Creating list with name: ${name} for user ID: ${req.userId}`);
    const list = await List.create({ name, userId: req.userId });
    console.log(`Created list with ID: ${list.id}`);
    res.status(201).json(list);
  } catch (err) {
    console.error("Error creating list:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Todo Routes (Authenticated)
app.get("/todos/:listId", isAuthenticated, async (req, res) => {
  const { listId } = req.params;

  try {
    console.log(
      `Fetching list with ID: ${listId} for user ID: ${req.userId}\n`
    );

    // Find the specific list and include the todos
    const list = await List.findOne({
      where: { id: listId, userId: req.userId }, // Ensure the list belongs to the authenticated user
      include: [
        {
          model: Todo,
          as: "tasksList", // Alias for todos
        },
      ],
    });

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    console.log(
      `Found list "${list.name}" with ${list.tasksList.length} todos.\n`
    );

    // Return the list with its associated todos
    res.json(list);
  } catch (error) {
    console.error("Error fetching list with todos:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.post("/todos/:listId", isAuthenticated, async (req, res) => {
  const { listId } = req.params;
  const name = req.body.name;
  console.log(
    `Creating todo for list ID: ${listId} with task: ${name} for user ID: ${req.userId}\n`
  );
  const todo = await Todo.create({ name, listId, completed: false });
  console.log(`Created todo with ID: ${todo.id}\n`);
  res.status(201).json(todo);
});

app.put("/todos/:listId/:taskId", isAuthenticated, async (req, res) => {
  const { listId, taskId } = req.params;

  try {
    console.log(`Toggling task completion for task ID: ${taskId} in list ID: ${listId} for user ID: ${req.userId}\n`);

    // Find the list with the provided listId and check if it belongs to the authenticated user
    const list = await List.findOne({
      where: { id: listId, userId: req.userId },
      include: [
        {
          model: Todo,
          as: "tasksList",
        },
      ],
    });

    if (!list) {
      return res.status(404).json({ message: "List not found or does not belong to the user" });
    }

    // Find the task within the list's tasks
    const task = await Todo.findOne({
      where: { id: taskId, listId: listId },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Toggle the completed status
    task.completed = !task.completed;
    await task.save(); // Save the updated task

    console.log(`Toggled task with ID: ${taskId} to completed: ${task.completed}\n`);

    // Respond with the updated task
    res.json(task);
  } catch (error) {
    console.error("Error toggling task completion:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}\n`);
});
