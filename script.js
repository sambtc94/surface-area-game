const SHAPE_ICONS = {
  Cube: "📦",
  "Rectangular Prism": "🧱",
  Cylinder: "🥫",
  Sphere: "🌐",
  "Triangular Prism": "🔺",
};

const LEVEL_POINT_STEP = 250;
const STREAK_BONUS_STEP = 10;
const POINTS_WITH_HINT = 80;
const POINTS_WITHOUT_HINT = 100;
const COINS_WITH_HINT = 1;
const COINS_WITHOUT_HINT = 3;
const MAP_SIZE = 7;
const ENEMY_COUNT = 6;
const POTION_COUNT = 5;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function maybeAttachDiagram(shapeName, details, textPrompt) {
  const useDiagram = Math.random() < 0.5;
  if (!useDiagram) {
    return {
      prompt: textPrompt,
      diagram: null,
    };
  }

  return {
    prompt: "Use the diagram dimensions to find the total surface area.",
    diagram: buildShapeDiagram(shapeName, details),
  };
}

function buildShapeDiagram(shapeName, details) {
  if (shapeName === "Cube") {
    return `
      <p class="shape-diagram-label">Cube (side ${details.side} cm)</p>
      <svg class="shape-diagram-svg" viewBox="0 0 260 160" role="img" aria-label="Cube diagram with side length ${details.side} centimetres">
        <rect x="50" y="45" width="90" height="90" fill="#e8edff" stroke="#3f63cc" stroke-width="2"/>
        <rect x="90" y="20" width="90" height="90" fill="#d8e1ff" stroke="#3f63cc" stroke-width="2"/>
        <line x1="50" y1="45" x2="90" y2="20" stroke="#3f63cc" stroke-width="2"/>
        <line x1="140" y1="45" x2="180" y2="20" stroke="#3f63cc" stroke-width="2"/>
        <line x1="50" y1="135" x2="90" y2="110" stroke="#3f63cc" stroke-width="2"/>
        <line x1="140" y1="135" x2="180" y2="110" stroke="#3f63cc" stroke-width="2"/>
        <text x="96" y="151" fill="#1f2d59" font-size="14">${details.side} cm</text>
      </svg>
    `;
  }

  if (shapeName === "Rectangular Prism") {
    return `
      <p class="shape-diagram-label">Rectangular Prism</p>
      <svg class="shape-diagram-svg" viewBox="0 0 300 170" role="img" aria-label="Rectangular prism diagram">
        <rect x="55" y="50" width="130" height="75" fill="#e8edff" stroke="#3f63cc" stroke-width="2"/>
        <rect x="105" y="25" width="130" height="75" fill="#d8e1ff" stroke="#3f63cc" stroke-width="2"/>
        <line x1="55" y1="50" x2="105" y2="25" stroke="#3f63cc" stroke-width="2"/>
        <line x1="185" y1="50" x2="235" y2="25" stroke="#3f63cc" stroke-width="2"/>
        <line x1="55" y1="125" x2="105" y2="100" stroke="#3f63cc" stroke-width="2"/>
        <line x1="185" y1="125" x2="235" y2="100" stroke="#3f63cc" stroke-width="2"/>
        <text x="108" y="147" fill="#1f2d59" font-size="14">l = ${details.l} cm</text>
        <text x="240" y="68" fill="#1f2d59" font-size="14">h = ${details.h} cm</text>
        <text x="145" y="18" fill="#1f2d59" font-size="14">w = ${details.w} cm</text>
      </svg>
    `;
  }

  if (shapeName === "Cylinder") {
    return `
      <p class="shape-diagram-label">Cylinder</p>
      <svg class="shape-diagram-svg" viewBox="0 0 260 170" role="img" aria-label="Cylinder diagram with radius ${details.r} and height ${details.h}">
        <ellipse cx="120" cy="35" rx="55" ry="18" fill="#d8e1ff" stroke="#3f63cc" stroke-width="2"/>
        <rect x="65" y="35" width="110" height="90" fill="#e8edff" stroke="#3f63cc" stroke-width="2"/>
        <ellipse cx="120" cy="125" rx="55" ry="18" fill="#e0e7ff" stroke="#3f63cc" stroke-width="2"/>
        <line x1="120" y1="35" x2="175" y2="35" stroke="#1f2d59" stroke-width="2"/>
        <line x1="188" y1="35" x2="188" y2="125" stroke="#1f2d59" stroke-width="2"/>
        <text x="128" y="29" fill="#1f2d59" font-size="14">r = ${details.r} cm</text>
        <text x="194" y="82" fill="#1f2d59" font-size="14">h = ${details.h} cm</text>
      </svg>
    `;
  }

  if (shapeName === "Sphere") {
    return `
      <p class="shape-diagram-label">Sphere</p>
      <svg class="shape-diagram-svg" viewBox="0 0 240 170" role="img" aria-label="Sphere diagram with radius ${details.r}">
        <circle cx="120" cy="85" r="60" fill="#e8edff" stroke="#3f63cc" stroke-width="2"/>
        <ellipse cx="120" cy="85" rx="60" ry="20" fill="none" stroke="#3f63cc" stroke-width="1.8"/>
        <line x1="120" y1="85" x2="180" y2="85" stroke="#1f2d59" stroke-width="2"/>
        <text x="132" y="78" fill="#1f2d59" font-size="14">r = ${details.r} cm</text>
      </svg>
    `;
  }

  return `
    <p class="shape-diagram-label">Triangular Prism</p>
    <svg class="shape-diagram-svg" viewBox="0 0 310 180" role="img" aria-label="Triangular prism diagram">
      <polygon points="70,125 130,45 190,125" fill="#e8edff" stroke="#3f63cc" stroke-width="2"/>
      <polygon points="130,125 190,45 250,125" fill="#d8e1ff" stroke="#3f63cc" stroke-width="2"/>
      <line x1="70" y1="125" x2="130" y2="125" stroke="#3f63cc" stroke-width="2"/>
      <line x1="130" y1="45" x2="190" y2="45" stroke="#3f63cc" stroke-width="2"/>
      <line x1="190" y1="125" x2="250" y2="125" stroke="#3f63cc" stroke-width="2"/>
      <text x="86" y="141" fill="#1f2d59" font-size="14">base = ${details.base} cm</text>
      <text x="139" y="38" fill="#1f2d59" font-size="14">height = ${details.triangleHeight} cm</text>
      <text x="205" y="146" fill="#1f2d59" font-size="14">length = ${details.prismLength} cm</text>
    </svg>
  `;
}

