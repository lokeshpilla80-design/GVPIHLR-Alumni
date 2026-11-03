const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// Mock data storage
let alumniData = [
  {
    _id: '1',
    name: 'John Doe',
    iappudu: 'John Doe',
    batch: '2020',
    year: '2020',
    company: 'Tech Company',
    position: 'Software Engineer',
    location: 'Bangalore',
    image: '/images/alumni/john.jpg',
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
    image: '/images/alumni/jane.jpg',
    achievements: ['Leadership Award'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let eventsData = [
  // No seeded events (removed Alumni Meet 2024)
];

let contactsData = [
  {
    _id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+91 9876543210',
    subject: 'Alumni Registration',
    message: 'I would like to register for the alumni association.',
    type: 'alumni',
    isRead: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// test route
app.get("/", (req, res) => {
  res.send("Backend Running Successfully! No MongoDB needed! - GVP Admin System");
});

// Alumni APIs
app.get("/api/alumni", (req, res) => {
  res.json({
    success: true,
    data: alumniData.filter(a => a.isActive)
  });
});

app.get("/api/alumni/admin/all", (req, res) => {
  res.json({
    success: true,
    data: alumniData
  });
});

app.post("/api/alumni", (req, res) => {
  const newAlumni = {
    _id: Date.now().toString(),
    ...req.body,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  alumniData.push(newAlumni);
  res.json({
    success: true,
    data: newAlumni,
    message: 'Alumni created successfully'
  });
});

// Events APIs
app.get("/api/events", (req, res) => {
  res.json({
    success: true,
    data: eventsData.filter(e => e.isActive)
  });
});

app.get("/api/events/admin/all", (req, res) => {
  res.json({
    success: true,
    data: eventsData
  });
});

app.post("/api/events", (req, res) => {
  const newEvent = {
    _id: Date.now().toString(),
    ...req.body,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  eventsData.push(newEvent);
  res.json({
    success: true,
    data: newEvent,
    message: 'Event created successfully'
  });
});

// Contacts APIs
app.get("/api/contacts", (req, res) => {
  res.json({
    success: true,
    data: contactsData.filter(c => c.isActive)
  });
});

app.get("/api/contacts/admin/all", (req, res) => {
  res.json({
    success: true,
    data: contactsData
  });
});

app.post("/api/contacts", (req, res) => {
  const newContact = {
    _id: Date.now().toString(),
    ...req.body,
    isRead: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  contactsData.push(newContact);
  res.json({
    success: true,
    data: newContact,
    message: 'Contact submitted successfully'
  });
});

// server start
app.listen(5000, () => {
  console.log("SIMPLE SERVER RUNNING ON PORT 5000 - NO MONGODB NEEDED!");
  console.log("APIs Ready:");
  console.log("- GET /api/alumni");
  console.log("- GET /api/events"); 
  console.log("- GET /api/contacts");
  console.log("- POST /api/alumni");
  console.log("- POST /api/events");
  console.log("- POST /api/contacts");
});
