let express = require('express');

let app = express();
let apiRoutes = require('./api-routes');

var port = process.env.PORT || 8080;

app.get('/', (req, res) => res.send('Hello World with Express'));

app.listen(port, function () {
  console.log('Listening at http://localhost:' + port);
});


app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use('/api', apiRoutes);
