
var pieces = [];
var numberOfPieces = 100;

/*function createConfetti() {
    while (pieces.length < numberOfPieces) {
        pieces.push(new Piece(Math.random() * canvas.width, 0));
    }
}*/

function randomColor () {
    var colors = ['#f00', '#0f0', '#00f', '#0ff', '#f0f', '#ff0'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function drawConfetti () {

    while (pieces.length < numberOfPieces) {
        pieces.push(new Piece(Math.random() * canvas.width, - 20));
    }

    for (var i = 0; i < pieces.length; i++) {
        var p = pieces[i];

        if (p.y > canvas.height) {
            pieces.splice(i, 1);
            continue;
        }

        p.y += p.gravity;
        p.x += p.rotationSpeed;
        p.rotation += p.rotationSpeed;

        ctx.fillStyle = p.color;

        var a = p.x - p.width, b = p.y - p.height;
        var c = p.x + p.width, d = p.y - p.height;
        var h = p.x + p.width, j = p.y + p.height;
        var k = p.x - p.width, l = p.y + p.height;
        var r = p.rotation;

        ctx.beginPath();
            ctx.moveTo(Math.cos(r)*(a - p.x) + Math.sin(r)*(b - p.y) + p.x, -Math.sin(r)*(a - p.x) + Math.cos(r)*(b - p.y) + p.y);
            ctx.lineTo(Math.cos(r)*(c - p.x) + Math.sin(r)*(d - p.y) + p.x, -Math.sin(r)*(c - p.x) + Math.cos(r)*(d - p.y) + p.y);
            ctx.lineTo(Math.cos(r)*(h - p.x) + Math.sin(r)*(j - p.y) + p.x, -Math.sin(r)*(h - p.x) + Math.cos(r)*(j - p.y) + p.y);
            ctx.lineTo(Math.cos(r)*(k - p.x) + Math.sin(r)*(l - p.y) + p.x, -Math.sin(r)*(k - p.x) + Math.cos(r)*(l - p.y) + p.y);
        ctx.fill();
    }
}

function Piece (x, y) {
    this.x = x;
    this.y = y;
    this.width = Math.random() * 2;
    this.height = this.width * Math.random() * 4;
    this.gravity = (Math.random() + 1);
    this.rotation = 0; //(Math.PI * 2) * Math.random() / 2;
    this.rotationSpeed = (Math.random()*2 - 1) * 0.2;
    this.color = randomColor();
}
