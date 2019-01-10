window.addEventListener("keydown", function(e) {
  if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
}, false);

const games = ['tron', 'snake', 'pong'];

$("#replay").click(function() {
  location.reload(true);
})

function runCheck() {
  if (Rscore > Lscore) {
    $("#score").html("Player 1 wins!")
  } else {
    $("#score").html("Player 2 wins!")
  }

  $("#replay").css('display', 'block')
  $("#score").css('diplay', 'block')
  $("#start").css('display', 'none')

  $("#Lwin").html(Number($(".Lscore").text()))
  $("#Lwin").css('display', 'none')
  $("#Rwin").html(Number($(".Rscore").text()))
  $("#Rwin").css('display', 'none')
}

function startNewGame() {
  $("#start").css('display', 'block')
  let index = Math.floor(Math.random() * 2) + 0

  if (games[index] == 'snake') {
    return new p5(snake, 'bigContainer')
  } else if (games[index] == 'tron') {
    return new p5(tron, 'bigContainer')
  } else if (games[index] == 'pong') {
    return new p5(pong, 'bigContainer')
  }
}


startNewGame()