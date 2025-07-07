// === Game State ===
const gameState = {
  score: 0,
  antsSmashed: 0,
  misses: 0,
  isPlaying: false,
  isPaused: false,
  player: "",
  spawnInterval: null,
  timerInterval: null,
  timeLeft: 60,
  ants: [],
  muted: false,
  level: 1,
  antClickLock: false, // to prevent double clicks on ants
};

// === DOM Elements ===
const welcomeScreen = document.getElementById("welcomeScreen");
const gameScreen = document.getElementById("gameScreen");
const gameContainer = document.getElementById("gameContainer");
const playerNameInput = document.getElementById("playerNameInput");
const currentScore = document.getElementById("currentScore");
const highScore = document.getElementById("highScore");
const antsSmashed = document.getElementById("antsSmashed");
const countdown = document.getElementById("timeLeft");
const currentPlayerName = document.getElementById("currentPlayerName");
const welcomeHighScore = document.getElementById("welcomeHighScore");
const welcomeHighScoreName = document.getElementById("welcomeHighScoreName");
const leaderboard = document.getElementById("leaderboardList");
const leaderboardBox = document.querySelector(".leaderboard");
const soundToggleBtn = document.getElementById("soundToggleBtn");
const restartBtn = document.getElementById("restartBtn");
const backBtn = document.getElementById("backBtn");
const missCount = document.getElementById("missCount");
const pauseBtn = document.getElementById("pauseBtn");

