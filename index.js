const app = require('./app');

const port = process.env.PORT || 8080;

app.get('/', (req, res) => res.send('Hello World with Express'));

app.listen(port, function () {
  console.log('Listening at http://localhost:' + port);
});
