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

var sketch = function(s) {
  socket.on('clientState', function(data) {
    clientState = data;
    if (data == 'RESET') {
      s.resetSketch();
    } else if (data == 'PLAYER_LEFT') {
      location.reload()
    }
  })

  var readyState;
  var xFruit; // defined by server
  var yFruit; // defined by server
  var text;
  var gameOver;
  var scoreElem

  var numSegmentsL; // defined by server
  var directionL; // defined by server
  var xStartL;
  var yStartL;
  var diffL;
  var xCorL;  // defined by server
  var yCorL;  // defined by server
  var playerElemL;

  var numSegmentsR; // defined by server
  var directionR; // defined by server
  var xStartR;
  var yStartR;
  var diffR;
  var xCorR; // defined by server
  var yCorR; // defined by server
  var playerElemR;


  s.setup = function() {
    s.createCanvas(1000, 500);
    s.frameRate(15);
    s.stroke(255);
    s.strokeWeight(10);

    scoreElem = s.createDiv().addClass('score')

    s.resetSketch()
  }

  s.resetSketch = function() {
    clientState = 'NOT_READY'
    readyState = {'p1': p1, 'state': 'NOT_READY'}
    socket.emit('clientReady', readyState)
    playerElemL = s.createDiv('Player 1').addClass('Lscore');
    playerElemR = s.createDiv('Player 2').addClass('Rscore');
    if (p1) {
      scoreElem.html('Goodluck Player 1!')
    } else {
      scoreElem.html('Goodluck Player 2!')
    }
    $("#rematchL").css('display', 'none');
    $("#rematchR").css('display', 'none');
    $(".PR").css("display", "none")
    $(".PL").css("display", "none")
    $(".checkR").css("display", "none")
    $(".checkL").css("display", "none")
    $(".PR").css("background", "#E54634")
    $(".PL").css("background", "#E54634")

    xFruit= 0;
    yFruit = 0;
    gameOver = false;
    text = 'waiting for oponent';

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

    // s.updateFruitCoordinates();

    for (var i = 0; i < numSegmentsL; i++) {
      xCorL.push(xStartL + (i * diffL));
      yCorL.push(yStartL);
    }
    for (var o = 0; o < numSegmentsR; o++) {
      xCorR.push(xStartR - (o * diffR));
      yCorR.push(yStartR);
    }

    // on document load + 2.5 seconds alert server clientstate ready
    $(function() {
      readyState = {'p1': p1, state: 'PLAYERS_READY'};
      socket.emit('clientReady', readyState)
    })

    s.draw()
    s.loop()
  }

  s.draw = function() {
    s.background(37, 40, 57)
    s.textAlign(s.CENTER, s.CENTER);
    s.textSize(100);
    s.text(text, s.width/2, s.height/2);

    socket.on('timer', function(num) {
      text = num;
    })

    if (clientState === 'PLAYERS_READY' && clientCount == 2) {
      text = '';
      s.drawL()
      s.drawR()
      s.checkGameStatus();
      socket.on('move', function(dir) {
        directionL = dir.L.directionL || directionL;
        directionR = dir.R.directionR || directionR;
        xCorR = dir.R.xCorR || xCorR;
        xCorL = dir.L.xCorL || xCorL;
        yCorR = dir.R.yCorR || yCorR;
        yCorL = dir.L.yCorL || yCorL;
      })
    }
  }

  s.drawL = function() {
    s.stroke(229,70,52)
    for (var i = 0; i < numSegmentsL - 1; i++) {
      s.line(xCorL[i], yCorL[i], xCorL[i + 1], yCorL[i + 1]);
    }
    s.updateSnakeCoordinatesL();
    // s.checkForFruitL();
  }

  s.drawR = function() {
    s.stroke(244,180,41)
    for (var i = 0; i < numSegmentsR - 1; i++) {
      s.line(xCorR[i], yCorR[i], xCorR[i + 1], yCorR[i + 1]);
    }
    s.updateSnakeCoordinatesR();
    // s.checkForFruitR();
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

  // should run on server
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
      gameOver = true;
      socket.emit('gameOver')
      // fix
      if (user_id !== 'guest') {
        socket.emit('l', user_id);
        socket.emit('w', user_id);
      }
      playerElemL.hide()
      playerElemR.hide()
      if (p1) {
        scoreElem.html('you lose')
        $(".PR").css("display", "block")
        $("#rematchL").css('display', 'block');
        $("#rematchL").unbind().click(function() {
          socket.emit('reset', username)
        })
      } else {
        scoreElem.html('you win')
        $(".PL").css("display", "block")
        $("#rematchR").css('display', 'block')
        $("#rematchR").unbind().click(function() {
          socket.emit('reset', username)
        })
      }
    } else if (
        xCorR[xCorR.length - 1] > s.width ||
        xCorR[xCorR.length - 1] < 0 ||
        yCorR[yCorR.length - 1] > s.height ||
        yCorR[yCorR.length - 1] < 0 ||
        s.checkSnakeCollisionR()) {
      s.noLoop();
      gameOver = true;
      socket.emit('gameOver')
      if (user_id !== 'guest') {
        socket.emit('w', user_id);
        socket.emit('l', user_id);
      }
      playerElemR.hide()
      playerElemL.hide()
      if (p1) {
        $(".PR").css("display", "block")
        scoreElem.html('you win')
        $("#rematchL").css('display', 'block')
        $("#rematchL").unbind().click(function() {
          socket.emit('reset', username)
        })
      } else {
        $(".PL").css("display", "block")
        scoreElem.html('you lose')
        $("#rematchR").css('display', 'block')
        $("#rematchR").unbind().click(function() {
          socket.emit('reset', username)
        })
      }
    }
  }

  // move to server
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

  // move to server
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
    var key = s.keyCode
    var data = {
      key,
      'L': {xCorL, yCorL},
      'R': {xCorR, yCorR}
    }

    // filters output based on player number
    if (clientState === 'PLAYERS_READY' && gameOver === false) {
      if (p1 && [65, 68, 87, 83].includes(key)) {
        console.log("sent p1 key", key)
        socket.emit('keypress', data)
      } else if (!p1 && [38, 39, 40, 37].includes(key)){
        console.log("sent p2 key", key)
        socket.emit('keypress', data)
      }
    }
  }

  // s.checkForFruitL = function() {
  //   s.stroke(200)
  //   s.point(xFruit, yFruit);
  //   if (xCorL[xCorL.length - 1] === xFruit && yCorL[yCorL.length - 1] === yFruit) {
  //     xCorL.unshift(xCorL[0]);
  //     yCorL.unshift(yCorL[0]);
  //     numSegmentsL++;
  //     s.updateFruitCoordinates();
  //   }
  // }

  // s.checkForFruitR = function() {
  //   s.stroke(200)
  //   s.point(xFruit, yFruit);
  //   if (xCorR[xCorR.length - 1] === xFruit && yCorR[yCorR.length - 1] === yFruit) {
  //     xCorR.unshift(xCorR[0]);
  //     yCorR.unshift(yCorR[0]);
  //     numSegmentsR++;
  //     s.updateFruitCoordinates();
  //   }
  // }

  // setup to spawn both fruits consistently through clients
  // s.updateFruitCoordinates = function() {
  //   xFruit = s.floor(s.random(10, (s.width - 100) / 10)) * 10;
  //   yFruit = s.floor(s.random(10, (s.height - 100) / 10)) * 10;
  // }
};

var snakeGame = new p5(sketch, 'bigContainer');