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
    //pegando os buildings do mongo
    const db = require('../db/buildings');
    const buildings = db.Mongoose.model(
      'buildings',
      db.BuildingsSchema,
      'buildings'
    );
    //declarando as consts necessarias para criar um building
    const {
      floors,
      name,
      description,
      maxCapacity
    } = req.body

    //vendo se ja existe um building com este id
    const result = await buildings
    .findById(req.params.id)
    .lean()
    .exec()
    if (result) {
      res.status(STATUS_CODE.conflict).json({success: false, message: "Building already exists"});
    }
    else {
      const building = await buildings.create({
        floors,
        name,
        description,
        maxCapacity
      });
      const created = {...{id: building["_id"]}, ...req.body};
      res.status(STATUS_CODE.created).json(created);
      return;
    }
  }catch(err){
    res.status(500).json({ error: err.message });
    return;
  }
});

buildingsRouter.delete('/buildings/:id', function (req, res) {
   try { 
    //pegando os buildings do mongo
    const db = require('../db/buildings');
    const buildings = db.Mongoose.model(
      'buildings',
      db.BuildingsSchema,
      'buildings'
    );
    //tentando deletar o building com id recebido por req.params.id
    buildings.findByIdAndRemove(req.params.id, function(err, result){
      if (err) {
        //se houve erro durante a tentativa de delete, error 500
        res.status(500).json({success: false, message: err});
        return;
      }
      else if (result) {
        //se houve result é porque deletou corretamente.
        res
          .status(STATUS_CODE.delete_success)
          .json({ success: true, message: 'Building deleted' });
        return;
      }
      else {
        //se nao é porque nao achou nenhum building com este id
        res.status(STATUS_CODE.not_found).json({ success: false, message: "Building not found" });
        return;
      }
    }) 
  }
  catch(err) {
    res.status(500).json({success: false, message: err});
    return;
  }

});

module.exports = buildingsRouter;
