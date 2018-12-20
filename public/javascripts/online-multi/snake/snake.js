var form = document.getElementsByClassName('.formm');
var ready = document.getElementById('#option1')
var clientCount;
var clientState = 'NOT_READY';
var clientsReady = false;
var clientRematch;
var stopwatch = null;
var socket = io.connect('http://localhost:3000/snake')
var username = Math.floor(Math.random() * Math.floor(50 ))
socket.emit('add-user', {"username": username})

socket.on('counter', function (data) {
  $("#counter").text(data.count);
  clientCount = data.count;
  console.log(clientCount)
});

socket.on('clientState', function(data) {
  if (data.state == 'PLAYERS_READY') {
    clientState = 'PLAYERS_READY';
  }
})
socket.on('playersReady', function(ready) {
  if (ready) {
    clientState = 'PLAYERS_READY'
  } else {
    clientState = 'NOT_READY'
  }
})


var sketch = function(s) {
  socket.on('rematch', function(data) {
    if (data) {
      s.resetSketch()
    }
  })
  var readyState;
  var xFruit;
  var yFruit;
  var button;
  var data;
  var waitingDiv;
  var timer;

  var numSegmentsL;
  var directionL;
  var xStartL;
  var yStartL;
  var diffL;
  var xCorL;
  var yCorL;
  var scoreElemL;

  var numSegmentsR;
  var directionR;
  var xStartR;
  var yStartR;
  var diffR;
  var xCorR;
  var yCorR;
  var scoreElemR;


  s.setup = function() {
    socket.on('keypress', s.newKey)


    s.createCanvas(1000, 500);
    s.frameRate(15);
    s.stroke(255);
    s.strokeWeight(10);

    scoreElemL = s.createDiv('p1').addClass('Lscore container');
    scoreElemL.style('color', 'black');

    scoreElemR = s.createDiv('p2').addClass('Rscore container');
    scoreElemR.style('color', 'black');

    button = s.createButton('Rematch?').addClass('rematch btn is-warning')
    button.style('display', 'none')

    s.resetSketch()
  }

  s.resetSketch = function() {
    clientRematch = false;
    readyState = {'username': username, 'state': 'NOT_READY'}
    socket.emit('clientState', readyState)
    timer = 5;
    xFruit= 0;
    yFruit = 0;

    // LEFT
    numSegmentsL = 20;
    directionL = 'right';
    xStartL = 10;
    yStartL = 250;
    diffL = 10;

    xCorL = [];
    yCorL = [];

    // RIGHT
    numSegmentsR = 20;
    directionR = 'left';
    xStartR = 1000;
    yStartR = 250;
    diffR = 10;

    xCorR = [];
    yCorR = [];

    s.updateFruitCoordinates();

    for (var i = 0; i < numSegmentsL; i++) {
      xCorL.push(xStartL + (i * diffL));
      yCorL.push(yStartL);
    }
    for (var o = 0; o < numSegmentsR; o++) {
      xCorR.push(xStartR - (o * diffR));
      yCorR.push(yStartR);
    }

    if (clientCount < 2){
      waitingDiv = s.createDiv('Waiting for second player...').id('matching')
    }

    $(function() {
      readyState = {'username': username, state: 'PLAYERS_READY'};
      socket.emit('clientState', readyState)
    })
    if (clientState = 'PLAYERS_READY') {
      s.draw()
      s.loop()
      scoreElemR.html('p2')
      scoreElemL.html('p1')
      button.style('display', 'none')
    }
  }

  s.draw = function() {
    s.background(0)
    s.textAlign(s.CENTER, s.CENTER);
    s.textSize(100);
    s.text(timer, s.width/2, s.height/2);

    if (clientCount == 2 && clientState == 'PLAYERS_READY') {
      if (!stopwatch) {
        stopwatch = setInterval(() => {
          timer -= 1;
        }, 1000)
      }

      if (timer === 0 && stopwatch) {
        clearInterval(stopwatch)
      }
    }

    if (clientCount == 2 && waitingDiv) {
      waitingDiv.hide();
    } else if (clientCount < 2 && !waitingDiv){
      waitingDiv.show();
    }

    if (timer == 0 && clientCount == 2) {
      s.drawL()
      s.drawR()
    }
  }

  s.drawL = function() {
    s.stroke(44,35,85)
    for (var i = 0; i < numSegmentsL - 1; i++) {
      s.line(xCorL[i], yCorL[i], xCorL[i + 1], yCorL[i + 1]);
    }
    s.updateSnakeCoordinatesL();
    s.checkForFruitL();
    s.checkGameStatus();
  }

  s.drawR = function() {
    s.stroke(37,97,105)
    for (var i = 0; i < numSegmentsR - 1; i++) {
      s.line(xCorR[i], yCorR[i], xCorR[i + 1], yCorR[i + 1]);
    }
    s.updateSnakeCoordinatesR();
    s.checkForFruitR();
    s.checkGameStatus();
  }

  s.newKey = function(data) {
    switch (data) {
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
  }

  // LEFT
  s.updateSnakeCoordinatesL = function() {
    for (var i = 0; i < numSegmentsL - 1; i++) {
      xCorL[i] = xCorL[i + 1];
      yCorL[i] = yCorL[i + 1];
    }
    switch (directionL) {
      case 'right':
        xCorL[numSegmentsL - 1] = xCorL[numSegmentsL - 2] + diffL;
        yCorL[numSegmentsL - 1] = yCorL[numSegmentsL - 2];
        break;
      case 'up':
        xCorL[numSegmentsL - 1] = xCorL[numSegmentsL - 2];
        yCorL[numSegmentsL - 1] = yCorL[numSegmentsL - 2] - diffL;
        break;
      case 'left':
        xCorL[numSegmentsL - 1] = xCorL[numSegmentsL - 2] - diffL;
        yCorL[numSegmentsL - 1] = yCorL[numSegmentsL - 2];
        break;
      case 'down':
        xCorL[numSegmentsL - 1] = xCorL[numSegmentsL - 2];
        yCorL[numSegmentsL - 1] = yCorL[numSegmentsL - 2] + diffL;
        break;
    }
  }

  s.updateSnakeCoordinatesR = function() {
    for (var i = 0; i < numSegmentsR - 1; i++) {
      xCorR[i] = xCorR[i + 1];
      yCorR[i] = yCorR[i + 1];
    }
    switch (directionR) {
      case 'right':
        xCorR[numSegmentsR - 1] = xCorR[numSegmentsR - 2] + diffR;
        yCorR[numSegmentsR - 1] = yCorR[numSegmentsR - 2];
        break;
      case 'up':
        xCorR[numSegmentsR - 1] = xCorR[numSegmentsR - 2];
        yCorR[numSegmentsR - 1] = yCorR[numSegmentsR - 2] - diffR;
        break;
      case 'left':
        xCorR[numSegmentsR - 1] = xCorR[numSegmentsR - 2] - diffR;
        yCorR[numSegmentsR - 1] = yCorR[numSegmentsR - 2];
        break;
      case 'down':
        xCorR[numSegmentsR - 1] = xCorR[numSegmentsR - 2];
        yCorR[numSegmentsR - 1] = yCorR[numSegmentsR - 2] + diffR;
        break;
    }
  }

  // user wins when other opponent is killed
  s.checkGameStatus = function() {
    if (xCorL[xCorL.length - 1] > s.width ||
        xCorL[xCorL.length - 1] < 0 ||
        yCorL[yCorL.length - 1] > s.height ||
        yCorL[yCorL.length - 1] < 0 ||
        s.checkSnakeCollisionL()) {
      s.noLoop();
      scoreElemL.html('You lost!');
      scoreElemR.html('You won!');
      if (!s.button) {
        button.style('display', 'block')
        button.mousePressed(s.resetSketch)
        // button.mousePressed(socket.emit('rematch', true))
      }
    } else if (
        xCorR[xCorR.length - 1] > s.width ||
        xCorR[xCorR.length - 1] < 0 ||
        yCorR[yCorR.length - 1] > s.height ||
        yCorR[yCorR.length - 1] < 0 ||
        s.checkSnakeCollisionR()) {
      s.noLoop();
      scoreElemL.html('You won!');
      scoreElemR.html('You lost!');
      if (!s.button) {
        button.style('display', 'block')
        button.mousePressed(s.resetSketch);
        // button.mousePressed(socket.emit('rematch', true))
      }
    }
  }

  s.checkSnakeCollisionL = function() {
    s.snakeHeadXL = xCorL[xCorL.length - 1];
    s.snakeHeadYL = yCorL[yCorL.length - 1];
    for (var i = 0; i < xCorL.length - 1; i++) {
      if (xCorL[i] === s.snakeHeadXL && yCorL[i] === s.snakeHeadYL) {
        return true;
      }
    }
    for (var o = 0; o < yCorL.length - 1; o++) {
      if (s.snakeHeadXL === xCorR[o] && s.snakeHeadYL === yCorR[o]) {
        return true;
      }
    }
  }

  s.checkSnakeCollisionR = function() {
    s.snakeHeadXR = xCorR[xCorR.length - 1];
    s.snakeHeadYR = yCorR[yCorR.length - 1];
    for (var i = 0; i < xCorR.length - 1; i++) {
      if (xCorR[i] === s.snakeHeadXR && yCorR[i] === s.snakeHeadYR) {
        return true;
      }
    }
    for (var o = 0; o < yCorR.length - 1; o++) {
      if (s.snakeHeadXR === xCorL[o] && s.snakeHeadYR === yCorL[o]) {
        return true;
      }
    }
  }


  s.checkForFruitL = function() {
    s.stroke(200)
    s.point(xFruit, yFruit);
    if (xCorL[xCorL.length - 1] === xFruit && yCorL[yCorL.length - 1] === yFruit) {
      xCorL.unshift(xCorL[0]);
      yCorL.unshift(yCorL[0]);
      numSegmentsL++;
      s.updateFruitCoordinates();
    }
  }

  s.checkForFruitR = function() {
    s.stroke(200)
    s.point(xFruit, yFruit);
    if (xCorR[xCorR.length - 1] === xFruit && yCorR[yCorR.length - 1] === yFruit) {
      xCorR.unshift(xCorR[0]);
      yCorR.unshift(yCorR[0]);
      numSegmentsR++;
      s.updateFruitCoordinates();
    }
  }

  // setup to spawn both fruits consistently through clients
  s.updateFruitCoordinates = function() {
    xFruit = s.floor(s.random(10, (s.width - 100) / 10)) * 10;
    yFruit = s.floor(s.random(10, (s.height - 100) / 10)) * 10;
  }

  s.keyPressed = function() {
    data = s.keyCode;
    socket.emit('keypress', data)

    switch (s.keyCode) {
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
  }
};

var snakeGame = new p5(sketch, 'snakeContainer');