const shapes = [
  {
    name: "Cube",
    buildQuestion() {
      const side = randomInt(2, 12);
      const answer = 6 * side * side;
      const display = maybeAttachDiagram(this.name, { side }, `A cube has side length ${side} cm. Find its total surface area.`);
      return {
        ...display,
        formula: "Surface area of a cube = 6s²",
        answer,
        worked: `SA = 6 × ${side}² = 6 × ${side * side} = ${answer} cm²`,
      };
    },
  },
  {
    name: "Rectangular Prism",
    buildQuestion() {
      const l = randomInt(3, 14);
      const w = randomInt(2, 10);
      const h = randomInt(2, 9);
      const answer = 2 * (l * w + l * h + w * h);
      const display = maybeAttachDiagram(
        this.name,
        { l, w, h },
        `A rectangular prism has length ${l} cm, width ${w} cm and height ${h} cm. Find its total surface area.`
      );
      return {
        ...display,
        formula: "Surface area of a rectangular prism = 2(lw + lh + wh)",
        answer,
        worked: `SA = 2(${l}×${w} + ${l}×${h} + ${w}×${h}) = 2(${l * w} + ${l * h} + ${w * h}) = 2(${l * w + l * h + w * h}) = ${answer} cm²`,
      };
    },
  },
  {
    name: "Cylinder",
    buildQuestion() {
      const r = randomInt(2, 8);
      const h = randomInt(3, 12);
      const answer = Number((2 * Math.PI * r * (r + h)).toFixed(1));
      const display = maybeAttachDiagram(this.name, { r, h }, `A cylinder has radius ${r} cm and height ${h} cm. Give your answer to 1 decimal place.`);
      return {
        ...display,
        formula: "Surface area of a cylinder = 2πr(r + h)",
        answer,
        worked: `SA = 2π(${r})(${r} + ${h}) = ${answer} cm² (to 1 d.p.)`,
      };
    },
  },
  {
    name: "Sphere",
    buildQuestion() {
      const r = randomInt(2, 10);
      const answer = Number((4 * Math.PI * r * r).toFixed(1));
      const display = maybeAttachDiagram(this.name, { r }, `A sphere has radius ${r} cm. Give its total surface area to 1 decimal place.`);
      return {
        ...display,
        formula: "Surface area of a sphere = 4πr²",
        answer,
        worked: `SA = 4π(${r}²) = 4π(${r * r}) = ${answer} cm² (to 1 d.p.)`,
      };
    },
  },
  {
    name: "Triangular Prism",
    buildQuestion() {
      const base = randomInt(4, 12);
      const triangleHeight = randomInt(3, 10);
      const prismLength = randomInt(4, 14);
      const slant = Number(Math.sqrt((base / 2) ** 2 + triangleHeight ** 2).toFixed(1));
      const baseRectangleArea = base * prismLength;
      const slantRectanglesArea = 2 * slant * prismLength;
      const twoTriangleEndsArea = 2 * (0.5 * base * triangleHeight);
      const answer = Number((baseRectangleArea + slantRectanglesArea + twoTriangleEndsArea).toFixed(1));
      const display = maybeAttachDiagram(
        this.name,
        { base, triangleHeight, prismLength },
        `A triangular prism has an isosceles triangular cross-section with base ${base} cm and height ${triangleHeight} cm, and prism length ${prismLength} cm. Give the total surface area to 1 decimal place.`
      );
      return {
        ...display,
        formula: "SA = (base×length) + (2×slant×length) + (2×½×base×triangle height)",
        answer,
        worked: `Slant side = √((${base}/2)² + ${triangleHeight}²) = ${slant} cm. Triangle area = ½×${base}×${triangleHeight}. SA = (${base}×${prismLength}) + (2×${slant}×${prismLength}) + (2×½×${base}×${triangleHeight}) = ${answer} cm² (to 1 d.p.)`,
      };
    },
  },
];

