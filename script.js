// account system
let currentUser = null;
let isCreatingAccount = false;

const users = JSON.parse(
    localStorage.getItem("luckyJackUsers") || "{}"
);

//screen elements
const loginScreen = document.getElementById("login-screen");
const homeScreen = document.getElementById("home-screen");
const mechanicsScreen = document.getElementById("mechanics-screen");
const gameScreen = document.getElementById("game-screen");
const gameOverScreen = document.getElementById("game-over-screen");

// login and registration elements
const usernameInput = document.getElementById("username-input");
const passwordInput = document.getElementById("password-input");

const authButton = document.getElementById("auth-btn");
const authTitle = document.getElementById("auth-title");
const authMessage = document.getElementById("auth-message");
const toggleAuthButton = document.getElementById("toggle-auth");

// sidebar and navigation elements
const sidebar = document.getElementById("sidebar");
const settingsButton = document.getElementById("settings-btn");
const sidebarSettingsButton = document.getElementById("sidebar-settings-btn");
const profileButton = document.getElementById("profile-dropdown-btn");
const profileDropdown = document.getElementById("profile-dropdown");
const informationButton = document.getElementById("information-btn");
const informationPanel = document.getElementById("information-panel");

// score and round displays
const roundNumberDisplay = document.getElementById("round-number");
const playerScoreDisplay = document.getElementById("player-score");
const computerScoreDisplay = document.getElementById("computer-score");
const gamePointsDisplay = document.getElementById("game-points");
const computerPointsDisplay = document.getElementById("computer-points");
const playerStreakDisplay = document.getElementById("player-streak");
const computerStreakDisplay = document.getElementById("computer-streak");

// player and computer move displays
const playerHand = document.getElementById("player-hand");
const computerHand = document.getElementById("computer-hand");

// game messages and countdown
const resultDisplay = document.getElementById("result");
const roundMessage = document.getElementById("round-message");
const countdownDisplay = document.getElementById("countdown");
const abilityMessage = document.getElementById("ability-message");

// ability elements
const lockOptions = document.getElementById("lock-options");
const reverseBanner = document.getElementById("reverse-banner");

// game buttons
const choiceButtons = document.querySelectorAll(".choice-btn");
const lockButtons = document.querySelectorAll(".lock-btn");

// peek ability elements
const peekButton = document.getElementById("peek-btn");
const peekResult = document.getElementById("peek-result");

// game scores
let playerScore = 0;
let computerScore = 0;

// game points
let playerPoints = 0;
let computerPoints = 0;
let matchPointsEarned = 0;

// round tracking
let roundNumber = 1;

// win streak tracking
let playerStreak = 0;
let computerStreak = 0;

// player and computer choices
let playerChoice = null;
let computerChoice = null;

// special ability variables
let playerAbility = null;
let playerLockChoice = null;

// reverse ability state
let reverseActive = false;

// peek ability state
let peekUsed = false;
let peekChoice = null;

// game state
let roundActive = false;
let gameEnded = false;
let bawiWindow = false;

// ability unlock streak requirement
let nextAbilityStreak = 3;

// game timers
let countdownTimer = null;
let bawiTimer = null;
let animationTimer = null;

// move images
const moveImages = {
    rock: "images/rock.svg",
    paper: "images/paper.svg",
    scissors: "images/scissors.svg"
};

// screen navigation
function showScreen(screen) {
    document.querySelectorAll(".screen").forEach(function(item) {
        item.classList.remove("active");
    });

    screen.classList.add("active");
    closeSidebarPanels();
}

// login and registration toggle
toggleAuthButton.addEventListener("click", function() {
    isCreatingAccount = !isCreatingAccount;

    if (isCreatingAccount) {
        authTitle.textContent = "CREATE ACCOUNT";
        authButton.textContent = "REGISTER";
        toggleAuthButton.textContent = "BACK TO LOGIN";
        passwordInput.autocomplete = "new-password";
    } else {
        authTitle.textContent = "LOGIN";
        authButton.textContent = "LOGIN";
        toggleAuthButton.textContent = "CREATE AN ACCOUNT";
        passwordInput.autocomplete = "current-password";
    }

    authMessage.textContent = "";
});

// authentication button event
authButton.addEventListener("click", handleAuthentication);

// login using enter key
passwordInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        handleAuthentication();
    }
});

