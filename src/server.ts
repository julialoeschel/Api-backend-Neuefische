import express from 'express';
import cookieParser from 'cookie-parser';

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
    username: 'JuLoe',
    password: 'pw123!',
  },
];

app.use(express.json());

// Middleware for parsing cookies
app.use(cookieParser());

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
// gibts den user mit den daten schon??
app.post('/api/users', (request, response) => {
  const newUser = request.body;
  if (!newUser.name || !newUser.username || !newUser.password) {
    response.status(400).send(`Missing property`);
    return;
  }
  if (users.some((user) => user.username === newUser.username)) {
    response.status(409).send(`aleady existst`);
  } else {
    users.push(newUser);
    // users.splice(users.length, 0, newUser.name);
    response.send(`${newUser.name} added`);
  }
});

// user und passwort abfragen
app.post('/api/login', (request, response) => {
  const userLogin = request.body;
  const findUser = users.find(
    (user) =>
      user.username === userLogin.username &&
      user.password === userLogin.password
  );
  if (findUser) {
    response.setHeader('Set-Cookie', `username=${findUser.username}`);
    response.send(`Herzlich willkommen ${findUser.name}!!!`);
  } else {
    response.status(401).send(`password or username is wrong`);
  }
});

app.get('/api/me', (request, response) => {
  //const cookie = request.headers.cookie;
  const username = request.cookies.username;
  console.log(request.headers.cookie);
  const foundUser = users.find((user) => user.username === username);
  if (foundUser) {
    response.send(foundUser);
  } else {
    response.status(404).send('User not found');
  }
});

app.post('/api/logout', (_request, response) => {
  response.setHeader('Set-Cookie', ``);
  response.send('you are logged out');
});

app.get('/api/users/:username', (request, response) => {
  const user = users.find((user) => user.username === request.params.username);
  if (user) {
    response.send(user);
  } else {
    response.status(404).send('does not exist');
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
