var sketch = function(s) {
  var leftS;
  var rightS;

  // LEFT
  var numSegmentsL = 10;
  var directionL = 'right';
  var xStartL = 0;
  var yStartL = 250;
  var diffL = 10;

  var xCorL = [];
  var yCorL = [];

  var xFruitL= 0;
  var yFruitL = 0;
  var scoreElemL;
  var scoreValL = 0;

  // RIGHT
  var numSegmentsR = 10;
  var directionR = 'right';
  var xStartR = 500;
  var yStartR = 250;
  var diffR = 10;

  var xCorR = [];
  var yCorR = [];

  var xFruitR= 0;
  var yFruitR = 0;
  var scoreElemR;
  var scoreValR = 0;

  s.setup = function() {
    scoreElemL = s.createDiv('Score = 0');
    scoreElemL.id = 'Lscore';
    scoreElemL.style('color', 'black');

    scoreElemR = s.createDiv('Score = 0');
    scoreElemR.id = 'Rscore';
    scoreElemR.style('color', 'black');


    s.createCanvas(1000, 500);
    s.leftS = s.createGraphics(500, 500)
    s.rightS = s.createGraphics(500, 500)

    s.frameRate(15);
    s.stroke(255);
    s.strokeWeight(10);
    s.updateFruitCoordinatesL();
    s.updateFruitCoordinatesR();

    for (var i = 0; i < numSegmentsL; i++) {
      xCorL.push(xStartL + (i * diffL));
      yCorL.push(yStartL);
    }
    for (var o = 0; o < numSegmentsR; o++) {
      xCorR.push(xStartR + (o * diffR));
      yCorR.push(yStartR);
    }
  }

  s.draw = function() {
    s.background(255)

    s.image(s.leftS, 0, 0);
    s.image(s.rightS, 500, 0);
    s.drawL()
    s.drawR()
  }

  s.drawL = function() {
    s.leftS.background(0);
    for (var i = 0; i < numSegmentsL - 1; i++) {
      s.line(xCorL[i], yCorL[i], xCorL[i + 1], yCorL[i + 1]);
    }
    s.updateSnakeCoordinatesL();
    s.checkGameStatus();
    s.checkForFruitL();
  }

  s.drawR = function() {
    s.rightS.background(100);
    for (var i = 0; i < numSegmentsR - 1; i++) {
      s.line(xCorR[i], yCorR[i], xCorR[i + 1], yCorR[i + 1]);
    }
    s.updateSnakeCoordinatesR();
    s.checkGameStatus();
    s.checkForFruitR();
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

  s.checkGameStatus = function() {
    console.log("running check")
    if (xCorL[xCorL.length - 1] > s.leftS.width ||
        xCorL[xCorL.length - 1] < 0 ||
        yCorL[yCorL.length - 1] > s.height ||
        yCorL[yCorL.length - 1] < 0 ||
        s.checkSnakeCollisionL()) {
      console.log("left died")
      console.log(scoreElemL.html())
      s.noLoop();
      s.scoreValL = parseInt(scoreElemL.html().replace(/[^0-9]/g, ''));
      s.scoreValR = parseInt(scoreElemR.html().replace(/[^0-9]/g, ''));
      scoreElemL.html('You lost! Your score was : ' + s.scoreValL);
      scoreElemR.html('You won! Your score was : ' + s.scoreValR);
    } else if (
        xCorR[xCorR.length - 1] > s.width ||
        xCorR[xCorR.length - 1] < 500 ||
        yCorR[yCorR.length - 1] > s.height ||
        yCorR[yCorR.length - 1] < 0 ||
        s.checkSnakeCollisionR()) {
      console.log("right died")
      s.noLoop();
      s.scoreValL = parseInt(scoreElemL.html().replace(/[^0-9]/g, ''));
      s.scoreValR = parseInt(scoreElemR.html().replace(/[^0-9]/g, ''));
      scoreElemL.html('You won! Your score was : ' + Number(s.scoreValL));
      scoreElemR.html('You lost! Your score was : ' + Number(s.scoreValR));
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

  s.checkSnakeCollisionR = function() {
    s.snakeHeadXR = xCorR[xCorR.length - 1];
    s.snakeHeadYR = yCorR[yCorR.length - 1];
    for (var i = 0; i < xCorR.length - 1; i++) {
      if (xCorR[i] === s.snakeHeadXR && yCorR[i] === s.snakeHeadYR) {
        return true;
      }
    }
  }
  }

  s.checkForFruitL = function() {
    s.point(xFruitL, yFruitL);
    if (xCorL[xCorL.length - 1] === xFruitL && yCorL[yCorL.length - 1] === yFruitL) {
      s.prevScoreL = parseInt(scoreElemL.html().substring(8));
      scoreElemL.html('Score = ' + (s.prevScoreL + 1));
      xCorL.unshift(xCorL[0]);
      yCorL.unshift(yCorL[0]);
      numSegmentsL++;
      s.updateFruitCoordinatesL();
    }
  }

  s.checkForFruitR = function() {
    s.point(xFruitR, yFruitR);
    if (xCorR[xCorR.length - 1] === xFruitR && yCorR[yCorR.length - 1] === yFruitR) {
      s.prevScoreR = parseInt(scoreElemR.html().substring(8));
      scoreElemR.html('Score = ' + (s.prevScoreR + 1));
      xCorR.unshift(xCorR[0]);
      yCorR.unshift(yCorR[0]);
      numSegmentsR++;
      s.updateFruitCoordinatesR();
    }
  }

  s.updateFruitCoordinatesL = function() {
    xFruitL = s.floor(s.random(10, (s.leftS.width - 100) / 10)) * 10;
    yFruitL = s.floor(s.random(10, (s.leftS.height - 100) / 10)) * 10;
  }

  s.updateFruitCoordinatesR = function() {
    xFruitR = s.floor(s.random(10, (s.rightS.width - 100) / 10)) * 10 + 500;
    yFruitR = s.floor(s.random(10, (s.rightS.height - 100) / 10)) * 10;
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

var snakeGame = new p5(sketch)


