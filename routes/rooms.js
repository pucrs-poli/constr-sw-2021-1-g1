let roomsRouter = require('express').Router();
const STATUS_CODE = require('../utils/constants');
const checkErrorMessage = require('../utils/checkErrorMessage');

// Start of rooms routes

roomsRouter.get('/rooms/all', function (req, res) {
  try{
  const db = require('../db/rooms');
  const rooms = db.Mongoose.model(
    'rooms',
    db.RoomsSchema,
    'rooms'
  );

  rooms
    .find({})
    .lean()
    .exec(function (e, docs) {
      if (docs.length === 0) {
        res.status(STATUS_CODE.not_found).json({
          success: false,
          message: "Rooms not found."
        })
      } else {      
        res.status(STATUS_CODE.success).json(docs);
      }
      res.end();
    });
  } catch(err) {
      if (err) {
        checkErrorMessage(err, res);
      }
      res.status(500).json({ error: err });
      res.end();
      return;
  }
});

roomsRouter.get('/rooms/:id', async function (req, res) {
  try {
    const db = require('../db/rooms');
    const rooms = db.Mongoose.model(
      'rooms',
      db.RoomsSchema,
      'rooms'
    );

    rooms
      .findById(req.params.id)
      .lean()
      .exec(function (e, result) {

        if (!result) {
          res.status(STATUS_CODE.not_found).json({
            success: false,
            message: 'Rooms not found.',
          });
        } else {
          res.status(STATUS_CODE.success).json(result);
        }
        res.end();
      });
    } catch(err) {
        if (err) {
          checkErrorMessage(err, res);
        }
        res.status(500).json({ error: err });
        res.end();
        return;
    }
});



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
      } else {
        res.status(STATUS_CODE.success).json(req.body);
        res.end();
      }
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
    if (number || description || maxCapacity || type)
      res.status(STATUS_CODE.success).json(roomReturn);
    else {
      res
        .status(STATUS_CODE.precondition_failed)
        .json({ error: 'Invalid attributes provided' });
      res.end();
      return;
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    res.end();
    return;
  }
});

roomsRouter.post('/rooms/', async function (req, res) {
  try {
    //pegando rooms do mongo
    const db = require('../db/rooms');
    const rooms = db.Mongoose.model(
      'rooms',
      db.RoomsSchema,
      'rooms'
    );
    //pegando buildings do mongo
    const dbBuildings = require('../db/buildings');
    const buildings = dbBuildings.Mongoose.model(
      'buildings',
      dbBuildings.BuildingsSchema,
      'buildings'
    );
    //consts necessarias para criar o room, vindas do req.body
    const {
      buildingID,
      number,
      description,
      maxCapacity,
      type
    } = req.body

    //vendo se ja existe um room com esse numero no mesmo building
    const roomNumber = await rooms
      .where("buildingID").equals(buildingID)
      .where("number").equals(number)
      .exec();

    //vendo se existe o building onde o room vai ser criado
    const buildingById = await buildings
      .findById(buildingID)
      .lean()
      .exec();
    
    if (buildingById) {
      //se existe o building
      if (roomNumber && roomNumber.length === 0) {
        //e se o numero ta disponivel
        const createdRoom = await rooms.create({
          buildingID,
          number,
          description,
          maxCapacity,
          type,
        });

        res.status(STATUS_CODE.created).json(createdRoom);
        res.end();
        return;
      } else {
        //se o numero ja existe, error 409: conflict.
        res
          .status(STATUS_CODE.conflict)
          .json({
            success: false,
            message: 'Room number already exists in this building.',
          });
        res.end();
        return;
      }
    }
    else {
      //se o building nao existe, building not found.
      res.status(STATUS_CODE.not_found).json({ success: false, message: "Building ID not found." });
      res.end();
      return;
    }

  } catch(err) {
    res.status(500).json({ success: false, message: err });
    res.end();
    return;
  }
});

roomsRouter.delete('/rooms/:id', async function (req, res) {
  try {
  //pegando os rooms do mongo
   const db = require('../db/rooms');
   const rooms = db.Mongoose.model(
     'rooms',
     db.RoomsSchema,
     'rooms'
   );
   //tentando deletar o room pelo ID recebido por req.params.id
    await rooms.findByIdAndRemove(
      { _id: req.params.id },
      function (err, result) {
        if (err) {
          checkErrorMessage(err, res);
        } else if (result) {
          //se houver result, ?? porque foi deletado corretamente
          res
            .status(STATUS_CODE.delete_success)
            .json({ success: true, message: 'Room deleted' });
          return;
        } else {
          //se nao houver result ?? porque nao existe um room com este id
          res
            .status(STATUS_CODE.not_found)
            .json({ success: false, message: 'Room not found' });
          return;
        }
      }
    );
 } catch(err) {
   return;
 }

});

module.exports = roomsRouter;
