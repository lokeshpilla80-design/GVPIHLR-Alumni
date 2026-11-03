const dns = require('dns');
const mongoose = require('mongoose');
require('dotenv').config();
const Event = require('./models/Event');

async function deleteEvent(eventId) {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    const atlasMongoURI = process.env.MONGO_URI;
    if (!atlasMongoURI) {
      console.error('No MONGO_URI configured in .env');
      process.exit(1);
    }

    await mongoose.connect(atlasMongoURI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
    });
    console.log('Connected to MongoDB');

    const event = await Event.findById(eventId);
    if (!event) {
      console.log('Event not found:', eventId);
      return;
    }

    console.log('Deleting event:', event.title, '-', event._id);
    await Event.findByIdAndDelete(eventId);
    console.log('Deleted successfully.');
  } catch (err) {
    console.error('Error deleting event:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

const [eventId] = process.argv.slice(2);
if (!eventId) {
  console.error('Usage: node delete-event.js <eventId>');
  process.exit(1);
}

deleteEvent(eventId);
