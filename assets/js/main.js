// Main entry point
import { animate } from './canvas.js';
import { init, showAnswers } from './questions.js';

// Start the animation loop
requestAnimationFrame(animate);

// Initialize the game
init();

// Expose showAnswers globally for the HTML button
window.showAnswers = showAnswers;
