/* ==========================================
   BATO-BATO PICK
   LOGIN, PROFILE, SCORING, ABILITIES
========================================== */


/* ==========================================
   VARIABLES
========================================== */

let currentUser = null;

let playerScore = 0;
let computerScore = 0;

let computerPoints = 0;
let matchNetPoints = 0;

let playerStreak = 0;
let computerStreak = 0;

let playerAbility = null;
let computerAbility = null;

let playerLockChoice = null;
let computerLockChoice = null;

let gameActive = false;
let isPlaying = false;

let roundNumber = 1;

let computerChoice = null;
let playerChoice = null;

let peekUsed = false;
let bawiWindow = false;
let reverseActive = false;

let roundTimer = null;

const choices = ["rock", "paper", "scissors"];

const winningScore = 5;

const images = {
    rock: "images/rock.svg",
    paper: "images/paper.svg",
    scissors: "images/scissors.svg"
};

const abilities = [
    "kandado",
    "bawi",
    "reverse"
];


/* ==========================================
   LOCAL STORAGE
========================================== */

const USERS_KEY = "batoBatoUsers";

function getUsers() {

    return JSON.parse(localStorage.getItem(USERS_KEY)) || {};

}

function saveUsers(users) {

    localStorage.setItem(USERS_KEY, JSON.stringify(users));

}

function saveCurrentUser() {

    if (!currentUser) {
        return;
    }

    const users = getUsers();

    users[currentUser.username] = currentUser;

    saveUsers(users);

}


/* ==========================================
   SCREEN REFERENCES
========================================== */

const loginScreen = document.getElementById("login-screen");
const homeScreen = document.getElementById("home-screen");
const mechanicsScreen = document.getElementById("mechanics-screen");
const gameScreen = document.getElementById("game-screen");
const gameOverScreen = document.getElementById("game-over-screen");


/* ==========================================
   SCREEN FUNCTION
========================================== */

function showScreen(screen) {

    document.querySelectorAll(".screen").forEach(function(section) {

        section.classList.remove("active");

    });

    screen.classList.add("active");

}


/* ==========================================
   LOGIN / REGISTER
========================================== */

let isRegistering = false;

const usernameInput = document.getElementById("username-input");
const passwordInput = document.getElementById("password-input");

const authButton = document.getElementById("auth-btn");
const authTitle = document.getElementById("auth-title");

const authMessage = document.getElementById("auth-message");
const toggleAuth = document.getElementById("toggle-auth");


toggleAuth.addEventListener("click", function() {

    isRegistering = !isRegistering;

    if (isRegistering) {

        authTitle.textContent = "Register";

        authButton.textContent = "Create Account";

        toggleAuth.textContent = "Already have an account? Login";

    }

    else {

        authTitle.textContent = "Login";

        authButton.textContent = "Login";

        toggleAuth.textContent = "Create an account";

    }

    authMessage.textContent = "";

});


authButton.addEventListener("click", authenticate);


function authenticate() {

    const username = usernameInput.value.trim();

    const password = passwordInput.value.trim();

    if (!username || !password) {

        authMessage.textContent =
            "Please enter your username and password.";

        return;

    }

    const users = getUsers();


    /* REGISTER */

    if (isRegistering) {

        if (users[username]) {

            authMessage.textContent =
                "Username already exists.";

            return;

        }

        users[username] = {

            username: username,

            password: password,

            points: 0,

            history: []

        };

        saveUsers(users);

        authMessage.textContent =
            "Account created successfully! You can now login.";

        isRegistering = false;

        authTitle.textContent = "Login";

        authButton.textContent = "Login";

        toggleAuth.textContent = "Create an account";

        passwordInput.value = "";

        return;

    }


    /* LOGIN */

    if (!users[username]) {

        authMessage.textContent =
            "Account not found.";

        return;

    }

    if (users[username].password !== password) {

        authMessage.textContent =
            "Incorrect password.";

        return;

    }

    currentUser = users[username];

    showHomeScreen();

}


/* ==========================================
   HOME SCREEN
========================================== */

