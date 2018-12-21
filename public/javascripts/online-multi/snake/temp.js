var form = document.getElementsByClassName('.formm');
var ready = document.getElementById('#option1')
var clientCount;
var clientState = 'NOT_READY';
var clientRematch;
var socket = io.connect('http://localhost:3000/snake')
var username = Math.floor(Math.random() * Math.floor(50))
var p1 = false;
var p2 = false;
socket.emit('add-user', {"username": username})

// sets player 1 or 2
socket.on('playerNum', function(data) {
  if (1) {
    p1 = true;
  } else {
    p2 = true;
  }
})
// user count
socket.on('counter', function (data) {
  $("#counter").text(data.count);
  clientCount = data.count;
});
// sets client state from server
socket.on('clientState', function(data) {
  clientState = data;
})



var sketch = function(s) {
  socket.on('rematch', function(data) {
    if (data) {
      s.resetSketch()
    }
  })
  var tick = 1;
  var readyState;
  var xFruit; // defined by server
  var yFruit; // defined by server
  var button;
  var data;
  var waitingDiv;
  var timer; // defined by server

  var numSegmentsL; // defined by server
  var directionL; // defined by server
  var xStartL;
  var yStartL;
  var diffL;
  var xCorL;  // defined by server
  var yCorL;  // defined by server
  var scoreElemL;

  var numSegmentsR; // defined by server
  var directionR; // defined by server
  var xStartR;
  var yStartR;
  var diffR;
  var xCorR; // defined by server
  var yCorR; // defined by server
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
    socket.emit('clientReady', readyState)
    timer = 'loading...';
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

    // s.updateFruitCoordinates();

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
      setTimeout(function() {
        readyState = {'username': username, state: 'PLAYERS_READY'};
        socket.emit('clientReady', readyState)
        timer = 'ready'
      }, 5000)
    })

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

    socket.on('move', function(dir) {
      directionL = dir.L
      directionR = dir.R

      tick++
      console.log(`x: ${xCorR}, ${xCorL} y: ${yCorR} ${yCorL} ${directionR} ${directionL}`)
    })

    if (clientCount == 2 && waitingDiv) {
      waitingDiv.hide();
    } else if (clientCount < 2 && !waitingDiv){
      waitingDiv.show();
    }

    if (clientState === 'PLAYERS_READY' && clientCount == 2) {
      timer = 'go'
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
    // s.checkForFruitL();
    s.checkGameStatus();
  }

  s.drawR = function() {
    s.stroke(37,97,105)
    for (var i = 0; i < numSegmentsR - 1; i++) {
      s.line(xCorR[i], yCorR[i], xCorR[i + 1], yCorR[i + 1]);
    }
    s.updateSnakeCoordinatesR();
    // s.checkForFruitR();
    s.checkGameStatus();
  }

  // should run on server
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

  // move to server
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
    // puts keys in an array and at set interval sends array to server to avoid too much input
    // filter keys to adjust to current direction
    // could make message type keypressR and L
    data = s.keyCode;
    socket.emit('keypress', data)
    // if (p1 && data == 65 || 68 || 87 || 83) {
    //   socket.emit('keypress', data)
    // } else if (p2 && data == 37 || 38 || 39 || 40) {
    //   socket.emit('keypress', data)
    // }
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

var snakeGame = new p5(sketch, 'snakeContainer');