const fallbackQuestion = {
  shapeName: "Cube",
  prompt: "A cube has side length 5 cm. Find its total surface area.",
  formula: "Surface area of a cube = 6s²",
  answer: 150,
  worked: "SA = 6 × 5² = 6 × 25 = 150 cm²",
  diagram: null,
};

const title = document.getElementById("shape-title");
const questionText = document.getElementById("question-text");
const formulaText = document.getElementById("formula-text");
const workedSolution = document.getElementById("worked-solution");
const answerInput = document.getElementById("answer-input");
const feedback = document.getElementById("feedback");
const checkBtn = document.getElementById("check-btn");
const nextBtn = document.getElementById("next-btn");
const hintBtn = document.getElementById("hint-btn");
const shapeIconEl = document.getElementById("shape-icon");
const questNumberEl = document.getElementById("quest-number");
const diagramWrap = document.getElementById("diagram-wrap");
const diagramContent = document.getElementById("diagram-content");

const correctCountEl = document.getElementById("correct-count");
const attemptedCountEl = document.getElementById("attempted-count");
const accuracyEl = document.getElementById("accuracy");
const streakCountEl = document.getElementById("streak-count");
const levelCountEl = document.getElementById("level-count");
const pointsCountEl = document.getElementById("points-count");
const coinsCountEl = document.getElementById("coins-count");
const hintsUsedEl = document.getElementById("hints-used");
const rewardMessageEl = document.getElementById("reward-message");
const badgeListEl = document.getElementById("badge-list");

const charCreationEl = document.getElementById("char-creation");
const charNameInputEl = document.getElementById("char-name-input");
const charNameErrorEl = document.getElementById("char-name-error");
const startQuestBtn = document.getElementById("start-quest-btn");
const avatarOptions = document.querySelectorAll(".avatar-option");
const gameMain = document.getElementById("game-main");

const charAvatarDisplay = document.getElementById("char-avatar-display");
const charNameDisplay = document.getElementById("char-name-display");
const hpBar = document.getElementById("hp-bar");
const charLevelEl = document.getElementById("char-level");
const charCoinsEl = document.getElementById("char-coins");
const charStreakEl = document.getElementById("char-streak");

const mapGridEl = document.getElementById("map-grid");
const mapStatusEl = document.getElementById("map-status");
const moveUpBtn = document.getElementById("move-up");
const moveDownBtn = document.getElementById("move-down");
const moveLeftBtn = document.getElementById("move-left");
const moveRightBtn = document.getElementById("move-right");

let currentQuestion;
let currentEnemy = null;
let attempted = 0;
let correct = 0;
let streak = 0;
let points = 0;
let coins = 0;
let level = 1;
let hintsUsed = 0;
let hintShown = false;
let questNumber = 0;
let hp = 100;
let charName = "Hero";
let charAvatar = "🧙";
let charColor = "#6741d9";
let gameStarted = false;
let gameOver = false;
let playerPos = { x: Math.floor(MAP_SIZE / 2), y: Math.floor(MAP_SIZE / 2) };
let enemies = [];
let potions = [];
const badges = new Set();

