
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// File path for storing user data
const usersFilePath = './users.json';

// Function to read users data from the file
const readUsersData = () => {
  if (fs.existsSync(usersFilePath)) {
    const data = fs.readFileSync(usersFilePath);
    return JSON.parse(data);
  }
  return [];
};

// Function to write users data to the file
const writeUsersData = (data) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2));
};

// Registration route
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const users = readUsersData();
  const userExists = users.find((user) => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists!' });
  }

  // Save new user
  const newUser = { username, email, password };
  users.push(newUser);
  writeUsersData(users);

  res.status(201).json({ message: 'User registered successfully!' });
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const users = readUsersData();
  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(400).json({ message: 'User not found!' });
  }

  // Check password
  if (user.password !== password) {
    return res.status(400).json({ message: 'Invalid credentials!' });
  }

  res.json({ message: 'Login successful!' });
});

// Default route
app.get('/', (req, res) => {
  res.send('Backend is running on localhost');
});

// Start the server
const PORT = process.env.PORT || 3000; // Default to port 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});