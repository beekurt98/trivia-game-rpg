// import { currentAnimation, frameIndex } from "./canvas.js"

// sound: "/Trivia Game/assets/sfx/select.mp3"

let questionNumStore = []
// const scoreInfo = document.querySelector(".score")
const userHeartsDiv = document.querySelector(".user-hearts")
const monsterHeartsDiv = document.querySelector(".monster-hearts")
const roundDiv = document.querySelector(".round")
let data;


// score keeper:
let score = 0;
let currentRound = 1;
let roundInfo = {
    "round": 1,
    "user": 3,
    "monster": 5, // this is the question count
}
let hearts = roundInfo.user;
let monsterHearts = roundInfo.monster;

userHeartsDiv.innerHTML = `User Hearts: ${roundInfo.user}`

monsterHeartsDiv.innerHTML = `Monster Hearts: ${roundInfo.monster}`


// random number generator

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// overall trivia control

async function init() {
    const datas = await fetch('./data.json').then(x => x.json())
    data = datas;
    getQuestions()
}
const questionCont = document.querySelector("#question-container")

function getQuestions() {

    let questionNum = randomNum(0, data.length)

    questionNumStore.includes(questionNum) ? questionNum = randomNum(0, data.length) : questionNumStore.push(questionNum)
    let currentQuestion = data[questionNum]
    questionCont.innerHTML = `
    <div class="question-div">
        <div class="question">Q. ${currentQuestion.question}</div>
        <p class="answer A">A. ${currentQuestion.A}</p>
        <p class="answer B">B. ${currentQuestion.B}</p>
        <p class="answer C">C. ${currentQuestion.C}</p>
        <p class="answer D">D. ${currentQuestion.D}</p>
        <p class="">Correct: ${currentQuestion.answer}</p>
    </div>`
    bindEvents(currentQuestion.answer);
}

export let answerStatus;

function bindEvents(correctAnswer) {
    const answers = document.querySelectorAll(".answer")
    answers.forEach((answer) => {
        checkIfGameEnds()
        answer.addEventListener("click", () => {
            let chosenAnswer = answer.className.split(' ')[1]
            if (correctAnswer === chosenAnswer) {
                answer.style.backgroundColor = "green"
                answer.innerHTML += `<span class="alert"> CORRECT!</span>`
                score++;
                // takes hit
                if (currentAnimation === "idle") {
                    currentAnimation = "attack";
                    heroFrameIndex = 0;
                }
                setTimeout(() => {
                    if (currentEnemyAnimation === "enemyIdle") {
                        currentEnemyAnimation = "enemyTakeHit";
                        enemyFrameIndex = 0;
                    }
                }, 300);
                
                // score data
                monsterHearts--
                setTimeout(() => {
                    showScore(hearts, monsterHearts)
                    checkIfGameEnds()
                    getQuestions(data)
                    return;
                }, 1000);

            } else {
                answer.style.backgroundColor = "red"
                answer.innerHTML += `<span class="alert"> WRONG!</span>`
                hearts--;
                if (currentAnimation === "idle") {
                    currentAnimation = "takeHit"
                    heroFrameIndex = 0;
                }
                
                if (currentEnemyAnimation === "enemyIdle") {
                    currentEnemyAnimation = "enemyAttack";
                    enemyFrameIndex = 0;
                }
                setTimeout(() => {
                    showScore(hearts, monsterHearts)
                    checkIfGameEnds()
                    getQuestions(data)
                    return;
                }, 1000);
            }
        })
    })
}

function showScore(user, monster) {
    userHeartsDiv.innerHTML = `User Score: ${user}`
    monsterHeartsDiv.innerHTML = `Monster Hearts: ${monster}`
}

