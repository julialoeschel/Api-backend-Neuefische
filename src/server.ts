import express from 'express';

const app = express();
const port = 3000;
const users = ['Paul', 'Samet', 'Julia', 'Muhamed', 'Patrick'];

app.use(express.json());

app.post('/api/users', (request, response) => {
  response.send(request.body.name);
});

app.get('/api/users/:name', (request, response) => {
  const isNameKnown = users.includes(request.params.name);
  if (isNameKnown) {
    response.send(request.params.name);
  } else {
    response.status(404).send('Blabla');
  }
});

app.get('/api/users', (_request, response) => {
  response.send(users);
});

app.get('/', (_request, response) => {
  response.send('Hallo Welt!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
