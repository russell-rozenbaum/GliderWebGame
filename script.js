const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const now = new Date();
const blocks = [];

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

class blackBlock {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.top = y;
        this.bottom = y - height;
        this.left = x;
        this.right = x + width;
    }
    draw() {
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}


class Player {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height - 60;
        this.color = 'hsl(10, 100%, 50%)'
        this.vel = 0;
        this.dir = null;
        this.top = this.y + 5;
        this.bottom = this.y - 5;
        this.left = this.x - 25;
        this.right = this.x + 25;
    }
    

    update() { 
        // mouse is target
        // player is start
        // find path to move along with pythagorean theorem
        const adj = mouse.x - this.x;
        const opp = mouse.y - this.y;
        console.log(opp);
        const hyp = Math.sqrt(opp*opp + adj*adj);
        const innerAng = Math.acos(adj / hyp);
        const outerAng = Math.asin(opp / hyp);
        let xVel = Math.cos(innerAng) * this.vel;
        let yVel = Math.sin(outerAng) * this.vel;
        for (let i = 0; i < blocks.length; i++) {
            if (!((this.left + xVel <= blocks[i].right) &&
                (this.right + xVel >= blocks[i].left))) {
                    this.x += xVel;
                    
                }
            console.log(blocks[i].bottom);
            console.log(this.top);
        }
        // (yVel > 0.5) ? this.vel += 0.055 : null;
        this.y += yVel;
        (this.vel > 0.1) ? this.vel -= 0.05 : this.vel = 0;
        this.top = this.y + 5;
        this.bottom = this.y - 5;
        this.left = this.x - 25;
        this.right = this.x + 25;
    }

    jump() {
        this.vel = 4;
    } 

    draw() {
        ctx.fillStyle = 'hsl(198, 60%, 0%)';
        ctx.fillRect(this.x, this.y, 10, 10);
        ctx.fillStyle = 'hsl(198, 60%, 65%)';
        // The origin is where the front point of the player is
        const adj = mouse.x - this.x;
        const opp = mouse.y - this.y;
        const ang = Math.atan2(opp, adj);
        console.log(ang);

        const v1x = this.x + Math.cos(ang) * 20;
        const v1y = this.y + Math.sin(ang) * 20;
        // Right corner
        const v2x = this.x + Math.cos(Math.PI / 2 - ang) * 10;
        const v2y = this.y - Math.sin(Math.PI / 2 - ang) * 10;
        // Left corner
        const v3x = this.x - Math.cos(Math.PI / 2 - ang) * 10;
        const v3y = this.y + Math.sin(Math.PI / 2 - ang) * 10;

        

        ctx.beginPath();

        ctx.moveTo(v1x, v1y);

        ctx.lineTo(v2x, v2y);
        ctx.lineTo(v3x, v3y);

        ctx.closePath();
        ctx.fill();
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
    player.updateWhenResized();
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
blocks.push(new blackBlock(0, canvas.height / 2, 110, 110));
blocks.push(new blackBlock(0, canvas.height / 2, 110, 110));
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