// move to password field using enter key
usernameInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        passwordInput.focus();
    }
});

// account authentication
function handleAuthentication() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        authMessage.textContent =
            "Please enter your username and password.";
        return;
    }

    // account registration
    if (isCreatingAccount) {
        if (users[username]) {
            authMessage.textContent = "Username already exists.";
            return;
        }

        users[username] = {
            password: password,
            points: 0,
            history: []
        };

        saveUsers();

        authMessage.textContent = "Account created successfully!";

        isCreatingAccount = false;
        authTitle.textContent = "LOGIN";
        authButton.textContent = "LOGIN";
        toggleAuthButton.textContent = "CREATE AN ACCOUNT";

        passwordInput.value = "";
        return;
    }

    // account login
    if (!users[username]) {
        authMessage.textContent = "Account does not exist.";
        return;
    }

    if (users[username].password !== password) {
        authMessage.textContent = "Incorrect password.";
        return;
    }

    currentUser = username;

    // initialize missing user data
    if (!Array.isArray(users[currentUser].history)) {
        users[currentUser].history = [];
    }

    if (typeof users[currentUser].points !== "number") {
        users[currentUser].points = 0;
    }

    authMessage.textContent = "";

    saveUsers();
    showHomeScreen();
}

// save user data to local storage
function saveUsers() {
    localStorage.setItem(
        "luckyJackUsers",
        JSON.stringify(users)
    );
}

// display home screen
function showHomeScreen() {
    if (!currentUser) {
        showScreen(loginScreen);
        return;
    }

    document.getElementById("welcome-username").textContent =
        currentUser;

    document.getElementById("total-points").textContent =
        users[currentUser].points;

    updateHistory();
    showScreen(homeScreen);
}

// close sidebar panels
function closeSidebarPanels() {
    sidebar.classList.remove("open");
    profileDropdown.classList.add("hidden");
    informationPanel.classList.add("hidden");
}

// settings sidebar toggle
settingsButton.addEventListener("click", function() {
    sidebar.classList.toggle("open");
    profileDropdown.classList.add("hidden");
    informationPanel.classList.add("hidden");
});

// close settings sidebar
sidebarSettingsButton.addEventListener("click", closeSidebarPanels);

// profile dropdown toggle
profileButton.addEventListener("click", function() {
    profileDropdown.classList.toggle("hidden");
    informationPanel.classList.add("hidden");
});

// information panel toggle
informationButton.addEventListener("click", function() {
    informationPanel.classList.toggle("hidden");
    profileDropdown.classList.add("hidden");
});

// display website creation date
document.getElementById("creation-date").textContent =
    new Date().toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

// logout function
document.getElementById("logout-btn").addEventListener("click", function() {
    stopGameTimers();

    currentUser = null;

    usernameInput.value = "";
    passwordInput.value = "";
    authMessage.textContent = "";

    closeSidebarPanels();
    showScreen(loginScreen);
});

// home screen navigation
document.getElementById("home-start-btn").addEventListener(
    "click",
    startGame
);

// mechanics screen navigation
document.getElementById("home-mechanics-btn").addEventListener(
    "click",
    function() {
        showScreen(mechanicsScreen);
    }
);

// return to home from mechanics
document.getElementById("mechanics-back-btn").addEventListener(
    "click",
    showHomeScreen
);

// random move selection
function randomChoice() {
    const moves = ["rock", "paper", "scissors"];

    return moves[
        Math.floor(Math.random() * moves.length)
    ];
}

// calculate available player points
function getAvailablePoints() {
    if (!currentUser) {
        return playerPoints;
    }

    return users[currentUser].points + playerPoints;
}

// stop all game timers
function stopGameTimers() {
    clearInterval(countdownTimer);
    clearInterval(bawiTimer);
    clearTimeout(animationTimer);
}

// initialize a new game
function startGame() {
    if (!currentUser) {
        showScreen(loginScreen);
        return;
    }

    stopGameTimers();

    // reset scores and points
    playerScore = 0;
    computerScore = 0;

    playerPoints = 0;
    computerPoints = 0;
    matchPointsEarned = 0;

    // reset round and streaks
    roundNumber = 1;

    playerStreak = 0;
    computerStreak = 0;

    // reset player and computer choices
    playerChoice = null;
    computerChoice = null;

    // reset abilities
    playerAbility = null;
    playerLockChoice = null;

    reverseActive = false;

    peekUsed = false;
    peekChoice = null;

    // reset game states
    roundActive = false;
    gameEnded = false;
    bawiWindow = false;

    nextAbilityStreak = 3;

    document.getElementById("game-username").textContent =
        currentUser;

    updateGameDisplay();

    showScreen(gameScreen);
    resetRound();
}