function showHomeScreen() {

    document.getElementById("welcome-username").textContent =
        currentUser.username;

    document.getElementById("total-points").textContent =
        currentUser.points;

    displayHistory();

    showScreen(homeScreen);

}


/* ==========================================
   GAME HISTORY
========================================== */

function displayHistory() {

    const historyList = document.getElementById("history-list");

    historyList.innerHTML = "";

    if (!currentUser.history || currentUser.history.length === 0) {

        historyList.innerHTML =
            "<p>No games played yet.</p>";

        return;

    }

    currentUser.history.slice().reverse().forEach(function(game) {

        const item = document.createElement("div");

        item.className = "history-item";

        item.innerHTML = `
            <span>${game.date}</span>
            <span>${game.result}</span>
            <span>${game.score}</span>
            <span>${game.points >= 0 ? "+" : ""}${game.points}</span>
        `;

        historyList.appendChild(item);

    });

}


/* ==========================================
   HOME BUTTONS
========================================== */

document.getElementById("home-start-btn")
    .addEventListener("click", startGame);


document.getElementById("mechanics-btn")
    .addEventListener("click", function() {

        showScreen(mechanicsScreen);

    });


document.getElementById("mechanics-back-btn")
    .addEventListener("click", showHomeScreen);


document.getElementById("logout-btn")
    .addEventListener("click", function() {

        currentUser = null;

        usernameInput.value = "";

        passwordInput.value = "";

        authMessage.textContent = "";

        showScreen(loginScreen);

    });


/* ==========================================
   START GAME
========================================== */

function startGame() {

    playerScore = 0;

    computerScore = 0;

    computerPoints = 0;

    matchNetPoints = 0;

    playerStreak = 0;

    computerStreak = 0;

    playerAbility = null;

    computerAbility = null;

    playerLockChoice = null;

    computerLockChoice = null;

    gameActive = true;

    isPlaying = false;

    roundNumber = 1;

    peekUsed = false;

    bawiWindow = false;

    reverseActive = false;

    computerChoice = null;

    playerChoice = null;

    updateScoreDisplay();

    updatePointsDisplay();

    updateStreakDisplay();

    updateAbilityDisplay();

    resetRoundDisplay();

    document.getElementById("game-username").textContent =
        currentUser.username;

    showScreen(gameScreen);

}


/* ==========================================
   SCORE DISPLAY
========================================== */

function updateScoreDisplay() {

    document.getElementById("player-score").textContent =
        playerScore;

    document.getElementById("computer-score").textContent =
        computerScore;

}


function updatePointsDisplay() {

    document.getElementById("game-points").textContent =
        currentUser.points;

    document.getElementById("computer-points").textContent =
        computerPoints;

}


function updateStreakDisplay() {

    document.getElementById("player-streak").textContent =
        playerStreak;

    document.getElementById("computer-streak").textContent =
        computerStreak;

}


/* ==========================================
   RESET ROUND DISPLAY
========================================== */

function resetRoundDisplay() {

    playerHand.src = images.rock;

    computerHand.src = images.rock;

    result.textContent = "Choose your move!";

    roundMessage.textContent =
        "Select Rock, Paper, or Scissors.";

    document.getElementById("countdown").textContent = "";

    document.getElementById("round-number").textContent =
        roundNumber;

    document.getElementById("peek-result").classList.add("hidden");

    document.getElementById("reverse-banner").classList.add("hidden");

    document.getElementById("peek-btn").disabled = false;

    document.getElementById("lock-options").classList.add("hidden");

    peekUsed = false;

    playerChoice = null;

    computerChoice = null;

}


/* ==========================================
   GAME REFERENCES
========================================== */

const playerHand = document.getElementById("player-hand");

const computerHand = document.getElementById("computer-hand");

const result = document.getElementById("result");

const roundMessage = document.getElementById("round-message");


/* ==========================================
   RANDOM CHOICE
========================================== */

function randomChoice() {

    return choices[Math.floor(Math.random() * choices.length)];

}


function randomAbility() {

    return abilities[Math.floor(Math.random() * abilities.length)];

}


/* ==========================================
   PEEK ABILITY
========================================== */

document.getElementById("peek-btn")
    .addEventListener("click", usePeek);


