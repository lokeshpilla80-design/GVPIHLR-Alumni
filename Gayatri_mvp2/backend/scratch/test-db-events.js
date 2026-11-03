const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config({ path: '../.env' });
const Event = require('../models/Event');

async function check() {
  try {
    const uri = process.env.MONGO_URI;
    console.log('Connecting to', uri);
    await mongoose.connect(uri);
    console.log('Connected!');
    const events = await Event.find({});
    console.log('Events found:', events.length);
    events.forEach(ev => {
      console.log(`- ID: ${ev._id}, Title: ${ev.title}, Date: ${ev.date}, Images Count: ${ev.images?.length}, IsActive: ${ev.isActive}`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