// reset current round
function resetRound() {
    stopGameTimers();

    playerChoice = null;
    computerChoice = null;

    playerLockChoice = null;

    reverseActive = false;

    peekUsed = false;
    peekChoice = null;

    roundActive = false;
    bawiWindow = false;

    // enable move buttons
    choiceButtons.forEach(function(button) {
        button.disabled = false;
    });

    // hide ability elements
    lockOptions.classList.add("hidden");
    reverseBanner.classList.add("hidden");
    peekResult.classList.add("hidden");

    // reset countdown
    countdownDisplay.textContent = "";

    // reset hand images
    playerHand.src = moveImages.rock;
    computerHand.src = moveImages.rock;

    playerHand.alt = "Your move";
    computerHand.alt = "Computer move";

    playerHand.classList.remove("shake");
    computerHand.classList.remove("shake");

    // reset round messages
    resultDisplay.textContent = "Choose your move!";
    resultDisplay.style.color = "";

    roundMessage.textContent =
        "Select Rock, Paper, or Scissors.";

    roundNumberDisplay.textContent = roundNumber;

    updateGameDisplay();
    updatePeekButton();
    prepareAbility();
}

// prepare player's unlocked ability
function prepareAbility() {
    lockOptions.classList.add("hidden");
    reverseBanner.classList.add("hidden");

    reverseActive = false;

    if (!playerAbility) {
        abilityMessage.textContent =
            playerStreak >= 2
                ? "Peek is unlocked! It costs 20 points."
                : "No active ability.";

        return;
    }

    // kandado ability
    if (playerAbility === "Kandado") {
        abilityMessage.textContent =
            "KANDADO! Choose a move to lock for the computer.";

        lockOptions.classList.remove("hidden");

        lockButtons.forEach(function(button) {
            button.disabled = false;
        });
    }

    // bawi ability
    if (playerAbility === "Bawi") {
        abilityMessage.textContent =
            "BAWI is ready! You can change your move during the Bawi window.";
    }

    // baligtaran ability
    if (playerAbility === "Baligtaran") {
        reverseActive = true;
        reverseBanner.classList.remove("hidden");

        abilityMessage.textContent =
            "BALIGTARAN! Winning rules are reversed this round.";
    }

    updatePeekButton();
}

// kandado move locking
lockButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        if (playerAbility !== "Kandado" || roundActive) {
            return;
        }

        playerLockChoice = button.dataset.lock;

        abilityMessage.textContent =
            "KANDADO: " +
            playerLockChoice.toUpperCase() +
            " is locked for the computer.";

        lockOptions.classList.add("hidden");

        lockButtons.forEach(function(item) {
            item.disabled = true;
        });

        generateComputerChoice();
    });
});

// generate computer move
function generateComputerChoice() {
    let availableMoves = [
        "rock",
        "paper",
        "scissors"
    ];

    // remove locked move from computer options
    if (playerLockChoice) {
        availableMoves = availableMoves.filter(function(move) {
            return move !== playerLockChoice;
        });
    }

    // randomize computer move
    computerChoice =
        availableMoves[
            Math.floor(Math.random() * availableMoves.length)
        ];
}

// peek ability button state
function updatePeekButton() {
    const hasEnoughPoints = getAvailablePoints() >= 20;
    const hasRequiredStreak = playerStreak >= 2;

    peekButton.disabled =
        !hasRequiredStreak ||
        !hasEnoughPoints ||
        peekUsed ||
        roundActive ||
        gameEnded;

    peekButton.classList.toggle(
        "disabled",
        peekButton.disabled
    );
}

// peek ability event
peekButton.addEventListener("click", usePeek);

