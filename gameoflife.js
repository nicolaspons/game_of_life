var canvas, ctx, flag = false;
var prevX = 0;
var currX = 0;
var prevY = 0;
var currY = 0;
var dot_flag = false;

var size = 1000; //canvas.height;

var tab = new Array(size);
for (var i = 0; i < size; ++i) {
    tab[i] = new Array(size);
    for (var j = 0; j < size; ++j) {
        tab[i][j] = 0;
    }
}

/*
tab[50][50] = 1;
tab[0][0] = 1;
tab[0][1] = 1;
tab[99][99] = 1;
tab[39, 92] = 1;
*/

var x = "black",
    y = 10;

function start() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    canvas.addEventListener("mousemove", function(e) {
        findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function(e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function(e) {
        findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function(e) {
        findxy('out', e)
    }, false);


    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    draw_grid();

    //fill the tab
    fill(10);
    draw_tab();

    play();
}

// Clear the canvas for redrawing
function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

}

function play() {
    console.log("salut mec");
    clear();
    draw_tab();
    /*
    wait(5000);

    console.log("salut mec");
    clear();
    draw_tab();
    wait(5000);
    */
}

function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function fill_rec(i, j, n) {
    if (n == 4 || i < 0 || j < 0 || i >= size || j >= size) {
        return;
    }
    tab[i][j] = 1;
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

function fill(nb) {
    var i = 0;
    while (i < nb) {
        fill_rec(getRandomInt(100), getRandomInt(100), 0);
        ++i;
    }
}

function draw_grid() {
    for (var i = 0; i < size; i += 10) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, size);
        ctx.stroke();

        ctx.moveTo(0, i);
        ctx.lineTo(size, i);
        ctx.stroke();
    }
}

function draw_tab() {
    for (var i = 0; i < size; ++i) {
        for (var j = 0; j < size; ++j) {
            if (tab[i][j] == 1) {
                ctx.beginPath();
                ctx.moveTo(i * 10, j * 10 + y / 2);
                ctx.lineTo(i * 10 + 10, j * 10 + y / 2);
                ctx.strokeStyle = x;
                ctx.lineWidth = y;
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
}

function findxy(res, e) {
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            ctx.beginPath();
            ctx.fillStyle = x;
            ctx.fillRect(currX, currY, 10, 10);
            ctx.closePath();
            dot_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
        flag = false;
    }
    if (res == 'move') {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
            draw();
        }
    }
}