const WIDTH = 20;
const HEIGHT = 15;
const SEPARATOR = ":";
const START_LEN = 3;

const LOW_SPEED = 120;
const MED_SPEED = 80;
const HIGH_SPEED = 50;

// Run a new game, clean up existing one
function new_game(highscore) {
    clear_grid(WIDTH, HEIGHT);

    let difficulty = document.getElementById("difficulty").value;
    let snake = new Snake(START_LEN, parseInt(difficulty));
    snake.run();

    return snake.score;
}

// Generate HTML for table
// totally uneccesary but otherwise the HTML file would be 1000 pages long
function build_grid(width, height) {
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
function clear_grid(width, height) {
    let table = document.getElementById("grid");
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

// yesh
function main() {
    let start_btn = document.getElementById("start_btn");
    highscore = 0;

    build_grid(WIDTH, HEIGHT);

    start_btn.onclick = function() { highscore = new_game(highscore) };
}

main();