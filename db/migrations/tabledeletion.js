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
  'DROP TABLE IF EXISTS stats'
).then(
  () => client.query(
    'DROP TABLE IF EXISTS users'
  )
).then(
  () => client.query(
    'DROP TABLE IF EXISTS games'
  )
).then(
  () => client.end()
)
