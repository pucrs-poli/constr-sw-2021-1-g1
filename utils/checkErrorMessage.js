const STATUS_CODE = require('../utils/constants');

const checkErrorMessage = (err, res) => {
  const patchError = err.message.includes("Cannot read property 'save' of null");
  if (err.name == 'CastError' || err.name == 'ValidationError' || patchError) {
    if (err.kind == 'ObjectId' || patchError) {
      res.status(STATUS_CODE.not_found).json({ error: 'Not found' });
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
};

module.exports = checkErrorMessage;