// === Audio ===
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(freq = 300, duration = 0.2, gainLevel = 0.05) {
  if (gameState.muted) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.value = freq;
  gain.gain.value = gainLevel;
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function playSmashSound() {
  playSound(320);
}

function playMissSound() {
  playSound(140);
}

// === Leaderboard ===
function loadLeaderboard() {
  const list = JSON.parse(localStorage.getItem("antSmasherLeaderboard")) || [];
  leaderboard.innerHTML = "";
  list
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .forEach((entry) => {
      const li = document.createElement("li");
      li.textContent = `${entry.name} - ${entry.score} pts`;
      leaderboard.appendChild(li);
    });
}

function updateLeaderboard(name, score) {
  const board = JSON.parse(localStorage.getItem("antSmasherLeaderboard")) || [];
  board.push({ name, score });
  localStorage.setItem("antSmasherLeaderboard", JSON.stringify(board));
}

// === Ant Spawning ===
function spawnAnt() {
  if (!gameState.isPlaying || gameState.isPaused) return;
  if (gameState.ants.length >= 10) return;
  const ant = document.createElement("div");
  ant.className = "ant";
  const maxX = gameContainer.offsetWidth - 50;
  const maxY = gameContainer.offsetHeight - 50;
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;
  ant.style.left = `${x}px`;
  ant.style.top = `${y}px`;

  ant.onclick = (e) => {
    e.stopPropagation();
    if (gameState.antClickLock) return;
    gameState.antClickLock = true;
    smashAnt(ant, x, y);
    setTimeout(() => {
      gameState.antClickLock = false;
    }, 200);
  };

  gameContainer.appendChild(ant);
  gameState.ants.push(ant);

  const lifespan = 2000 - Math.min(gameState.level * 100, 1400);
  setTimeout(() => {
    if (ant.parentNode && !ant.classList.contains("smashed")) {
      ant.remove();
      gameState.ants = gameState.ants.filter((a) => a !== ant);
      setTimeout(() => {
        if (!ant.classList.contains("smashed")) missAnt();
      }, 400);
    }
  }, lifespan);

  let moveX = Math.random() * 2 - 1;
  let moveY = Math.random() * 2 - 1;
  let speed = 1 + gameState.level * 0.2;

  function moveAnt() {
    if (!ant.parentNode || gameState.isPaused) return;
    let rect = ant.getBoundingClientRect();
    let x = parseFloat(ant.style.left);
    let y = parseFloat(ant.style.top);
    x += moveX * speed;
    y += moveY * speed;
    if (x <= 0 || x >= gameContainer.offsetWidth - 50) moveX *= -1;
    if (y <= 0 || y >= gameContainer.offsetHeight - 50) moveY *= -1;
    ant.style.left = `${x}px`;
    ant.style.top = `${y}px`;
    if (!gameState.isPaused) requestAnimationFrame(moveAnt);
  }
  requestAnimationFrame(moveAnt);
}

function smashAnt(ant, x, y) {
  if (ant.classList.contains("smashed")) return;
  ant.classList.add("smashed");
  playSmashSound();

  gameState.score++;
  gameState.antsSmashed++;
  currentScore.textContent = gameState.score;
  antsSmashed.textContent = gameState.antsSmashed;
  bounce(currentScore);
  showPopup(x, y);

  const storedHigh = parseInt(localStorage.getItem("antSmasherHighScore")) || 0;
  if (gameState.score > storedHigh) {
    localStorage.setItem("antSmasherHighScore", gameState.score);
    localStorage.setItem("antSmasherHighScoreName", gameState.player);
    updateWelcomeScore();
    highScore.textContent = gameState.score;
  }

  // Remove ant from gameState.ants array before removing from DOM
  gameState.ants = gameState.ants.filter((a) => a !== ant);
  setTimeout(() => ant.remove(), 400);

  const levelThreshold = 20;
  if (
    gameState.score > 0 &&
    gameState.score % levelThreshold === 0 &&
    gameState.level < 9
  ) {
    gameState.level++;
  }
}

function missAnt() {
  gameState.misses++;
  missCount.textContent = `${gameState.misses}/7`;
  playMissSound();
  showMissFeedback();
  if (gameState.misses >= 7) endGame("Too many misses!");
}

function showMissFeedback() {
  const feedback = document.createElement("div");
  feedback.className = "miss-feedback";
  feedback.textContent = "❌ Miss!";
  gameContainer.appendChild(feedback);
  setTimeout(() => feedback.remove(), 1000);
}

function showPopup(x, y) {
  const pop = document.createElement("div");
  pop.className = "score-popup";
  pop.textContent = "+1";
  pop.style.left = `${x}px`;
  pop.style.top = `${y}px`;
  gameContainer.appendChild(pop);
  setTimeout(() => pop.remove(), 1000);
}

function bounce(el) {
  el.classList.add("bounce");
  setTimeout(() => el.classList.remove("bounce"), 300);
}

function preGameCountdown(callback) {
  let count = 3;
  const overlay = document.createElement("div");
  overlay.className = "countdown";
  gameContainer.appendChild(overlay);
  const interval = setInterval(() => {
    overlay.textContent = count > 0 ? count : "Go!";
    if (count-- < 0) {
      clearInterval(interval);
      overlay.remove();
      callback();
    }
  }, 1000);
}

function startGame() {
  const name = playerNameInput.value.trim();
  if (!name) {
    alert("Please enter your name!");
    return;
  }
  Object.assign(gameState, {
    score: 0,
    antsSmashed: 0,
    misses: 0,
    timeLeft: 60,
    level: 1,
    isPlaying: false,
    isPaused: false,
    ants: [],
    antClickLock: false,
    player: name,
  });

  currentPlayerName.textContent = name;
  currentScore.textContent = "0";
  antsSmashed.textContent = "0";
  missCount.textContent = "0/7";
  countdown.textContent = "60s";

  welcomeScreen.style.display = "none";
  gameScreen.style.display = "flex";
  gameContainer.style.opacity = "1";
  gameContainer.innerHTML = "";
  leaderboardBox.style.display = "block";
  pauseBtn.textContent = "⏸️ Pause";
  gameState.isPlaying = false;
  gameState.isPaused = false;

  preGameCountdown(() => {
    gameState.isPlaying = true;
    clearIntervals();
    dynamicSpawnLoop();
    gameState.timerInterval = setInterval(updateTimer, 1000);
  });
}

function dynamicSpawnLoop() {
  if (!gameState.isPlaying || gameState.isPaused) return;
  spawnAnt();
  const interval = Math.max(1800 - gameState.level * 100, 600);
  gameState.spawnInterval = setTimeout(dynamicSpawnLoop, interval);
}

function updateTimer() {
  if (!gameState.isPlaying || gameState.isPaused) return;
  gameState.timeLeft--;
  countdown.textContent = `${gameState.timeLeft}s`;
  if (gameState.timeLeft <= 0) endGame("Time up!");
}

function endGame(reason = "Game Over") {
  clearIntervals();
  gameState.isPlaying = false;
  setTimeout(() => {
    const overlay = document.getElementById("gameOverOverlay");
    document.getElementById("gameOverMessage").textContent = reason;
    document.getElementById(
      "finalScore"
    ).textContent = `Score: ${gameState.score}`;
    overlay.style.display = "flex";
  }, 100);

  updateLeaderboard(gameState.player, gameState.score);
  loadLeaderboard();
  leaderboardBox.style.display = "block";
  gameContainer.style.opacity = "1";
  pauseBtn.textContent = "⏸️ Pause";
}

function restartGame() {
  document.getElementById("gameOverOverlay").style.display = "none";
  clearIntervals();
  gameContainer.innerHTML = "";
  leaderboardBox.style.display = "none";
  startGame();
}

function goBackToWelcome() {
  clearIntervals();

  // Reset Game Screen
  gameState.isPlaying = false;
  gameState.isPaused = false;
  gameContainer.innerHTML = "";
  leaderboardBox.style.display = "none";

  // Hide Game Screen & Game Over Overlay
  document.getElementById("gameScreen").style.display = "none";
  document.getElementById("gameOverOverlay").style.display = "none";

  // Reset Welcome Screen
  document.getElementById("welcomeScreen").style.display = "grid"; // important!
  updateWelcomeScore();
  playerNameInput.value = "";
  playerNameInput.focus();
}

function toggleSound() {
  gameState.muted = !gameState.muted;
  soundToggleBtn.textContent = gameState.muted ? "🔇 Unmute" : "🔊 Mute";
}

function togglePause() {
  if (!gameState.isPlaying) return;

  gameState.isPaused = !gameState.isPaused;

  pauseBtn.textContent = gameState.isPaused ? "▶️ Resume" : "⏸️ Pause";
  gameContainer.style.opacity = gameState.isPaused ? "0.7" : "1";

  if (gameState.isPaused) {
    clearIntervals(); // pause both timer and spawn loop
  } else {
    dynamicSpawnLoop(); // resume spawn loop
    gameState.timerInterval = setInterval(updateTimer, 1000); // resume timer
  }
}

function clearIntervals() {
  clearTimeout(gameState.spawnInterval);
  clearInterval(gameState.timerInterval);
  gameState.spawnInterval = null;
  gameState.timerInterval = null;
}

function updateWelcomeScore() {
  const topScore = localStorage.getItem("antSmasherHighScore") || 0;
  const topName =
    localStorage.getItem("antSmasherHighScoreName") || "No record yet";
  welcomeHighScore.textContent = topScore;
  welcomeHighScoreName.textContent = topName;
  highScore.textContent = topScore;
}

window.addEventListener("DOMContentLoaded", () => {
  updateWelcomeScore();
  loadLeaderboard();
  playerNameInput.focus();
  document.getElementById("startGameBtn").addEventListener("click", startGame);
  playerNameInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^A-Za-z0-9 ]/g, "");
  });
  playerNameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && playerNameInput.value.trim()) {
      startGame();
    }
  });
  soundToggleBtn.addEventListener("click", toggleSound);
  restartBtn.addEventListener("click", restartGame);
  backBtn.addEventListener("click", goBackToWelcome);
  gameContainer.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("ant") ||
      gameState.isPaused ||
      !gameState.isPlaying
    )
      return;
    // Don't count container clicks as miss anymore
  });
  pauseBtn.addEventListener("click", togglePause);
});
