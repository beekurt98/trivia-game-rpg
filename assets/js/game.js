// Game state management

export const roundInfo = {
    round: 1,
    user: 3,
    monster: 5,
};

export let gameState = {
    score: 0,
    currentRound: 1,
    hearts: roundInfo.user,
    monsterHearts: roundInfo.monster,
    questionNumStore: [],
    isAnswerSelected: false,
};

export function resetGame() {
    gameState.score = 0;
    gameState.currentRound = 1;
    gameState.hearts = roundInfo.user;
    gameState.monsterHearts = roundInfo.monster;
    gameState.questionNumStore = [];
    gameState.isAnswerSelected = false;
}

export function nextRound() {
    gameState.currentRound++;
    gameState.hearts = roundInfo.user + 2;
    gameState.monsterHearts = roundInfo.monster * 2;
}

export function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
