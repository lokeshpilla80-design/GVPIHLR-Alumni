const mongoose = require('mongoose');
require('dotenv').config();
const HeritageEvent = require('./models/HeritageEvent');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gvp_mvp';
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const events = [
  {
    campusName: 'Gayatri Vidya Parishad College for Degree and PG Courses (A)',
    location: 'Rushikonda, Visakhapatnam.',
    documentUrl: '/images/invetation/GVP-SriRama-Intivation-1.pdf',
    subEvents: [
      { title: 'Sundarakanda Parayanam and Havanam', dateString: '05/04/2025 at 8.00 AM' },
      { title: 'Sri Seetarama Kalyanam', dateString: '06/04/2025 at 8.00 AM' }
    ]
  },
  {
    campusName: 'Gayatri Vidya Parishad College of Engineering (A)',
    location: 'Kommadi, Visakhapatnam.',
    documentUrl: '/images/invetation/GVP-SriRama-Intivation-1.pdf',
    subEvents: [
      { title: 'Ramayana Parayanam and Havanam', dateString: '07/04/2025 to 13/04/2025 from 8 AM' },
      { title: 'Sri Seetarama Kalyanam', dateString: '14/04/2025 at 8.00 AM' }
    ]
  }
];

const seedData = async () => {
  await connectDB();
  try {
    await HeritageEvent.deleteMany({});
    console.log('Cleared existing heritage events...');
    await HeritageEvent.insertMany(events);
    console.log('Successfully seeded Heritage Events!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    process.exit(0);
  }
};

seedData();
