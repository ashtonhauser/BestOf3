var snake = function(s) {
  var xFruit;
  var yFruit;
  var button;
  var timer;
  var gameOver;

  // LEFT
  var numSegmentsL;
  var directionL;
  var xStartL;
  var yStartL;
  var diffL;
  var xCorL;
  var yCorL;


  // RIGHT
  var numSegmentsR;
  var directionR;
  var xStartR;
  var yStartR;
  var diffR;
  var xCorR;
  var yCorR;
  var start;
  var runCountL;
  var runCountR;

  s.setup = function() {
    runCounter++
    s.createCanvas(1000, 500);

    s.frameRate(20);
    s.stroke(255);
    s.strokeWeight(10);

    s.resetSketch()

  }


  s.resetSketch = function() {
    $("#nextRound").css('display', 'none');

    timer = 3;
    xFruit= 0;
    yFruit = 0;
    gameOver = true;
    start = false;
    runCountL = 0;
    runCountR = 0;

    // LEFT
    numSegmentsL = 30;
    directionL = 'right';
    xStartL = 10;
    yStartL = 250;
    diffL = 10;
    xCorL = [];
    yCorL = [];

    // RIGHT
    numSegmentsR = 30;
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
    s.draw()
    s.loop()
  }

  s.draw = function() {
    s.background(37, 40, 57)
    s.textAlign(s.CENTER, s.CENTER);
    s.textSize(100);
    s.text(timer, s.width/2, s.height/2);

    $("#start").unbind().click(function() {
      start = true
      $("#start").css('display', 'none')
    })

    if (s.frameCount % 15 == 0 && timer > 0 && start) {
      timer --;
    }

    if (timer == 0) {
      timer = ''
      gameOver = false;
    }

    if(!gameOver) {
      s.drawL()
      s.drawR()
      s.checkGameStatus();
    }
  }

  s.drawL = function() {
    s.stroke(229,70,52)
    for (var i = 0; i < numSegmentsL - 1; i++) {
      s.line(xCorL[i], yCorL[i], xCorL[i + 1], yCorL[i + 1]);
    }
    s.updateSnakeCoordinatesL();
    s.checkForFruitL();
  }

  s.drawR = function() {
    s.stroke(244,180,41)
    for (var i = 0; i < numSegmentsR - 1; i++) {
      s.line(xCorR[i], yCorR[i], xCorR[i + 1], yCorR[i + 1]);
    }
    s.updateSnakeCoordinatesR();
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
    if (xCorL[xCorL.length - 1] > s.width ||
        xCorL[xCorL.length - 1] < 0 ||
        yCorL[yCorL.length - 1] > s.height ||
        yCorL[yCorL.length - 1] < 0 ||
        s.checkSnakeCollisionL()) {
      s.noLoop();
      runCountL++
      gameOver = true;
      $(".Rscore").html((Number($(".Rscore").text()) + 1))
      $("#nextRound").css('display', 'block');
      if (runCounter == 3) {
        runCheck()
        $("#nextRound").css('display', 'none');
        s.remove()
      }
      $("#nextRound").unbind().click(function() {
        s.remove()
        startNewGame()
        $("#nextRound").css('display', 'none');
      })
      if (runCountL >= 2) {
        $(".Rscore").html((Number($(".Rscore").text()) - 1))
      }
    } else if (
        xCorR[xCorR.length - 1] > s.width ||
        xCorR[xCorR.length - 1] < 0 ||
        yCorR[yCorR.length - 1] > s.height ||
        yCorR[yCorR.length - 1] < 0 ||
        s.checkSnakeCollisionR()) {
      s.noLoop();
      runCountR++
      gameOver = true;
      $(".Lscore").html((Number($(".Lscore").text()) + 1))
      $("#nextRound").css('display', 'block');
      if (runCounter == 3) {
        $("#nextRound").css('display', 'none');
        runCheck()
        s.remove()
      }
      $("#nextRound").unbind().click(function() {
        s.remove()
        startNewGame()
        $("#nextRound").css('display', 'none');
      })
      if (runCountR >= 2) {
        $(".Lscore").html((Number($(".Lscore").text()) - 1))
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

  // create one fruit spawn which both snakes can consume
  s.updateFruitCoordinates = function() {
    s.stroke(200)
    xFruit = s.floor(s.random(10, (s.width - 100) / 10)) * 10;
    yFruit = s.floor(s.random(10, (s.height - 100) / 10)) * 10;
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