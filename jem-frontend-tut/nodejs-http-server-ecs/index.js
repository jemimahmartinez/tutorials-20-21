const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

app.get('/hi', (req, res) => {
  console.log('hello');

  // res.send(200, 'Hello world from a Node.js app!');
  res.status(200).send({ key: 'Hello from hi' });
});

app.get('/', (req, res) => {
  console.log('hello');
  res.status(200).send('Hello world from a Node.js app!');
});

app.listen(3000, () => {
  console.log('Server is up on 3000');
});
