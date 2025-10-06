
const CONFIG = {
  maxCount: 20,
  rock: 'rock',
  paper: 'paper',
  scissors: 'scissors',
  win: "win",
  lose: 'lose',
  draw: 'draw'

}

const choiceButtons = document.querySelectorAll(".choice")

const resultText = document.querySelector("#result-text")

const userChoiceContainer = document.querySelector("#user-choice")

const playerScoreNumber =document.querySelector("#player-score")
const computerScoreNumber =document.querySelector("#computer-score")

const gameState = JSON.parse(localStorage.getItem('state')) || []

let playerScore =Number( JSON.parse(localStorage.getItem('player-score'))) || 0
let computerScore = Number(JSON.parse(localStorage.getItem('computer-score')) )|| 0


console.log(gameState)


choiceButtons.forEach((btn) => {
  btn.addEventListener("click" , (e)=> {
    e.preventDefault()
    choiceButtons.forEach((button) =>{
      button.disabled = true;
    })
    const chosenImage = document.createElement("img")
    chosenImage.src = btn.children[0].src
    chosenImage.alt = btn.children[0].alt
    chosenImage.classList.add("max-w-50")
    
    userChoiceContainer.innerHTML = ''

      userChoiceContainer.appendChild(chosenImage)

      const game = {
        player: '',
        computer: "",
        result: "",
      
      }
      game.player =btn.id
 
    computerChoise(game)
  })
})




function computerChoise(game) {
  resultText.textContent = "Computer Choosing..."
  const images = ['paper', 'rock' , 'scissors']
  const computerContainer = document.querySelector("#computer-choice")
  computerContainer.innerHTML = ""
  const computerChosenImage = document.createElement("img")
  computerChosenImage.alt = 'chosenImage'
  computerChosenImage.classList.add("max-w-50")
  computerContainer.appendChild(computerChosenImage)
  computerChosenImage.src = 'images/rock.png'

  let count = 0


  const intervalImage =  setInterval(() => {
    const randomeImageIndex = Math.floor(Math.random() * images.length);

    computerChosenImage.src = `images/${images[randomeImageIndex]}.png`
    computerChosenImage.id = images[randomeImageIndex]


    count++;

    if (count === CONFIG.maxCount) {
      game.computer = computerChosenImage.id
      gameResult(game)

      clearInterval(intervalImage)
    }


  } , 100)

}


function gameResult(game) {
  const { player, computer } = game
  const { rock, paper, scissors } = CONFIG

  if (
    (player === rock && computer === scissors) ||
    (player === paper && computer === rock) ||
    (player === scissors && computer === paper)
  ) {
    game.result = CONFIG.win
  } else if (player === computer) {
    game.result = CONFIG.draw
  } else {
    game.result = CONFIG.lose
  }

  gameState.push(game)
  if (gameState.length > 50) gameState.shift()
  localStorage.setItem('state', JSON.stringify(gameState))

  if (game.result === CONFIG.win) {
    resultText.textContent = 'You Win!'
  } else if (game.result === CONFIG.lose) {
    resultText.textContent = 'You Lose!'
  } else {
    resultText.textContent = 'Draw!'
  }


  // calculatePlayerAndComputerScore()

  choiceButtons.forEach(button => button.disabled = false)
}


// function calculatePlayerAndComputerScore() {

//   gameState.forEach((game) => {
//     if (game.result === CONFIG.win) {
//       playerScore++
//       localStorage.setItem('player-score', JSON.stringify(playerScore))
//     }else if (game.result === CONFIG.lose) {
//       computerScore++
//       localStorage.setItem('computer-score', JSON.stringify(computerScore))
//     }
//   })

// }
// calculatePlayerAndComputerScore()

// function updateScoreUI() {
//   playerScoreNumber.textContent = playerScore
//   computerScoreNumber.textContent = computerScore
// }
// updateScoreUI()