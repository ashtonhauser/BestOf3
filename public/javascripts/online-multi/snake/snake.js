var form = document.getElementsByClassName('.formm');
var ready = document.getElementById('#option1')
var clientCount;
var socket = io.connect('http://localhost:3000/snake')
var socketId = socket.id

socket.on('counter', function (data) {
  $("#counter").text(data.count);
  clientCount = data.count;
  console.log(clientCount)
});


/*
  could make an array that acts as a queue for each client that joins.
  index 0 is p1 index 2 is p2
  on connection if clientCount >= 1 emit to that client p2 = true
  if p1(has set id) true then use function newkeyL
  else use function newkeyR
*/



var sketch = function(s) {

  var xFruit= 0;
  var yFruit = 0;
  var button;
  var data;
  var waitingDiv;
  var timer;

  // LEFT
  var numSegmentsL = 20;
  var directionL = 'right';
  var xStartL = 10;
  var yStartL = 250;
  var diffL = 10;

  var xCorL = [];
  var yCorL = [];

  var scoreElemL;

  // RIGHT
  var numSegmentsR = 20;
  var directionR = 'left';
  var xStartR = 1000;
  var yStartR = 250;
  var diffR = 10;

  var xCorR = [];
  var yCorR = [];

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

    s.draw()
    s.loop()
    scoreElemR.html('p2')
    scoreElemL.html('p1')
    button.style('display', 'none')
  }


  s.draw = function() {
    s.background(0)
    s.textAlign(s.CENTER, s.CENTER);
    s.textSize(100);
    s.text(timer, s.width/2, s.height/2);

    if (clientCount == 2) {
      if (s.frameCount % 15 == 0 && timer > 0) {
        timer --;
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
    s.point(xFruit, yFruit);
    if (xCorL[xCorL.length - 1] === xFruit && yCorL[yCorL.length - 1] === yFruit) {
      xCorL.unshift(xCorL[0]);
      yCorL.unshift(yCorL[0]);
      numSegmentsL++;
      s.updateFruitCoordinates();
    }
  }

  s.checkForFruitR = function() {
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


