const pg = require('pg');

const dbClient = new pg.Client({
  user: 'development',
  host: 'localhost',
  database: 'bestof3',
  password: 'development',
  port: 5432
});
var app = require('./app');
var debug = require('debug')('bestof3:server');
var http = require('http');
var socket = require('socket.io');

dbClient.connect();

// Get port from environment and store in Express.

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Create HTTP server.

const server = http.createServer(app);

// SOCKET SETUP

var io = socket(server);

// snake variables
var sClients = {};
var snakeP1R = false;
var snakeP1Reset = false;
var snakeP2R = false;
var snakeP2Reset = false;
var sDirectionL = 'right';
var sDirectionR = 'left';

// tron variables
var tClients = {};
var tronP1R = false;
var tronP1Reset = false;
var tronP2R = false;
var tronP2Reset = false;
var tDirectionL = 'right';
var tDirectionR = 'left';
var tCordsLX = [200];
var tCordsLY = [250];
var tCordsRX = [800];
var tCordsRY = [250];
var segmentsL = 1;
var segmentsR = 1;
var diff = 10;

// pong variables
let pongCounter = 0;
let pongKeys = [];

const tron = io.of('/tron')
const snake = io.of('/snake');
const pong = io.of('/pong');

// TRON HANDLING
function cordsR() {
  segmentsR++
  tCordsRX.push(tCordsRX[segmentsR.length - 1] - 1)
  tCordsRY.push(tCordsRY[segmentsR.length - 1] - 1)
  switch (tDirectionR) {
    case 'right':
      tCordsRX[segmentsR - 1] = tCordsRX[segmentsR - 2] + diff;
      tCordsRY[segmentsR - 1] = tCordsRY[segmentsR - 2];
      break;
    case 'up':
      tCordsRX[segmentsR - 1] = tCordsRX[segmentsR - 2];
      tCordsRY[segmentsR - 1] = tCordsRY[segmentsR - 2] - diff;
      break;
    case 'left':
      tCordsRX[segmentsR - 1] = tCordsRX[segmentsR - 2] - diff;
      tCordsRY[segmentsR - 1] = tCordsRY[segmentsR - 2];
      break;
    case 'down':
      tCordsRX[segmentsR - 1] = tCordsRX[segmentsR - 2];
      tCordsRY[segmentsR - 1] = tCordsRY[segmentsR - 2] + diff;
      break;
  }
}

function cordsL() {
  segmentsL++
  tCordsLX.push(tCordsLX[segmentsL.length - 1] - 1)
  tCordsLY.push(tCordsLY[segmentsL.length - 1] - 1)
  switch (tDirectionL) {
    case 'right':
      tCordsLX[segmentsL - 1] = tCordsLX[segmentsL - 2] + diff;
      tCordsLY[segmentsL - 1] = tCordsLY[segmentsL - 2];
      break;
    case 'up':
      tCordsLX[segmentsL - 1] = tCordsLX[segmentsL - 2];
      tCordsLY[segmentsL - 1] = tCordsLY[segmentsL - 2] - diff;
      break;
    case 'left':
      tCordsLX[segmentsL - 1] = tCordsLX[segmentsL - 2] - diff;
      tCordsLY[segmentsL - 1] = tCordsLY[segmentsL - 2];
      break;
    case 'down':
      tCordsLX[segmentsL - 1] = tCordsLX[segmentsL - 2];
      tCordsLY[segmentsL - 1] = tCordsLY[segmentsL - 2] + diff;
      break;
  }
}