function usePeek() {

    if (!gameActive || isPlaying || peekUsed) {
        return;
    }

    if (currentUser.points < 20) {

        roundMessage.textContent =
            "You need at least 20 points to Peek!";

        return;

    }

    /* DEDUCT 20 POINTS */

    currentUser.points -= 20;

    matchNetPoints -= 20;

    saveCurrentUser();

    updatePointsDisplay();

    peekUsed = true;

    document.getElementById("peek-btn").disabled = true;


    /* SET COMPUTER CHOICE */

    computerChoice = randomChoice();


    /* CREATE DECOY */

    let decoyChoice;

    do {

        decoyChoice = randomChoice();

    } while (decoyChoice === computerChoice);


    /* RANDOMIZE DISPLAY ORDER */

    const peekChoices = Math.random() < 0.5
        ? [computerChoice, decoyChoice]
        : [decoyChoice, computerChoice];


    /* DISPLAY POSSIBILITIES */

    document.getElementById("peek-image-1").src =
        images[peekChoices[0]];

    document.getElementById("peek-image-2").src =
        images[peekChoices[1]];

    document.getElementById("peek-label-1").textContent =
        capitalize(peekChoices[0]);

    document.getElementById("peek-label-2").textContent =
        capitalize(peekChoices[1]);


    document.getElementById("peek-result")
        .classList.remove("hidden");


    roundMessage.textContent =
        "Peek used! One move is correct and one is a decoy.";

}


/* ==========================================
   PLAYER CHOICES
========================================== */

document.querySelectorAll(".choice-btn").forEach(function(button) {

    button.addEventListener("click", function() {

        handlePlayerChoice(button.dataset.choice);

    });

});


function handlePlayerChoice(choice) {

    if (!gameActive || isPlaying) {
        return;
    }

    /* BAWI WINDOW */

    if (bawiWindow) {

        playerChoice = choice;

        roundMessage.textContent =
            "Your move changed to " + capitalize(choice) + "!";

        return;

    }

    playRound(choice);

}


/* ==========================================
   KEYBOARD CONTROLS
========================================== */

document.addEventListener("keydown", function(event) {

    if (!gameActive || !gameScreen.classList.contains("active")) {
        return;
    }

    const key = event.key.toLowerCase();

    if (key === "r") {

        handlePlayerChoice("rock");

    }

    else if (key === "p") {

        handlePlayerChoice("paper");

    }

    else if (key === "s") {

        handlePlayerChoice("scissors");

    }

});


/* ==========================================
   KANDADO LOCK SELECTION
========================================== */

document.querySelectorAll(".lock-btn").forEach(function(button) {

    button.addEventListener("click", function() {

        if (playerAbility !== "kandado") {
            return;
        }

        playerLockChoice = button.dataset.lock;

        playerAbility = null;

        document.getElementById("lock-options")
            .classList.add("hidden");

        document.getElementById("ability-message").textContent =
            "🔒 You locked " + capitalize(playerLockChoice) +
            " for the computer's next round!";

    });

});


/* ==========================================
   PLAY ROUND
========================================== */

function playRound(choice) {

    if (!gameActive || isPlaying) {
        return;
    }

    /* PLAYER MUST USE KANDADO FIRST */

    if (playerAbility === "kandado" && !playerLockChoice) {

        roundMessage.textContent =
            "Choose which move to lock first!";

        document.getElementById("lock-options")
            .classList.remove("hidden");

        return;

    }

    isPlaying = true;

    playerChoice = choice;


    /* COMPUTER CHOICE */

    if (!computerChoice) {

        computerChoice = randomChoice();

    }


    /* COMPUTER KANDADO */

    if (computerAbility === "kandado") {

        if (!computerLockChoice) {

            computerLockChoice = randomChoice();

        }

        if (playerChoice === computerLockChoice) {

            roundMessage.textContent =
                capitalize(playerChoice) +
                " is locked! Choose another move.";

            isPlaying = false;

            return;

        }

    }


    /* PLAYER KANDADO */

    if (playerLockChoice) {

        while (computerChoice === playerLockChoice) {

            computerChoice = randomChoice();

        }

    }


    /* REVERSE */

    reverseActive =
        playerAbility === "reverse" ||
        computerAbility === "reverse";


    if (reverseActive) {

        document.getElementById("reverse-banner")
            .classList.remove("hidden");

    }


    /* SHOW ROCK BEFORE SHAKE */

    playerHand.src = images.rock;

    computerHand.src = images.rock;


    /* START SHAKE */

    playerHand.classList.add("shake");

    computerHand.classList.add("shake");


    /* COUNTDOWN */

    let countdown = 3;

    document.getElementById("countdown").textContent =
        countdown;


    roundTimer = setInterval(function() {

        countdown--;

        if (countdown > 0) {

            document.getElementById("countdown").textContent =
                countdown;

        }

        else {

            clearInterval(roundTimer);

            startBawiWindow();

        }

    }, 1000);

}


