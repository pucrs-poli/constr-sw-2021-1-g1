let express = require('express');
require('dotenv').config();

let app = express();
const apiRoutes = require('./routes/api-routes');
const buildingsRoutes = require('./routes/buildings');
const roomsRoutes = require('./routes/rooms.js');

const BASE_URL = '/api';

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(BASE_URL, apiRoutes);
app.use(BASE_URL, buildingsRoutes);
app.use(BASE_URL, roomsRoutes);

module.exports = app;