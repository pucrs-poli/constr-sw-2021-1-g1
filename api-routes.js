let router = require('express').Router();

router.get('/', function (req, res) {
  res.json({
    status: 'API Its Working',
    message: 'Initial route',
  });
});

const STATUS_CODE = {
  success: 200,
  created: 201,
  not_found: 404,
  precondition_failed: 412,
};

const checkErrorMessage = (err, res) => {
  if (err.name == 'CastError' || err.name == 'ValidationError') {
    if (err.kind == 'ObjectID') {
      res.status(STATUS_CODE.not_found).json({ error: err });
      res.end();
      return;
    } else {
      res.status(STATUS_CODE.precondition_failed).json({ error: err });
      res.end();
      return;
    }
  }

  res.status(500).json({ error: err.message });
  res.end();
  return;
}

// Start of buildings routes

router.get('/buildings/all', function (req, res) {
  const db = require('./db/buildings');
  const buildings = db.Mongoose.model('buildings', db.BuildingsSchema, 'buildings');
  
  buildings
    .find({})
    .lean()
    .exec(function (e, docs) {
      res.status(STATUS_CODE.success).json(docs);
      res.end();
    });
});

router.get('/buildings', function(req, res){
  const db = require('./db/buildings');
  const buildings = db.Mongoose.model('buildings', db.BuildingsSchema, 'buildings');
  
  const name = req.query.name;
  
  buildings.find({name:name})
  .lean()
  .exec(function(e, docs){
    res.status(STATUS_CODE.success).json(docs);
    res.end;
  });
});

router.get('/buildings/findBy',function(req,res){
  const db = require('./db/buildings');
  const buildings = db.Mongoose.model('buildings', db.BuildingsSchema, 'buildings');

  const floors = req.query.floors;
  const name = req.query.name;
  const description = req.query.description;
  const maxCapacity = req.query.maxCapacity;

  buildings.
    find({floors:floors, name:name, description:description, maxCapacity:maxCapacity})
    .lean()
    .exec(function(e, docs){
      res.status(STATUS_CODE.success).json(docs);
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
        checkErrorMessage(err, res);
      }
      res.status(STATUS_CODE.success).json(req.body);
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
    res.status(STATUS_CODE.not_found).json({ error: err });
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
    res.status(STATUS_CODE.success).json(buildingReturn);
  } catch (err) {
    if (err) {
      checkErrorMessage(err, res);
    }
    res.status(500).json({ error: err });
    res.end();
    return;
  }
});

// End of buildings routes

// Start of rooms routes

router.get('/rooms/findBy',function(req,res){
  const db = require('./db/rooms');
  const buildings = db.Mongoose.model('rooms', db.RoomsSchema, 'rooms');

  const number = req.query.number;
  const description = req.query.description;
  const maxCapacity = req.query.maxCapacity;
  const type = req.query.type;

  buildings.
    find({number:number, type:type, description:description, maxCapacity:maxCapacity})
    .lean()
    .exec(function(e, docs){
      res.status(STATUS_CODE.success).json(docs);
      res.end();
    });
});

/**
 * Update an existing room
 */
router.put('/rooms/:id', function (req, res) {
  const db = require('./db/rooms');
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
router.patch('/rooms/:id', async function (req, res) {
  const db = require('./db/rooms');
  const rooms = db.Mongoose.model(
    'rooms',
    db.RoomsSchema,
    'rooms'
  );

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

// End of rooms routes

module.exports = router;
