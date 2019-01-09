var clientCount;
var clientState = 'NOT_READY';
var socket = io.connect('http://localhost:3000/snake')
var username = Math.floor(Math.random() * Math.floor(500))
var p1 = false;
socket.emit('addUser', username)

// prevents arrow keys scrolling
window.addEventListener("keydown", function(e) {
  if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
}, false);

// sets player 1 or 2
socket.on('playerNum', function(data) {
  if (data == 1) {
    p1 = true;
  } else {
    p1 = false;
  }
})

// user count
socket.on('counter', function (data) {
  clientCount = data.count;
});

socket.on('sendReady', function() {
  if (p1) {
    $(".PR").css("background", "#72dfbe")
    $(".checkR").css("display", "block")
  } else {
    $(".PL").css("background", "#72dfbe")
    $(".checkL").css("display", "block")
  }
})

var snakeGame = new p5(sketch, 'bigContainer');
