const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function test() {
  try {
    const form = new FormData();
    form.append('image', fs.createReadStream('../frontend/public/images/img_enterpr/hvtt-logo.png'));
    form.append('name', 'node-test');

    const res = await axios.post('http://localhost:5000/api/entrepreneurs', form, {
      headers: {
        ...form.getHeaders(),
        // 'x-auth-token': '<YOUR_TOKEN>' // add if you have a token
      },
      maxBodyLength: Infinity,
    });
    console.log('status', res.status, res.data);
  } catch (e) {
    if (e.response) console.error('resp', e.response.status, e.response.data);
    else console.error('err', e.message);
  }
}

test();
