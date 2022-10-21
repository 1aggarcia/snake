class Snake {
    constructor() {
        this.blocks['r7c10', 'r8c10', 'r9c10'];
        this.len = blocks.len;

        for (let i = 0; i < this.len; i++) {
            let block = document.getElementById(blocks[i]);
            block.className = "s_block";
        }
    }
}

module.exports.Snake = Snake;