function checkIfGameEnds() {
    if (score == 35) {
        questionCont.remove();
        const gameWonInfo = document.createElement("div");
        gameWonInfo.classList.add("game-end");
        gameWonInfo.innerHTML = `<p class="indicator-text">Congrats, you won!</p>
        <p>Your Score: ${score}</p>
        <button class="play-again-btn">Play Again</button>
        `
        document.querySelector(".main-cont").appendChild(gameWonInfo)
        
        if (currentEnemyAnimation === "enemyIdle") {
            currentEnemyAnimation = "enemyDeath";
            enemyFrameIndex = 0;
        }
        stopAnimation()
        displayEndGameText("You Win!");
        
        freezeDeathAnimation();
        addPlayAgainButtonHandler();
    } else if (monsterHearts == 0) {
        // round ends, proceed to next round
        currentRound++
        roundDiv.innerHTML = `Round: ${currentRound}`
        hearts = roundInfo.user + 2;
        monsterHearts = roundInfo.monster * 2;
        showScore(hearts, monsterHearts)
        return;
    } else if (hearts == 0) {
        // game ends
        questionCont.remove();
        const gameOverInfo = document.createElement("div");
        gameOverInfo.classList.add("game-end")
        gameOverInfo.innerHTML = `<p class="indicator-text">Game Over</p>
        <p>Your Score: ${score}</p>
        <button class="play-again-btn">Play Again</button>
        `
        document.querySelector(".main-cont").appendChild(gameOverInfo)

        if (currentAnimation === "idle") {
            console.log(heroFrameIndex)
            currentAnimation = "death";
            heroFrameIndex = 0;
        }
        stopAnimation()
        displayEndGameText("Game Over");
        
        freezeDeathAnimation();
        addPlayAgainButtonHandler();
    }
}
function addPlayAgainButtonHandler() {
    const playAgainBtn = document.querySelector(".play-again-btn");
    playAgainBtn.addEventListener("click", () => {
        // Reset game state
        score = 0;
        currentRound = 1;
        hearts = roundInfo.user;
        monsterHearts = roundInfo.monster;
        questionNumStore = [];
        
        // Reset UI
        roundDiv.innerHTML = `Round: ${currentRound}`;
        userHeartsDiv.innerHTML = `User Hearts: ${hearts}`;
        monsterHeartsDiv.innerHTML = `Monster Hearts: ${monsterHearts}`;
        
        // Clear game end screen
        document.querySelector(".game-end").remove();
        
        // Reinitialize the game
        init();
    });
}

// Freeze death animations on the last frame
function freezeDeathAnimation() {
    if (currentAnimation === "death") {
        heroFrameIndex = animations.death.frameCount - 1;
    }
    if (currentEnemyAnimation === "enemyDeath") {
        enemyFrameIndex = enemyAnimations.enemyDeath.frameCount - 1;
    }
}

// Display "Game Over" or "You Win!" texts on the canvas
function displayEndGameText(message) {
    ctx.save();
    ctx.font = "30px 'Press Start 2P'";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    ctx.font = "20px 'Press Start 2P'";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
    ctx.restore();
}

const pastQuestions = document.querySelector(".all-qs")

function showAnswers() {

    pastQuestions.innerHTML = questionNumStore.map((num) => {
        let currentQ = data[num]
        return `
        <div class="">
            <div class="">${currentQ.question}</div>
            <p class="">A. ${currentQ.A}</p>
            <p class="">B. ${currentQ.B}</p>
            <p class="">C. ${currentQ.C}</p>
            <p class="">D. ${currentQ.D}</p>
            <p class="">Correct: ${currentQ.answer}</p>
        </div>`
    }).join('')

}

// canvas
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d')
// user image controller
const idleImg = new Image();
idleImg.src = './assets/images/hero/Idle.png'
const attackImg = new Image();
attackImg.src = './assets/images/hero/Attack1.png'
const takeHitImg = new Image();
takeHitImg.src = './assets/images/hero/TakeHit.png'
const deathImg = new Image();
deathImg.src = './assets/images/hero/Death.png'

