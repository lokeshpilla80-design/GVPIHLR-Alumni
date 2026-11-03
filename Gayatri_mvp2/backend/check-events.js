require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');
const Notification = require('./models/Notification');

async function checkEvents() {
  try {
    const atlasMongoURI = process.env.MONGO_URI;
    if (!atlasMongoURI) {
      console.log('❌ No MONGO_URI found in environment variables');
      return;
    }

    await mongoose.connect(atlasMongoURI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log('✅ Connected to MongoDB\n');

    // Get all events
    const events = await Event.find();
    console.log(`📋 Total Events in Database: ${events.length}\n`);

    if (events.length === 0) {
      console.log('No events found.');
      await mongoose.connection.close();
      return;
    }

    // Display all events
    events.forEach((event, index) => {
      console.log(`\n${index + 1}. Event ID: ${event._id}`);
      console.log(`   Title: ${event.title}`);
      console.log(`   Date: ${new Date(event.date).toISOString()}`);
      console.log(`   Active: ${event.isActive}`);
      console.log(`   Notice ID: ${event.noticeId || 'None'}`);
    });

    // Get command line arguments
    const args = process.argv.slice(2);
    
    if (args[0] === 'delete' && args[1]) {
      const eventId = args[1];
      console.log(`\n\n🗑️  Attempting to delete event: ${eventId}`);
      
      const event = await Event.findByIdAndDelete(eventId);
      if (event) {
        console.log(`✅ Event deleted: ${event.title}`);
        
        if (event.noticeId) {
          await Notification.findByIdAndDelete(event.noticeId);
          console.log(`✅ Associated notice also deleted`);
        }
      } else {
        console.log(`❌ Event not found`);
      }
    } else if (args[0] === 'delete-all') {
      console.log(`\n\n⚠️  Deleting ALL events...`);
      const result = await Event.deleteMany({});
      await Notification.deleteMany({});
      console.log(`✅ Deleted ${result.deletedCount} events and their notices`);
    }

    await mongoose.connection.close();
    console.log('\n✅ Disconnected from database');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkEvents();
