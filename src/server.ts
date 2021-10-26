import express from 'express';

const app = express();
const port = 3000;

app.get('/api/users/:name', (request, response) => {
  response.send(request.params);
});

app.get('/api/users', (_request, response) => {
  const users = ['Paul', 'Samet', 'Julia'];
  response.send(users);
});

app.get('/', (_request, response) => {
  response.send('Hallo Welt!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
