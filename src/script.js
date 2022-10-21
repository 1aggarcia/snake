const ROW = "r";
const COL = "c";
const WIDTH = 20;
const HEIGHT = 15;

function main() {
    build_grid(WIDTH, HEIGHT);

    let snake = new Snake();
    let tick_btn = document.getElementById("tick_btn")
    let dir_btn = document.getElementsByClassName("dir_btn");

    tick_btn.onclick = function() { snake.tick(); }
    dir_btn.onclick = function() { snake.redirect(dir_btn.id); }
    
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

}

main();