const enemyIdleImg = new Image();
enemyIdleImg.src = "./assets/images/enemy2/EnemyIdle.png";
enemyIdleImg.style.transform = "scale(-1,1)";
const enemyAttackImg = new Image();
enemyAttackImg.src = "./assets/images/enemy2/EnemyAttack.png"
const enemyTakeHitImg = new Image();
enemyTakeHitImg.src = "./assets/images/enemy2/EnemyTakeHit.png"
const enemyDeathImg = new Image();
enemyDeathImg.src = "./assets/images/enemy2/EnemyDeath.png"


// BACKGROUND CONTROLS
let backgroundImg = new Image();
backgroundImg.src = './assets/images/bg.png'

backgroundImg.onerror = () => {
    console.error("Image failed to load. Check the file path.");
};

// canvas controller
let animationId; 
let currentAnimation = "idle";
let currentEnemyAnimation = "enemyIdle";
const frameCount = 8; 
const heroFrameWidth = 1600 / 8; 
const heroFrameHeight = 200;
let frameIndex = 0; 
let fps = 10; 
let lastTime = 0;

let heroFrameIndex = 0; 
let enemyFrameIndex = 0; 

let lastHeroTime = 0; 
let lastEnemyTime = 0; 

const enemyFrameWidth = 1200 / 8; 
const enemyFrameHeight = 150;
// const enemyFrameWidth = 1386 / 6; 
// const enemyFrameHeight = 190;

const animations = {
    idle: {
        image: idleImg,
        frameCount: 8,
        fps: 10,
        posX: 30,
        posY: (canvas.height / 2) - 55,
    },
    attack: {
        image: attackImg,
        frameCount: 6,
        fps: 10,
        posX: 30,
        posY: (canvas.height / 2) - 55
    },
    takeHit: {
        image: takeHitImg,
        frameCount: 4,
        fps: 10,
        posX: 30,
        posY: (canvas.height / 2) - 55
    },
    death: {
        image: deathImg,
        frameCount: 6,
        fps: 10,
        posX: 30,
        posY: (canvas.height / 2) - 55
    },

}

const enemyAnimations = {
    enemyIdle: {
        image: enemyIdleImg,
        frameCount: 8,
        fps: 10,
        posX: 190,
        posY: (canvas.height / 2) - 45
    },
    enemyAttack: {
        image: enemyAttackImg,
        frameCount: 8,
        fps: 10,
        posX: 190,
        posY: (canvas.height / 2) - 45
    },
    enemyTakeHit: {
        image: enemyTakeHitImg,
        frameCount: 4,
        fps: 10,
        posX: 190,
        posY: (canvas.height / 2) - 45
    },
    enemyDeath: {
        image: enemyDeathImg,
        frameCount: 5,
        fps: 10,
        posX: 190,
        posY: (canvas.height / 2) - 45
    }

}

// stop anim

function stopAnimation() {
    cancelAnimationFrame(animationId);
}

// attack

function animate(time) {
    
    if (time - lastTime >= 1000 / fps) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(backgroundImg, 0, -80); 
        ctx.font = "25px 'Press Start 2P'";
        ctx.fillText(hearts,30,45);
        ctx.font = "25px 'Press Start 2P'";
        ctx.fillText(monsterHearts,370,45);
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
        ctx.restore()
        heroFrameIndex++;
        enemyFrameIndex++;

        if (heroFrameIndex >= heroAnim.frameCount) {
            if (currentAnimation !== "idle") {
                currentAnimation = "idle";
            }
            heroFrameIndex = 0;
        }

        if (enemyFrameIndex >= enemyAnim.frameCount) {
            if (currentEnemyAnimation !== "enemyIdle") {
              currentEnemyAnimation = "enemyIdle"; 
            }
            enemyFrameIndex = 0; 
          }

        lastTime = time;
    }
    animationId = requestAnimationFrame(animate);}

requestAnimationFrame(animate);

init();
