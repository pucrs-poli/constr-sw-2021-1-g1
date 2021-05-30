const app = require('./app');

const port = process.env.PORT || 8080;

const buildingsRouter = require("./routes/buildings")
const roomsRouter = require("./routes/rooms")

app.use(buildingsRouter);
app.use(roomsRouter);

app.get('/', (req, res) => res.send('Hello World with Express'));

app.listen(port, function () {
  console.log('Listening at http://localhost:' + port);
});