function calculateLevel(totalPoints) {
  return Math.floor(totalPoints / LEVEL_POINT_STEP) + 1;
}

function updateBadges() {
  if (correct >= 5) badges.add("Rookie Solver");
  if (streak >= 3) badges.add("Streak Star");
  if (level >= 4) badges.add("Area Master");
  badgeListEl.textContent = badges.size > 0 ? `Badges: ${Array.from(badges).join(" • ")}` : "Badges: None yet";
}

function updateCharPanel() {
  charAvatarDisplay.textContent = charAvatar;
  charAvatarDisplay.style.background = charColor;
  charNameDisplay.textContent = charName;
  hpBar.style.width = `${hp}%`;
  if (hp > 60) {
    hpBar.style.background = "#2d9e4e";
  } else if (hp > 30) {
    hpBar.style.background = "#d97c28";
  } else {
    hpBar.style.background = "#d93b3b";
  }
  charLevelEl.textContent = String(level);
  charCoinsEl.textContent = String(coins);
  charStreakEl.textContent = String(streak);
}

function updateScoreboard() {
  correctCountEl.textContent = String(correct);
  attemptedCountEl.textContent = String(attempted);
  const accuracy = attempted === 0 ? 0 : Math.round((correct / attempted) * 100);
  accuracyEl.textContent = `${accuracy}%`;
  streakCountEl.textContent = String(streak);
  levelCountEl.textContent = String(level);
  pointsCountEl.textContent = String(points);
  coinsCountEl.textContent = String(coins);
  hintsUsedEl.textContent = String(hintsUsed);
  updateBadges();
  updateCharPanel();
}

function showRewardMessage(message) {
  rewardMessageEl.textContent = message;
}

function updateControlStates() {
  const encounterActive = Boolean(currentEnemy);
  const movementLocked = !gameStarted || gameOver || encounterActive;
  moveUpBtn.disabled = movementLocked;
  moveDownBtn.disabled = movementLocked;
  moveLeftBtn.disabled = movementLocked;
  moveRightBtn.disabled = movementLocked;

  const canAnswer = gameStarted && !gameOver && encounterActive;
  answerInput.disabled = !canAnswer;
  checkBtn.disabled = !canAnswer;
  hintBtn.disabled = !canAnswer || hintShown;
}

function showExplorationQuestCard() {
  title.textContent = "Explore the map";
  shapeIconEl.textContent = "🗺️";
  questNumberEl.textContent = `#${questNumber}`;
  questionText.textContent = "Move onto an enemy tile and solve the puzzle to defeat that enemy.";
  formulaText.textContent = "";
  formulaText.classList.add("hidden");
  workedSolution.textContent = "";
  diagramWrap.classList.add("hidden");
  diagramContent.innerHTML = "";
  hintShown = false;
  updateControlStates();
}

function randomUnusedCell(used) {
  let x;
  let y;
  do {
    x = randomInt(0, MAP_SIZE - 1);
    y = randomInt(0, MAP_SIZE - 1);
  } while (used.has(`${x},${y}`));

  used.add(`${x},${y}`);
  return { x, y };
}

function initializeMap() {
  playerPos = { x: Math.floor(MAP_SIZE / 2), y: Math.floor(MAP_SIZE / 2) };
  const used = new Set([`${playerPos.x},${playerPos.y}`]);

  enemies = Array.from({ length: ENEMY_COUNT }, (_, index) => {
    const cell = randomUnusedCell(used);
    return {
      id: index + 1,
      x: cell.x,
      y: cell.y,
      defeated: false,
      name: `Enemy ${index + 1}`,
    };
  });

  potions = Array.from({ length: POTION_COUNT }, () => {
    const cell = randomUnusedCell(used);
    return {
      x: cell.x,
      y: cell.y,
      used: false,
    };
  });
}

function renderMap() {
  mapGridEl.innerHTML = "";
  for (let y = 0; y < MAP_SIZE; y += 1) {
    for (let x = 0; x < MAP_SIZE; x += 1) {
      const cell = document.createElement("div");
      cell.className = "map-cell";

      const enemy = enemies.find((e) => e.x === x && e.y === y);
      const potion = potions.find((p) => p.x === x && p.y === y && !p.used);

      if (playerPos.x === x && playerPos.y === y) {
        cell.classList.add("player");
        cell.textContent = charAvatar;
      } else if (enemy && enemy.defeated) {
        cell.classList.add("defeated");
        cell.textContent = "💀";
      } else if (enemy) {
        cell.classList.add("enemy");
        cell.textContent = "👾";
      } else if (potion) {
        cell.classList.add("potion");
        cell.textContent = "🧪";
      } else {
        cell.textContent = "·";
      }

      mapGridEl.appendChild(cell);
    }
  }
}

