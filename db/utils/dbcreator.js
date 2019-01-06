const pg = require('pg');

const client = new pg.Client({
  user: 'development',
  host: 'localhost',
  database: 'bestof3',
  password: 'development',
  port: 5432
});
client.connect();

const parseResult = (result) => result.rows;

module.exports = {

  setEmailandPassword: function(email, password){
    return client.query(`INSERT INTO users (email, password) VALUES ('${email}', '${password}') RETURNING *;`
    ).then(parseResult)
    .catch(e => console.error(e));
  },

  initSnakeStats: function async (user_id){
    return client.query(`INSERT INTO stats (user_id, game_id) VALUES (${user_id}, 1);`
    ).then(parseResult)
    .catch(e => console.error(e));
  },

  grabSnakeLosses: function async (user_id){
    return client.query(`SELECT (losses) FROM stats WHERE user_id=${user_id}`
    ).then(parseResult
    ).catch(e => console.error(e));
  },

  grabSnakeWins: function async (user_id){
    return client.query(`SELECT (wins) FROM stats WHERE user_id=${user_id}`
    ).then(parseResult
    ).catch(e => console.error(e));
  },

  grabUserExp: function async (user_id){
    return client.query(`SELECT (exp) FROM users WHERE id=${user_id}`
    ).then(parseResult
    ).catch((e) => console.error(e));
  },

  grabUserByEmail: function async (email){
    return client.query("SELECT * FROM users WHERE email= '" + email + "';"
    ).then(parseResult)
    .catch(e => console.error(e));
  },

  grabUserById: function async (id){
    return client.query(`SELECT * FROM users WHERE id= '${Number(id)}';`
    )
    .then(parseResult)
    .catch(e => console.error(e));
  }

};
