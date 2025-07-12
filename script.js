let clicks = 0;
let startTime = null;
let timerInterval = null;
const coin = document.getElementById('coin');
const clickCount = document.getElementById('clickCount');
const timerDisplay = document.getElementById('timer');
const giveUpBtn = document.getElementById('giveUpBtn');
const leaderboardList = document.getElementById('leaderboard');

// Sounds (free from Orange Free Sounds with attribution)
const coinSound = new Audio('https://www.orangefreesounds.com/wp-content/uploads/2021/09/8bit-coin-sound-effect.mp3');
const laughSound = new Audio('https://orangefreesounds.com/wp-content/uploads/2025/04/Goofy-cartoon-laugh-sound-effect.mp3');
const quitLaughSound = new Audio('https://orangefreesounds.com/wp-content/uploads/2020/09/Crowd-laughing-sound-effect.mp3');

// Text-to-speech for mocking phrases (using browser's SpeechSynthesis API)
const synth = window.speechSynthesis;
const mockingPhrases = [
    "You're still clicking? What a loser!",
    "Get a life already!",
    "Seriously, keep going? Pathetic!",
    "This is sad... why not quit?",
    "Loser alert! Still at it?",
    "Time to give up, no-lifer!"
];

function speakPhrase(phrase) {
    if (synth) {
        const utterance = new SpeechSynthesisUtterance(phrase);
        synth.speak(utterance);
    }
}

// Update timer display every 10ms for millisecond precision
function updateTimer() {
    if (startTime) {
        const ms = Date.now() - startTime;
        const minutes = String(Math.floor(ms / 60000)).padStart(2, '0');
        const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
        const millis = String(ms % 1000).padStart(3, '0');
        timerDisplay.textContent = `${minutes}:${seconds}:${millis}`;
    }
}

// Load leaderboard from localStorage
function loadLeaderboard() {
    const storedScores = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboardList.innerHTML = ''; // Clear list
    storedScores.forEach((entry, index) => {
        const li = document.createElement('li');
        let crown = '';
        if (index === 0) {
            crown = '💎👑 '; // Diamond king crown for #1
        }
        const timeFormatted = (entry.time / 1000).toFixed(3); // Format to seconds with 3 decimal places
        li.textContent = `${crown}${index + 1}. ${entry.name}: ${entry.score} clicks in ${timeFormatted} seconds`;
        leaderboardList.appendChild(li);
    });
}

// Save score and update leaderboard
function submitScore() {
    quitLaughSound.play(); // Play crowd laughing sound on give up
    const elapsedMs = startTime ? Date.now() - startTime : 0;
    clearInterval(timerInterval); // Stop the timer
    timerDisplay.textContent = '00:00:000'; // Reset display
    const name = prompt('Enter your name:');
    if (name) {
        let storedScores = JSON.parse(localStorage.getItem('leaderboard')) || [];
        storedScores.push({ name, score: clicks, time: elapsedMs });
        // Sort descending by score
        storedScores.sort((a, b) => b.score - a.score);
        // Keep only top 10
        storedScores = storedScores.slice(0, 10);
        localStorage.setItem('leaderboard', JSON.stringify(storedScores));
        loadLeaderboard();
        // Reset game
        clicks = 0;
        clickCount.textContent = clicks;
        startTime = null;
        timerInterval = null;
    }
}

// Enhancements: Textures and animations
const textures = ['coin1.png', 'coin2.png', 'coin3.png', 'coin4.png', 'coin5.png', 'coin6.png', 'coin7.png', 'coin8.png', 'coin9.png', 'coin10.png'];
const animations = ['spin', 'pulse', 'shake', 'spin', 'pulse', 'shake', 'spin', 'pulse', 'shake', 'spin'];
let currentTexture = 0;

// Event listeners
coin.addEventListener('click', () => {
    if (!startTime) {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 10); // Update every 10ms for smooth milliseconds
    }
    clicks++;
    clickCount.textContent = clicks;
    coinSound.play();
    if (clicks % 20 === 0) {
        laughSound.play();
    }
    if (clicks === 500) {
        speakPhrase(mockingPhrases[0]); // "You're still clicking? What a loser!"
    } else if (clicks === 600) {
        speakPhrase(mockingPhrases[1]); // "Get a life already!"
    } else if (clicks >= 1000 && clicks % 1000 === 0) {
        // Random mocking phrase every 1000 clicks after 600
        const randomIndex = Math.floor(Math.random() * (mockingPhrases.length - 2)) + 2; // From index 2 onward
        speakPhrase(mockingPhrases[randomIndex]);
    }

    // Move coin
    const maxOffset = 50;
    const offsetX = Math.random() * maxOffset - maxOffset / 2;
    const offsetY = Math.random() * maxOffset - maxOffset / 2;
    let currentLeft = parseInt(coin.style.left) || 200;
    let currentTop = parseInt(coin.style.top) || 200;
    const minLeft = 0;
    const maxLeft = window.innerWidth - 100; // Adjust based on window width minus coin size
    const minTop = 0;
    const maxTop = window.innerHeight - 100; // Adjust based on window height minus coin size
    let newLeft = currentLeft + offsetX;
    let newTop = currentTop + offsetY;
    newLeft = Math.max(minLeft, Math.min(maxLeft, newLeft));
    newTop = Math.max(minTop, Math.min(maxTop, newTop));
    coin.style.left = newLeft + 'px';
    coin.style.top = newTop + 'px';

    // Change texture and animation every 100 clicks up to 1000
    if (clicks % 100 === 0 && clicks <= 1000) {
        currentTexture = Math.floor(clicks / 100) - 1;
        if (currentTexture >= textures.length) currentTexture = textures.length - 1;
        coin.src = textures[currentTexture];
        // Remove previous animation classes
        animations.forEach(anim => coin.classList.remove(anim));
        // Add new animation class
        coin.classList.add(animations[currentTexture]);
    }

    // Click effect
    coin.classList.add('clicked');
    setTimeout(() => {
        coin.classList.remove('clicked');
    }, 100);
});

giveUpBtn.addEventListener('click', submitScore);

// Initial load
loadLeaderboard();
