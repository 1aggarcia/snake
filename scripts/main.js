const WIDTH = 25;
const HEIGHT = 15;
const SEPARATOR = ":";
const START_LEN = 3;

const USERNAME_MIN = 3;
const USERNAME_MAX = 60;

const highscoreKey = "1aggarciasnake_highscore";

const DOM = {
    header: document.getElementById("header"),
    startBtn: document.getElementById("start_btn"),
    highscoreBox: document.getElementById("highscore"),
    grid: document.getElementById("grid"),
    menu: document.getElementById("menu"),
    
    leaderboardForm: document.getElementById("leaderboardForm"),
    leaderboardElem: document.getElementById("leaderboard"),
};

(function main () {
    let gameActive = false;
    let highscore = localStorage.getItem(highscoreKey) || 0;

    DOM.highscoreBox.textContent = highscore;
    grid.innerHTML = buildGrid(WIDTH, HEIGHT);

    leaderboardToDom(DOM.leaderboardElem);
    setUpBlockSize();

    // Start game when start button pressed
    DOM.startBtn.onclick = () => newGame();

    // Start game when spacebar pressed
    document.addEventListener("keydown", e => {
        if (!gameActive && e.code == "Space") {
            newGame();
        }
    });

    async function newGame() {
        // Don't start a new game if there already is one active
        if (gameActive) return;

        DOM.leaderboardForm.onsubmit = () => false;
        DOM.leaderboardForm.style.display = "none";
        DOM.menu.style.display = "none";

        clearGrid(WIDTH, HEIGHT);
        gameActive = true;

        const difficulty = document.getElementById("difficulty").value;
        const snake = new Snake(START_LEN, parseInt(difficulty));
        const score = await snake.run();

        // Game over
        gameActive = false;
        gameOverToDom(score, highscore);
    }
})();

function gameOverToDom(score, highscore) {
    DOM.header.innerHTML = `GAME OVER (Score ${score})`;
    DOM.startBtn.textContent = "Restart";
    DOM.menu.style.display = "flex";

    // Update highscore if needed
    if (score > highscore) {
        highscore = score;
        localStorage.setItem(highscoreKey, score);
        DOM.highscoreBox.innerText = score; 
    }

    if (score < MIN_LEADERBOARD_SCORE) return;

    // Listen for leaderboard update
    DOM.leaderboardForm.style.display = "flex";
    DOM.leaderboardForm.onsubmit = e => {
        handleLeaderbaordForm(e, score, DOM.leaderboardElem);
    }
}

function setUpBlockSize() {
    const blockSizeElem = document.getElementById("blockSize");

    const initSize = localStorage.getItem("blockSize") || 30;
    setBlockSize(initSize);
    blockSizeElem.value = initSize;

    // Change block size when the slider is dragged
    blockSizeElem.addEventListener("input", e => {
        const size = Number(e.target.value);
        if (isNaN(size)) {
            throw TypeError("Size is not a number");
        }
        setBlockSize(size);
    });

    // Save block size only when slider is released
    blockSizeElem.addEventListener("change", e => {
        const size = Number(e.target.value);
        if (isNaN(size)) {
            throw TypeError("Size is not a number");
        }
        localStorage.setItem("blockSize", size);
    });
}

/** @param {number} size */
function setBlockSize(size) {
    document.getElementById("blockSizeVal").textContent = size;

    document.querySelectorAll(".grid td").forEach(td => {
        td.style.width = `${size}px`;
        td.style.height = `${size}px`;
    })
}

// Generate HTML grid
function buildGrid(width, height) {
    let html = "";
    let id;

    for (let r = 1; r <= height; r++) {
        html += `<tr id ='r${r}'>`;
        for (let c = 1; c <= width; c++) {
            id = r + SEPARATOR + c;
            html += `<td id ='${id}'></td>`;
        }
        html += "</tr>"
    }
    return html;
}

// Clear all blocks in grid
function clearGrid(width, height) {
    let id;
    for (let r = 1; r <= height; r++) {
        for (let c = 1; c <= width; c++) {
            id = r + SEPARATOR + c;
            clear_block(id);
        }
    }
}
