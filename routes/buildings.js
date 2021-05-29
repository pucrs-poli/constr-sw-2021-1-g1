let buildingsRouter = require('express').Router();
const STATUS_CODE = require('../utils/constants');
const checkErrorMessage = require('../utils/checkErrorMessage');

buildingsRouter.get('/buildings/all', function (req, res) {
  const db = require('../db/buildings');
  const buildings = db.Mongoose.model(
    'buildings',
    db.BuildingsSchema,
    'buildings'
  );

  buildings
    .find({})
    .lean()
    .exec(function (e, docs) {
      res.status(STATUS_CODE.success).json(docs);
      res.end();
    });
});

/**
 * Update an existing building
 */
buildingsRouter.put('/buildings/:id', function (req, res) {
  const db = require('../db/buildings');
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
buildingsRouter.patch('/buildings/:id', async function (req, res) {
  const db = require('../db/buildings');
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
module.exports = buildingsRouter;