tron.on('connection', function(socket) {
  console.log('client attempting connection to tron')

  if (Object.keys(tClients).length >= 2) {
    socket.disconnect()
    console.log('refused connection, max clients')
  }

  socket.on('addUser', function(data) {
    if (Object.keys(tClients).length > 0) {
      socket.emit('playerNum', 2)
      tClients[data] = {
        "socket": socket.id,
        "player": 2
      }
    } else {
      socket.emit('playerNum', 1)
      tClients[data] = {
        "socket": socket.id,
        "player": 1
      }
    }
    tron.emit('counter', {count: Object.keys(tClients).length})
  })

  socket.on('clientReady', function(data) {
    console.log(`recieved ready status from client ${data.p1}, ${data.state}`)

    if (data.p1 && data.state == 'PLAYERS_READY') {
      tronP1R = true;
    } else if (!data.p1 && data.state == 'PLAYERS_READY') {
      tronP2R = true;
    }

    if (tronP1R && tronP2R) {
      tron.emit('clientState', 'PLAYERS_READY')
    } else {
      tron.emit('clientState', 'NOT_READY')
    }
  })

  socket.on('updateL', function() {
    if (tronP1R && tronP2R) {
      cordsL()
      tron.emit('cord', {
        L: {tCordsLX, tCordsLY, segmentsL},
        R: {tCordsRX, tCordsRY, segmentsR}
      })
    }
  })
  socket.on('updateR', function(data) {
    if (tronP1R && tronP2R) {
      cordsR()
      tron.emit('cord', {
        L: {tCordsLX, tCordsLY, segmentsL},
        R: {tCordsRX, tCordsRY, segmentsR}
      })
    }
  })

  socket.on('reset', function(data) {
    if (tClients[data].player == 1) {
      tronP1Reset = true;
    } else if (tClients[data].player == 2) {
      tronP2Reset = true;
    }
    if (tronP1Reset && tronP2Reset) {
      tron.emit('clientState', 'RESET')
      tronP1R = false;
      tronP1Reset = false;
      tronP2R = false;
      tronP2Reset = false;
      tDirectionL = 'right';
      tDirectionR = 'left';
      tCordsLX = [200];
      tCordsLY = [250];
      tCordsRX = [800];
      tCordsRY = [250];
      segmentsL = 1;
      segmentsR = 1;
    }
  })

  socket.on('keypress', function(data) {
    switch (data.key) {
      case 37:
        if (tDirectionR != 'right') {
          tDirectionR = 'left';
        }
        break;
      case 39:
        if (tDirectionR != 'left') {
          tDirectionR = 'right';
        }
        break;
      case 38:
        if (tDirectionR != 'down') {
          tDirectionR = 'up';
        }
        break;
      case 40:
        if (tDirectionR != 'up') {
          tDirectionR = 'down';
        }
        break;
      case 65:
        if (tDirectionL != 'right') {
          tDirectionL = 'left';
        }
        break;
      case 68:
        if (tDirectionL != 'left') {
          tDirectionL = 'right';
        }
        break;
      case 87:
        if (tDirectionL != 'down') {
          tDirectionL = 'up';
        }
        break;
      case 83:
        if (tDirectionL != 'up') {
          tDirectionL = 'down';
        }
    }
  })

  socket.on('disconnect', function() {
    console.log('client dissconected')
    for (var key in tClients) {
      if (tClients[key].player == 2) {
        tClients[key].player = 1
        tron.emit('playerNum', 1)
      }
      if (socket.id == tClients[key].socket) {
        delete tClients[key];
        tron.emit('clientState', 'PLAYER_LEFT')

        tronP1R = false;
        tronP1Reset = false;
        tronP2R = false;
        tronP2Reset = false;
        tDirectionL = 'right';
        tDirectionR = 'left';
        tCordsLX = [200];
        tCordsLY = [250];
        tCordsRX = [800];
        tCordsRY = [250];
        segmentsL = 1;
        segmentsR = 1;
      }
    }
    tron.emit('counter', {count: Object.keys(sClients).length});
  })
})









