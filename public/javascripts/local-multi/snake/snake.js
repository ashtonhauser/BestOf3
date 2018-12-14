var sketch = function(s) {
  var leftS;
  var rightS;

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

  s.setup = function() {
    scoreElemL = s.createDiv('Score = 0');
    scoreElemL.id = 'Lscore';
    scoreElemL.style('color', 'black');

    scoreElemR = s.createDiv('Score = 0');
    scoreElemR.id = 'Rscore';
    scoreElemR.style('color', 'black');


    s.cnv = s.createCanvas(1000, 500);
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
    s.background(0);
    for (var i = 0; i < numSegments - 1; i++) {
      s.line(xCor[i], yCor[i], xCor[i + 1], yCor[i + 1]);
    }
    s.updateSnakeCoordinates();
    s.checkGameStatus();
    s.checkForFruit();
  }

  s.updateSnakeCoordinates = function() {
    for (var i = 0; i < numSegments - 1; i++) {
      xCor[i] = xCor[i + 1];
      yCor[i] = yCor[i + 1];
    }
    switch (direction) {
      case 'right':
        xCor[numSegments - 1] = xCor[numSegments - 2] + diff;
        yCor[numSegments - 1] = yCor[numSegments - 2];
        break;
      case 'up':
        xCor[numSegments - 1] = xCor[numSegments - 2];
        yCor[numSegments - 1] = yCor[numSegments - 2] - diff;
        break;
      case 'left':
        xCor[numSegments - 1] = xCor[numSegments - 2] - diff;
        yCor[numSegments - 1] = yCor[numSegments - 2];
        break;
      case 'down':
        xCor[numSegments - 1] = xCor[numSegments - 2];
        yCor[numSegments - 1] = yCor[numSegments - 2] + diff;
        break;
    }
  }

  s.checkGameStatus = function() {
    if (xCor[xCor.length - 1] > s.width ||
        xCor[xCor.length - 1] < 0 ||
        yCor[yCor.length - 1] > s.height ||
        yCor[yCor.length - 1] < 0 ||
        s.checkSnakeCollision()) {
      s.noLoop();
      s.scoreVal = parseInt(scoreElem.html().substring(8));
      scoreElem.html('Game ended! Your score was : ' + s.scoreVal);
    }
  }

  s.checkSnakeCollision = function() {
    s.snakeHeadX = xCor[xCor.length - 1];
    s.snakeHeadY = yCor[yCor.length - 1];
    for (var i = 0; i < xCor.length - 1; i++) {
      if (xCor[i] === s.snakeHeadX && yCor[i] === s.snakeHeadY) {
        return true;
      }
    }
  }

  s.checkForFruit = function() {
    s.point(xFruit, yFruit);
    if (xCor[xCor.length - 1] === xFruit && yCor[yCor.length - 1] === yFruit) {
      s.prevScore = parseInt(scoreElem.html().substring(8));
      scoreElem.html('Score = ' + (s.prevScore + 1));
      xCor.unshift(xCor[0]);
      yCor.unshift(yCor[0]);
      numSegments++;
      s.updateFruitCoordinates();
    }
  }

  s.updateFruitCoordinates = function() {
    xFruit = s.floor(s.random(10, (s.width - 100) / 10)) * 10;
    yFruit = s.floor(s.random(10, (s.height - 100) / 10)) * 10;
  }

  s.keyPressed = function() {
    console.log('Key in RightSketch', s.keyCode)
    switch (s.keyCode) {
      case 65:
        if (direction != 'right') {
          direction = 'left';
        }
        break;
      case 68:
        if (direction != 'left') {
          direction = 'right';
        }
        break;
      case 87:
        if (direction != 'down') {
          direction = 'up';
        }
        break;
      case 83:
        if (direction != 'up') {
          direction = 'down';
        }
        break;
    }
  }

};

var snake = new p5(sketch, 'localS1')


