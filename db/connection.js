const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/api_constr');

module.exports = mongoose;
