const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const overlay = document.getElementById("overlay");
const alertMessage = document.getElementById("alert-message");

// 获取 URL 参数中的游戏信息
const urlParams = new URLSearchParams(window.location.search);
const game = urlParams.get('game');

let blocks = [];
let currentBlock = null;
let isMovingRight = true;
let gameOver = false;
let score = 0;
let blockSpeed = 3;
let blockHeight = 30;
let blockWidth = 100;
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

class Block {
    constructor(y, width, xSpeed) {
        this.y = y;
        this.width = width;
        this.height = blockHeight;
        this.x = Math.random() * (canvasWidth - width);
        this.xSpeed = xSpeed;
        this.color = this.randomColor();
    }

    randomColor() {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return `rgb(${r},${g},${b})`;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move() {
        if (isMovingRight) {
            this.x += this.xSpeed;
            if (this.x + this.width > canvasWidth) {
                isMovingRight = false;
            }
        } else {
            this.x -= this.xSpeed;
            if (this.x < 0) {
                isMovingRight = true;
            }
        }
    }
}

function createNewBlock() {
    const newBlock = new Block(canvasHeight - blocks.length * blockHeight - blockHeight, blockWidth, blockSpeed);
    currentBlock = newBlock;
}

function drawBlocks() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    blocks.forEach(block => block.draw());
    if (currentBlock) {
        currentBlock.move();
        currentBlock.draw();
    }
}

function placeBlock() {
    if (!currentBlock) return;

    let newBlockWidth = blockWidth;

    if (blocks.length > 0) {
        const lastBlock = blocks[blocks.length - 1];
        const overlap = Math.min(lastBlock.x + lastBlock.width, currentBlock.x + currentBlock.width) - Math.max(lastBlock.x, currentBlock.x);
        
        if (overlap > 0) {
            currentBlock.width = overlap;
            currentBlock.x = Math.max(lastBlock.x, currentBlock.x);
            blocks.push(currentBlock);
            score++;
            scoreElement.textContent = `Score: ${score}`;
            newBlockWidth = overlap;  // Use the overlap for the next block's width
        } else {
            endGame();
            return;
        }
    } else {
        blocks.push(currentBlock);
        score++;
        scoreElement.textContent = `Score: ${score}`;
    }

    blockWidth = Math.max(newBlockWidth - 5, 50); // Reduce block width each time but maintain a minimum width of 50
    currentBlock = null;
}

function endGame() {
    gameOver = true;
    alertMessage.textContent = "Game over! Your score was: " + score;
    overlay.style.display = "flex";  // 显示弹窗
}

function restartGame() {
    blocks = [];
    currentBlock = null;
    isMovingRight = true;
    gameOver = false;
    score = 0;
    blockSpeed = 3;
    blockWidth = 100;
    scoreElement.textContent = `Score: ${score}`;
    overlay.style.display = "none"; // 隐藏弹窗
    createNewBlock();
}

function redirectToNextPage() {
    const userData = { 
        score: score,
        game: "Stacking Block Game"  // Use a fixed name for the game
    };
    
    console.log(userData);

    // Store user data in session storage
    try {
        sessionStorage.setItem('userData', JSON.stringify(userData));
        console.log('User data stored successfully:', userData);
    } catch (error) {
        console.error('Error storing user data:', error);
    }

    window.location.href = "p1Accueil.html";  // 跳转到你希望的页面
}

function gameLoop() {
    if (!gameOver) {
        drawBlocks();
        if (!currentBlock) {
            createNewBlock();
        }
    }
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        if (gameOver) {
            restartGame();
        } else {
            placeBlock();
        }
    }
});

gameLoop();
