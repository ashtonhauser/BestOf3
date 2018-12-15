const pg = require('pg');

const client = new pg.Client({
  user: 'development',
  host: 'localhost',
  database: 'bestof3',
  password: 'development',
  port: 5432
});
client.connect();
client.query(
  "INSERT INTO games (name) VALUES('snake')"
).then(
  () => client.query(
    "INSERT INTO games (name) VALUES('pong')"
  )
).then(
  () => client.end()
);
