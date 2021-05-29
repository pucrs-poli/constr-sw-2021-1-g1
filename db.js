const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/api_constr');

// _id is added by default
const buildingsSchema = new mongoose.Schema(
  {
    floors: { type: Number, min: 0, max: 2 },
    name: String,
    description: String,
    maxCapacity: Number,
  },
  { collection: 'buildings' }
);

module.exports = { Mongoose: mongoose, BuildingsSchema: buildingsSchema };
