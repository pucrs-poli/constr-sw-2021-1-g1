const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/api_constr');

// _id is added by default
const buildingSchema = new mongoose.Schema(
  {
    floors: { type: Number, min: 0, max: 2 },
    name: String,
    description: String,
    maxCapacity: Number,
  },
  { collection: 'building' }
);

module.exports = { Mongoose: mongoose, BuildingSchema: buildingSchema };
