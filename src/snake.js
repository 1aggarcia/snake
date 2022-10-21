const BLOCK_CLASS = "s_block";

class Snake {
    constructor() {
        this.blocks = ["r7c10", "r8c10", "r9c10"];
        this.len = this.blocks.length;

        this.down = 0;
        this.left = 1;
        this.eating = true;

        for (let i = 0; i < this.len; i++) {
            let block = document.getElementById(this.blocks[i]);
            block.className = BLOCK_CLASS;
        }
    }

    redirect(id) {
        switch (String(id)) {
            case "left":
                this.down = 0;
                this.left = 1;
            case "right":
                this.down = 0;
                this.left = -1;
            case "down":
                this.down = 1;
                this.left = 0;
            case "up":
                this.down = -1;
                this.left = 0;
        }
        console.log(this.down);
        console.log(this.left);
    }

    tick() {
        let head = this.blocks[0].substring(1);
        let coords = head.split("c");

        coords[0] = parseInt(coords[0]) + this.down;
        coords[1] = parseInt(coords[1]) + this.left;

        head = ROW + coords[0] + COL + coords[1];

        this.blocks = [head].concat(this.blocks);
        document.getElementById(head).className = BLOCK_CLASS;

        if (this.eating == false) {
            let tail = this.blocks.pop();
            document.getElementById(tail).className = "";
        } else {
            this.len += 1;
            this.eating = false;
        }

        console.log(this.blocks);
    }
}