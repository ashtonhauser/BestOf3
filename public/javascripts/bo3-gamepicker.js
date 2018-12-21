export default function() {
  const gameq = [];
  const games = ['pong', 'snake'];
  for (var i = 0; i < 3; i++) {
    let gameSelector = Math.floor(Math.random() * games.length);
    gameq.push(games[gameSelector]);
  }
  return gameq;
}
