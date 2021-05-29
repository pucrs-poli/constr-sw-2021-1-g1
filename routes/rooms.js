let roomsRouter = require('express').Router();
const STATUS_CODE = require('../utils/constants');
const checkErrorMessage = require('../utils/checkErrorMessage');

// Start of rooms routes

/**
 * Update an existing room
 */
roomsRouter.put('/rooms/:id', function (req, res) {
  const db = require('../db/rooms');
  const rooms = db.Mongoose.model('rooms', db.RoomsSchema, 'rooms');

  rooms.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { upsert: true },
    function (err) {
      if (err) {
        checkErrorMessage(err, res);
      }

      res.status(STATUS_CODE.success).json(req.body);
      res.end();
    }
  );
});

/**
 * Update some attributes of an existing room
 */
roomsRouter.patch('/rooms/:id', async function (req, res) {
  const db = require('../db/rooms');
  const rooms = db.Mongoose.model('rooms', db.RoomsSchema, 'rooms');

  const { number, description, maxCapacity, type } = req.body;
  let roomReturn;

  try {
    roomReturn = await rooms.findById(req.params.id);
  } catch (err) {
    res.status(500).json({ error: err.message });
    res.end();
    return;
  }

  if (number) {
    roomReturn.number = number;
  }

  if (description) {
    roomReturn.description = description;
  }

  if (maxCapacity) {
    roomReturn.maxCapacity = maxCapacity;
  }

  if (type) {
    roomReturn.type = type;
  }

  try {
    await roomReturn.save();
    res.status(STATUS_CODE.success).json(roomReturn);
  } catch (err) {
    res.status(500).json({ error: err.message });
    res.end();
    return;
  }
});

module.exports = roomsRouter;
