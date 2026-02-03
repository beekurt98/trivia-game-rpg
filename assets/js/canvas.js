// Canvas and animation logic
import { gameState } from './game.js';

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

// Hero images
const idleImg = new Image();
idleImg.src = './assets/images/hero/Idle.png';
const attackImg = new Image();
attackImg.src = './assets/images/hero/Attack1.png';
const takeHitImg = new Image();
takeHitImg.src = './assets/images/hero/TakeHit.png';
const deathImg = new Image();
deathImg.src = './assets/images/hero/Death.png';

// Enemy images
const enemyIdleImg = new Image();
enemyIdleImg.src = "./assets/images/enemy2/EnemyIdle.png";
const enemyAttackImg = new Image();
enemyAttackImg.src = "./assets/images/enemy2/EnemyAttack.png";
const enemyTakeHitImg = new Image();
enemyTakeHitImg.src = "./assets/images/enemy2/EnemyTakeHit.png";
const enemyDeathImg = new Image();
enemyDeathImg.src = "./assets/images/enemy2/EnemyDeath.png";

// Background
const backgroundImg = new Image();
backgroundImg.src = './assets/images/bg.png';
backgroundImg.onerror = () => {
    console.error("Background image failed to load.");
};

// Animation state
let animationId;
export let currentAnimation = "idle";
export let currentEnemyAnimation = "enemyIdle";

const heroFrameWidth = 1600 / 8;
const heroFrameHeight = 200;
const enemyFrameWidth = 1200 / 8;
const enemyFrameHeight = 150;

let heroFrameIndex = 0;
let enemyFrameIndex = 0;
let lastTime = 0;
const fps = 10;

// Animation configurations
const animations = {
    idle: {
        image: idleImg,
        frameCount: 8,
        posX: 30,
        posY: (canvas.height / 2) - 55,
    },
    attack: {
        image: attackImg,
        frameCount: 6,
        posX: 30,
        posY: (canvas.height / 2) - 55
    },
    takeHit: {
        image: takeHitImg,
        frameCount: 4,
        posX: 30,
        posY: (canvas.height / 2) - 55
    },
    death: {
        image: deathImg,
        frameCount: 6,
        posX: 30,
        posY: (canvas.height / 2) - 55
    },
};

const enemyAnimations = {
    enemyIdle: {
        image: enemyIdleImg,
        frameCount: 8,
        posX: 190,
        posY: (canvas.height / 2) - 45
    },
    enemyAttack: {
        image: enemyAttackImg,
        frameCount: 8,
        posX: 190,
        posY: (canvas.height / 2) - 45
    },
    enemyTakeHit: {
        image: enemyTakeHitImg,
        frameCount: 4,
        posX: 190,
        posY: (canvas.height / 2) - 45
    },
    enemyDeath: {
        image: enemyDeathImg,
        frameCount: 5,
        posX: 190,
        posY: (canvas.height / 2) - 45
    }
};

export function setHeroAnimation(anim) {
    currentAnimation = anim;
    heroFrameIndex = 0;
}

export function setEnemyAnimation(anim) {
    currentEnemyAnimation = anim;
    enemyFrameIndex = 0;
}

export function stopAnimation() {
    cancelAnimationFrame(animationId);
}

export function resetAnimations() {
    currentAnimation = "idle";
    currentEnemyAnimation = "enemyIdle";
    heroFrameIndex = 0;
    enemyFrameIndex = 0;
    lastTime = 0;
}

export function displayEndGameText(message) {
    ctx.save();
    ctx.font = "30px 'Press Start 2P'";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    ctx.font = "20px 'Press Start 2P'";
    ctx.fillText(`Score: ${gameState.score}`, canvas.width / 2, canvas.height / 2 + 40);
    ctx.restore();
}

function freezeDeathAnimation() {
    if (currentAnimation === "death") {
        heroFrameIndex = animations.death.frameCount - 1;
    }
    if (currentEnemyAnimation === "enemyDeath") {
        enemyFrameIndex = enemyAnimations.enemyDeath.frameCount - 1;
    }
}

export function animate(time) {
    if (time - lastTime >= 1000 / fps) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(backgroundImg, 0, -80);

        // Draw UI text
        ctx.font = "25px 'Press Start 2P'";
        ctx.fillStyle = "#001a23";
        ctx.fillText(gameState.hearts, 30, 45);
        ctx.fillText(gameState.monsterHearts, 370, 45);
        ctx.font = "15px 'Press Start 2P'";
        ctx.fillText(`Round: ${gameState.currentRound}`, canvas.width / 2 - 50, 35);

        // Draw hero
        const heroAnim = animations[currentAnimation];
        ctx.drawImage(
            heroAnim.image,
            heroFrameIndex * heroFrameWidth,
            0,
            heroFrameWidth,
            heroFrameHeight,
            heroAnim.posX,
            heroAnim.posY,
            heroFrameWidth * 1.1,
            heroFrameHeight * 1.1
        );

        // Draw enemy (flipped)
        ctx.save();
        ctx.scale(-1, 1);
        const enemyAnim = enemyAnimations[currentEnemyAnimation];
        const flippedPosX = -(enemyAnim.posX + enemyFrameWidth);
        ctx.drawImage(
            enemyAnim.image,
            enemyFrameIndex * enemyFrameWidth,
            0,
            enemyFrameWidth,
            enemyFrameHeight,
            flippedPosX,
            enemyAnim.posY,
            enemyFrameWidth * 1.2,
            enemyFrameHeight * 1.2
        );
        ctx.restore();

        // Update frame indices
        heroFrameIndex++;
        enemyFrameIndex++;

        if (heroFrameIndex >= heroAnim.frameCount) {
            if (currentAnimation !== "idle" && currentAnimation !== "death") {
                currentAnimation = "idle";
            }
            if (currentAnimation === "death") {
                heroFrameIndex = heroAnim.frameCount - 1;
            } else {
                heroFrameIndex = 0;
            }
        }

        if (enemyFrameIndex >= enemyAnim.frameCount) {
            if (currentEnemyAnimation !== "enemyIdle" && currentEnemyAnimation !== "enemyDeath") {
                currentEnemyAnimation = "enemyIdle";
            }
            if (currentEnemyAnimation === "enemyDeath") {
                enemyFrameIndex = enemyAnim.frameCount - 1;
            } else {
                enemyFrameIndex = 0;
            }
        }

        lastTime = time;
    }
    animationId = requestAnimationFrame(animate);
}

export function startAnimation() {
    resetAnimations();
    requestAnimationFrame(animate);
}
