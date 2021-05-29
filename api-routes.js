let router = require('express').Router();

router.get('/', function (req, res) {
  res.json({
    status: 'API Its Working',
    message: 'Initial route',
  });
});


// Start of buildings routes

router.get('/buildings/all', function (req, res) {
  const db = require('./db/buildings');
  const buildings = db.Mongoose.model('buildings', db.BuildingsSchema, 'buildings');
  buildings
    .find({})
    .lean()
    .exec(function (e, docs) {
      console.log(docs);
      res.json(docs);
      res.end();
    });
});

/**
 * Update an existing building
 */
router.put('/buildings/:id', function (req, res) {
  const db = require('./db/buildings');
  const buildings = db.Mongoose.model(
    'buildings',
    db.BuildingsSchema,
    'buildings'
  );

  buildings.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { upsert: true },
    function (err, doc) {
      if (err) {
        res.status(500).json({ error: err.message });
        res.end();
        return;
      }
      res.json(req.body);
      res.end();
    }
  );
});

// End of buildings routes

// Start of rooms routes

/**
 * Update an existing building
 */
router.put('/rooms/:id', function (req, res) {
  const db = require('./db/rooms');
  const rooms = db.Mongoose.model('rooms', db.RoomsSchema, 'rooms');

  rooms.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { upsert: true },
    function (err, doc) {
      if (err) {
        res.status(500).json({ error: err.message });
        res.end();
        return;
      }
      res.json(req.body);
      res.end();
    }
  );
});


// End of rooms routes

module.exports = router;
