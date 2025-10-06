const CONFIG = {
  maxCount: 20,
  rock: 'rock',
  paper: 'paper',
  scissors: 'scissors',
  win: 'win',
  lose: 'lose',
  draw: 'draw',
};

const choiceButtons = document.querySelectorAll('.choice');

const resultText = document.querySelector('#result-text');

const userChoiceContainer = document.querySelector('#user-choice');

const resultContainer = document.querySelector('.result');

const playerScoreNumber = document.querySelector('#player-score');
const computerScoreNumber = document.querySelector('#computer-score');

let gameState = JSON.parse(localStorage.getItem('state')) || [];

// let playerScore =Number( JSON.parse(localStorage.getItem('player-score'))) || 0
// let computerScore = Number(JSON.parse(localStorage.getItem('computer-score')) )|| 0

let gameScore = JSON.parse(localStorage.getItem('score')) || {
  player: 0,
  computer: 0,
};

console.log(gameState);

choiceButtons.forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();

    resultContainer.classList.remove('win', 'lose', 'draw');

    choiceButtons.forEach(button => {
      button.disabled = true;
    });
    const chosenImage = document.createElement('img');
    chosenImage.src = btn.children[0].src;
    chosenImage.alt = btn.children[0].alt;
    chosenImage.classList.add('max-w-50');

    userChoiceContainer.innerHTML = '';

    userChoiceContainer.appendChild(chosenImage);

    const game = {
      player: '',
      computer: '',
      result: '',
    };
    game.player = btn.id;

    computerChoise(game);
  });
});

function computerChoise(game) {
  resultText.textContent = 'Computer Choosing...';
  const images = ['paper', 'rock', 'scissors'];
  const computerContainer = document.querySelector('#computer-choice');
  computerContainer.innerHTML = '';
  const computerChosenImage = document.createElement('img');
  computerChosenImage.alt = 'chosenImage';
  computerChosenImage.classList.add('max-w-50');
  computerContainer.appendChild(computerChosenImage);
  computerChosenImage.src = 'images/rock.png';

  let count = 0;

  const intervalImage = setInterval(() => {
    const randomeImageIndex = Math.floor(Math.random() * images.length);

    computerChosenImage.src = `images/${images[randomeImageIndex]}.png`;
    computerChosenImage.id = images[randomeImageIndex];

    count++;

    if (count === CONFIG.maxCount) {
      game.computer = computerChosenImage.id;
      gameResult(game);

      clearInterval(intervalImage);
    }
  }, 100);
}

function gameResult(game) {
  const { player, computer } = game;
  const { rock, paper, scissors } = CONFIG;

  if (
    (player === rock && computer === scissors) ||
    (player === paper && computer === rock) ||
    (player === scissors && computer === paper)
  ) {
    game.result = CONFIG.win;
  } else if (player === computer) {
    game.result = CONFIG.draw;
  } else {
    game.result = CONFIG.lose;
  }

  gameState.push(game);
  if (gameState.length > 50) gameState.shift();
  localStorage.setItem('state', JSON.stringify(gameState));

  const resultContainer = document.querySelector('.result');

  resultContainer.classList.remove('win', 'lose', 'draw');

  if (game.result === CONFIG.win) {
    resultText.textContent = '🎉 You Win! 🎉';
    resultContainer.classList.add('win');
  } else if (game.result === CONFIG.lose) {
    resultText.textContent = '💔 You Lose! 💔';
    resultContainer.classList.add('lose');
  } else {
    resultText.textContent = '🤝 Draw! 🤝';
    resultContainer.classList.add('draw');
  }

  calculatePlayerAndComputerScore(game);

  choiceButtons.forEach(button => (button.disabled = false));
}

function calculatePlayerAndComputerScore(game) {
  if (game.result === CONFIG.win) {
    gameScore.player++;
  } else if (game.result === CONFIG.lose) {
    gameScore.computer++;
  }

  localStorage.setItem('score', JSON.stringify(gameScore));

  updateScoreUI();
}

function updateScoreUI() {
  playerScoreNumber.textContent = gameScore.player;
  computerScoreNumber.textContent = gameScore.computer;
}
updateScoreUI();

const resetButton = document.querySelector('#reset');

resetButton.addEventListener('click', resetGame);

function resetGame() {
  gameState = [];

  gameScore = {
    player: 0,
    computer: 0,
  };

  resultContainer.classList.remove('win', 'lose', 'draw');
  resultText.textContent = 'Choose your weapon!';

  localStorage.setItem('state', JSON.stringify(gameState));
  localStorage.setItem('score', JSON.stringify(gameScore));
  updateScoreUI();
  updateStatsPanel();
}

const statsBtn = document.getElementById('stats-btn');
const statsPanel = document.getElementById('stats-panel');
const closeStatsBtn = document.getElementById('close-stats-btn');
const gameContainer = document.getElementById('game-container');

statsBtn.addEventListener('click', () => {
  statsPanel.classList.add('show');
  gameContainer.classList.add('hide-left');
  updateStatsPanel();
});

closeStatsBtn.addEventListener('click', () => {
  statsPanel.classList.remove('show');
  gameContainer.classList.remove('hide-left');
});

function updateStatsPanel() {
  const totalGames = gameState.length;
  const totalWins = gameState.filter(game => game.result === CONFIG.win).length;
  const totalLosses = gameState.filter(
    game => game.result === CONFIG.lose
  ).length;
  const totalDraws = gameState.filter(
    game => game.result === CONFIG.draw
  ).length;

  document.getElementById('total-games').textContent = totalGames;
  document.getElementById('total-wins').textContent = totalWins;
  document.getElementById('total-losses').textContent = totalLosses;
  document.getElementById('total-draws').textContent = totalDraws;

  const historyList = document.getElementById('history-list');
  historyList.innerHTML = '';

  const recentGames = gameState.slice(-20).reverse();

  if (recentGames.length === 0) {
    historyList.innerHTML =
      '<p style="text-align: center; color: #999; padding: 20px;">No games played yet</p>';
    return;
  }

  recentGames.forEach((game, index) => {
    const historyItem = document.createElement('div');
    historyItem.classList.add('history-item', game.result);

    const choiceDiv = document.createElement('div');
    choiceDiv.classList.add('history-choice');
    choiceDiv.innerHTML = `<strong>You:</strong> ${game.player} <strong>vs</strong> ${game.computer}`;

    const resultDiv = document.createElement('div');
    resultDiv.classList.add('history-result', game.result);
    resultDiv.textContent =
      game.result === CONFIG.win
        ? 'Win'
        : game.result === CONFIG.lose
        ? 'Lose'
        : 'Draw';

    historyItem.appendChild(choiceDiv);
    historyItem.appendChild(resultDiv);
    historyList.appendChild(historyItem);
  });
}
