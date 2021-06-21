const mongoose = require('mongoose');
require('dotenv').config();

try {
  mongoose.connect(process.env.MONGODB_URL);
} catch(err){
  console.log('Unable to connect to ', process.env.MONGODB_URL);
  return;
}

module.exports = mongoose;
