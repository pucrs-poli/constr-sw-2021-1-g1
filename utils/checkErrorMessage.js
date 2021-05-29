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
  };
  
  module.exports = checkErrorMessage;