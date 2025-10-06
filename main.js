// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  maxCount: 20,
  rock: 'rock',
  paper: 'paper',
  scissors: 'scissors',
  win: 'win',
  lose: 'lose',
  draw: 'draw',
};

// ============================================
// DOM ELEMENTS
// ============================================
const choiceButtons = document.querySelectorAll('.choice');
const resultText = document.querySelector('#result-text');
const userChoiceContainer = document.querySelector('#user-choice');
const playerScoreNumber = document.querySelector('#player-score');
const computerScoreNumber = document.querySelector('#computer-score');

// ============================================
// GAME STATE & SCORE
// ============================================
const gameState = JSON.parse(localStorage.getItem('state')) || [];

const gameScore = JSON.parse(localStorage.getItem('score')) || {
  player: 0,
  computer: 0,
};

console.log(gameState);

// ============================================
// EVENT LISTENERS - CHOICE BUTTONS
// ============================================
choiceButtons.forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();

    // Remove previous result styling
    const resultContainer = document.querySelector('.result');
    resultContainer.classList.remove('win', 'lose', 'draw');

    // Disable all choice buttons
    choiceButtons.forEach(button => {
      button.disabled = true;
    });

    // Display user's choice
    const chosenImage = document.createElement('img');
    chosenImage.src = btn.children[0].src;
    chosenImage.alt = btn.children[0].alt;
    chosenImage.classList.add('max-w-50');

    userChoiceContainer.innerHTML = '';
    userChoiceContainer.appendChild(chosenImage);

    // Initialize game object
    const game = {
      player: '',
      computer: '',
      result: '',
    };
    game.player = btn.id;

    // Trigger computer choice
    computerChoise(game);
  });
});

// ============================================
// COMPUTER CHOICE ANIMATION
// ============================================
function computerChoise(game) {
  resultText.textContent = 'Computer Choosing...';
  const images = ['paper', 'rock', 'scissors'];
  const computerContainer = document.querySelector('#computer-choice');
  computerContainer.innerHTML = '';

  // Create computer choice image element
  const computerChosenImage = document.createElement('img');
  computerChosenImage.alt = 'chosenImage';
  computerChosenImage.classList.add('max-w-50');
  computerChosenImage.src = 'images/rock.png';
  computerContainer.appendChild(computerChosenImage);

  let count = 0;

  // Animate through random images
  const intervalImage = setInterval(() => {
    const randomImageIndex = Math.floor(Math.random() * images.length);

    computerChosenImage.src = `images/${images[randomImageIndex]}.png`;
    computerChosenImage.id = images[randomImageIndex];

    count++;

    // Stop animation and determine result
    if (count === CONFIG.maxCount) {
      game.computer = computerChosenImage.id;
      gameResult(game);
      clearInterval(intervalImage);
    }
  }, 100);
}

// ============================================
// GAME RESULT LOGIC
// ============================================
function gameResult(game) {
  const { player, computer } = game;
  const { rock, paper, scissors } = CONFIG;

  // Determine winner
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

  // Save game state to localStorage (keep last 50 games)
  gameState.push(game);
  if (gameState.length > 50) gameState.shift();
  localStorage.setItem('state', JSON.stringify(gameState));

  // Update UI with result
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

  // Update scores
  calculatePlayerAndComputerScore(game);

  // Re-enable choice buttons
  choiceButtons.forEach(button => (button.disabled = false));
}

// ============================================
// SCORE MANAGEMENT
// ============================================
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

// Initialize score display on page load
updateScoreUI();

// ============================================
// RESET GAME FUNCTIONALITY
// ============================================
const resetButton = document.querySelector('#reset');

resetButton.addEventListener('click', resetGame);

function resetGame() {
  // Clear game state
  gameState.length = 0;

  // Reset scores
  gameScore.player = 0;
  gameScore.computer = 0;

  // Reset UI
  const resultContainer = document.querySelector('.result');
  resultContainer.classList.remove('win', 'lose', 'draw');
  resultText.textContent = 'Choose your weapon!';

  // Update localStorage
  localStorage.setItem('state', JSON.stringify(gameState));
  localStorage.setItem('score', JSON.stringify(gameScore));

  // Update UI
  updateScoreUI();
  updateStatsPanel();
}

// ============================================
// STATS PANEL FUNCTIONALITY
// ============================================
const statsBtn = document.getElementById('stats-btn');
const statsPanel = document.getElementById('stats-panel');
const closeStatsBtn = document.getElementById('close-stats-btn');
const gameContainer = document.getElementById('game-container');

// Open stats panel
statsBtn.addEventListener('click', () => {
  statsPanel.classList.add('show');
  statsPanel.setAttribute('aria-hidden', 'false');
  gameContainer.classList.add('hide-left');
  updateStatsPanel();
  closeStatsBtn.focus();
});

// Close stats panel
closeStatsBtn.addEventListener('click', () => {
  statsPanel.classList.remove('show');
  statsPanel.setAttribute('aria-hidden', 'true');
  gameContainer.classList.remove('hide-left');
  statsBtn.focus();
});

// Update stats panel with game data
function updateStatsPanel() {
  // Calculate statistics
  const totalGames = gameState.length;
  const totalWins = gameState.filter(game => game.result === CONFIG.win).length;
  const totalLosses = gameState.filter(
    game => game.result === CONFIG.lose
  ).length;
  const totalDraws = gameState.filter(
    game => game.result === CONFIG.draw
  ).length;

  // Update stats summary
  document.getElementById('total-games').textContent = totalGames;
  document.getElementById('total-wins').textContent = totalWins;
  document.getElementById('total-losses').textContent = totalLosses;
  document.getElementById('total-draws').textContent = totalDraws;

  // Populate game history
  const historyList = document.getElementById('history-list');
  historyList.innerHTML = '';

  const recentGames = gameState.slice(-20).reverse();

  if (recentGames.length === 0) {
    historyList.innerHTML =
      '<p style="text-align: center; color: #999; padding: 20px;">No games played yet</p>';
    return;
  }

  recentGames.forEach(game => {
    const historyItem = document.createElement('div');
    historyItem.classList.add('history-item', game.result);
    historyItem.setAttribute('role', 'listitem');

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
