//import {Snake} from "snake.js";

const ROW = "r";
const COL = "c";
const WIDTH = 20;
const HEIGHT = 15;

function main() {
    build_grid(WIDTH, HEIGHT);
}

function build_grid(width, height) {
    let table = document.getElementById("grid");
    let id;
    let html = "";

    for (let r = 1; r < height+1; r++) {
        html += "<tr>\n";
        for (let c = 1; c < width+1; c++) {
            id = ROW + r + COL + c;
            html += "<td id ='" + id + "'></td>\n";
        }
        html += "</tr>"
    }

    table.innerHTML = html;
    init_snake();
}

function init_snake() {
    let r = Math.floor(HEIGHT / 2);
    let c = Math.floor(WIDTH / 2);
    let start_len = 3;
    let head_id;
    let head;

    for (let i = 0; i < start_len; i++) {
        head_id = ROW + (r+i) + COL + c;
        head = document.getElementById(head_id);
        head.className = "s_block";
    }
}

main();