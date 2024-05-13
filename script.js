const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const now = new Date();
const blocks = [];
let GRAVITY = .02;
let VELMAX = 2;
let LIFT = .02;

const moveVel = {
    up: 0,
    down: 0,
    right: 0,
    left: 0,
}

const mouse = {
    x: null,
    y: null,
}

class greyBlock {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.top = y;
        this.bottom = y + height;
        this.left = x;
        this.right = x + width;
        this.color = 'grey'
    }
    draw() {
        ctx.fillStyle = 'hsl(200, 10%, 94%)';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class blackBlock {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.top = y;
        this.bottom = y + height;
        this.left = x;
        this.right = x + width;
        this.color = 'black';
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class blueBlock {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.top = y;
        this.bottom = y + height;
        this.left = x;
        this.right = x + width;
        this.color = 'blue';
    }
    draw() {
        ctx.fillStyle = 'hsl(200, 30%, 55%)';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}


class Player {
    constructor() {
        this.xPivot = canvas.width / 2;
        this.yPivot = canvas.height - 60;
        this.xHead = null;
        this.yHead = null;
        this.color = 'hsl(10, 100%, 50%)'
        this.vel = 0;
        this.decel = 0;
        this.inAir = false;
        this.jumpsRem = 3;

        this.oldAdj = null;
        this.oldOpp = null;
    }

    update() { // This is where physics engine and glide mechanics are
        // mouse is target
        // player is start
        // find path to move along with pythagorean theorem
        const dx = mouse.x - this.xPivot;
        const dy = mouse.y - this.yPivot;
        const hyp = Math.sqrt(dx*dx + dy*dy);
        const innerAng = Math.acos(dx / hyp);
        const outerAng = Math.asin(dy / hyp);
        let xVel = Math.cos(innerAng) * this.vel;
        let yVel = Math.sin(outerAng) * this.vel;

        if (!this.inAir) {
            this.reset();
        }
        else if (Math.sin(outerAng) < 0) {
            this.vel -= (GRAVITY - LIFT * Math.abs(Math.cos(innerAng) - .01));
        }
        else {
            this.vel += (GRAVITY - LIFT * Math.abs(Math.cos(innerAng) + .01));
        }

        // Handle environment boundaries
        for (let i = 0; i < blocks.length; i++) {
            if (!this.withinBox(xVel, yVel, blocks[i])) {
                    this.xPivot += xVel;
                    this.yPivot += yVel;
                }
            else if (this.yPivot >= blocks[i].top || this.yHead >= blocks[i].top) {
                if(blocks[i].color == 'blue') {
                    this.yHead >= blocks[i].top && this.vel > 0 ? this.vel *= -0.5 : null;
                }
                else if (blocks[i].color == 'grey') {
                    this.reset();
                }  
            }
        }

        this.drawTail(xVel, yVel);
    }

    jump() {
        if (this.jumpsRem > 0) {
            this.inAir ? this.vel = 1 : this.vel = 1;
            this.inAir = true;
            this.jumpsRem--;
        }
    } 

    reset() {
        this.inAir = false;
        this.vel = 0;
        this.jumpsRem = 2;
    }

    withinBox(xVel, yVel, block) {
        return (this.xPivot + xVel <= block.right ||
            this.xHead + xVel <= block.right) &&
           (this.xPivot + xVel >= block.left ||
                this.xHead + xVel >= block.left) && 
           (this.yPivot + yVel >= block.top ||
                this.yHead + xVel >= block.top) &&
           (this.yPivot + yVel <= block.bottom ||
                this.yHead + xVel <= block.bottom);
    }

    draw() {
        //ctx.fillStyle = 'hsl(198, 60%, 0%)';
        //ctx.fillRect(this.x, this.y, 10, 10);
        ctx.fillStyle = 'hsl(148, 60%, 85%)';
        // The origin is where the front point of the player is
        let adj = mouse.x - this.xPivot;
        let opp = mouse.y - this.yPivot;
        if (Math.abs(adj) < 20 && Math.abs(opp) < 20) {
            if (Math.abs(adj) < 20) adj = this.oldAdj;
            if (Math.abs(opp) < 20) opp = this.oldOpp;
        }
        else {
            this.oldAdj = adj;
            this.oldOpp = opp;
        }
        const ang = Math.atan2(opp, adj);
        // Head
        const v1x = this.xPivot + Math.cos(ang) * 20;
        const v1y = this.yPivot + Math.sin(ang) * 20;
        this.xHead = v1x;
        this.yHead = v1y;
        // Right corner
        const v2x = this.xPivot + Math.cos(Math.PI / 2 - ang) * 10;
        const v2y = this.yPivot - Math.sin(Math.PI / 2 - ang) * 10;
        // Left corner
        const v3x = this.xPivot - Math.cos(Math.PI / 2 - ang) * 10;
        const v3y = this.yPivot + Math.sin(Math.PI / 2 - ang) * 10;

        ctx.beginPath();
        ctx.moveTo(v1x, v1y);
        ctx.lineTo(v2x, v2y);
        ctx.lineTo(v3x, v3y);
        ctx.closePath();
        ctx.fill();
        
    }

    drawTail(xVel, yVel) {
        // Draw the trailing line
        ctx.strokeStyle = 'hsl(158, 33%, 33%)';
        ctx.beginPath();
        const startX = this.xPivot - xVel * 10;
        const startY = this.yPivot - yVel * 10;
        ctx.moveTo(startX, startY);
        const cpx = this.xPivot - xVel * 20;
        const cpy = this.yPivot - yVel * 20;
        if (this.vel < 0) {
            ctx.quadraticCurveTo(cpx, cpy, this.xPivot + xVel * 100, this.yPivot + yVel * 100);
        }
        else ctx.quadraticCurveTo(cpx, cpy, this.xPivot - xVel * 100, this.yPivot - yVel * 100);
        ctx.stroke();
    }
}
let player = new Player();

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('resize', function() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
});

window.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        player.jump();
        console.log('Space pressed');
    }
});


function handlePlayer() {
    player.update();
    player.draw();
}











// Game Environment
blocks.push(new greyBlock(0, canvas.height / 1.09, canvas.width, 100));
blocks.push(new greyBlock(0, canvas.height / 2, 110, 110));
blocks.push(new blueBlock(500, canvas.height / 6, 110, 110));
function gameEnv() {
    for (let i = 0; i < blocks.length; i++) {
        blocks[i].draw();
    }
}






function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = 'rgba(0,0,0,.1)';
    // ctx.fillRect(0, 0, canvas.width, canvas.height)
    handlePlayer();
    gameEnv();
    requestAnimationFrame(animate);
}
animate();