// peek ability function
function usePeek() {
    if (roundActive || peekUsed || gameEnded) {
        return;
    }

    // check peek requirements
    if (playerStreak < 2) {
        roundMessage.textContent =
            "Win 2 consecutive rounds to unlock Peek.";

        updatePeekButton();
        return;
    }

    if (getAvailablePoints() < 20) {
        roundMessage.textContent =
            "You need at least 20 points to use Peek.";

        updatePeekButton();
        return;
    }

    // generate computer move if not yet generated
    if (!computerChoice) {
        generateComputerChoice();
    }

    // deduct peek cost
    const savedPoints = users[currentUser].points;

    if (savedPoints >= 20) {
        users[currentUser].points -= 20;
    } else {
        const remainingCost = 20 - savedPoints;

        users[currentUser].points = 0;
        playerPoints -= remainingCost;
    }

    saveUsers();

    peekUsed = true;

    // generate decoy move
    const decoyMoves = [
        "rock",
        "paper",
        "scissors"
    ].filter(function(move) {
        return move !== computerChoice;
    });

    const decoy =
        decoyMoves[
            Math.floor(Math.random() * decoyMoves.length)
        ];

    // arrange correct move and decoy
    const options = [
        computerChoice,
        decoy
    ];

    if (Math.random() > 0.5) {
        options.reverse();
    }

    // display peek choices
    document.getElementById("peek-image-1").src =
        moveImages[options[0]];

    document.getElementById("peek-image-2").src =
        moveImages[options[1]];

    document.getElementById("peek-label-1").textContent =
        options[0].toUpperCase();

    document.getElementById("peek-label-2").textContent =
        options[1].toUpperCase();

    peekResult.classList.remove("hidden");

    roundMessage.textContent =
        "Peek used! One move is correct and one is a decoy.";

    updateGameDisplay();
    updatePeekButton();
}

// player move button events
choiceButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const choice = button.dataset.choice;

        if (bawiWindow) {
            changeBawiChoice(choice);
            return;
        }

        playRound(choice);
    });
});

// keyboard move controls
document.addEventListener("keydown", function(event) {
    if (!gameScreen.classList.contains("active")) {
        return;
    }

    if (event.target.tagName === "INPUT") {
        return;
    }

    const key = event.key.toLowerCase();

    let choice = null;

    // r for rock
    if (key === "r") choice = "rock";

    // p for paper
    if (key === "p") choice = "paper";

    // s for scissors
    if (key === "s") choice = "scissors";

    if (!choice) {
        return;
    }

    if (bawiWindow) {
        changeBawiChoice(choice);
        return;
    }

    playRound(choice);
});

// start a round
function playRound(choice) {
    if (roundActive || gameEnded) {
        return;
    }

    // require kandado selection
    if (playerAbility === "Kandado" && !playerLockChoice) {
        roundMessage.textContent =
            "Choose a move to lock before playing.";

        return;
    }

    playerChoice = choice;

    // generate computer move
    if (!computerChoice) {
        generateComputerChoice();
    }

    roundActive = true;

    // disable move buttons
    choiceButtons.forEach(function(button) {
        button.disabled = true;
    });

    updatePeekButton();

    // prepare hand animations
    playerHand.src = moveImages.rock;
    computerHand.src = moveImages.rock;

    playerHand.classList.add("shake");
    computerHand.classList.add("shake");

    resultDisplay.textContent = "READY...";
    roundMessage.textContent = "The battle is beginning!";

    // start countdown
    let count = 3;

    countdownDisplay.textContent = count;

    countdownTimer = setInterval(function() {
        count--;

        if (count > 0) {
            countdownDisplay.textContent = count;
        } else {
            clearInterval(countdownTimer);

            countdownDisplay.textContent = "SHOOT!";

            playerHand.classList.remove("shake");
            computerHand.classList.remove("shake");

            revealMoves();
        }
    }, 700);
}

// reveal player and computer moves
function revealMoves() {
    playerHand.src = moveImages[playerChoice];
    computerHand.src = moveImages[computerChoice];

    playerHand.alt = "You chose " + playerChoice;
    computerHand.alt = "Computer chose " + computerChoice;

    resultDisplay.textContent = "MOVES REVEALED!";

    roundMessage.textContent =
        "Your move: " +
        playerChoice.toUpperCase() +
        " | Computer: " +
        computerChoice.toUpperCase();

    countdownDisplay.textContent = "";

    // activate bawi ability
    if (playerAbility === "Bawi") {
        showBawiWindow();
    } else {
        animationTimer = setTimeout(function() {
            resolveRound();
        }, 1500);
    }
}

