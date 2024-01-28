const WIDTH = 20;
const HEIGHT = 15;
const SEPARATOR = ":";
const START_LEN = 3;

const SPACE_KEY = 32;

// Run a new game, clean up existing one
async function new_game(highscore) {
    clear_grid(WIDTH, HEIGHT);

    let difficulty = document.getElementById("difficulty").value;
    let snake = new Snake(START_LEN, parseInt(difficulty));
    const score = await snake.run();

    return score;
}

// Generate HTML for table
// totally uneccesary but otherwise the HTML file would be really long
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

// Start new game if space presseed
function checkSpace(k) {
    k = k || window.event;

    console.log("keypress out of game")
    if  (k.keyCode == SPACE_KEY) {
        console.log("Space pressed")
        new_game();
    }
}

// yesh
function main() {
    let start_btn = document.getElementById("start_btn");
    highscore = 0;

    build_grid(WIDTH, HEIGHT);

    document.onkeydown = k => checkSpace(k);
    start_btn.onclick = () => {
        new_game()
            .then(score => {
                if (score > highscore) {
                    highscore = score;
                    document.querySelector("#highscore").innerText = score;
                }
            })
            .catch(err => console.error(err));
    };
}

main();