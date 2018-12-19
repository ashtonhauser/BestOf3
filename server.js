#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('./app');
var debug = require('debug')('bestof3:server');
var http = require('http');
var socket = require('socket.io');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

// SOCKET SETUP

var io = socket(server)
var clientCounter = 0;

var snake = io.of('/snake')
snake.on('connection', function(socket) {
  console.log("connected to snake socket")
  clientCounter++;

  // emitts client count on connect
  snake.emit('counter', {count: clientCounter})

  //
  socket.on('keypress', function(data) {
    snake.emit('keypress', data);
  })

  socket.on('disconnect', function() {
    console.log('client dissconected')
    clientCounter--;
    snake.emit('counter', {count: clientCounter});
  })

})

// io.on('connection', function(socket) {
//   console.log("user connected")
// });









// io.on('connection', function(socket) {
//   let clientId = socket.id;

//   // ADDS NEW IP AND EMITS USER COUNT TO ALL USERS
//   clientCounter++;
//   console.log(clientCounter)
//   io.emit('counter', {count: clientCounter})

//   // ON RECIEVING KEYPRESS BROADCAST TO OTHER USER
//   socket.on('keypress', keypressMessage)
//   function keypressMessage(data) {
//     socket.broadcast.emit('keypress', data);
//   }

//   //

//   // DELETES USER COUNT
//   socket.on('disconnect', function() {
//     console.log('client dissconected')

//     clientCounter--;
//     io.emit('counter', {count: clientCounter});
//     console.log(clientCounter)
//   })
// });




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
