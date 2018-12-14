const pg = require('pg');

const client = new pg.Client({
  user: 'development',
  host: 'localhost',
  database: 'BestOf3',
  password: 'development',
  port: 5432
});
client.connect();
client.query(
  'CREATE TABLE users(id SERIAL PRIMARY KEY, email VARCHAR(40), password VARCHAR(255), exp INTEGER);'
).then(
  () => client.query(
    'CREATE TABLE games(id SERIAL PRIMARY KEY, name VARCHAR(40))'
  )
).then(
  () => client.query(
    'CREATE TABLE stats(user_id INTEGER REFERENCES users(id), game_id INTEGER REFERENCES games(id), wins INTEGER, losses INTEGER);'
  )
).then(
  () => client.end()
);
