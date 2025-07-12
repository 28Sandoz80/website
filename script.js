let clicks = 0;
let startTime = null;
let timerInterval = null;
const coin = document.getElementById('coin');
const clickCount = document.getElementById('clickCount');
const timerDisplay = document.getElementById('timer');
const giveUpBtn = document.getElementById('giveUpBtn');
const leaderboardList = document.getElementById('leaderboard');
const diddyImage = document.getElementById('diddyImage');
const skillCheck = document.getElementById('skillCheck');
const randomKey = document.getElementById('randomKey');
const bar = document.getElementById('bar');
const greenZone = document.getElementById('greenZone');

// Sounds
const coinSound = new Audio('https://www.orangefreesounds.com/wp-content/uploads/2021/09/8bit-coin-sound-effect.mp3');
const laughSound = new Audio('https://orangefreesounds.com/wp-content/uploads/2025/04/Goofy-cartoon-laugh-sound-effect.mp3');
const quitLaughSound = new Audio('https://orangefreesounds.com/wp-content/uploads/2020/09/Crowd-laughing-sound-effect.mp3');
const cheeringSound = new Audio('https://www.soundjay.com/applause-1.mp3');
const fartSound = new Audio('https://www.soundjay.com/fart-1.mp3');

// Text-to-speech
const synth = window.speechSynthesis;
const mockingPhrases = [
    "You're still clicking? What a loser!",
    "Get a life already!",
    "Seriously, keep going? Pathetic!",
    "This is sad... why not quit?",
    "Loser alert! Still at it?",
    "Time to give up, no-lifer!"
];

const diddyQuote = "The sun don't shine forever, but as long as it's here, then we might as well shine together.";

function speakPhrase(phrase) {
    if (synth) {
        const utterance = new SpeechSynthesisUtterance(phrase);
        synth.speak(utterance);
    }
}

// Update timer
function updateTimer() {
    if (startTime) {
        const ms = Date.now() - startTime;
        const minutes = String(Math.floor(ms / 60000)).padStart(2, '0');
        const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
        const millis = String(ms % 1000).padStart(3, '0');
        timerDisplay.textContent = `${minutes}:${seconds}:${millis}`;
    }
}

// Load leaderboard
function loadLeaderboard() {
    const storedScores = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboardList.innerHTML = '';
    storedScores.forEach((entry, index) => {
        const li = document.createElement('li');
        let crown = '';
        if (index === 0) {
            crown = '💎👑 ';
        }
        const timeFormatted = (entry.time / 1000).toFixed(3);
        li.textContent = `${crown}${index + 1}. ${entry.name}: ${entry.score} clicks in ${timeFormatted} seconds`;
        leaderboardList.appendChild(li);
    });
}

// Submit score
function submitScore() {
    quitLaughSound.play();
    const elapsedMs = startTime ? Date.now() - startTime : 0;
    clearInterval(timerInterval);
    timerDisplay.textContent = '00:00:000';
    const name = prompt('Enter your name:');
    if (name) {
        let storedScores = JSON.parse(localStorage.getItem('leaderboard')) || [];
        storedScores.push({ name, score: clicks, time: elapsedMs });
        storedScores.sort((a, b) => b.score - a.score);
        storedScores = storedScores.slice(0, 10);
        localStorage.setItem('leaderboard', JSON.stringify(storedScores));
        loadLeaderboard();
        clicks = 0;
        clickCount.textContent = clicks;
        startTime = null;
        timerInterval = null;
        coin.style.left = '200px';
        coin.style.top = '200px';
        updateCoinSVG(0, 0);
        animations.forEach(anim => coin.classList.remove(anim));
        diddyImage.style.display = 'none';
        skillCheck.style.display = 'none';
    }
}

// Enhancements
const colors = ['gold', 'silver', '#FF4500', '#00BFFF', '#32CD32', '#FF69B4', '#FFD700', '#C0C0C0', '#B22222', '#4B0082'];
const animations = ['spin', 'pulse', 'shake', 'spin', 'pulse', 'shake', 'spin', 'pulse', 'shake', 'spin'];
let skillActive = false;
let greenWidth = 30;
let meterSpeed = 2000;

