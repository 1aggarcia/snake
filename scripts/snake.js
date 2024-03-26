const POINTS = 50;
const SNAKE_CLASS = "s_block";
const FOOD_CLASS = "f_block";

const scorebox = document.getElementById("scorebox");

const upBtn = document.getElementById("upBtn");
const downBtn = document.getElementById("downBtn");
const rightBtn = document.getElementById("rightBtn");
const leftBtn = document.getElementById("leftBtn");

class Snake {
    // Constructor for Snake class
    constructor(start_len, speed) {
        this.blocks = this.gen_snake(WIDTH, HEIGHT, start_len);
        this.food = this.gen_food();
        this.speed = speed;

        this.direction = [-1, 0]; // encoded as [downShift, rightShift]
        this.score = 0;
        this.alive = true;
    }

    // Function holding snake vars
    async run() {
        scorebox.innerHTML = 0;

        for (let i = 0; i < this.blocks.length; i++) {
            fill_block(this.blocks[i], false);
        }
        
        fill_block(this.food, true);
        document.addEventListener("keydown", e => {
            const direction = readDirectionFromKey(e);
            if (direction !== null) {
                this.direction = direction;
            }
        });

        upBtn.onclick = () => this.direction = [-1, 0];
        downBtn.onclick = () => this.direction = [1, 0];
        rightBtn.onclick = () => this.direction = [0, 1];
        leftBtn.onclick = () => this.direction = [0, -1];


        // Tick loop
        while (this.alive) {
            await delay(this.speed);
            this.tick(); // move head, add to block array

            // add point if eating food
            if (this.blocks[0] === this.food) {
                this.food = this.gen_food();
                fill_block(this.food, true);
                this.score += POINTS;
                scorebox.innerHTML = this.score;
            } else if (this.alive) {
                let tail = this.blocks.pop();
                clear_block(tail);
            }
        }

        return this.score;
    }

    // Move head of snake forward
    tick() {
        let old_blocks = this.blocks;
        let head = old_blocks[0];
        let coords = head.split(SEPARATOR);

        coords[0] = parseInt(coords[0]) + this.direction[0]; // Shift y down by direction[0]
        coords[1] = parseInt(coords[1]) + this.direction[1]; // Shift x right by direction[1]
        head = coords[0] + SEPARATOR + coords[1];

        if (0 >= coords[0] || coords[0] > HEIGHT || 0 >= coords[1] || coords[1] > WIDTH) {
            // Kill snake if head is out of bounds
            this.alive = false;
        } else if (this.blocks.includes(head)) { // if snake runs into itself
            if (head == this.blocks[1]) {
                // if snake reverses direction, reverse it back
                this.invertDirection();
                this.tick();
                console.log("Attempted Suicide @ " + head);
            } else {
                // if snake runs into itself otherwise, kill it
                this.alive = false;
            }
        } else {
            fill_block(head, false);
            this.blocks.unshift(head); //= [head].concat(old_blocks);
        }
    }

    // Generate random location for food
    gen_food() {
        let row = Math.floor(Math.random() * HEIGHT) + 1;
        let col = Math.floor(Math.random() * WIDTH) + 1;
        let food = row + SEPARATOR + col;

        // regenerate location if location overlaps with snake
        if (this.blocks.includes(food)) {
            console.log("Food Regen (food position was on the snake)");
            return this.gen_food();
        } else {
            return food;
        }
    }

    // Generate & return initial snake
    gen_snake(width, height, length) {
        let row = Math.floor(height / 2);
        let col = Math.floor(width / 2);
        let blocks = [];
        
        for (let i = 0; i < length; i++) {
            blocks.push(row + SEPARATOR + col);
            row++;
        }
        return blocks;
    }

    // Reverse direction of snake
    invertDirection() {
        this.direction[0] *= -1;
        this.direction[1] *= -1;       
    }
}

/**
 * Interpret a key press as either a new direction or null,
 * if the keypress does not coorespond to a key
 */
function readDirectionFromKey(e) {
    switch(e.code) {
        case "ArrowLeft":
        case "KeyA":
            return [0, -1];
        case "ArrowUp": 
        case "KeyW":
            return [-1, 0];
        case "ArrowRight":
        case "KeyD":
            return [0, 1];
        case "ArrowDown":
        case "KeyS":
            return [1, 0];
        case "KeyQ": // secret key 1
            return [-1, -1];
        case "KeyE": // secret key 2
            return [-1, 1];
        default:
            return null;
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

// Delay time
function delay(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

/*
Versión funcional:

runSnakeGame() {
    snake = genSnake(3)
    xDir = 0
    yDir = 0
    score = 0
    alive = T

    addEventListener(changeDir)

    while (alive) {
        sleep()
        snake = advance(xDir, yDir)

        if (dead()) {
            alive = F
            break
        }

        if (eating()) {
            point ++
        }

        redraw(snake)
    }

    return score;
}
*/
