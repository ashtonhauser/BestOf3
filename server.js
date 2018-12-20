#!/usr/bin/env node
 // Module dependencies.

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
var clientCounter = 0;
var clients = {};
var snake = io.of('/snake')
var p1R = false;
var p2R = false;

snake.on('connection', function(socket) {
  console.log("connected to snake socket")
  // Kicks user if 2 connected already
  if (clientCounter >= 2) {
    socket.disconnect()
    console.log("booted client, max reached")
  } else {
    clientCounter++;
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
      clients[data.username] = {
        "socket": socket.id,
        "player": 2
      }
    } else {
      clients[data.username] = {
        "socket": socket.id,
        "player": 1
      }
    }
    console.log(clients)
  })

  // Checks if both players ready
  socket.on('clientState', function(data) {
    console.log(`recieved state from client ${data.username}, ${data.state}`)

    if (clients[data.username].player == 1 && data.state == 'PLAYERS_READY') {
      p1R = true;
    } else if (clients[data.username].player == 2 && data.state == 'PLAYERS_READY') {
      p2R = true;
    } else if (clients[data.username].player == 1 && data.state != 'PLAYERS_READY') {
      p1R = false;
    } else if (clients[data.username].player == 2 && data.state != 'PLAYERS_READY') {
      p2R = false;
    }
    console.log(p1R, p2R)

    if (p1R && p2R) {
      snake.emit('playersReady', true)
    } else {
      snake.emit('playersReady', false)
    }
  })

  // handles rematch
  socket.on('rematch', function(data) {
    snake.emit('rematch', true)
  })

  // emitts client count on connect
  snake.emit('counter', {count: clientCounter})

  // broadcast keypresses to snake
  socket.on('keypress', function(data) {
    snake.emit('keypress', data);
  })

  // Update counter on disconnect
  socket.on('disconnect', function() {
    console.log('client dissconected')
    clientCounter--;
    snake.emit('counter', {count: clientCounter});
  })
})



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
