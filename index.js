const express = require('express');
const kcAdminClient = require('./keycloak-config');
const credentials = require('./keycloak-credentials');

const app = express();

const port = 8080;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

app.get('/test', function (req, res) {
  res.send('Tested');
});

app.get('/auth', async (req, res) => {
  const { username, password, grantType, clientId, totp, clientSecret } =
    credentials;

  try {
    await kcAdminClient.auth({
      username,
      password,
      grantType,
      clientId,
      totp,
      clientSecret,
    });

    res.status(200).send({
      accessToken: kcAdminClient.accessToken,
      refreshToken: kcAdminClient.refreshToken,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// Returns all users from keycloak
app.get('/users', async function (req, res) {
  let users;
  try {
    users = await kcAdminClient.users.find();
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
  
  res.send(users);
});

// Returns an user by id
app.get('/users/:id', async function (req, res, _) {
  let user;
  try {
    user = await kcAdminClient.users.findOne({ id: req.params.id });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }

  res.status(200).send(user);
  
});

app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

// Creates user
app.post('/users', async function (req, res) {
  const { username, email, firstName, lastName } = req.body;
  let response;
  try {
    response = await kcAdminClient.users.create({
      username,
      email,
      firstName,
      lastName,
      emailVerified: true,
      enabled: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }

  res.status(200).send(response);
});

// Updates the user data
app.put('/users/:id', async function (req, res) {
  const { firstName, lastName } = req.body;
  let response;
  try {
    response = await kcAdminClient.users.update(
      { id: req.params.id },
      {
        firstName,
        lastName,
        requiredActions: [],
        emailVerified: true,
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }

  res.status(200).send(response);
});

// Updates the user password
app.patch('/users/:id', async function (req, res) {
  const { password } = req.body;
  const { id } = req.params;
  let response;
  try {
    response = await kcAdminClient.users.update(
      { id },
      {
        password,
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }

  res.status(200).send(response);
});

// Deletes an user by id
app.delete('/users/:id', async function (req, res) {
  let response;
  try {
    response = await kcAdminClient.users.del({ id: req.params.id });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }

  res.status(200).send(response);
});
