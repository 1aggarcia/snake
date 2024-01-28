const WIDTH = 20;
const HEIGHT = 15;
const SEPARATOR = ":";
const START_LEN = 3;

const SPACE_KEY = 32;

const highscoreKey = "1aggarciasnake_highscore";

// Self invoking "main" function
(function main () {
    const startBtn = document.getElementById("start_btn");
    const highscoreBox = document.getElementById("highscore");

    let gameActive = false;
    let highscore = localStorage.getItem(highscoreKey) || 0;

    highscoreBox.innerText = highscore;
    buildGrid(WIDTH, HEIGHT);

    // Setup event listeners

    startBtn.onclick = () => newGame();
    document.addEventListener("keydown", k => {
        // Ignore keypresses during active games
        if (gameActive) return;
    
        k = k || window.event;
        if  (k.keyCode == SPACE_KEY) {
            newGame();
        }
    });

    async function newGame() {
        clearGrid(WIDTH, HEIGHT);
        gameActive = true;

        const difficulty = document.getElementById("difficulty").value;
        const snake = new Snake(START_LEN, parseInt(difficulty));
        const score = await snake.run();

        gameActive = false;

        // Update highscore if needed
        if (score > highscore) {
            highscore = score;
            localStorage.setItem(highscoreKey, score);
            highscoreBox.innerText = score; 
        }
    }
})();

// Generate HTML grid
function buildGrid(width, height) {
    let table = document.getElementById("grid");
    let id;
    let html = "";

    for (let r = 1; r <= height; r++) {
        html += "<tr id ='r" + r + "'>\n";
        for (let c = 1; c <= width; c++) {
            id = r + SEPARATOR + c;
            html += "<td id ='" + id + "'></td>\n";
        }
        html += "</tr>"
    }

    table.innerHTML = html;
}

// Clear all blocks in grid
function clearGrid(width, height) {
    let id;
    let html = "";

    for (let r = 1; r <= height; r++) {
        html += "<tr id ='r" + r + "'>\n";
        for (let c = 1; c <= width; c++) {
            id = r + SEPARATOR + c;
            clear_block(id);
        }
        html += "</tr>"
    }
}