// bawi move changing window
function showBawiWindow() {
    bawiWindow = true;

    abilityMessage.textContent =
        "BAWI! Change your move now!";

    countdownDisplay.textContent = "BAWI: 2";

    let seconds = 2;

    // enable move buttons during bawi
    choiceButtons.forEach(function(button) {
        button.disabled = false;
    });

    // bawi countdown
    bawiTimer = setInterval(function() {
        seconds--;

        if (seconds > 0) {
            countdownDisplay.textContent =
                "BAWI: " + seconds;
        } else {
            clearInterval(bawiTimer);

            bawiWindow = false;

            countdownDisplay.textContent = "TIME'S UP!";

            choiceButtons.forEach(function(button) {
                button.disabled = true;
            });

            animationTimer = setTimeout(function() {
                resolveRound();
            }, 1000);
        }
    }, 1000);
}

// change player's move during bawi
function changeBawiChoice(choice) {
    if (!bawiWindow || gameEnded) {
        return;
    }

    playerChoice = choice;

    playerHand.src = moveImages[playerChoice];
    playerHand.alt = "Your changed move: " + playerChoice;

    roundMessage.textContent =
        "Your move changed to " +
        playerChoice.toUpperCase() +
        "!";
}

// determine round winner and update scores
function resolveRound() {
    clearInterval(countdownTimer);
    clearInterval(bawiTimer);
    clearTimeout(animationTimer);

    bawiWindow = false;

    // disable move buttons
    choiceButtons.forEach(function(button) {
        button.disabled = true;
    });

    const abilityUsedThisRound = playerAbility;

    // determine normal round outcome
    let outcome = getWinner(
        playerChoice,
        computerChoice
    );

    // reverse outcome for baligtaran
    if (reverseActive) {
        if (outcome === "win") {
            outcome = "lose";
        } else if (outcome === "lose") {
            outcome = "win";
        }
    }

    // player wins round
    if (outcome === "win") {
        playerScore++;

        playerPoints += 10;
        matchPointsEarned += 10;

        playerStreak++;

        computerStreak = 0;

        resultDisplay.textContent = "YOU WIN!";
        resultDisplay.style.color = "#2c9b42";

        roundMessage.textContent =
            playerChoice.toUpperCase() +
            " beats " +
            computerChoice.toUpperCase() +
            "! +10 points";

    // computer wins round
    } else if (outcome === "lose") {
        computerScore++;

        computerPoints += 10;

        computerStreak++;

        playerStreak = 0;

        resultDisplay.textContent = "YOU LOSE!";
        resultDisplay.style.color = "#e84141";

        roundMessage.textContent =
            computerChoice.toUpperCase() +
            " beats " +
            playerChoice.toUpperCase() +
            "!";

    // draw round
    } else {
        playerPoints += 5;
        computerPoints += 5;

        matchPointsEarned += 5;

        resultDisplay.textContent = "DRAW!";
        resultDisplay.style.color = "#f2a900";

        roundMessage.textContent =
            "Both players chose " +
            playerChoice.toUpperCase() +
            "! +5 points each.";
    }

    // consume special ability
    if (abilityUsedThisRound) {
        playerAbility = null;
    }

    // reset ability states
    playerLockChoice = null;
    reverseActive = false;

    lockOptions.classList.add("hidden");
    reverseBanner.classList.add("hidden");

    updateGameDisplay();
    updatePeekButton();

    // check ability unlock
    checkAbilityUnlock();

    // check match winner
    if (checkGameOver()) {
        return;
    }

    // move to next round
    roundNumber++;

    animationTimer = setTimeout(function() {
        resetRound();
    }, 1800);
}

// determine winner using rock paper scissors rules
function getWinner(player, computer) {
    if (player === computer) {
        return "draw";
    }

    if (
        (player === "rock" && computer === "scissors") ||
        (player === "paper" && computer === "rock") ||
        (player === "scissors" && computer === "paper")
    ) {
        return "win";
    }

    return "lose";
}

// check if player unlocks an ability
function checkAbilityUnlock() {
    if (
        playerStreak >= nextAbilityStreak &&
        playerAbility === null
    ) {
        unlockAbility();
        nextAbilityStreak += 3;
    }
}

