import express from 'express';

const app = express();
const port = 3000;
const users = ['Paul', 'Samet', 'Julia', 'Muhamed', 'Patrick'];

app.get('/api/users/:name', (request, response) => {
  const isNameKnown = users.includes(request.params.name);
  if (isNameKnown) {
    response.send(request.params.name);
  } else {
    response.status(404).send('Blabla');
  }
});

app.delete('/api/users/:name', (request, response) => {
  const isKnown = request.params.name;
  if (users.includes(isKnown)) {
    const IndexOfName = users.findIndex((name) => name === isKnown);
    response.send(`${IndexOfName}`);
    users.splice(IndexOfName, 1);
    response.send(users);
  } else {
    response.status(404).send('User not found');
  }

  app.get('/api/users', (_request, response) => {
    response.send(users);
  });

  app.get('/', (_request, response) => {
    response.send('Hallo Welt!');
  });

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});
