const canvas = document.querySelector('.output_canvas');
const ctx = canvas.getContext('2d');
const playerScoreEl = document.getElementById('player-score');
const aiScoreEl = document.getElementById('ai-score');
const startScreen = document.getElementById('start-screen');
const gameStartBtn = document.getElementById('start-btn');
const speedSlider = document.getElementById('speed-slider');
const speedValue = document.getElementById('speed-value');

speedSlider.addEventListener('input', (e) => {
    let newSpeed = parseFloat(e.target.value);
    speedValue.innerText = newSpeed;
    if (!gameRunning) {
        ball.speed = newSpeed;
    }
});

let gameRunning = false;
let width = canvas.width;
let height = canvas.height;

const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const BALL_SIZE = 12;
const PADDLE_GLOW = '#0ff';
const AI_GLOW = '#f0f';

let score = { player: 0, ai: 0 };

let ball = {
    x: width / 2,
    y: height / 2,
    vx: 0,
    vy: 0,
    speed: parseFloat(speedSlider.value)
};

let aiPaddle = {
    y: height / 2
};

function resetBall(direction = -1) {
    ball.x = width / 2;
    ball.y = height / 2;
    // Serve towards player (direction = -1) or AI (direction = 1)
    ball.vx = direction * ball.speed;
    ball.vy = (Math.random() * 2 - 1) * (ball.speed * 0.8);
}

function update() {
    if (!gameRunning) return;

    let pLeft = window.playerSide === 'left';

    // AI Logic: smooth follow with some delay/imperfection
    let aiCenter = aiPaddle.y;
    let targetY = ball.y;
    
    // AI only starts moving when the ball is coming towards it
    if ((pLeft && ball.vx > 0) || (!pLeft && ball.vx < 0)) {
        // Simple lerp for smooth but beatable AI
        aiPaddle.y += (targetY - aiCenter) * 0.08;
    } else {
        // Return to center slowly
        aiPaddle.y += (height / 2 - aiCenter) * 0.02;
    }
    
    // Constrain AI paddle
    aiPaddle.y = Math.max(PADDLE_HEIGHT/2, Math.min(height - PADDLE_HEIGHT/2, aiPaddle.y));
    
    // Player paddle (from mediapipe)
    let playerY = window.playerPaddleY;
    // Constrain Player paddle
    playerY = Math.max(PADDLE_HEIGHT/2, Math.min(height - PADDLE_HEIGHT/2, playerY));

    let leftPaddleY = pLeft ? playerY : aiPaddle.y;
    let rightPaddleY = pLeft ? aiPaddle.y : playerY;

    // Ball movement
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Wall collision (top and bottom)
    if (ball.y <= BALL_SIZE || ball.y >= height - BALL_SIZE) {
        ball.vy *= -1;
        // Keep ball inside bounds
        ball.y = ball.y <= BALL_SIZE ? BALL_SIZE : height - BALL_SIZE;
    }

    // Paddle collision
    // Left paddle
    if (ball.x - BALL_SIZE <= 30 + PADDLE_WIDTH && ball.x - BALL_SIZE >= 20) {
        if (ball.y >= leftPaddleY - PADDLE_HEIGHT/2 && ball.y <= leftPaddleY + PADDLE_HEIGHT/2) {
            ball.vx = Math.abs(ball.vx); // bounce right
            let hitPoint = ball.y - leftPaddleY;
            ball.vy = (hitPoint / (PADDLE_HEIGHT/2)) * ball.speed;
            ball.speed = Math.min(ball.speed + 0.4, 15); // cap max speed
        }
    }
    
    // Right paddle
    if (ball.x + BALL_SIZE >= width - 30 - PADDLE_WIDTH && ball.x + BALL_SIZE <= width - 20) {
        if (ball.y >= rightPaddleY - PADDLE_HEIGHT/2 && ball.y <= rightPaddleY + PADDLE_HEIGHT/2) {
            ball.vx = -Math.abs(ball.vx); // bounce left
            let hitPoint = ball.y - rightPaddleY;
            ball.vy = (hitPoint / (PADDLE_HEIGHT/2)) * ball.speed;
            ball.speed = Math.min(ball.speed + 0.4, 15);
        }
    }

    // Scoring
    if (ball.x < -50) {
        if (pLeft) {
            score.ai++;
            aiScoreEl.innerText = score.ai;
        } else {
            score.player++;
            playerScoreEl.innerText = score.player;
        }
        ball.speed = parseFloat(speedSlider.value);
        gameRunning = false;
        setTimeout(() => {
            resetBall(-1);
            gameRunning = true;
        }, 1000);
    } else if (ball.x > width + 50) {
        if (pLeft) {
            score.player++;
            playerScoreEl.innerText = score.player;
        } else {
            score.ai++;
            aiScoreEl.innerText = score.ai;
        }
        ball.speed = parseFloat(speedSlider.value);
        gameRunning = false;
        setTimeout(() => {
            resetBall(1);
            gameRunning = true;
        }, 1000);
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw center line
    ctx.setLineDash([15, 20]);
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.setLineDash([]);
    
    let pLeft = window.playerSide === 'left';
    let playerY = Math.max(PADDLE_HEIGHT/2, Math.min(height - PADDLE_HEIGHT/2, window.playerPaddleY));
    
    let leftPaddleY = pLeft ? playerY : aiPaddle.y;
    let rightPaddleY = pLeft ? aiPaddle.y : playerY;
    let leftColor = pLeft ? PADDLE_GLOW : AI_GLOW;
    let rightColor = pLeft ? AI_GLOW : PADDLE_GLOW;

    // Glow settings for paddles
    ctx.shadowBlur = 25;
    
    // Draw Left Paddle
    ctx.shadowColor = leftColor;
    ctx.fillStyle = '#fff';
    ctx.fillRect(30, leftPaddleY - PADDLE_HEIGHT/2, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw Right Paddle
    ctx.shadowColor = rightColor;
    ctx.fillRect(width - 30 - PADDLE_WIDTH, rightPaddleY - PADDLE_HEIGHT/2, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw Ball
    if (gameRunning) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = ball.vx > 0 ? AI_GLOW : PADDLE_GLOW;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, BALL_SIZE, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.closePath();
    }
    
    // Reset shadow
    ctx.shadowBlur = 0;
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

gameStartBtn.addEventListener('click', () => {
    let pLeft = window.playerSide === 'left';
    
    // Swap scores in DOM if needed so player is always their color on their side
    if (pLeft) {
        document.querySelector('.score-board').appendChild(aiScoreEl);
    } else {
        document.querySelector('.score-board').appendChild(playerScoreEl);
    }

    startScreen.classList.remove('active');
    setTimeout(() => {
        resetBall(pLeft ? -1 : 1); // Serve to player first
        gameRunning = true;
    }, 500);
});

// Start rendering loop immediately (paddles will move even before start)
loop();
