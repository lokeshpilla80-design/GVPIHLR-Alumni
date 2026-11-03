const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// Serve static files from frontend public directory
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Mock data storage
const alumniData = [
  {
    _id: '1',
    name: 'John Doe',
    iappudu: 'John Doe',
    batch: '2020',
    year: '2020',
    company: 'Tech Company',
    position: 'Software Engineer',
    location: 'Bangalore',
    image: 'http://localhost:5000/images/alumni/avatar1.svg',
    achievements: ['Best Student Award', 'Hackathon Winner'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    name: 'Jane Smith',
    iappudu: 'Jane Smith',
    batch: '2019',
    year: '2019',
    company: 'Startup Inc',
    position: 'Product Manager',
    location: 'Hyderabad',
    image: 'http://localhost:5000/images/alumni/avatar2.svg',
    achievements: ['Leadership Award'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '3',
    name: 'Raj Kumar',
    iappudu: 'Raj Kumar',
    batch: '2018',
    year: '2018',
    company: 'Google',
    position: 'Senior Developer',
    location: 'Bangalore',
    image: null,
    achievements: ['Google Code Jam Winner', 'Best Project Award'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '4',
    name: 'Priya Sharma',
    iappudu: 'Priya Sharma',
    batch: '2021',
    year: '2021',
    company: 'Microsoft',
    position: 'Data Scientist',
    location: 'Hyderabad',
    image: null,
    achievements: ['AI Research Excellence', 'Women in Tech Award'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const eventsData = [];

// test route
app.get("/", (req, res) => {
  res.send("Backend Running Successfully! - GVP Admin System");
});

// Authentication routes
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  
  // Fallback for admin when database is not connected
  if (email === 'admin@gvp.com' && password === '123456') {
    const token = jwt.sign(
      { id: 'admin-fallback', email: 'admin@gvp.com', name: 'Admin', role: 'admin' },
      'fallback-secret',
      { expiresIn: "1d" }
    );
    return res.json({ token });
  }
  
  res.status(400).json({ message: "Invalid credentials" });
});

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, 'fallback-secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

app.get("/api/auth/dashboard", authMiddleware, (req, res) => {
  // Handle fallback admin user
  if (req.user.id === 'admin-fallback') {
    return res.json({
      message: 'Welcome to the dashboard',
      user: {
        id: 'admin-fallback',
        email: 'admin@gvp.com',
        name: 'Admin',
        role: 'admin'
      }
    });
  }
  
  res.json({
    message: 'Welcome to the dashboard',
    user: req.user
  });
});

// Alumni APIs
app.get("/api/alumni", (req, res) => {
  res.json({
    success: true,
    data: alumniData.filter(a => a.isActive)
  });
});

// Events APIs
app.get("/api/events", (req, res) => {
  res.json({
    success: true,
    data: eventsData.filter(e => e.isActive)
  });
});

// Contacts APIs
app.get("/api/contacts", (req, res) => {
  res.json({
    success: true,
    data: []
  });
});

// server start
const server = app.listen(5000, () => {
  console.log("STABLE SERVER RUNNING ON PORT 5000!");
  console.log("APIs Ready:");
  console.log("- POST /api/auth/login");
  console.log("- GET /api/auth/dashboard");
  console.log("- GET /api/alumni");
  console.log("- GET /api/events"); 
  console.log("- GET /api/contacts");
  console.log("Admin Login: admin@gvp.com / 123456");
});

// Keep server running
console.log('Server is running. Press Ctrl+C to stop.');

process.on('SIGTERM', () => {
  console.log('\nSIGTERM received');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
