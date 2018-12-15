const pg = require('pg');

const client = new pg.Client({
  user: 'development',
  host: 'localhost',
  database: 'bestof3',
  password: 'development',
  port: 5432
});
client.connect();
module.exports = {

  setEmailAndPassword: function(email, password){
    return client.query("INSERT INTO users (email, password, exp) VALUES ('" + email + "', " + "'" + password + "', 0);"
  ).catch(e => console.error(e));
  },

  grabPasswordByEmail: function(email){
    return client.query("SELECT password FROM users WHERE email= '" + email + "';"
    ).catch(e => console.error(e));
  }

}
