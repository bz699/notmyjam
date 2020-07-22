const express = require('express');
const app = express();
const port = 8000 || process.env.PORT;
const dotenv = require('dotenv');
const cors = require('cors');
const routes = require('./routes');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use('/api', routes);

// test connexion
app.get('/', (request, response) =>{
  response.send('connexion made');
});

// port listening
app.listen(port, (err) => {
  if(err) {
    console.log(err)
  }
  console.log(`I\'m listening your port ${port}`)
});