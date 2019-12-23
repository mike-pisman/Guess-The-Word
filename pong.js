const WINNING_SCORE = 2;
var acceleration = 1.5;

var canvas, ctx;
var ball_x, ball_y;
var ballSpeed, ballDirection = 0;
var ballMaxSpeed = 20;
var player1_y, player2_y;
var height;
var player2_speed;
var framesPerSecond = 60;
var time = framesPerSecond*4;

var score1 = 0, score2 = 0;
var showScore = false;
var ballRadius;
var sound_played = false;

var snd_win = new Audio("Sounds/win.wav");
var snd_lose = new Audio("Sounds/lose.wav");
var snd_left = new Audio("Sounds/left.wav");
var snd_right = new Audio("Sounds/right.wav");
var snd_timer = new Audio("Sounds/timer.wav");
var snd_go = new Audio("Sounds/go.wav");
var timer = ["GO!", "1", "2", "3"];

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    scaleWindow();

    ballRadius = canvas.height/75;
    ball_x = canvas.width/2;
    ball_y = canvas.height/2;
    player1_y = canvas.height/2;
    player2_y = canvas.height/2;

    setInterval(function() {
        scaleWindow();
        play();
        draw();
    }, 1000/framesPerSecond);

    //canvas.addEventListener('mousedown', handleMouseClick);
    canvas.addEventListener('mousemove',
        function(evt) {
            var mousePos = calculateMousePos(evt);
            player1_y = Math.min(Math.max(15, mousePos.y - (height/2)), canvas.height - 25 - height)
        });
}

function play() {
    height = (canvas.height - 20)/10;
    ballRadius = canvas.height/75;
    ballSpeed = (canvas.height / 100) * acceleration;
    player2_speed = canvas.height/200;

    if(showScore) {
        return;
    }

    computerMovement();

    if(time > 0) {
        time--;
        ball_x = canvas.width/2;
        ball_y = canvas.height/2;
    }
    else {
        ball_x += ballSpeed*Math.cos(ballDirection / 180 * Math.PI);
        ball_y += ballSpeed*Math.sin(ballDirection / 180 * Math.PI);
    }

    if(ball_x < 10 + canvas.width/100 + canvas.height/50) {
        if(ball_y > player1_y - ballRadius*2 && ball_y < player1_y + height + ballRadius*2) {
            var deltaY = ball_y - (player1_y + height/2);
            ballDirection = (180 - ballDirection) + deltaY*0.35;
            acceleration = Math.min(ballMaxSpeed, acceleration*1.05);
            snd_left.play();
        } else {
            score2++;
            ballDirection = 0;
            ballReset();
        }
    }
    if(ball_x > canvas.width*0.99 - 15 - canvas.height/50) {
        if(ball_y > player2_y - ballRadius*2 && ball_y < player2_y + height + ballRadius*2) {
            var deltaY = ball_y - (player2_y + height/2);
            ballDirection = (180 - ballDirection) + deltaY*0.35;
            acceleration = Math.min(ballMaxSpeed, acceleration*1.1);
            snd_right.play();
        } else {
            score1++;
            ballDirection = 180;
            ballReset();
        }
    }
    if(ball_y < 10 + canvas.height/50) {
        ballDirection =  - ballDirection;
    }
    if(ball_y > canvas.height - 10  - canvas.height/50) {
        ballDirection = - ballDirection;
    }
}

function computerMovement() {
    var player2_center = player2_y + height/2;

    if(player2_center < ball_y - height/4) {
        player2_y = Math.min(player2_y + player2_speed, canvas.height - 25 - height);
    } else if(player2_center > ball_y + height/2) {
        player2_y = Math.max(15, player2_y - player2_speed);
    }
}

function scaleWindow() {
    if(window.innerWidth/9*5 > window.innerHeight) {
        ctx.canvas.width  = window.innerHeight*9/5;
        ctx.canvas.height = window.innerHeight;
    }
    else
    {
        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerWidth/9*5;
    }
}

