const express = require('express');
const app = express();

const port = 8080;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

app.get('/test', function (req, res) {
  res.send('Hello');
});

// Returns all users from keycloak
app.get('/users', function (req, res) {
  res.send('Should return all users');
});

// Returns an user by id
app.get('/users/:id', async (req, res, _) => {
  res.send(`Should return the user from id ${req.params.id}`);
});

app.use(express.urlencoded({
  extended: true,
}));

// Creates user
app.post('/users', function (req, res) {
  const body = req.body;
  console.log(req);
  res.send(`Should create an user`);
});

// Updates the user data
app.put('/users/:id', function (req, res) {
  res.send('Should update the user data');
});

// Updates the user password
app.patch('/users/:id', function (req, res) {
  res.send('Should update the user password');
});

// Deletes an user by id
app.delete('/users/:id', function (req, res) {
  res.send(`Should delete ${req.params.id}`);
});
