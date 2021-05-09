const express = require('express');
const app = express();

const port = 8080;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

app.get('/test', function (req, res) {
  res.send('Hello');
})