// Skill check function (unchanged)
function triggerSkillCheck() {
    skillActive = true;
    coin.style.pointerEvents = 'none';
    skillCheck.style.display = 'block';
    const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const key = keys[Math.floor(Math.random() * keys.length)];
    randomKey.textContent = key;
    bar.style.width = '0%';
    greenZone.style.left = '35%';
    greenZone.style.width = greenWidth + '%';
    let progress = 0;
    const interval = setInterval(() => {
        progress += 1;
        bar.style.width = progress + '%';
        if (progress >= 100) {
            clearInterval(interval);
            endSkillCheck(false);
        }
    }, meterSpeed / 100);

    const keyListener = (e) => {
        if (e.key.toUpperCase() === key) {
            document.removeEventListener('keydown', keyListener);
            clearInterval(interval);
            const position = parseInt(bar.style.width);
            const greenStart = 35;
            const greenEnd = greenStart + greenWidth;
            if (position >= greenStart && position <= greenEnd) {
                clicks += 50;
                cheeringSound.play();
            } else {
                clicks -= 100;
                if (clicks < 0) clicks = 0;
                fartSound.play();
            }
            endSkillCheck(true);
        }
    };
    document.addEventListener('keydown', keyListener);
}

function endSkillCheck(success) {
    skillActive = false;
    skillCheck.style.display = 'none';
    coin.style.pointerEvents = 'auto';
    greenWidth = Math.max(10, greenWidth - 2);
    meterSpeed = Math.max(1000, meterSpeed - 100);
    clickCount.textContent = clicks;
}

// Update coin SVG
function updateCoinSVG(level, damage) {
    let svg = `<svg width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="${colors[level]}" stroke="black" stroke-width="2"/>`;
    for (let i = 0; i < damage; i++) {
        const x1 = Math.random() * 60 + 20;
        const y1 = Math.random() * 60 + 20;
        const x2 = Math.random() * 60 + 20;
        const y2 = Math.random() * 60 + 20;
        svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="black" stroke-width="3"/>`;
    }
    svg += `</svg>`;
    coin.innerHTML = svg;
}

// Event listeners
coin.addEventListener('click', () => {
    if (skillActive) return;
    if (!startTime) {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 10);
    }
    clicks++;
    clickCount.textContent = clicks;
    coinSound.play();
    if (clicks % 20 === 0) {
        laughSound.play();
    }
    if (clicks === 500) {
        speakPhrase(mockingPhrases[0]);
    } else if (clicks === 600) {
        speakPhrase(mockingPhrases[1]);
    } else if (clicks >= 1000 && clicks % 1000 === 0) {
        const randomIndex = Math.floor(Math.random() * (mockingPhrases.length - 2)) + 2;
        speakPhrase(mockingPhrases[randomIndex]);
    }

    if (clicks === 100) {
        diddyImage.style.display = 'block';
        speakPhrase(diddyQuote);
    }

    if (clicks > 100 && clicks % 50 === 0) {
        triggerSkillCheck();
    }

    // Move coin
    const maxOffset = 50;
    const offsetX = Math.random() * maxOffset - maxOffset / 2;
    const offsetY = Math.random() * maxOffset - maxOffset / 2;
    let currentLeft = parseInt(coin.style.left) || 200;
    let currentTop = parseInt(coin.style.top) || 200;
    const minLeft = 0;
    const maxLeft = window.innerWidth - 100;
    const minTop = 0;
    const maxTop = window.innerHeight - 100;
    let newLeft = currentLeft + offsetX;
    let newTop = currentTop + offsetY;
    newLeft = Math.max(minLeft, Math.min(maxLeft, newLeft));
    newTop = Math.max(minTop, Math.min(maxTop, newTop));
    coin.style.left = newLeft + 'px';
    coin.style.top = newTop + 'px';

    // Degradation and hatching
    const level = Math.min(Math.floor(clicks / 100), 9);
    const phase = clicks % 100;
    if (phase === 0 && clicks <= 1000 && clicks > 0) {
        // Hatch/break
        coin.classList.add('hatch');
        const onHatchEnd = () => {
            coin.classList.remove('hatch');
            coin.style.transform = 'scale(1)';
            coin.style.opacity = '1';
            coin.style.filter = 'brightness(1)';
            updateCoinSVG(level, 0); // New coin, no damage
            animations.forEach(anim => coin.classList.remove(anim));
            coin.classList.add(animations[level]);
            coin.removeEventListener('animationend', onHatchEnd);
        };
        coin.addEventListener('animationend', onHatchEnd);
    } else {
        const damage = Math.floor(phase / 20); // Add a crack every 20 clicks (up to 4 per phase)
        updateCoinSVG(level, damage);
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
updateCoinSVG(0, 0); // Initial coin