function draw() {
    ctx.font = "7px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Mikhail Pisman © 2019", canvas.width/2, canvas.height - 2);
    drawRect(0, 0, canvas.width,canvas.height ,'white', 1);

    if(showScore) {

        ctx.font = "" + canvas.height/10 + "px VT323";
        ctx.textAlign = "center";

        //ctx.fillStyle = 'grey';
        //ctx.fillText("Click to Continue", canvas.width/2, canvas.height/2 + canvas.height/20);

        if(score1 >= WINNING_SCORE) {
            if(!sound_played)
                snd_win.play();
            sound_played = true;
            ctx.fillStyle = "#81db89";
            ctx.fillText("You Win", canvas.width/2, canvas.height/2 - canvas.height/20);
            drawConfetti();
        }
        else if(score2 >= WINNING_SCORE){
            if(!sound_played)
                snd_lose.play();
            sound_played = true;
            ctx.fillStyle = "#db8781";
            ctx.fillText("You Lose", canvas.width/2, canvas.height/2 - canvas.height/20);
        }

        return;
    }
    else {

        drawRect(10, 10, canvas.width - 20, canvas.height - 20, "grey", 0);

        //dreawRect(0, 0, canvas.width, canvas.height, "#fff", 1);
        drawRect(10, 10, canvas.width - 20, canvas.height - 20, "grey", 0);

        ctx.fillStyle = "#f2f2f2"
        ctx.font = "" + canvas.height + "px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(score1, canvas.width*.1, canvas.height*.85);
        ctx.fillText(score2, canvas.width*.6, canvas.height*.85);

        drawNet();
        // this is left player paddle
        drawRect(15, player1_y, canvas.width/200, 10 + height, 'grey', 1);
        // this is right computer paddle
        drawRect(canvas.width - 15 - canvas.width/100, player2_y, canvas.width/200, 10 + height, 'grey', 1);
        // next line draws the ball
        drawCircle(ball_x, ball_y, ballRadius, 'grey');

        if(time > 0) {
            if(time/framesPerSecond == Math.ceil(time/framesPerSecond))
                if(Math.ceil(time/framesPerSecond) - 1 > 0)
                    snd_timer.play();
                else
                    snd_go.play();
            ctx.font = "" + canvas.height/4 + "px VT323";
            ctx.textAlign = "center";
            ctx.fillStyle = "black"
            ctx.fillText(timer[Math.ceil(time/framesPerSecond) - 1], canvas.width/2, canvas.height/2 + canvas.height/25);
        }
    }
}

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouse_x = evt.clientX - rect.left - root.scrollLeft;
    var mouse_y = evt.clientY - rect.top - root.scrollTop;
    return {
        x:mouse_x,
        y:mouse_y
    };
}
function handleMouseClick(evt) {
    /*if(showScore) {
        score1 = 0;
        score2 = 0;
        showScore = false;
        ballSpeed = 10;
        sound_played = false;
    }*/
}
function ballReset() {
    if(score1 >= WINNING_SCORE || score2 >= WINNING_SCORE)
        showScore = true;

        time = framesPerSecond * 4;

        acceleration = 1.5;
        ballSpeed = (canvas.height / 100) * acceleration;
        ball_x = canvas.width/2;
        ball_y = canvas.height/2;
}
function drawNet() {
    for(var i = 10; i < canvas.height - 10 - (canvas.height-20)/20; i += (canvas.height-20)/10) {
        drawRect(canvas.width/2-1, i + (canvas.height-10)/40, 2,(canvas.height-20)/20 ,'grey', 1);
    }
}
function drawCircle(x, y, r, c) {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, true);
    ctx.fill();
}
function drawRect(x, y, w, h, c, f) {
    ctx.fillStyle = c;
    ctx.strokeStyle = c;
    ctx.lineWidth = 2;
    if(f)
        ctx.fillRect(x, y, w, h);
    else
        ctx.strokeRect(x, y, w, h);
}