function getRandomQuestion() {
  if (shapes.length === 0) {
    return {
      shapeName: fallbackQuestion.shapeName,
      ...fallbackQuestion,
    };
  }

  const shape = shapes[randomInt(0, shapes.length - 1)];
  let shapeName = shape.name;

  try {
    return {
      shapeName,
      ...shape.buildQuestion(),
    };
  } catch (error) {
    console.warn("Question generation failed, using fallback question.", error);
    shapeName = fallbackQuestion.shapeName;
    return {
      shapeName,
      ...fallbackQuestion,
    };
  }
}

function startEncounter(enemy) {
  currentEnemy = enemy;
  questNumber += 1;
  currentQuestion = getRandomQuestion();
  hintShown = false;

  title.textContent = `${enemy.name} • ${currentQuestion.shapeName}`;
  shapeIconEl.textContent = SHAPE_ICONS[currentQuestion.shapeName] || "📐";
  questNumberEl.textContent = `#${questNumber}`;
  questionText.textContent = currentQuestion.prompt;
  formulaText.textContent = currentQuestion.formula;
  formulaText.classList.add("hidden");
  workedSolution.textContent = currentQuestion.worked;
  answerInput.value = "";
  answerInput.focus();
  feedback.textContent = "Defeat this enemy by solving the puzzle.";
  feedback.className = "feedback";
  hintBtn.textContent = "Show formula hint";

  if (currentQuestion.diagram) {
    diagramWrap.classList.remove("hidden");
    diagramContent.innerHTML = currentQuestion.diagram;
  } else {
    diagramWrap.classList.add("hidden");
    diagramContent.innerHTML = "";
  }

  mapStatusEl.textContent = `${enemy.name} encountered! Solve correctly to win.`;
  updateControlStates();
}

function triggerGameOver() {
  gameOver = true;
  currentEnemy = null;
  currentQuestion = null;
  title.textContent = "💀 Game Over";
  shapeIconEl.textContent = "💀";
  questionText.textContent = "Your health hit zero. Refresh the page to start a new run.";
  formulaText.textContent = "";
  formulaText.classList.add("hidden");
  workedSolution.textContent = "";
  diagramWrap.classList.add("hidden");
  diagramContent.innerHTML = "";
  mapStatusEl.textContent = "Game over — your hero has fallen.";
  showRewardMessage("Game over! Defeat enemies faster and collect potions next run.");
  updateControlStates();
  renderMap();
}

function checkMapTileEffects() {
  const potion = potions.find((p) => !p.used && p.x === playerPos.x && p.y === playerPos.y);
  if (potion) {
    potion.used = true;
    hp = Math.min(100, hp + 30);
    mapStatusEl.textContent = "Potion collected! Health restored by 30.";
  }

  const enemy = enemies.find((e) => !e.defeated && e.x === playerPos.x && e.y === playerPos.y);
  if (enemy) {
    startEncounter(enemy);
  }

  updateScoreboard();
  renderMap();
}

function movePlayer(dx, dy) {
  if (!gameStarted || gameOver || currentEnemy) {
    return;
  }

  const nextX = playerPos.x + dx;
  const nextY = playerPos.y + dy;

  if (nextX < 0 || nextX >= MAP_SIZE || nextY < 0 || nextY >= MAP_SIZE) {
    mapStatusEl.textContent = "You cannot move outside the map.";
    return;
  }

  playerPos = { x: nextX, y: nextY };
  mapStatusEl.textContent = "You moved to a new tile.";
  checkMapTileEffects();
}

function showHint() {
  if (!currentQuestion || !currentEnemy || gameOver) return;
  if (!hintShown) {
    hintsUsed += 1;
  }
  hintShown = true;
  formulaText.classList.remove("hidden");
  hintBtn.textContent = "Hint shown";
  hintBtn.disabled = true;
  updateScoreboard();
}

