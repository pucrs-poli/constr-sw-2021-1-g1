let router = require('express').Router();

router.get('/', function (req, res) {
  res.json({
    status: 'API Its Working',
    message: 'Initial route',
  });
});

router.get('/buildings/all', function (req, res) {
  const db = require('./db');
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
  const db = require('./db');
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

module.exports = router;
