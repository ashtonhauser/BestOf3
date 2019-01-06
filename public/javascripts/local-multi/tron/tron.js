window.addEventListener("keydown", function(e) {
  if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
}, false);

var sketch = function(s) {
  var button;

  // LEFT
  var numSegmentsL;
  var directionL;
  var xStartL;
  var yStartL;
  var diffL;
  var xCorL;
  var yCorL;
  var scoreElemL;

  // RIGHT
  var numSegmentsR;
  var directionR;
  var xStartR;
  var yStartR;
  var diffR;
  var xCorR;
  var yCorR;
  var scoreElemR;

  s.setup = function() {
    s.createCanvas(1000, 500);

    s.frameRate(35);
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
    // LEFT
    numSegmentsL = 1;
    directionL = 'right';
    xStartL = 200;
    yStartL = 250;
    diffL = 10;
    xCorL = [];
    yCorL = [];

    // RIGHT
    numSegmentsR = 1;
    directionR = 'left';
    xStartR = 800;
    yStartR = 250;
    diffR = 10;
    xCorR = [];
    yCorR = [];

    for (var i = 0; i < numSegmentsL; i++) {
      xCorL.push(xStartL + (i * diffL));
      yCorL.push(yStartL);
    }
    for (var o = 0; o < numSegmentsR; o++) {
      xCorR.push(xStartR - (o * diffR));
      yCorR.push(yStartR);
    }

    s.draw()
    s.loop()
    scoreElemR.html('p2')
    scoreElemL.html('p1')
    button.style('display', 'none')
  }

  s.draw = function() {
    s.background(37, 40, 57)
    s.drawL()
    s.drawR()
    s.checkGameStatus();
  }

  s.drawL = function() {
    s.stroke(130,240,240)
    for (var i = 0; i < numSegmentsL - 1; i++) {
      s.line(xCorL[i], yCorL[i], xCorL[i + 1], yCorL[i + 1]);
    }
    s.updateSnakeCoordinatesL();
  }

  s.drawR = function() {
    s.stroke(240,84,79)
    for (var i = 0; i < numSegmentsR - 1; i++) {
      s.line(xCorR[i], yCorR[i], xCorR[i + 1], yCorR[i + 1]);
    }
    s.updateSnakeCoordinatesR();
  }

  s.updateSnakeCoordinatesL = function() {
    numSegmentsL++
    xCorL.push(xCorL[numSegmentsL.length - 1] + 1)
    yCorL.push(yCorL[numSegmentsL.length - 1] + 1)
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
    numSegmentsR++
    xCorR.push(xCorR[numSegmentsR.length - 1] - 1)
    yCorR.push(yCorR[numSegmentsR.length - 1] - 1)
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
        button.mousePressed(s.resetSketch);
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

  s.keyPressed = function() {
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

var snakeGame = new p5(sketch, 'snakeContainer')


