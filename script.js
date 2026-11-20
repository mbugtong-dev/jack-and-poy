
/* GAME VARIABLES */

let playerScore = 0;
let computerScore = 0;

let gameActive = false;
let isPlaying = false;

const winningScore = 5;


/* IMAGE REFERENCES */

const images = {
    rock: "images/rock.svg",
    paper: "images/paper.svg",
    scissors: "images/scissors.svg"
};


/* SCREEN REFERENCES */

const startScreen = document.getElementById("start-screen");
const instructionsScreen = document.getElementById("instructions-screen");
const gameScreen = document.getElementById("game-screen");
const gameOverScreen = document.getElementById("game-over-screen");


/* GAME REFERENCES */

const playerHand = document.getElementById("player-hand");
const computerHand = document.getElementById("computer-hand");

const result = document.getElementById("result");
const roundMessage = document.getElementById("round-message");

const playerScoreDisplay = document.getElementById("player-score");
const computerScoreDisplay = document.getElementById("computer-score");

const highScoreStart = document.getElementById("high-score-start");
const highScoreGame = document.getElementById("high-score-game");
const highScoreFinal = document.getElementById("high-score-final");

const finalScore = document.getElementById("final-score");
const finalMessage = document.getElementById("final-message");
const gameOverTitle = document.getElementById("game-over-title");


/* HIGH SCORE */

let highScore = Number(localStorage.getItem("rpsHighScore")) || 0;

updateHighScoreDisplay();


/* SCREEN FUNCTION */

function showScreen(screen) {

    document.querySelectorAll(".screen").forEach(function(section) {
        section.classList.remove("active");
    });

    screen.classList.add("active");

}


/* START GAME */

document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {

    playerScore = 0;
    computerScore = 0;

    gameActive = true;
    isPlaying = false;

    playerScoreDisplay.textContent = playerScore;
    computerScoreDisplay.textContent = computerScore;

    playerHand.src = images.rock;
    computerHand.src = images.rock;

    result.textContent = "Choose your move!";
    roundMessage.textContent = "First to 5 points wins!";

    showScreen(gameScreen);

}


/* INSTRUCTIONS */

document.getElementById("instructions-btn").addEventListener("click", function() {

    showScreen(instructionsScreen);

});

document.getElementById("back-btn").addEventListener("click", function() {

    showScreen(startScreen);

});


/* PLAYER CHOICES */

document.querySelectorAll(".choice-btn").forEach(function(button) {

    button.addEventListener("click", function() {

        const choice = button.dataset.choice;

        playGame(choice);

    });

});


/* KEYBOARD CONTROLS */

document.addEventListener("keydown", function(event) {

    if (!gameActive || isPlaying) {
        return;
    }

    const key = event.key.toLowerCase();

    if (key === "r") {
        playGame("rock");
    }

    else if (key === "p") {
        playGame("paper");
    }

    else if (key === "s") {
        playGame("scissors");
    }

});


/* GAME LOGIC */

function playGame(playerChoice) {

    if (!gameActive || isPlaying) {
        return;
    }

    isPlaying = true;

    const choices = ["rock", "paper", "scissors"];

    const computerChoice =
        choices[Math.floor(Math.random() * choices.length)];


    /* SHOW ROCK BEFORE THE ANIMATION */

    playerHand.src = images.rock;
    computerHand.src = images.rock;


    /* START SHAKING ANIMATION */

    playerHand.classList.add("shake");
    computerHand.classList.add("shake");


    /* REVEAL THE CHOICES AFTER THE ANIMATION */

    setTimeout(function() {

        playerHand.classList.remove("shake");
        computerHand.classList.remove("shake");

        /* CHECK IF GAME IS STILL ACTIVE */

        if (!gameActive) {
            isPlaying = false;
            return;
        }

        /* DISPLAY PLAYER'S CHOICE */

        playerHand.src = images[playerChoice];

        /* DISPLAY COMPUTER'S CHOICE */

        computerHand.src = images[computerChoice];


        /* DETERMINE THE WINNER */

        determineWinner(playerChoice, computerChoice);

        isPlaying = false;

    }, 600);

}


/* DETERMINE WINNER */

function determineWinner(playerChoice, computerChoice) {

    if (playerChoice === computerChoice) {

        result.textContent = "It's a Draw!";

        roundMessage.textContent =
            "Both chose " + playerChoice + "!";

    }

    else if (
        (playerChoice === "rock" && computerChoice === "scissors") ||
        (playerChoice === "paper" && computerChoice === "rock") ||
        (playerChoice === "scissors" && computerChoice === "paper")
    ) {

        playerScore++;

        result.textContent = "You Win!";

        roundMessage.textContent =
            playerChoice + " beats " + computerChoice + "!";

    }

    else {

        computerScore++;

        result.textContent = "You Lose!";

        roundMessage.textContent =
            computerChoice + " beats " + playerChoice + "!";

    }

    updateScore();

    checkGameOver();

}


/* UPDATE SCORE */

function updateScore() {

    playerScoreDisplay.textContent = playerScore;
    computerScoreDisplay.textContent = computerScore;

}


/* CHECK GAME COMPLETION */

function checkGameOver() {

    if (
        playerScore >= winningScore ||
        computerScore >= winningScore
    ) {

        gameActive = false;

        setTimeout(showGameOver, 700);

    }

}


/* GAME OVER SCREEN */

function showGameOver() {

    /* SAVE HIGH SCORE */

    if (playerScore > highScore) {

        highScore = playerScore;

        localStorage.setItem("rpsHighScore", highScore);

    }

    updateHighScoreDisplay();

    finalScore.textContent = playerScore;

    /* PLAYER WINS */

    if (playerScore >= winningScore) {

        gameOverTitle.textContent = "You Won!";

        finalMessage.textContent =
            "Congratulations! You defeated the computer.";

    }

    /* COMPUTER WINS */

    else {

        gameOverTitle.textContent = "Game Over!";

        finalMessage.textContent =
            "The computer won. Try again and beat it!";

    }

    showScreen(gameOverScreen);

}


/* UPDATE HIGH SCORE */

function updateHighScoreDisplay() {

    highScoreStart.textContent = highScore;
    highScoreGame.textContent = highScore;
    highScoreFinal.textContent = highScore;

}


/* RESTART GAME */

document.getElementById("restart-btn").addEventListener("click", startGame);


/* RETURN TO MENU */

document.getElementById("menu-btn").addEventListener("click", function() {

    updateHighScoreDisplay();

    showScreen(startScreen);

});


/* QUIT GAME */

document.getElementById("quit-btn").addEventListener("click", function() {

    gameActive = false;
    isPlaying = false;

    showScreen(startScreen);

});
