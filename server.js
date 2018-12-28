var app = require('./app');
var debug = require('debug')('bestof3:server');
var http = require('http');
var socket = require('socket.io');

// Get port from environment and store in Express.

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Create HTTP server.

const server = http.createServer(app);

// SOCKET SETUP

var io = socket(server);

var clients = {};
var p1R = false;
var p1Reset = false;
var p2R = false;
var p2Reset = false;
var snakeCount = 0;
var directionL = 'right';
var directionR = 'left';

let pongCounter = 0;
let pongKeys = [];

const snake = io.of('/snake');
const pong = io.of('/pong');

// SNAKE HANDLING
snake.on('connection', function(socket) {
  console.log("connected to snake socket")
  // Kicks user if 2 connected already
  if (snakeCount >= 2) {
    socket.disconnect()
    console.log("booted client, max reached")
  }

  // adds username to client
  socket.on('add-user', function(data) {
    let p1 = false;
    for (var key in clients) {
      if (key.player = 1) {
        p1 = true;
      }
    }
    if (p1) {
      socket.emit('playerNum', 2)
      clients[data.username] = {
        "socket": socket.id,
        "player": 2
      }
    } else {
      socket.emit('playerNum', 1)
      clients[data.username] = {
        "socket": socket.id,
        "player": 1
      }
    }
    snakeCount = Object.keys(clients).length;
    snake.emit('counter', {count: snakeCount})
  })

  // Checks if both players ready
  socket.on('clientReady', function(data) {
    console.log(`recieved ready status from client ${data.username}, ${data.state}`)

    if (clients[data.username].player == 1 && data.state == 'PLAYERS_READY') {
      p1R = true;
    } else if (clients[data.username].player == 2 && data.state == 'PLAYERS_READY') {
      p2R = true;
    } else if (clients[data.username].player == 1 && data.state != 'PLAYERS_READY') {
      p1R = false;
    } else if (clients[data.username].player == 2 && data.state != 'PLAYERS_READY') {
      p2R = false;
    }
    if (p1R && p2R) {
      snake.emit('clientState', 'PLAYERS_READY')
    } else {
      snake.emit('clientState', 'NOT_READY')
    }
  })

  // handles rematch
  socket.on('reset', function(data) {
    if (clients[data].player == 1) {
      p1Reset = true;
    } else if (clients[data].player == 2) {
      p2Reset = true;
    }
    if (p1Reset && p2Reset) {
      snake.emit('clientState', 'RESET')
      p1Reset = false;
      p2Reset = false;
    }
  })

  // broadcast keypresses and x y cords to socket
  socket.on('keypress', function(data) {
    switch (data.key) {
      case 37:
        if (directionR != 'right') {
          directionR = 'left';
        }
        break;
      case 39:
        if (directionR != 'left') {
          directionR = 'right';
        }
        break;
      case 38:
        if (directionR != 'down') {
          directionR = 'up';
        }
        break;
      case 40:
        if (directionR != 'up') {
          directionR = 'down';
        }
        break;
      case 65:
        if (directionL != 'right') {
          directionL = 'left';
        }
        break;
      case 68:
        if (directionL != 'left') {
          directionL = 'right';
        }
        break;
      case 87:
        if (directionL != 'down') {
          directionL = 'up';
        }
        break;
      case 83:
        if (directionL != 'up') {
          directionL = 'down';
        }
    }
    // put in let
    position = {
      'L': {xCorL: data.L.xCorL, yCorL: data.L.yCorL, directionL: directionL},
      'R': {xCorR: data.R.xCorR, yCorR: data.R.yCorR, directionR: directionR}
    }
    snake.emit('move', position)
  })

  // Update counter on disconnect
  // on discconect tell remaining client to refresh
  socket.on('disconnect', function() {
    console.log('client dissconected')
    for (var key in clients) {
      if (clients[key].player == 2) {
        clients[key].player = 1
        snake.emit('playerNum', 1)
      }
      if (socket.id == clients[key].socket) {
        delete clients[key];
        snakeCount = Object.keys(clients).length;
        snake.emit('clientState', 'PLAYER_LEFT')
        directionR = 'left'
        directionL = 'right'
      }
    }
    snake.emit('counter', {count: snakeCount});
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
