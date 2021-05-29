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

/**
 * Update some attributes of an existing building
 */
router.patch('/buildings/:id', async function (req, res) {
  const db = require('./db/buildings');
  const buildings = db.Mongoose.model(
    'buildings',
    db.BuildingsSchema,
    'buildings'
  );

  const { floors, name, description, maxCapacity } = req.body;
  let buildingReturn;
  
  try {
   buildingReturn = await buildings.findById(req.params.id); 
  } catch (err) {
    res.status(500).json({ error: err.message });
    res.end();
    return;
  }

  if (floors) {
    buildingReturn.floors = floors;
  }

  if (name) {
    buildingReturn.name = name;
  }

  if (description) {
    buildingReturn.description = description;
  }

  if (maxCapacity) {
    buildingReturn.maxCapacity = maxCapacity;
  }

  try {
    await buildingReturn.save();
    res.status(200).json(buildingReturn);
  } catch (err) {
    res.status(500).json({ error: err.message });
    res.end();
    return;
  }
  
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
