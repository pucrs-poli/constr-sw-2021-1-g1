const express = require('express');
const kcAdminClient = require('./keycloak-config');
const app = express();

const port = 8080;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

app.get('/test', function (req, res) {
  res.send('Hello');
});

app.get('/auth', async (req, res) => {
  try {
    await kcAdminClient.auth({
      username: 'biancacm',
      password: 'teste123',
      grantType: 'password',
      clientId: 'node-microservice',
      totp: '123456',
      clientSecret: 'fc296488-8d24-4989-86e2-9c99965a7323',
    });

    res.status(200).send({
      accessToken: kcAdminClient.accessToken,
      refreshToken: kcAdminClient.refreshToken,
    });
  } catch (err) {
    console.log(err);
  }
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
