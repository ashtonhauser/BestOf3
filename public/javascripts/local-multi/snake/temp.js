var leftSketch = function(p) {
  p.numSegments = 10;
  p.direction = 'right';

  p.xStart = 0; //starting x coordinate for snake
  p.yStart = 250; //starting y coordinate for snake
  p.diff = 10;

  p.xCor = [];
  p.yCor = [];

  p.xFruit = 0;
  p.yFruit = 0;
  p.scoreElem;

  p.setup = function() {
    p.scoreElem = p.createDiv('Score = 0');
    p.scoreElem.id = 'score';
    p.scoreElem.style('color', 'black');
    // p.scoreElem.parent('myContainer');

    p.cnv = p.createCanvas(500, 500);
    // p.cnv.parent('myContainer');
    p.frameRate(15);
    p.stroke(255);
    p.strokeWeight(10);
    p.updateFruitCoordinates();

    for (var i = 0; i < p.numSegments; i++) {
      p.xCor.push(p.xStart + (i * p.diff));
      p.yCor.push(p.yStart);
    }
  }

  p.draw = function() {
    p.background(0);
    for (var i = 0; i < p.numSegments - 1; i++) {
      p.line(p.xCor[i], p.yCor[i], p.xCor[i + 1], p.yCor[i + 1]);
    }
    p.updateSnakeCoordinates();
    p.checkGameStatus();
    p.checkForFruit();
  }

  p.updateSnakeCoordinates = function() {
    for (var i = 0; i < p.numSegments - 1; i++) {
      p.xCor[i] = p.xCor[i + 1];
      p.yCor[i] = p.yCor[i + 1];
    }
    switch (p.direction) {
      case 'right':
        p.xCor[p.numSegments - 1] = p.xCor[p.numSegments - 2] + p.diff;
        p.yCor[p.numSegments - 1] = p.yCor[p.numSegments - 2];
        break;
      case 'up':
        p.xCor[p.numSegments - 1] = p.xCor[p.numSegments - 2];
        p.yCor[p.numSegments - 1] = p.yCor[p.numSegments - 2] - p.diff;
        break;
      case 'left':
        p.xCor[p.numSegments - 1] = p.xCor[p.numSegments - 2] - p.diff;
        p.yCor[p.numSegments - 1] = p.yCor[p.numSegments - 2];
        break;
      case 'down':
        p.xCor[p.numSegments - 1] = p.xCor[p.numSegments - 2];
        p.yCor[p.numSegments - 1] = p.yCor[p.numSegments - 2] + p.diff;
        break;
    }
  }

  p.checkGameStatus = function() {
    if (p.xCor[p.xCor.length - 1] > p.width ||
        p.xCor[p.xCor.length - 1] < 0 ||
        p.yCor[p.yCor.length - 1] > p.height ||
        p.yCor[p.yCor.length - 1] < 0 ||
        p.checkSnakeCollision()) {
      p.noLoop();
      p.scoreVal = parseInt(p.scoreElem.html().substring(8));
      p.scoreElem.html('Game ended! Your score was : ' + p.scoreVal);
    }
  }

  p.checkSnakeCollision = function() {
    p.snakeHeadX = p.xCor[p.xCor.length - 1];
    p.snakeHeadY = p.yCor[p.yCor.length - 1];
    for (var i = 0; i < p.xCor.length - 1; i++) {
      if (p.xCor[i] === p.snakeHeadX && p.yCor[i] === p.snakeHeadY) {
        return true;
      }
    }
  }

  p.checkForFruit = function() {
    p.point(p.xFruit, p.yFruit);
    if (p.xCor[p.xCor.length - 1] === p.xFruit && p.yCor[p.yCor.length - 1] === p.yFruit) {
      p.prevScore = parseInt(p.scoreElem.html().substring(8));
      p.scoreElem.html('Score = ' + (p.prevScore + 1));
      p.xCor.unshift(p.xCor[0]);
      p.yCor.unshift(p.yCor[0]);
      p.numSegments++;
      p.updateFruitCoordinates();
    }
  }

  p.updateFruitCoordinates = function() {
    p.xFruit = p.floor(p.random(10, (p.width - 100) / 10)) * 10;
    p.yFruit = p.floor(p.random(10, (p.height - 100) / 10)) * 10;
  }

  p.keyPressed = function() {
    console.log('Key in LeftSketch', p.keyCode)
    switch (p.keyCode) {
      case 37:
        if (p.direction != 'right') {
          p.direction = 'left';
        }
        break;
      case 39:
        if (p.direction != 'left') {
          p.direction = 'right';
        }
        break;
      case 38:
        if (p.direction != 'down') {
          p.direction = 'up';
        }
        break;
      case 40:
        if (p.direction != 'up') {
          p.direction = 'down';
        }
        break;
    }
  }
}

var rightSketch = function(s) {
  var numSegments = 10;
  var direction = 'right';

  var xStart = 0; //starting x coordinate for snake
  var yStart = 250; //starting y coordinate for snake
  var diff = 10;

  var xCor = [];
  var yCor = [];

  var xFruit = 0;
  var yFruit = 0;
  var scoreElem;

  s.setup = function() {
    scoreElem = s.createDiv('Score = 0');
    scoreElem.id = 'score';
    scoreElem.style('color', 'black');
    // scoreElem.parent('myContainer');

    s.cnv = s.createCanvas(500, 500);
    // s.cnv.parent('myContainer');
    s.frameRate(15);
    s.stroke(255);
    s.strokeWeight(10);
    s.updateFruitCoordinates();

    for (var i = 0; i < numSegments; i++) {
      xCor.push(xStart + (i * diff));
      yCor.push(yStart);
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


snake1 = new p5(leftSketch, 'localS1')
snake2 = new p5(rightSketch, 'localS2')





