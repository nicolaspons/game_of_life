const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const size = canvas.width / 10
let arena = createMatrix(size, size);
context.scale(10, 10);

function gameReset() {
    arena = createMatrix(size, size);
    fill(10);
}

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
    arena = new_arena;
}

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

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

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
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0) {
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

function fill_rec(i, j, n) {
    if (n == 4 || i < 0 || j < 0 || i >= size || j >= size) {
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

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function fill(nb) {
    var i = 0;
    while (i < nb) {
        fill_rec(getRandomInt(size), getRandomInt(size), 0);
        ++i;
    }
}

gameReset();
update();