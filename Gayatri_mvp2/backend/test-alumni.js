const mongoose = require('mongoose');
require('dotenv').config();

// Test connection without complex password
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    
    // Test creating a sample alumni
    const AlumniStack = require('./models/AlumniStack');
    const testAlumni = new AlumniStack({
      name: 'Test Alumni',
      iappudu: 'Test User',
      batch: '2024',
      year: '2024',
      company: 'Test Company',
      position: 'Test Position',
      location: 'Test Location',
      image: '/images/alumni/test.jpg',
      achievements: ['Test Achievement'],
      isActive: true
    });
    
    testAlumni.save()
      .then(() => {
        console.log('✅ Test alumni created successfully!');
        process.exit(0);
      })
      .catch(err => {
        console.error('❌ Error creating test alumni:', err);
        process.exit(1);
      });
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });
