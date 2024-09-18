const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let petImage = new Image();
petImage.src = 'DeadJeu.png';  // Ensure the image path is correct
petImage.onload = function() {
    requestAnimationFrame(gameLoop);  // Start the game loop once the image has loaded
};

let pet = {
    x: canvas.width / 2 - 25,  // Set initial position to center, half the width
    y: canvas.height - 30,  // Start from the bottom, height is 30
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
    speedY: 3
};

let score = 0;
let lives = 3;

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
    ctx.fillStyle = "#FF0FF0"; // The color of the ball is red
    ctx.fill();
    ctx.closePath();
}

function movePet() {
    if (pet.moveLeft && pet.x > 0) pet.x -= pet.speed;
    if (pet.moveRight && pet.x + pet.width < canvas.width) pet.x += pet.speed;
}

function moveBall() {
    ball.y += ball.speedY;
    if (ball.y + ball.radius >= pet.y && ball.x >= pet.x && ball.x <= pet.x + pet.width) {
        score++;
        resetBall();
    }
    if (ball.y > canvas.height) {
        lives--;
        if (lives === 0) {
            alert("Game over! Your score was: " + score);
            document.location.reload();  // Reload the document to restart the game
        } else {
            resetBall();
        }
    }
}

function resetBall() {
    ball.x = Math.random() * canvas.width;
    ball.y = 0;
}

function drawInfo() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFFFFF";  // The color of the text is white
    ctx.fillText("Score: " + score, 8, 20);
    ctx.fillText("Lives: " + lives, canvas.width - 80, 20);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPet();
    drawBall();
    drawInfo();
    movePet();
    moveBall();
    requestAnimationFrame(gameLoop);
}