/* ==========================================
   BAWI WINDOW
========================================== */

function startBawiWindow() {

    playerHand.classList.remove("shake");

    computerHand.classList.remove("shake");

    document.getElementById("countdown").textContent = "";


    /* COMPUTER BAWI */

    if (computerAbility === "bawi") {

        computerChoice = randomChoice();

    }


    /* PLAYER BAWI */

    if (playerAbility === "bawi") {

        bawiWindow = true;

        roundMessage.textContent =
            "BAWI! You have 2 seconds to change your move!";

        let timeLeft = 2;

        document.getElementById("countdown").textContent =
            timeLeft;


        const timer = setInterval(function() {

            timeLeft--;

            document.getElementById("countdown").textContent =
                timeLeft > 0 ? timeLeft : "";

            if (timeLeft <= 0) {

                clearInterval(timer);

                bawiWindow = false;

                revealChoices();

            }

        }, 1000);

    }

    else {

        revealChoices();

    }

}


/* ==========================================
   REVEAL CHOICES
========================================== */

function revealChoices() {

    playerHand.src = images[playerChoice];

    computerHand.src = images[computerChoice];

    determineWinner(playerChoice, computerChoice);

}


/* ==========================================
   DETERMINE WINNER
========================================== */

function determineWinner(player, computer) {

    let winner;


    /* DRAW */

    if (player === computer) {

        winner = "draw";

    }


    /* NORMAL RULES */

    else if (

        (player === "rock" && computer === "scissors") ||

        (player === "paper" && computer === "rock") ||

        (player === "scissors" && computer === "paper")

    ) {

        winner = "player";

    }

    else {

        winner = "computer";

    }


    /* REVERSE RULES */

    if (reverseActive && winner !== "draw") {

        winner = winner === "player"
            ? "computer"
            : "player";

    }


    /* UPDATE SCORES */

    updateRoundScore(winner);


    /* RESULT MESSAGE */

    if (winner === "draw") {

        result.textContent = "It's a Draw!";

        roundMessage.textContent =
            "Both chose " + capitalize(player) + "!";

    }

    else if (winner === "player") {

        result.textContent = "You Win!";

        roundMessage.textContent =
            capitalize(player) + " vs " +
            capitalize(computer);

    }

    else {

        result.textContent = "You Lose!";

        roundMessage.textContent =
            capitalize(computer) + " beats " +
            capitalize(player);

    }


    /* RESET USED ABILITIES */

    playerAbility = null;

    computerAbility = null;

    playerLockChoice = null;

    computerLockChoice = null;

    reverseActive = false;

    document.getElementById("reverse-banner")
        .classList.add("hidden");

    document.getElementById("lock-options")
        .classList.add("hidden");


    /* UPDATE DISPLAY */

    updateScoreDisplay();

    updatePointsDisplay();

    updateStreakDisplay();

    updateAbilityDisplay();


    /* CHECK GAME OVER */

    checkGameOver();


    /* NEXT ROUND */

    if (gameActive) {

        roundNumber++;

        setTimeout(function() {

            resetRoundDisplay();

            isPlaying = false;

        }, 1500);

    }

}


/* ==========================================
   ROUND SCORING
========================================== */

