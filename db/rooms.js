const mongoose = require('./connection');

// _id is added by default
const roomsSchema = new mongoose.Schema(
  {
    buildingID: String,
    number: Number,
    description: String,
    maxCapacity: Number,
    type: String
  },
  { collection: 'rooms' }
);

module.exports = { Mongoose: mongoose, RoomsSchema: roomsSchema };