const axios = require('axios');

const API_BASE = 'http://localhost:5000';

async function manageEvents() {
  try {
    console.log('📋 Fetching all events...\n');
    
    const response = await axios.get(`${API_BASE}/api/events`);
    const events = response.data.data || [];
    
    if (events.length === 0) {
      console.log('✅ No events found in database.');
      process.exit(0);
    }
    
    console.log(`Found ${events.length} event(s):\n`);
    events.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title}`);
      console.log(`   ID: ${event._id}`);
      console.log(`   Date: ${new Date(event.date).toLocaleString()}`);
      console.log(`   Active: ${event.isActive}`);
      console.log('');
    });
    
    // Check for command line argument to delete
    const args = process.argv.slice(2);
    if (args[0] === 'delete' && args[1]) {
      const eventId = args[1];
      console.log(`🗑️  Deleting event: ${eventId}\n`);
      
      try {
        const deleteResponse = await axios.delete(`${API_BASE}/api/events/${eventId}`, {
          headers: { 'Authorization': `Bearer ${process.env.AUTH_TOKEN || ''}` }
        });
        
        if (deleteResponse.data.success) {
          console.log('✅ Event deleted successfully!');
        } else {
          console.log('❌ Failed to delete event');
        }
      } catch (err) {
        if (err.response?.status === 401) {
          console.log('⚠️  Need authentication. Make sure you have admin privileges.');
        } else {
          console.log(`❌ Error: ${err.message}`);
        }
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

manageEvents();