function updateRoundScore(winner) {


    /* DRAW */

    if (winner === "draw") {

        currentUser.points += 5;

        computerPoints += 5;

        matchNetPoints += 5;

        playerStreak = 0;

        computerStreak = 0;

    }


    /* PLAYER WINS */

    else if (winner === "player") {

        playerStreak++;

        computerStreak = 0;


        /*
           EVERY ROUND ADDS ONE MATCH POINT.
           THE GAME ONLY ENDS WHEN THERE IS
           A 2-POINT LEAD AND AT LEAST 5 POINTS.
        */

        playerScore++;

        currentUser.points += 10;

        matchNetPoints += 10;


        /* THREE CONSECUTIVE WINS */

        if (playerStreak >= 3) {

            playerAbility = randomAbility();

            playerStreak = 0;

            showAbilityMessage("player");

        }

    }


    /* COMPUTER WINS */

    else {

        computerStreak++;

        playerStreak = 0;


        /* COMPUTER GETS ONE MATCH POINT */

        computerScore++;

        computerPoints += 10;


        /* THREE CONSECUTIVE WINS */

        if (computerStreak >= 3) {

            computerAbility = randomAbility();

            computerStreak = 0;

            showAbilityMessage("computer");

        }

    }


    saveCurrentUser();

}


/* ==========================================
   ABILITY MESSAGE
========================================== */

function showAbilityMessage(who) {

    const ability =
        who === "player"
            ? playerAbility
            : computerAbility;

    const name =
        ability === "kandado"
            ? "Kandado"
            : ability === "bawi"
                ? "Bawi"
                : "Baligtaran";


    if (who === "player") {

        document.getElementById("ability-message").textContent =
            "🔥 3 WIN STREAK! You unlocked " + name + "!";

        if (ability === "kandado") {

            document.getElementById("lock-options")
                .classList.remove("hidden");

        }

    }

    else {

        document.getElementById("ability-message").textContent =
            "🤖 Computer unlocked " + name + "!";

    }

}


/* ==========================================
   ABILITY DISPLAY
========================================== */

function updateAbilityDisplay() {

    if (!playerAbility && !computerAbility) {

        document.getElementById("ability-message").textContent =
            "No active ability.";

    }

}


/* ==========================================
   CHECK GAME COMPLETION
========================================== */

function checkGameOver() {

    const playerWonByTwo =
        playerScore >= winningScore &&
        playerScore - computerScore >= 2;

    const computerWonByTwo =
        computerScore >= winningScore &&
        computerScore - playerScore >= 2;


    if (playerWonByTwo || computerWonByTwo) {

        gameActive = false;

        isPlaying = false;

        setTimeout(showGameOver, 1000);

    }

}


/* ==========================================
   GAME OVER SCREEN
========================================== */

function showGameOver() {

    const playerWon = playerScore > computerScore;

    const gameResult = playerWon
        ? "Victory"
        : "Defeat";


    document.getElementById("game-over-title").textContent =
        playerWon ? "🏆 You Won!" : "Game Over!";


    document.getElementById("final-message").textContent =
        playerWon
            ? "Congratulations! You defeated the computer!"
            : "The computer won. Try again!";


    document.getElementById("final-player-score").textContent =
        playerScore;

    document.getElementById("final-computer-score").textContent =
        computerScore;


    document.getElementById("match-points-earned").textContent =
        matchNetPoints;


    /* SAVE HISTORY */

    currentUser.history.push({

        date: new Date().toLocaleString(),

        result: gameResult,

        score: playerScore + " - " + computerScore,

        points: matchNetPoints

    });


    saveCurrentUser();

    showScreen(gameOverScreen);

}


/* ==========================================
   RESTART
========================================== */

document.getElementById("restart-btn")
    .addEventListener("click", startGame);


/* ==========================================
   BACK TO HOME
========================================== */

document.getElementById("menu-btn")
    .addEventListener("click", showHomeScreen);


document.getElementById("quit-btn")
    .addEventListener("click", function() {

        gameActive = false;

        isPlaying = false;

        bawiWindow = false;

        if (roundTimer) {

            clearInterval(roundTimer);

        }

        showHomeScreen();

    });


/* ==========================================
   HELPER FUNCTION
========================================== */

function capitalize(word) {

    return word.charAt(0).toUpperCase() +
        word.slice(1);

}