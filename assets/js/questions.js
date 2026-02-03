// Question handling logic
import { gameState, randomNum, resetGame, nextRound } from './game.js';
import {
    currentAnimation,
    currentEnemyAnimation,
    setHeroAnimation,
    setEnemyAnimation,
    stopAnimation,
    displayEndGameText,
    startAnimation
} from './canvas.js';

let data;
const questionCont = document.querySelector("#question-container");

export async function init() {
    data = await fetch('./data.json').then(x => x.json());
    getQuestions();
}

export function getQuestions() {
    // Reset answer selection flag
    gameState.isAnswerSelected = false;

    let questionNum = randomNum(0, data.length - 1);

    // Avoid repeat questions
    while (gameState.questionNumStore.includes(questionNum)) {
        questionNum = randomNum(0, data.length - 1);
    }
    gameState.questionNumStore.push(questionNum);

    const currentQuestion = data[questionNum];
    questionCont.innerHTML = `
    <div class="question-div">
        <div class="question">Q. ${currentQuestion.question}</div>
        <p class="answer A">A. ${currentQuestion.A}</p>
        <p class="answer B">B. ${currentQuestion.B}</p>
        <p class="answer C">C. ${currentQuestion.C}</p>
        <p class="answer D">D. ${currentQuestion.D}</p>
    </div>`;

    bindEvents(currentQuestion.answer);
}

function bindEvents(correctAnswer) {
    const answers = document.querySelectorAll(".answer");

    answers.forEach((answer) => {
        answer.addEventListener("click", () => {
            // Prevent multiple selections
            if (gameState.isAnswerSelected) return;
            gameState.isAnswerSelected = true;

            // Disable all answer buttons visually
            answers.forEach(ans => {
                ans.style.pointerEvents = "none";
                ans.style.opacity = "0.7";
            });
            answer.style.opacity = "1";

            const chosenAnswer = answer.className.split(' ')[1];

            if (correctAnswer === chosenAnswer) {
                handleCorrectAnswer(answer);
            } else {
                handleWrongAnswer(answer);
            }
        });
    });
}

function handleCorrectAnswer(answer) {
    answer.style.backgroundColor = "green";
    answer.innerHTML += `<span class="alert"> CORRECT!</span>`;
    gameState.score++;
    gameState.monsterHearts--;

    // Hero attacks
    if (currentAnimation === "idle") {
        setHeroAnimation("attack");
    }

    // Enemy takes hit after delay
    setTimeout(() => {
        if (currentEnemyAnimation === "enemyIdle") {
            setEnemyAnimation("enemyTakeHit");
        }
    }, 300);

    setTimeout(() => {
        if (!checkIfGameEnds()) {
            getQuestions();
        }
    }, 1000);
}

function handleWrongAnswer(answer) {
    answer.style.backgroundColor = "red";
    answer.innerHTML += `<span class="alert"> WRONG!</span>`;
    gameState.hearts--;

    // Hero takes hit
    if (currentAnimation === "idle") {
        setHeroAnimation("takeHit");
    }

    // Enemy attacks
    if (currentEnemyAnimation === "enemyIdle") {
        setEnemyAnimation("enemyAttack");
    }

    setTimeout(() => {
        if (!checkIfGameEnds()) {
            getQuestions();
        }
    }, 1000);
}

function checkIfGameEnds() {
    if (gameState.score === 35) {
        showGameEnd("Congrats, you won!", "You Win!");
        setEnemyAnimation("enemyDeath");
        return true;
    } else if (gameState.monsterHearts === 0) {
        // Round completed, move to next round
        nextRound();
        return false;
    } else if (gameState.hearts === 0) {
        showGameEnd("Game Over", "Game Over");
        setHeroAnimation("death");
        return true;
    }
    return false;
}

function showGameEnd(message, canvasMessage) {
    questionCont.innerHTML = '';

    const gameEndInfo = document.createElement("div");
    gameEndInfo.classList.add("game-end");
    gameEndInfo.innerHTML = `
        <p class="indicator-text">${message}</p>
        <p>Your Score: ${gameState.score}</p>
        <button class="play-again-btn">Play Again</button>
    `;
    document.querySelector(".main-cont").appendChild(gameEndInfo);

    stopAnimation();
    displayEndGameText(canvasMessage);
    addPlayAgainButtonHandler();
}

function addPlayAgainButtonHandler() {
    const playAgainBtn = document.querySelector(".play-again-btn");
    playAgainBtn.addEventListener("click", () => {
        // Remove game end screen
        document.querySelector(".game-end").remove();

        // Reset game state
        resetGame();

        // Restart animation
        startAnimation();

        // Start new game
        getQuestions();
    });
}

export function showAnswers() {
    const pastQuestions = document.querySelector(".all-qs");
    pastQuestions.innerHTML = gameState.questionNumStore.map((num) => {
        const currentQ = data[num];
        return `
        <div class="">
            <div class="">${currentQ.question}</div>
            <p class="">A. ${currentQ.A}</p>
            <p class="">B. ${currentQ.B}</p>
            <p class="">C. ${currentQ.C}</p>
            <p class="">D. ${currentQ.D}</p>
            <p class="">Correct: ${currentQ.answer}</p>
        </div>`;
    }).join('');
}
