# 🐜 Ant Smasher Game

Welcome to **Ant Smasher Game** – a fast-paced, fun-filled browser game where your mission is simple: **SMASH THOSE ANTS** before they get away! Earn points, beat your high score, and climb the leaderboard in this dynamic arcade-style game built with HTML, CSS, and JavaScript.

---

## 🚀 Live Demo

<a href="https://devilgod129.github.io/Ant_Smasher/" target="_blank">🔗 Click here to play</a>

---

## 🎮 Gameplay Overview

- 🖱️ **Click ants** as they appear to smash them.
- ⏱️ **60 seconds** countdown to score as high as possible.
- 💣 **Miss 7 ants** and it's game over!
- ⚠️ Ants disappear quickly – be alert!
- 🏆 Compete for the **high score** and track top players on the leaderboard.

---

## 🧠 Game Features

- 🎯 **Pre-Game Countdown** before gameplay starts
- 🧠 **Levels increase** difficulty as you score higher
- 🔊 **Sound effects** for smashes and misses
- 🎚️ **Pause**, **restart**, and **mute** controls
- 🧾 **Leaderboard** stored in browser `localStorage`
- 🧑‍🎓 Accessible, responsive, and mobile-friendly

---

## 🛠️ Tech Stack

| Technology         | Description                         |
| ------------------ | ----------------------------------- |
| `HTML5`            | Markup for structuring game layout  |
| `CSS3`             | Stylish, animated, responsive UI    |
| `JavaScript (ES6)` | Game logic, timer, DOM manipulation |
| `LocalStorage`     | Store high scores and player names  |

---

## 🗂️ File Structure

```
ant-smasher/
│
├── index.html         # Main HTML structure
├── style.css          # All game styles and animations
├── script.js          # Game logic and interactivity
└── assets/            # Ant images and background
```

---

## 🧪 How to Run Locally

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/ant-smasher.git
   cd ant-smasher
   ```

2. **Open `index.html` in your browser**:

   - On Mac/Linux:

     ```bash
     open index.html
     ```

   - Or simply double-click the `index.html` file from your file explorer.

✅ That’s it! No build tools or installations needed.

---

## 📁 Assets Needed

Make sure you place these images inside a folder named `/assets/` in the root directory:

| File                | Description             |
| ------------------- | ----------------------- |
| `ant.jpg`           | Regular ant             |
| `ants_smashed.jpg`  | Smashed ant graphic     |
| `grass_texture.jpg` | Game background texture |

---

## 📱 Responsive Design & Features

- 🖥️ Full **desktop layout** with grid-based info panel
- 📱 **Mobile-friendly** view – controls stack and resize adaptively
- 🎮 Dynamic **game background texture** for added depth

---

## 🔄 Reset Local Storage

To reset high scores and leaderboard:

### Option 1: In Browser Console

1. Open DevTools (Right-click > Inspect > Console tab)
2. Paste and run:

```js
localStorage.clear();
```

### Option 2: Manually

1. Go to `Application` tab in DevTools
2. Select `Local Storage > [your domain]`
3. Right-click and choose "Clear"

---

## 🐞 Common Issues

- **404 for ant.jpg or assets?**

  - Make sure your folder is named `assets`, not `assests` (typo!)
  - Ensure the image files are in the correct place

- **404 for `favicon.ico`?**

  - You can ignore this or add a `favicon.ico` to root directory to remove error

---
