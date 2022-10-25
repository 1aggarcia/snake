const WIDTH = 20;
const HEIGHT = 15;
const SEPARATOR = ":";

const SNAKE_CLASS = "s_block";
const FOOD_CLASS = "f_block";

function main() {
    build_grid(WIDTH, HEIGHT);
    run_snake();
    
}

// Fill HTML of table
function build_grid(width, height) {
    let table = document.getElementById("grid");
    let id;
    let html = "";

    for (let r = 1; r < height+1; r++) {
        html += "<tr id ='" + r + "'>\n";
        for (let c = 1; c < width+1; c++) {
            id = r + SEPARATOR + c;
            html += "<td id ='" + id + "'></td>\n";
        }
        html += "</tr>"
    }

    table.innerHTML = html;

}

// Function holding snake vars
async function run_snake() {
    let blocks = ["7:10", "8:10", "9:10"];

    let direction = [0, 1] // encoded as [downShift, leftShift]
    let eating = true;
    let alive = true;

    for (let i = 0; i < blocks.length; i++) {
        fill_block(blocks[i], true);
    }
    fill_block("7:11", false);

    for (let i = 0; i < 9; i++) {
        await delay(250);
        blocks = tick(blocks, direction, eating); // move head, add to block array

        // clear tail if not eating
        if (eating == false) {
            let tail = blocks.pop();
            clear_block(tail);
        } else {
            eating = false;
        }
    }
}

// Fill block with snake
function fill_block(id, isSnake) {
    let block = document.getElementById(id);
    if (isSnake) {
        block.className = SNAKE_CLASS;
    } else {
        block.className = FOOD_CLASS;
    }
}

// Remove snake from block
function clear_block(id) {
    document.getElementById(id).className = "";
}

// ticker
function tick(blocks, direction, eating) {
    let head = blocks[0];
    let coords = head.split(":");

    coords[0] = parseInt(coords[0]) + direction[0]; // Shift y down by direction[0]
    coords[1] = parseInt(coords[1]) + direction[1]; // Shift x lefy by direction[1]

    head = coords[0] + SEPARATOR + coords[1];
    blocks = [head].concat(blocks);
    fill_block(head, true);

    return blocks;
}

// Delay time
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

main();