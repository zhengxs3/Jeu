const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 获取 URL 参数中的游戏信息
const urlParams = new URLSearchParams(window.location.search);
const game = urlParams.get('game');

let petImage = new Image();
petImage.src = 'image/DeadJeu.png';  // 确保图像路径正确
petImage.onload = function() {
    requestAnimationFrame(gameLoop);  // 图像加载后启动游戏循环
};

let pet = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 30,
    width: 50,
    height: 30,
    speed: 5,
    moveLeft: false,
    moveRight: false
};

let ball = {
    x: Math.random() * canvas.width,
    y: 50,
    radius: 15,
    speedY: 3,  // 初始速度
    acceleration: 0.05  // 加速度，随着时间推移速度会越来越快
};

let score = 0;
let lives = 3;
let gameOver = false;  // 标志游戏是否结束

document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft") pet.moveLeft = true;
    if (event.key === "ArrowRight") pet.moveRight = true;
});

document.addEventListener("keyup", function(event) {
    if (event.key === "ArrowLeft") pet.moveLeft = false;
    if (event.key === "ArrowRight") pet.moveRight = false;
});

function drawPet() {
    ctx.drawImage(petImage, pet.x, pet.y, pet.width, pet.height);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#FF0FF0";  // 球的颜色
    ctx.fill();
    ctx.closePath();
}

function movePet() {
    if (pet.moveLeft && pet.x > 0) pet.x -= pet.speed;
    if (pet.moveRight && pet.x + pet.width < canvas.width) pet.x += pet.speed;
}

function moveBall() {
    ball.y += ball.speedY;
    ball.speedY += ball.acceleration;  // 每次循环都加速

    if (ball.y + ball.radius >= pet.y && ball.x >= pet.x && ball.x <= pet.x + pet.width) {
        score++;
        resetBall();
    }

    if (ball.y > canvas.height) {
        lives--;
        if (lives === 0) {
            gameOver = true;  // 游戏结束
            document.getElementById('alert-message').textContent = "Game over! Your score was: " + score;
            document.getElementById('overlay').style.display = "flex";  // 显示弹窗

            console.log('当前游戏:', game, '分数:', score);

        } else {
            resetBall();
        }
    }
}

function resetBall() {
    ball.x = Math.random() * canvas.width;
    ball.y = 0;
    ball.speedY = 3;  // 重置球的速度
}

function drawInfo() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFFFFF";  // 文字颜色
    ctx.fillText("Score: " + score, 8, 20);
    ctx.fillText("Lives: " + lives, canvas.width - 80, 20);
}

function gameLoop() {
    if (!gameOver) {  // 只有在游戏没有结束时才继续循环
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPet();
        drawBall();
        drawInfo();
        movePet();
        moveBall();
        requestAnimationFrame(gameLoop);  // 再次调用动画帧
    }
}

function redirectToNextPage() {

    const userData = { 
        score: score,
        game: game,  // 可选：记录是哪个游戏
    };
    
    console.log(userData)

    // Store user data in session storage
    try {
        sessionStorage.setItem('userData', JSON.stringify(userData));
        console.log('User data stored successfully:', userData);
    } catch (error) {
        console.error('Error storing user data:', error);
    }

    window.location.href = "p1Accueil.html";  // 跳转到你希望的页面
}

function restart() {
    document.location.reload();  // Reload the document to restart the game
}