function checkAnswer() {
  if (!currentQuestion || !currentEnemy || gameOver) {
    feedback.textContent = "Move onto an enemy tile to start a puzzle.";
    feedback.className = "feedback bad";
    return;
  }

  const value = Number(answerInput.value);
  if (!answerInput.value || Number.isNaN(value)) {
    feedback.textContent = "Enter a number to submit your answer!";
    feedback.className = "feedback bad";
    return;
  }

  attempted += 1;
  const isCorrect = Math.abs(value - currentQuestion.answer) < 0.15;

  if (isCorrect) {
    const basePoints = hintShown ? POINTS_WITH_HINT : POINTS_WITHOUT_HINT;
    const coinsEarned = hintShown ? COINS_WITH_HINT : COINS_WITHOUT_HINT;
    correct += 1;
    streak += 1;
    hp = Math.min(100, hp + 10);
    const streakBonus = Math.max(streak - 1, 0) * STREAK_BONUS_STEP;
    const pointsEarned = basePoints + streakBonus;
    points += pointsEarned;
    coins += coinsEarned;
    level = calculateLevel(points);

    currentEnemy.defeated = true;
    const defeatedEnemy = currentEnemy.name;
    currentEnemy = null;
    currentQuestion = null;

    feedback.textContent = `Great job! ${defeatedEnemy} defeated.`;
    feedback.className = "feedback good";
    showRewardMessage(`+${pointsEarned} points  •  +${coinsEarned} 🪙${streak > 1 ? `  •  🔥 ×${streak} streak!` : ""}`);

    const remainingEnemies = enemies.filter((enemy) => !enemy.defeated).length;
    if (remainingEnemies === 0) {
      mapStatusEl.textContent = "All enemies defeated! You cleared the map.";
    } else {
      mapStatusEl.textContent = `${defeatedEnemy} defeated. ${remainingEnemies} enemies remain.`;
    }

    showExplorationQuestCard();
  } else {
    streak = 0;
    hp = Math.max(0, hp - 25);
    feedback.textContent = `Not quite, ${charName}. The answer was ${currentQuestion.answer} cm².`;
    feedback.className = "feedback bad";
    showRewardMessage("Wrong answer: enemy attack deals 25 damage.");
    mapStatusEl.textContent = `${currentEnemy.name} attacked you!`;

    if (hp <= 0) {
      triggerGameOver();
    }
  }

  updateScoreboard();
  renderMap();
  updateControlStates();
}

avatarOptions.forEach((opt) => {
  opt.addEventListener("click", () => {
    avatarOptions.forEach((option) => {
      option.classList.remove("selected");
      option.setAttribute("aria-pressed", "false");
    });
    opt.classList.add("selected");
    opt.setAttribute("aria-pressed", "true");
    charAvatar = opt.dataset.avatar;
    charColor = opt.dataset.color;
    renderMap();
  });
});

startQuestBtn.addEventListener("click", () => {
  const name = charNameInputEl.value.trim();
  if (!name) {
    charNameErrorEl.classList.remove("hidden");
    charNameInputEl.focus();
    return;
  }

  charNameErrorEl.classList.add("hidden");
  charName = name;
  charCreationEl.classList.add("hidden");
  gameMain.removeAttribute("aria-hidden");
  gameStarted = true;

  initializeMap();
  showExplorationQuestCard();
  updateScoreboard();
  renderMap();
  mapStatusEl.textContent = "Explore the map, collect potions, and defeat enemies.";
  showRewardMessage("Battle rewards: solve enemy puzzles to gain points and coins.");
  nextBtn.style.display = "none";
  updateControlStates();
});

charNameInputEl.addEventListener("input", () => {
  if (charNameInputEl.value.trim()) {
    charNameErrorEl.classList.add("hidden");
  }
});

charNameInputEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    startQuestBtn.click();
  }
});

checkBtn.addEventListener("click", checkAnswer);
hintBtn.addEventListener("click", showHint);
answerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkAnswer();
  }
});

moveUpBtn.addEventListener("click", () => movePlayer(0, -1));
moveDownBtn.addEventListener("click", () => movePlayer(0, 1));
moveLeftBtn.addEventListener("click", () => movePlayer(-1, 0));
moveRightBtn.addEventListener("click", () => movePlayer(1, 0));

document.addEventListener("keydown", (event) => {
  if (!gameStarted || gameOver || currentEnemy) return;
  if (event.target === answerInput || event.target === charNameInputEl) return;

  if (event.key === "ArrowUp") {
    event.preventDefault();
    movePlayer(0, -1);
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    movePlayer(0, 1);
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    movePlayer(-1, 0);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    movePlayer(1, 0);
  }
});

showExplorationQuestCard();
updateScoreboard();
renderMap();
