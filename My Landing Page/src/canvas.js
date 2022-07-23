const CANVAS = document.getElementById("Canvas");
const CONTEXT = CANVAS.getContext("2d");
const HEADER = document.getElementById('Header');

CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;

window.addEventListener('resize', function(){
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;
});

var ball_size = 15;
var ball_speed = 20;
var ball_loc_x, ball_loc_y;  // ball location
var ball_dir_x, ball_dir_y; // ball direction

function init(){
    ball_loc_x = CANVAS.width / 2;
    ball_loc_y = CANVAS.height / 2;
    ball_dir_x = ball_speed;
    ball_dir_y = -ball_speed;
}

//draws rectangles (brick/paddle/bg)
function drawRect(color, x, y, w, h) {
    CONTEXT.fillStyle = color
    CONTEXT.beginPath()
    CONTEXT.rect(x, y, w, h)
    CONTEXT.fill()
    CONTEXT.stroke()
}
//draw circles (ball)
function drawCircle(color, x, y, r) {
    CONTEXT.fillStyle = color
    CONTEXT.beginPath()
    CONTEXT.arc(x, y, r, 0, 2 * Math.PI, false)
    CONTEXT.fill()
}
//bounce on canvas walls
function bounce(){
    //bounce on walls
    if (ball_loc_x - ball_size + ball_dir_x < 0 ||
            ball_loc_x + ball_size + ball_dir_x > CANVAS.width){
        ball_dir_x = -ball_dir_x;
    };
    if (ball_loc_y - ball_size + ball_dir_y < 0 ||
        ball_loc_y + ball_size + ball_dir_y > CANVAS.height){
        ball_dir_y = -ball_dir_y;
    };
}
//draw game details
function draw(){
    CONTEXT.globalAlpha = 0;
    //background
    drawRect('black', 0, 0, CANVAS.width, CANVAS.height);
    CONTEXT.globalAlpha = 1;
    //blackhole
    drawCircle('lightgray', ball_loc_x, ball_loc_y, ball_size);
    drawCircle('#1a1b1a', (ball_loc_x-1), (ball_loc_y-1), (ball_size-1));
    drawCircle('black', (ball_loc_x-2), (ball_loc_y-2), (ball_size-6));
}

//main update on interval
function updateGame(){
    draw();
    bounce();
    //ball movement
    // ball_loc_x += ball_dir_x;
    // ball_loc_y += ball_dir_y;
}

//movement
document.addEventListener("keydown", function(e){
    switch (e.keyCode) {
        case 37: //left
            if (ball_loc_x >= (ball_size/2)){
                ball_loc_x -= ball_dir_x;
                break;
            }
        case 38: //up
            if (ball_loc_y <= CANVAS.height - (ball_size/2)){
                ball_loc_y += ball_dir_y;
                break;
            }
        case 39: //right
            if (ball_loc_x <= CANVAS.width - (ball_size/2)){
                ball_loc_x += ball_dir_x;
                break;
            }
        case 40: //down
            if (ball_loc_y >= (ball_size/2)){
                ball_loc_y -= ball_dir_y;
                break;
            }
    };
});

init();
setInterval(() => {updateGame()}, 1000/30);