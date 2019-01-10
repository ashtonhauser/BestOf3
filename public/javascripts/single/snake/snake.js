var sketch = function(s) {
  s.numSegments = 10;
  s.direction = 'right';

  s.xStart = 0; //starting x coordinate for snake
  s.yStart = 250; //starting y coordinate for snake
  s.diff = 10;

  s.xCor = [];
  s.yCor = [];

  s.xFruit = 0;
  s.yFruit = 0;
  s.scoreElem;

  s.setup = function() {
    s.scoreElem = s.createDiv('Score = 0');
    s.scoreElem.id = 'score';
    s.scoreElem.style('color', 'black');
    s.scoreElem.parent('myContainer');

    s.cnv = s.createCanvas(500, 500);
    s.cnv.parent('myContainer');
    s.frameRate(15);
    s.stroke(255);
    s.strokeWeight(10);
    s.updateFruitCoordinates();

    for (var i = 0; i < s.numSegments; i++) {
      s.xCor.push(s.xStart + (i * s.diff));
      s.yCor.push(s.yStart);
    }
  }

  s.draw = function() {
    s.background(37, 40, 57);
    for (var i = 0; i < s.numSegments - 1; i++) {
      s.line(s.xCor[i], s.yCor[i], s.xCor[i + 1], s.yCor[i + 1]);
    }
    s.updateSnakeCoordinates();
    s.checkGameStatus();
    s.checkForFruit();
  }

  s.updateSnakeCoordinates = function() {
    for (var i = 0; i < s.numSegments - 1; i++) {
      s.xCor[i] = s.xCor[i + 1];
      s.yCor[i] = s.yCor[i + 1];
    }
    switch (s.direction) {
      case 'right':
        s.xCor[s.numSegments - 1] = s.xCor[s.numSegments - 2] + s.diff;
        s.yCor[s.numSegments - 1] = s.yCor[s.numSegments - 2];
        break;
      case 'up':
        s.xCor[s.numSegments - 1] = s.xCor[s.numSegments - 2];
        s.yCor[s.numSegments - 1] = s.yCor[s.numSegments - 2] - s.diff;
        break;
      case 'left':
        s.xCor[s.numSegments - 1] = s.xCor[s.numSegments - 2] - s.diff;
        s.yCor[s.numSegments - 1] = s.yCor[s.numSegments - 2];
        break;
      case 'down':
        s.xCor[s.numSegments - 1] = s.xCor[s.numSegments - 2];
        s.yCor[s.numSegments - 1] = s.yCor[s.numSegments - 2] + s.diff;
        break;
    }
  }

  s.checkGameStatus = function() {
    if (s.xCor[s.xCor.length - 1] > s.width ||
        s.xCor[s.xCor.length - 1] < 0 ||
        s.yCor[s.yCor.length - 1] > s.height ||
        s.yCor[s.yCor.length - 1] < 0 ||
        s.checkSnakeCollision()) {
      s.noLoop();
      s.scoreVal = parseInt(s.scoreElem.html().substring(8));
      s.scoreElem.html('Game ended! Your score was : ' + s.scoreVal);
    }
  }

  s.checkSnakeCollision = function() {
    s.snakeHeadX = s.xCor[s.xCor.length - 1];
    s.snakeHeadY = s.yCor[s.yCor.length - 1];
    for (var i = 0; i < s.xCor.length - 1; i++) {
      if (s.xCor[i] === s.snakeHeadX && s.yCor[i] === s.snakeHeadY) {
        return true;
      }
    }
  }

  s.checkForFruit = function() {
    s.point(s.xFruit, s.yFruit);
    if (s.xCor[s.xCor.length - 1] === s.xFruit && s.yCor[s.yCor.length - 1] === s.yFruit) {
      s.prevScore = parseInt(s.scoreElem.html().substring(8));
      s.scoreElem.html('Score = ' + (s.prevScore + 1));
      s.xCor.unshift(s.xCor[0]);
      s.yCor.unshift(s.yCor[0]);
      s.numSegments++;
      s.updateFruitCoordinates();
    }
  }

  s.updateFruitCoordinates = function() {
    s.xFruit = s.floor(s.random(10, (s.width - 100) / 10)) * 10;
    s.yFruit = s.floor(s.random(10, (s.height - 100) / 10)) * 10;
  }

  s.keyPressed = function() {
    switch (s.keyCode) {
      case 74:
        if (s.direction != 'right') {
          s.direction = 'left';
        }
        break;
      case 76:
        if (s.direction != 'left') {
          s.direction = 'right';
        }
        break;
      case 73:
        if (s.direction != 'down') {
          s.direction = 'up';
        }
        break;
      case 75:
        if (s.direction != 'up') {
          s.direction = 'down';
        }
        break;
    }
  }

}

var snake = new p5(sketch)