const express = require('express');
const kcAdminClient = require('./keycloak-config');
const app = express();

const port = 8080;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

app.get('/test', function (req, res) {
  res.send('Tested');
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
app.get('/users', async function (req, res) {
  const users = await kcAdminClient.users.find();
  res.send(users);
});

// Returns an user by id
app.get('/users/:id', async function (req, res, _) {
  try {
    const user = await kcAdminClient.users.findOne({ id: req.params.id });
    res.send(user);
  } catch (err) {
    console.log(err);
  }
  
});

app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

// Creates user
app.post('/users', async function (req, res) {
  console.log(req.body.username);
  try {
    await kcAdminClient.users.create({
      username: req.body.username,
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailVerified: true,
      enabled: true,
    });
    res.status(200).send();
  } catch (err) {
    console.log(err);
  }
});

// Updates the user data
app.put('/users/:id', async function (req, res) {
  console.log(req);
  try {
    await kcAdminClient.users.update(
      { id: req.params.id },
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        requiredActions: [],
        emailVerified: true,
      }
    );
    res.status(200).send();
  } catch (err) {
    console.log(err);
  }
});

// Updates the user password
app.patch('/users/:id', async function (req, res) {
  try {
    await kcAdminClient.users.update(
      { id: req.params.id },
      {
        password: req.body.password,
      }
    );
    res.status(200).send();
  } catch (err) {
    console.log(err);
  }
});

// Deletes an user by id
app.delete('/users/:id', async function (req, res) {
  try {
    await kcAdminClient.users.del({ id: req.params.id });
    res.status(200).send();
  } catch (err) {
    console.log(err)
  }
});
