const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
// Display the game's name
context.font = "6px Arial";
context.textAlign = "center";
context.fillStyle = "white";
const scale = 5;
const size = canvas.width / scale;
context.fillText("Game Of Life", size / 2, size / 2);

let is_playing = 1;
let steps = 0;
let nb_of_cells = 10;
const nb_of_oc = 10;
let arena = createMatrix(size, size);
context.scale(scale, scale);

/*
 * Reset the matrix of cells and fill it again
 */
function gameReset() {
    arena = createMatrix(size, size);
    steps = 0;
    fill(nb_of_cells);
}

/*
 * Update the current matrix with the game of life's rules:
 * A current cell'll live if his neighbors are 3 or 2.
 * A cell will spawn if his neighbors are 3.
 */
function gameDrop() {
    var new_arena = createMatrix(size, size);
    arena.forEach((row, y) => {
        row.forEach((value, x) => {
            if (arena[y][x] === 0 && is_alive(x, y)) {
                new_arena[y][x] = 1;
            } else if (arena[y][x] !== 0) {
                new_arena[y][x] = is_dead(x, y) ? 1 : 0;
            }
        });
    });
    steps++;
    arena = new_arena;
}

/**
 * Boolean function => Check if a cell can live or not
 * It depends on the number of his neighbors (only 2 or 3)
 * @param {position x of the cell} x 
 * @param {position y of the cell} y 
 */
function is_dead(x, y) {
    let count = 0;
    for (let x2 = x - 1; x2 <= x + 1; ++x2) {
        if (x2 >= 0 && x2 < size) {
            if (y - 1 >= 0 && arena[y - 1][x2] !== 0) {
                count++;
            }
            if (arena[y][x2] !== 0 && x2 !== x) {
                count++;
            }
            if (y + 1 < size && arena[y + 1][x2] !== 0) {
                count++;
            }
        }
    }
    return count === 3 || count === 2;
}

/**
 * Boolean function => Check if a cell'll spawn
 * It depends on the number of his neighbors (only 3)
 * @param {position x of the cell} x 
 * @param {position y of the cell} y 
 */
function is_alive(x, y) {
    let count = 0;
    for (let x2 = x - 1; x2 <= x + 1; ++x2) {
        if (x2 >= 0 && x2 < size) {
            if (y - 1 >= 0 && arena[y - 1][x2] !== 0) {
                count++;
            }
            if (arena[y][x2] !== 0 && x2 !== x) {
                count++;
            }
            if (y + 1 < size && arena[y + 1][x2] !== 0) {
                count++;
            }
        }
    }
    return count === 3;
}

/**
 * Simple way to create and fill a matrix of 0.
 * @param {width} w 
 * @param {height} h 
 */
function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

/**
 * Draw a white board, then for each cell, draw a black square
 */
function draw() {
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

    arena.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = 'black';
                context.fillRect(x, y, 1, 1);
            }
        });
    });
    document.getElementById('steps').innerHTML = steps;
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

/**
 * Update the game every second
 */
function update(time = 0) {
    if (is_playing) {
        const deltaTime = time - lastTime;
        lastTime = time;
        dropCounter += deltaTime;
        if (dropCounter > dropInterval) {
            gameDrop();
            draw();
            dropCounter = 0;
        }
        requestAnimationFrame(update);
    }
}

/**
 * Grow randomly the cells
 * @param {position y} i 
 * @param {position x} j 
 * @param {number of occurence} n 
 */
function fill_rec(i, j, n) {
    if (n == nb_of_oc || i < 0 || j < 0 || i >= size || j >= size) {
        return;
    }
    arena[i][j] = 1;
    var where = getRandomInt(8);
    switch (where) {
        case 0:
            fill_rec(i - 1, j - 1, n + 1);
            break;
        case 1:
            fill_rec(i - 1, j, n + 1);
            break;
        case 2:
            fill_rec(i - 1, j + 1, n + 1);
            break;
        case 3:
            fill_rec(i, j + 1, n + 1);
            break;
        case 4:
            fill_rec(i + 1, j + 1, n + 1);
            break;
        case 5:
            fill_rec(i + 1, j, n + 1);
            break;
        case 6:
            fill_rec(i + 1, j - 1, n + 1);
            break;
        default:
            fill_rec(i, j - 1, n + 1);
            break;
    }
}

/**
 * Returns a random int beetween 0 and max
 * @param {*} max 
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

/**
 * Create nb cells randomly
 * @param {number of total cells} nb 
 */
function fill(nb) {
    var i = 0;
    while (i < nb) {
        fill_rec(getRandomInt(size), getRandomInt(size), 0);
        ++i;
    }
}

/**
 * Stop or resume the game
 */
function resume() {
    if (is_playing) {
        is_playing = 0;
        document.getElementById('stop').innerHTML = 'resume';
    } else {
        is_playing = 1;
        document.getElementById('stop').innerHTML = 'stop';
    }
    update();
}

/**
 * Modify the current step's speed
 * @param {Int which corresponds to an incrementing or a reducing } x 
 */
function modifySpeed(x) {
    dropInterval += x > 0 ? -500 : 500;
    console.log(x)
}

/**
 * Start the game
 */
function start() {
    gameReset();
    update();
}

/**
 * Create 4 spaceships instead of random cells
 */
function spaceships() {
    arena = createMatrix(size, size);
    steps = 0;

    for (let y = 0; y < 4; ++y) {
        arena[2 + y * size / 4][size - 2] = 1;
        arena[4 + y * size / 4][size - 2] = 1;
        arena[5 + y * size / 4][size - 3] = 1;
        arena[5 + y * size / 4][size - 4] = 1;
        arena[5 + y * size / 4][size - 5] = 1;
        arena[5 + y * size / 4][size - 6] = 1;
        arena[4 + y * size / 4][size - 6] = 1;
        arena[3 + y * size / 4][size - 6] = 1;
        arena[2 + y * size / 4][size - 5] = 1;
    }
    update();
}