// SNAKE HANDLING
snake.on('connection', function(socket) {
  console.log("client attempting connection to snake")
  // Kicks user if 2 connected already
  if (Object.keys(sClients).length >= 2) {
    socket.disconnect()
    console.log("booted client, max reached")
  }

  // adds username to client
  socket.on('addUser', function(data) {
    if (Object.keys(sClients).length > 0) {
      socket.emit('playerNum', 2)
      sClients[data] = {
        "socket": socket.id,
        "player": 2
      }
    } else {
      socket.emit('playerNum', 1)
      sClients[data] = {
        "socket": socket.id,
        "player": 1
      }
    }
    snake.emit('counter', {count: Object.keys(sClients).length})
  })

  // Checks if both players ready
  socket.on('clientReady', function(data) {
    console.log(`recieved ready status from client ${data.p1}, ${data.state}`)

    if (data.p1 && data.state == 'PLAYERS_READY') {
      snakeP1R = true;
    } else if (!data.p1 && data.state == 'PLAYERS_READY') {
      snakeP2R = true;
    }
    console.log(snakeP1R, snakeP2R)
    if (snakeP1R && snakeP2R) {
      snake.emit('clientState', 'PLAYERS_READY')
    } else {
      snake.emit('clientState', 'NOT_READY')
    }
  })

  // handles rematch
  socket.on('reset', function(data) {
    if (sClients[data].player == 1) {
      snakeP1Reset = true;
    } else if (sClients[data].player == 2) {
      snakeP2Reset = true;
    }
    if (snakeP1Reset && snakeP2Reset) {
      snake.emit('clientState', 'RESET')
      snakeP1Reset = false;
      snakeP2Reset = false;
    }
  })

  // broadcast keypresses and x y cords to socket
  socket.on('keypress', function(data) {
    switch (data.key) {
      case 37:
        if (sDirectionR != 'right') {
          sDirectionR = 'left';
        }
        break;
      case 39:
        if (sDirectionR != 'left') {
          sDirectionR = 'right';
        }
        break;
      case 38:
        if (sDirectionR != 'down') {
          sDirectionR = 'up';
        }
        break;
      case 40:
        if (sDirectionR != 'up') {
          sDirectionR = 'down';
        }
        break;
      case 65:
        if (sDirectionL != 'right') {
          sDirectionL = 'left';
        }
        break;
      case 68:
        if (sDirectionL != 'left') {
          sDirectionL = 'right';
        }
        break;
      case 87:
        if (sDirectionL != 'down') {
          sDirectionL = 'up';
        }
        break;
      case 83:
        if (sDirectionL != 'up') {
          sDirectionL = 'down';
        }
    }
    let position = {
      'L': {xCorL: data.L.xCorL, yCorL: data.L.yCorL, directionL: sDirectionL},
      'R': {xCorR: data.R.xCorR, yCorR: data.R.yCorR, directionR: sDirectionR}
    }
    snake.emit('move', position)
  })

  // socket.on('wAndL', function(data) {
  //   let wUserID = 1;
  //   let lUserID = 2;
  //
  //   dbClient.query(
  //     `UPDATE stats SET wins=wins+1 WHERE user_id=${wUserID}`
  //   ).then(
  //     () => dbClient.query(
  //       `UPDATE stats SET losses=losses+1 WHERE user_id=${lUserID}`
  //     )
  //   );
  // });

  socket.on('w', function(user_id) {
    dbClient.query(
      `UPDATE stats SET wins=wins+1 WHERE user_id=${user_id}`
    ).then(
      dbClient.query(
        `UPDATE users SET exp=exp+10 WHERE id=${user_id}`
      )
    );
  });

  socket.on('l', function(user_id) {
    dbClient.query(
      `UPDATE stats SET losses=losses+1 WHERE user_id=${user_id}`
    ).then(
      dbClient.query(
        `UPDATE users SET exp=exp+2 WHERE id=${user_id}`
      )
    );
  });

  // Update counter on disconnect
  // on discconect tell remaining client to refresh
  socket.on('disconnect', function() {
    console.log('client dissconected')
    for (var key in sClients) {
      if (sClients[key].player == 2) {
        sClients[key].player = 1
        snake.emit('playerNum', 1)
      }
      if (socket.id == sClients[key].socket) {
        delete sClients[key];
        snake.emit('clientState', 'PLAYER_LEFT')
        sDirectionR = 'left'
        sDirectionL = 'right'
      }
    }
    snake.emit('counter', {count: Object.keys(sClients).length});
  })
})



// PONG HANDLING

//connects to pong socket
pong.on('connection', function(socket) {
  console.log('pong socket connected');
  pongCounter++;

  //sends client counter to client
  pong.emit('counter', {count: pongCounter});

  pong.emit('pongKeys', {keys: pongKeys});

  socket.on('keyup', function(data) {
    pongKeys.push(data);
    pong.emit('pongKeys', {keys: pongKeys});
  });

  socket.on('keydown', function(data) {
    pongKeys.push(data);
    pong.emit('pongKeys', {keys: pongKeys});
  });

  socket.on('disconnect', function() {
    console.log('pong socket disconnected');
    pongCounter--;
    pong.emit('counter', {count: pongCounter});
  });
});



/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
