let buildingsRouter = require('express').Router();
const STATUS_CODE = require('../utils/constants');
const checkErrorMessage = require('../utils/checkErrorMessage');
const { success } = require('../utils/constants');

buildingsRouter.get('/buildings/all', function (req, res) {
  try{
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
      if(docs.length === 0){
        res.status(STATUS_CODE.not_found).json({
          success: false,
          message: "Buildings not found."
        })
      }else{      
        res.status(STATUS_CODE.success).json(docs);
      }
      res.end();
    });
  }catch(err){
      if (err) {
        checkErrorMessage(err, res);
      }
      res.status(500).json({ error: err });
      res.end();
      return;
  }
});

buildingsRouter.get('/buildings/:id', async function (req, res) {
  try{
      const db = require('../db/buildings');
      const buildings = db.Mongoose.model(
        'buildings',
        db.BuildingsSchema,
        'buildings'
      );

      buildings
    .findById(req.params.id)
    .lean()
    .exec(function (e, result) {

      if(!result){
        res.status(STATUS_CODE.not_found).json({
          success: false,
          message: "Building not found."
        })
      }else{
        res.status(STATUS_CODE.success).json(result);
      }
      res.end();})
    }catch(err){
        if (err) {
          checkErrorMessage(err, res);
        }
        res.status(500).json({ error: err });
        res.end();
        return;
    }
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
    if (floors || name || description || maxCapacity)
      res.status(STATUS_CODE.success).json(buildingReturn);
    else {
      res.status(STATUS_CODE.precondition_failed).json({ error: 'Invalid attributes provided' });
      res.end();
      return;
    }
  } catch (err) {
    if (err) {
      checkErrorMessage(err, res);
    }
    return;
  }
});

buildingsRouter.post('/buildings/', async function (req, res) {
  try {
    const db = require('../db/buildings');
    const buildings = db.Mongoose.model(
      'buildings',
      db.BuildingsSchema,
      'buildings'
    );

    const {
      floors,
      name,
      description,
      maxCapacity
    } = req.body

    const result = await buildings
    .findById(req.params.id)
    .lean()
    .exec()
    if (result) {
      res.status(STATUS_CODE.conflict).json({success: false, message: "Building already exists"});
    }
    else {
      buildings.create({
        floors,
        name,
        description,
        maxCapacity
      })
      res.status(STATUS_CODE.success).json({success: true, message: "Building created"});
      return;
    }
      console.log(result)
  }catch(err){

  }
});

module.exports = buildingsRouter;
