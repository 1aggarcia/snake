const LEFT_KEY = 37;
const UP_KEY = 38;
const RIGHT_KEY = 39;
const DOWN_KEY = 40;

const W_KEY = 87;
const A_KEY = 65;
const S_KEY = 83;
const D_KEY = 68;

const POINTS = 50;
const SNAKE_CLASS = "s_block";
const FOOD_CLASS = "f_block";

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
        let scorebox = document.getElementById("scorebox");
        let start_btn = document.getElementById("start_btn");
        let header = document.getElementById("header");
        let difficulty = document.getElementById("difficulty");
        let snake = this

        start_btn.disabled = true;
        difficulty.disabled = true;
        header.innerHTML = "snek";
        scorebox.innerHTML = 0;

        for (let i = 0; i < this.blocks.length; i++) {
            fill_block(this.blocks[i], false);
        }
        
        fill_block(this.food, true);
        document.onkeydown = function(e){ checkKey(e, snake) };

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

        // Game over stuff
        header.innerHTML = "YOU DIED";
        start_btn.innerHTML = "Restart";
        start_btn.disabled = false;
        difficulty.disabled = false;

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
        } else if (old_blocks.includes(head)) { // if snake runs into itself
            if (head == old_blocks[1]) {
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
            this.blocks = [head].concat(old_blocks);
        }
    }

    // Generate random location for food
    gen_food() {
        let row = Math.floor(Math.random() * HEIGHT) + 1;
        let col = Math.floor(Math.random() * WIDTH) + 1;
        let food = row + SEPARATOR + col;

        // regenerate location if location overlaps with snake
        // console.logging bc its a rare occurence, I wanna see it happen
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

// Read key press, change direction if needed
function checkKey(e, snake) {
    e = e || window.event;

    switch(e.keyCode) {
        case LEFT_KEY:
        case A_KEY:
            snake.direction = [0, -1];
            break;
        case UP_KEY:
        case W_KEY:
            snake.direction = [-1, 0];
            break;
        case RIGHT_KEY:
        case D_KEY:
            snake.direction = [0, 1];
            break;
        case DOWN_KEY:
        case S_KEY:
            snake.direction = [1, 0];
            break;
        case 81: // secret key 1
            snake.direction = [-1, -1];
            break;
        case 69: // secret key 2
            snake.direction = [-1, 1];
            break
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
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}