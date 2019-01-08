var clientCount;
var clientState = 'NOT_READY';
var socket = io.connect('http://localhost:3000/tron')
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
  $("#counter").text(data.count);
  clientCount = data.count;
});

var sketch = function(s) {
  socket.on('cord', function(data) {
    console.log("got cord", data.R.tCordsRX)
    xCorR = data.R.tCordsRX
    yCorR = data.R.tCordsRY
    numSegmentsR = data.R.segmentsR

    xCorL = data.L.tCordsLX
    yCorL = data.L.tCordsLY
    numSegmentsL = data.L.segmentsL
  })

  socket.on('clientState', function(data) {
  console.log(`recieved state ${data}`)
    clientState = data;
    if (data == 'RESET') {
      s.resetSketch();
    } else if (data == 'PLAYER_LEFT') {
      location.reload()
    }
  })

  var button;
  var readyState;
  var button;
  var waitingDiv;
  var text;
  var gameOver;
  var diff;

  // LEFT
  var xCorL;
  var yCorL;

  var scoreElemL;

  // RIGHT
  var xCorR;
  var yCorR;

  var scoreElemR;

  s.setup = function() {
    s.createCanvas(1000, 500);

    s.frameRate(25);
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
    clientState = 'NOT_READY'
    readyState = {'p1': p1, 'state': 'NOT_READY'}
    socket.emit('clientReady', readyState)
    text = 'ready';
    gameOver = false;

    // LEFT
    numSegmentsL = 1;
    xCorL = [200];
    yCorL = [250];

    // RIGHT
    numSegmentsR = 1;
    xCorR = [800];
    yCorR = [250];

    $(function() {
      setTimeout(function() {
        readyState = {'p1': p1, state: 'PLAYERS_READY'};
        socket.emit('clientReady', readyState)
        text = 'set'
      }, 2500)
    })

    s.draw()
    s.loop()
    scoreElemR.html('p2')
    scoreElemL.html('p1')
    button.style('display', 'none')
  }


  s.draw = function() {
    s.background(37, 40, 57)
    s.textAlign(s.CENTER, s.CENTER);
    s.textSize(100);
    s.text(text, s.width/2, s.height/2);

    if (clientState === 'PLAYERS_READY' && clientCount == 2) {
      text = 'go'
      s.drawL()
      s.drawR()
      if (p1) {
        socket.emit('updateL')
      } else {
        socket.emit('updateR')
      }
      s.checkGameStatus();
      socket.on('move', function(data) {
        numSegmentsL = data.L.numSeg
        numSegmentsR = data.R.numSeg
        xCorR = data.R.xCorR || xCorR;
        xCorL = data.L.xCorL || xCorL;
        yCorR = data.R.yCorR || yCorR;
        yCorL = data.L.yCorL || yCorL;
      })
    }
  }

  s.drawL = function() {
    console.log("drew")
    s.stroke(229,70,52)
    for (var i = 0; i < numSegmentsL - 1; i++) {
      s.line(xCorL[i], yCorL[i], xCorL[i + 1], yCorL[i + 1]);
    }
  }

  s.drawR = function() {
    s.stroke(244,180,41)
    for (var i = 0; i < numSegmentsR - 1; i++) {
      s.line(xCorR[i], yCorR[i], xCorR[i + 1], yCorR[i + 1]);
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
      gameOver = true;
      if (true) {
        if (user_id !== 'guest') {
          socket.emit('l', user_id);
        }
      }
      if (true) {
        if (user_id !== 'guest') {
          socket.emit('w', user_id);
        }
      }
      scoreElemL.html('Player 1 lost!');
      scoreElemR.html('Player 2 wins!');
      button.style('display', 'block')
      $(".rematch").unbind().click(function() {
        socket.emit('reset', username)
      })
    } else if (
        xCorR[xCorR.length - 1] > s.width ||
        xCorR[xCorR.length - 1] < 0 ||
        yCorR[yCorR.length - 1] > s.height ||
        yCorR[yCorR.length - 1] < 0 ||
        s.checkSnakeCollisionR()) {
      s.noLoop();
      gameOver = true;
      if (true) {
        if (user_id !== 'guest') {
          socket.emit('w', user_id);
        }
      }
      if (true) {
        if (user_id !== 'guest') {
          socket.emit('l', user_id);
        }
      }
      scoreElemL.html('Player 1 wins!');
      scoreElemR.html('Player 2 lost!');
      button.style('display', 'block')
      $(".rematch").unbind().click(function() {
        socket.emit('reset', username)
      })
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
    let key = s.keyCode
    console.log(xCorR, xCorL)
    let data = {
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
};

var snakeGame = new p5(sketch, 'snakeContainer')
