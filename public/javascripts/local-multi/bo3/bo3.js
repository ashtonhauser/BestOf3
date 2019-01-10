window.addEventListener("keydown", function(e) {
  if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
}, false);

var runCounter = 0;
const games = ['tron', 'snake', 'pong'];

function startNewGame() {
  let index = Math.floor(Math.random() * 3) + 0
  console.log(index)
  if (games[index] == 'snake') {
    runCounter++;
    console.log('ran snake')
    return new p5(snake, 'bigContainer')
  } else if (games[index] == 'tron') {
    runCounter++;
    console.log('ran tron')
    return new p5(tron, 'bigContainer')
  } else if (games[index] == 'pong') {
    runCounter++;
    console.log('ran pong')
    return new p5(pong, 'bigContainer')
  }
}

startNewGame()