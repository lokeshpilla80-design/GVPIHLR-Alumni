const mongoose = require('mongoose');
const ContentSection = require('./models/ContentSection');
require('dotenv').config();

async function setupAlumniCorner() {
  try {
    // Connect to MongoDB using the same connection as server.js
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if alumni-corner content already exists
    const existing = await ContentSection.findOne({ sectionId: 'alumni-corner' });
    if (existing) {
      console.log('Alumni Corner content already exists');
      await mongoose.connection.close();
      return;
    }

    // Create alumni-corner content
    const alumniCorner = new ContentSection({
      sectionId: 'alumni-corner',
      title: 'Welcome to Alumni Corner',
      body: 'Connect with our distinguished alumni network and explore endless opportunities for collaboration and growth. Our alumni are spread across the globe, making significant contributions in various fields.\n\nStay connected with your alma mater and fellow alumni through our various programs and events.\n\nJoin us in building a stronger alumni community!'
    });

    await alumniCorner.save();
    console.log('Alumni Corner content created successfully');
    
  } catch (error) {
    console.error('Error setting up Alumni Corner:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

setupAlumniCorner();
