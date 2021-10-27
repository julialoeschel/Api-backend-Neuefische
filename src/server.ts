import express from 'express';

const app = express();
const port = 3000;
const users = [
  {
    name: 'Patrick',
    username: 'Patrick123123',
    password: '123abc',
  },
  {
    name: 'Alex',
    username: 'AlexZZ',
    password: 'asdc',
  },
  {
    name: 'Felix',
    username: 'FE9000',
    password: 'ab',
  },
  {
    name: 'Julia',
    username: 'phgrtz',
    password: 'pw123!',
  },
];

app.use(express.json());

app.get('/api/users/:username', (request, response) => {
  const user = users.find((user) => user.username === request.params.username);
  if (user) {
    response.send(user);
  } else {
    response.status(404).send('does not exist');
  }
});

app.delete('/api/users/:username', (request, response) => {
  const username = request.params.username;
  const indexOfName = users.map((user) => user.username).indexOf(username);
  if (indexOfName !== -1) {
    users.splice(indexOfName, 1);
    response.send(users);
  } else {
    response.status(404).send(`Sorry can't find that!`);
  }
});

app.post('/api/users', (request, response) => {
  const newUser = request.body;
  // users.splice(users.length, 0, newUser.name);
  if (users.some((user) => user.username === newUser.username)) {
    response.status(409).send(`aleady existst`);
  } else {
    users.push(newUser);
    response.send(`${newUser.name} added`);
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
