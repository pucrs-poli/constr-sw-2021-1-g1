let router = require('express').Router();
router.get('/', function (req, res) {
  res.json({
    status: 'API Its Working',
    message: 'Initial route',
  });
});

router.get('/building/all', function (req, res) {
  const db = require('./db');
  const building = db.Mongoose.model('building', db.BuildingSchema, 'building');
  building
    .find({})
    .lean()
    .exec(function (e, docs) {
      console.log(docs);
      res.json(docs);
      res.end();
    });
});

module.exports = router;
