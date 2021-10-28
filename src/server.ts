import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDatabase, getUserCollection } from './utils/database';

if (!process.env.KEY_URL_MONGOBD)
  throw new Error('no KEY_URL_MONGOBD provided');

const app = express();
const port = 3000;
// const users = [
//   {
//     name: 'Patrick',
//     username: 'Patrick123123',
//     password: '123abc',
//   },
//   {
//     name: 'Alex',
//     username: 'AlexZZ',
//     password: 'asdc',
//   },
//   {
//     name: 'Felix',
//     username: 'FE9000',
//     password: 'ab',
//   },
//   {
//     name: 'Julia',
//     username: 'JuLoe',
//     password: 'pw123!',
//   },
// ];

app.use(express.json());

// Middleware for parsing cookies
app.use(cookieParser());

app.delete('/api/users/:username', async (request, response) => {
  const username = request.params.username;
  const isUserThere = await getUserCollection().findOne({
    username: username,
  });
  if (!isUserThere) {
    response.send(`${username} dosnt exist`);
  } else {
    await getUserCollection().deleteOne({ username: username });
    response.send(`${username} deleted`);
  }
});

// gibts den user mit den daten schon??
app.post('/api/users', async (request, response) => {
  const newUser = request.body;
  if (!newUser.name || !newUser.username || !newUser.password) {
    response.status(400).send(`Missing property`);
    return;
  }
  const isUserThere = await getUserCollection().findOne({
    username: newUser.username,
  });
  if (!isUserThere) {
    // users.splice(users.length, 0, newUser.name);
    const writeUser = await getUserCollection().insertOne(newUser);
    response.send(`${newUser.name} added with ID ${writeUser.insertedId}`);
  } else {
    response.status(409).send(`aleady existst`);
  }
});

// user und passwort abfragen
app.post('/api/login', async (request, response) => {
  const userLogin = request.body;
  const FindeLogedinUser = await getUserCollection().findOne({
    username: userLogin.username,
    password: userLogin.password,
  });

  if (FindeLogedinUser) {
    response.setHeader('Set-Cookie', `username=${FindeLogedinUser.username}`);
    response.send(`Herzlich willkommen ${FindeLogedinUser.name}!!!`);
  } else {
    response.status(401).send(`password or username is wrong`);
  }
});

app.get('/api/me', async (request, response) => {
  //const cookie = request.headers.cookie;
  const cookieName = request.cookies.username;
  const userNamefromDB = await getUserCollection().findOne({
    username: cookieName,
  });

  if (userNamefromDB) {
    response.send(userNamefromDB);
  } else {
    response.status(404).send('User not found');
  }
});

app.post('/api/logout', async (_request, response) => {
  response.setHeader('Set-Cookie', ``);
  response.send('you are logged out');
});

app.get('/api/users/:username', async (request, response) => {
  const username = request.params.username;
  const existingUser = await getUserCollection().findOne({ username });
  if (!existingUser) {
    response
      .status(200)
      .send(`Hi!! The username ${username} is free / user dosent exsists`);
  } else {
    response.status(404).send('user already taken, user exists');
  }
});

app.get('/api/users', async (_request, response) => {
  const userDoc = await getUserCollection().find().toArray();
  response.send(userDoc);
});

app.get('/', (_request, response) => {
  response.send('Hallo Welt!');
});

connectDatabase(process.env.KEY_URL_MONGOBD).then(() =>
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  })
);
