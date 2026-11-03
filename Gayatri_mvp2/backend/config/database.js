const mongoose = require('mongoose');

const atlasMongoURI = process.env.MONGO_URI;

// Connect directly to Atlas (skip local MongoDB)
const connectDB = async () => {
  if (!atlasMongoURI) {
    console.log('No MONGO_URI set — running without database');
    return;
  }
  try {
    await mongoose.connect(atlasMongoURI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      retryWrites: true,
    });
    console.log('✅ Connected to MongoDB Atlas');
    await createSampleData();
  } catch (err) {
    console.log('⚠️  Atlas connection failed — running with file-system fallback. Error:', err.message);
  }
};

// Create sample data
const createSampleData = async () => {
  const AlumniStack = require('../models/AlumniStack');
  const Event = require('../models/Event');
  const Notification = require('../models/Notification');
  
  try {
    const alumniCount = await AlumniStack.countDocuments();
    if (alumniCount === 0) {
      await AlumniStack.create([
        {
          name: 'John Doe',
          iappudu: 'John Doe',
          batch: '2020',
          year: '2020',
          company: 'Tech Company',
          position: 'Software Engineer',
          location: 'Bangalore',
          image: '/images/alumni/john.jpg',
          achievements: ['Best Student Award', 'Hackathon Winner'],
          isActive: true
        },
        {
          name: 'Jane Smith',
          iappudu: 'Jane Smith',
          batch: '2019',
          year: '2019',
          company: 'Startup Inc',
          position: 'Product Manager',
          location: 'Hyderabad',
          image: '/images/alumni/jane.jpg',
          achievements: ['Leadership Award'],
          isActive: true
        }
      ]);
      console.log('Sample alumni data created');
    }
    // create sample notifications if none exist
    try {
      const notifCount = await Notification.countDocuments();
      if (notifCount === 0) {
        await Notification.create([
          { title: 'Examinations April 2026 Notification', important: true, visible: true },
          { title: 'Results Declared for B.Tech I Semester', important: true, visible: true },
          { title: 'Last Date for Revaluation Applications', important: false, visible: true },
          { title: 'Alumni Meet Registration Open', important: false, visible: true },
          { title: 'Campus Placement Drive Updates', important: true, visible: true },
        ]);
        console.log('Sample notifications created');
      }
    } catch (e) {
      console.log('Error creating sample notifications:', e.message);
    }
    
    // No sample events created by default (events removed per user request)
  } catch (error) {
    console.log('Error creating sample data:', error.message);
  }
};

module.exports = connectDB;
