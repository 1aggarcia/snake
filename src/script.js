const LEFT_KEY = 37;
const UP_KEY = 38;
const RIGHT_KEY = 39;
const DOWN_KEY = 40;

const LOW_SPEED = 120;
const MED_SPEED = 80;
const HIGH_SPEED = 50;

const START_LEN = 3;
const WIDTH = 20;
const HEIGHT = 15;
const SEPARATOR = ":";

const SNAKE_CLASS = "s_block";
const FOOD_CLASS = "f_block";

// Function holding snake vars
async function run_snake() {
    let blocks = ["7:10", "8:10", "9:10"]; // VERY BAD, 6 magic numbers in a single line oh my
    let food = gen_food(blocks);

    let direction = [-1, 0] // encoded as [downShift, rightShift]
    let alive = true;

    let infobox = document.getElementById("infobox");

    for (let i = 0; i < blocks.length; i++) {
        fill_block(blocks[i], false);
    }
    fill_block(food, true);

    document.onkeydown = function(){ direction = checkKey() };

    // Tick loop
    while (alive = true) {
        await delay(MED_SPEED);
        blocks = tick(blocks, direction); // move head, add to block array

        // delete tail if not eating
        if (blocks[0] === food) {
            food = gen_food(blocks);
            fill_block(food, true);
            infobox.innerHTML = "Score: " + get_score(blocks);
        } else {
            let tail = blocks.pop();
            clear_block(tail);
        }
    }
}

// Move head of snake forward
function tick(blocks, direction) {
    let head = blocks[0];
    let coords = head.split(":");

    coords[0] = parseInt(coords[0]) + direction[0]; // Shift y down by direction[0]
    coords[1] = parseInt(coords[1]) + direction[1]; // Shift x right by direction[1]

    head = coords[0] + SEPARATOR + coords[1];
    blocks = [head].concat(blocks);
    fill_block(head, false);

    return blocks;
}

// Read key press, change direction if needed
function checkKey(e) {
    e = e || window.event;
    let direction = [];

    switch(e.keyCode) {
        case LEFT_KEY:
            direction = [0, -1];
            break;
        case UP_KEY:
            direction = [-1, 0];
            break;
        case RIGHT_KEY:
            direction = [0, 1];
            break;
        case DOWN_KEY:
            direction = [1, 0];
    }

    console.log("Direction: " + direction);
    return direction;

}

// Generate random location for food
function gen_food(blocks) {
    let row = Math.floor(Math.random() * HEIGHT) + 1;
    let col = Math.floor(Math.random() * WIDTH) + 1;
    let food = row + SEPARATOR + col;

    // regenerate location if location overlaps with snake
    if (blocks.includes(food)) {
        return gen_food(blocks);
    } else {
        return food;
    }
}

// Fill block with snake
function fill_block(id, isFood) {
    let block = document.getElementById(id);
    if (isFood) {
        block.className = FOOD_CLASS;
    } else {
        block.className = SNAKE_CLASS;
    }
}

// Remove snake from block
function clear_block(id) {
    document.getElementById(id).className = "";
}

// Calculate & return score
function get_score(blocks) {
    return (blocks.length - START_LEN) * 50
}

// Delay time
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

// Fill HTML of table
function build_grid(width, height) {
    let table = document.getElementById("grid");
    let id;
    let html = "";

    for (let r = 1; r < height+1; r++) {
        html += "<tr id ='r" + r + "'>\n";
        for (let c = 1; c < width+1; c++) {
            id = r + SEPARATOR + c;
            html += "<td id ='" + id + "'></td>\n";
        }
        html += "</tr>"
    }

    table.innerHTML = html;
}

function main() {
    build_grid(WIDTH, HEIGHT);
    run_snake();
}

main();