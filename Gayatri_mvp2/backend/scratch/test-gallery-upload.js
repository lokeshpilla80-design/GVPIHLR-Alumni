const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function test() {
  try {
    // 1. Login
    console.log('Logging in...');
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gvp.com',
      password: '123456'
    });
    const token = loginRes.data.token;
    console.log('Login successful! Token:', token);

    // 2. Upload test image
    console.log('Uploading test image...');
    const form = new FormData();
    // Use an existing webp/png in frontend/public/images/img_enterpr/hvtt-logo.png
    form.append('image', fs.createReadStream('../../frontend/public/images/img_enterpr/hvtt-logo.png'));
    form.append('title', 'test-upload-title');
    form.append('description', 'test-upload-desc');

    const res = await axios.post('http://localhost:5000/api/gallery', form, {
      headers: {
        ...form.getHeaders(),
        'x-auth-token': token
      }
    });

    console.log('Upload status:', res.status);
    console.log('Upload response data:', res.data);
  } catch (err) {
    if (err.response) {
      console.error('Error Response status:', err.response.status);
      console.error('Error Response data:', err.response.data);
    } else {
      console.error('Error:', err.message);
    }
  }
}

test();