// randomly assign special ability
function unlockAbility() {
    const abilities = [
        "Kandado",
        "Bawi",
        "Baligtaran"
    ];

    playerAbility =
        abilities[
            Math.floor(Math.random() * abilities.length)
        ];

    abilityMessage.textContent =
        playerStreak +
        "-WIN STREAK! You unlocked " +
        playerAbility +
        "!";

    roundMessage.textContent =
        "Your next round will use your special ability.";
}

// check if match is finished
function checkGameOver() {
    const playerWon =
        playerScore >= 5 &&
        playerScore - computerScore >= 2;

    const computerWon =
        computerScore >= 5 &&
        computerScore - playerScore >= 2;

    if (!playerWon && !computerWon) {
        return false;
    }

    gameEnded = true;
    roundActive = false;

    stopGameTimers();
    finishGame(playerWon);

    return true;
}

// display final game results
function finishGame(playerWon) {
    const title = document.getElementById("game-over-title");
    const finalMessage = document.getElementById("final-message");

    // display match result
    if (playerWon) {
        title.textContent = "YOU WIN!";

        finalMessage.textContent =
            "Congratulations! You defeated the computer!";
    } else {
        title.textContent = "YOU LOSE!";

        finalMessage.textContent =
            "Better luck next time!";
    }

    // display final scores and points
    document.getElementById("final-player-score").textContent =
        playerScore;

    document.getElementById("final-computer-score").textContent =
        computerScore;

    document.getElementById("match-points-earned").textContent =
        matchPointsEarned;

    // save earned points
    users[currentUser].points += playerPoints;

    // save match history
    users[currentUser].history.unshift({
        date: new Date().toLocaleDateString(),
        playerScore: playerScore,
        computerScore: computerScore,
        points: playerPoints,
        result: playerWon ? "WIN" : "LOSS"
    });

    // limit history to 10 games
    users[currentUser].history =
        users[currentUser].history.slice(0, 10);

    saveUsers();
    updateHistory();

    showScreen(gameOverScreen);
}

// update game displays
function updateGameDisplay() {
    playerScoreDisplay.textContent = playerScore;
    computerScoreDisplay.textContent = computerScore;

    gamePointsDisplay.textContent =
        getAvailablePoints();

    computerPointsDisplay.textContent =
        computerPoints;

    playerStreakDisplay.textContent =
        playerStreak;

    computerStreakDisplay.textContent =
        computerStreak;

    roundNumberDisplay.textContent =
        roundNumber;

    // update total user points
    if (currentUser) {
        document.getElementById("total-points").textContent =
            users[currentUser].points;
    }

    updatePeekButton();
}

// display game history
function updateHistory() {
    if (!currentUser) {
        return;
    }

    const historyList = document.getElementById("history-list");
    const history = users[currentUser].history;

    // display empty history
    if (!history || history.length === 0) {
        historyList.innerHTML =
            "<p>No games played yet.</p>";

        return;
    }

    historyList.innerHTML = "";

    // create history items
    history.forEach(function(game) {
        const item = document.createElement("div");

        item.classList.add("history-item");

        // apply result styling
        if (game.result === "WIN") {
            item.classList.add("history-win");
        } else if (game.result === "LOSS") {
            item.classList.add("history-loss");
        } else {
            item.classList.add("history-draw");
        }

        // display match date
        const date = document.createElement("p");
        date.textContent = game.date;

        // display match result and score
        const score = document.createElement("p");
        score.textContent =
            game.result +
            " (" +
            game.playerScore +
            " - " +
            game.computerScore +
            ")";

        // display points earned
        const points = document.createElement("p");
        points.textContent =
            "Points earned: " + game.points;

        // add information to history item
        item.appendChild(date);
        item.appendChild(score);
        item.appendChild(points);

        historyList.appendChild(item);
    });
}

// quit game and return home
document.getElementById("quit-btn").addEventListener("click", function() {
    stopGameTimers();

    gameEnded = true;
    roundActive = false;
    bawiWindow = false;

    showHomeScreen();
});

// restart game
document.getElementById("restart-btn").addEventListener(
    "click",
    startGame
);

// return to home menu
document.getElementById("menu-btn").addEventListener(
    "click",
    showHomeScreen
);

// display login screen when website loads
showScreen(loginScreen);