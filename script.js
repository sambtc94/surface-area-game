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
const BOSS_ENEMY_COUNT = 2;
const BOSS_POINT_MULTIPLIER = 2;
const MAP_CLEARED_BONUS_POINTS = 500;
const MAP_CLEARED_BONUS_COINS = 10;
const POTION_COUNT = 5;
const MAX_HEALTH = 100;
const POTION_HEAL_AMOUNT = 30;
const CORRECT_ANSWER_HEAL_AMOUNT = 10;
const WRONG_ANSWER_DAMAGE = 25;
const DIAGRAM_PROBABILITY = 1;

function getInitialPlayerPos() {
  return { x: Math.floor(MAP_SIZE / 2), y: Math.floor(MAP_SIZE / 2) };
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function maybeAttachDiagram(shapeName, details, textPrompt) {
  const useDiagram = Math.random() < DIAGRAM_PROBABILITY;
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

function buildCompositeQuestion(shapePool = shapes) {
  if (shapePool.length < 2) {
    throw new Error("At least two shapes are required for a composite question.");
  }

  const idx1 = randomInt(0, shapePool.length - 1);
  let idx2;
  do {
    idx2 = randomInt(0, shapePool.length - 1);
  } while (idx2 === idx1);

  const shape1 = shapePool[idx1];
  const shape2 = shapePool[idx2];
  const q1 = shape1.buildQuestion();
  const q2 = shape2.buildQuestion();
  const totalAnswer = Number((q1.answer + q2.answer).toFixed(1));

  const diag1 = q1.diagram || `<p>${q1.prompt}</p>`;
  const diag2 = q2.diagram || `<p>${q2.prompt}</p>`;
  const combinedDiagram = `<div class="composite-diagrams"><div class="composite-part"><strong>Shape 1: ${shape1.name}</strong>${diag1}</div><div class="composite-part"><strong>Shape 2: ${shape2.name}</strong>${diag2}</div></div>`;

  return {
    shapeName: `${shape1.name} & ${shape2.name}`,
    prompt: `Boss challenge! Find the COMBINED total surface area of both shapes shown. Give your answer to 1 decimal place.`,
    formula: `[Shape 1] ${q1.formula}  •  [Shape 2] ${q2.formula}`,
    answer: totalAnswer,
    worked: `Shape 1 (${shape1.name}): ${q1.worked}  |  Shape 2 (${shape2.name}): ${q2.worked}  |  Combined = ${q1.answer} + ${q2.answer} = ${totalAnswer} cm²`,
    diagram: combinedDiagram,
  };
}

const fallbackQuestion = {
  prompt: "A cube has side length 5 cm. Find its total surface area.",
  formula: "Surface area of a cube = 6s²",
  answer: 150,
  worked: "SA = 6 × 5² = 6 × 25 = 150 cm²",
  diagram: buildShapeDiagram("Cube", { side: 5 }),
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
const optionNoSphereEl = document.getElementById("option-no-sphere");
const optionNoSlantEl = document.getElementById("option-no-slant");
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

const gameOverScreenEl = document.getElementById("game-over-screen");
const gameOverStatsEl = document.getElementById("gameover-stats");
const gameOverPlayAgainBtn = document.getElementById("gameover-play-again");

const victoryScreenEl = document.getElementById("victory-screen");
const victoryBonusMsgEl = document.getElementById("victory-bonus-msg");
const victoryStatsEl = document.getElementById("victory-stats");
const victoryPlayAgainBtn = document.getElementById("victory-play-again");

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
let hp = MAX_HEALTH;
let charName = "Hero";
let charAvatar = "🧙";
let charColor = "#6741d9";
let removeSphereQuestions = false;
let removeSlantHeightQuestions = false;
let gameStarted = false;
let gameOver = false;
let playerPos = getInitialPlayerPos();
let enemies = [];
let potions = [];
let terrainMap = [];
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
  checkForGameOver();
}

function checkForGameOver() {
  if (hp <= 0 && !gameOver) {
    triggerGameOver();
    return true;
  }
  return false;
}

function showRewardMessage(message) {
  rewardMessageEl.textContent = message;
}

function isMovementLocked() {
  return !gameStarted || gameOver || !!currentEnemy;
}

function updateControlStates() {
  const encounterActive = Boolean(currentEnemy);
  const movementLocked = isMovementLocked();
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
  playerPos = getInitialPlayerPos();
  terrainMap = Array.from({ length: MAP_SIZE }, (_, y) =>
    Array.from({ length: MAP_SIZE }, (_, x) => {
      if (x === playerPos.x && y === playerPos.y) return "path";
      const roll = Math.random();
      if (roll < 0.52) return "grass";
      if (roll < 0.72) return "forest";
      if (roll < 0.86) return "path";
      if (roll < 0.95) return "stone";
      return "water";
    })
  );
  const used = new Set([`${playerPos.x},${playerPos.y}`]);

  enemies = Array.from({ length: ENEMY_COUNT }, (_, index) => {
    const cell = randomUnusedCell(used);
    const isBoss = index < BOSS_ENEMY_COUNT;
    return {
      id: index + 1,
      x: cell.x,
      y: cell.y,
      defeated: false,
      isBoss,
      name: isBoss ? `Boss ${index + 1}` : `Enemy ${index + 1 - BOSS_ENEMY_COUNT}`,
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

function createMapSprite(type, label) {
  const sprite = document.createElement("span");
  sprite.className = `sprite sprite-${type}`;
  sprite.setAttribute("aria-hidden", "true");
  sprite.textContent = label;
  return sprite;
}

function renderMap() {
  mapGridEl.innerHTML = "";
  for (let y = 0; y < MAP_SIZE; y += 1) {
    for (let x = 0; x < MAP_SIZE; x += 1) {
      const cell = document.createElement("div");
      cell.className = "map-cell";
      const terrain = terrainMap[y]?.[x] || "grass";
      cell.classList.add(`terrain-${terrain}`);

      const enemy = enemies.find((e) => e.x === x && e.y === y);
      const potion = potions.find((p) => p.x === x && p.y === y && !p.used);

      if (playerPos.x === x && playerPos.y === y) {
        cell.classList.add("player");
        cell.appendChild(createMapSprite("player", charAvatar));
        cell.setAttribute("aria-label", `${charName} position`);
      } else if (enemy && enemy.defeated) {
        cell.classList.add("defeated");
        cell.appendChild(createMapSprite("defeated", "💀"));
        cell.setAttribute("aria-label", "Defeated enemy");
      } else if (enemy && enemy.isBoss) {
        cell.classList.add("enemy", "boss");
        cell.appendChild(createMapSprite("boss", "👾👾"));
        cell.setAttribute("aria-label", `${enemy.name} boss enemy`);
      } else if (enemy) {
        cell.classList.add("enemy");
        cell.appendChild(createMapSprite("enemy", "👾"));
        cell.setAttribute("aria-label", `${enemy.name} enemy`);
      } else if (potion) {
        cell.classList.add("potion");
        cell.appendChild(createMapSprite("potion", "🧪"));
        cell.setAttribute("aria-label", "Health potion");
      } else {
        cell.setAttribute("aria-label", `${terrain} tile`);
      }

      mapGridEl.appendChild(cell);
    }
  }
}

function getRandomQuestion() {
  const availableShapes = shapes.filter((shape) => {
    if (removeSphereQuestions && shape.name === "Sphere") return false;
    if (removeSlantHeightQuestions && shape.name === "Triangular Prism") return false;
    return true;
  });

  if (availableShapes.length === 0) {
    return {
      shapeName: "Cube",
      ...fallbackQuestion,
    };
  }

  const shape = availableShapes[randomInt(0, availableShapes.length - 1)];
  let shapeName = shape.name;

  try {
    return {
      shapeName,
      ...shape.buildQuestion(),
    };
  } catch (error) {
    console.warn("Question generation failed, using fallback question.", error);
    shapeName = "Cube";
    return {
      shapeName,
      ...fallbackQuestion,
    };
  }
}

function getBossQuestion() {
  const availableShapes = shapes.filter((shape) => {
    if (removeSphereQuestions && shape.name === "Sphere") return false;
    if (removeSlantHeightQuestions && shape.name === "Triangular Prism") return false;
    return true;
  });

  if (availableShapes.length < 2) {
    return getRandomQuestion();
  }

  try {
    return buildCompositeQuestion(availableShapes);
  } catch (error) {
    console.warn("Composite question generation failed, using regular question.", error);
    return getRandomQuestion();
  }
}

function startEncounter(enemy) {
  currentEnemy = enemy;
  questNumber += 1;
  currentQuestion = enemy.isBoss ? getBossQuestion() : getRandomQuestion();
  hintShown = false;

  const enemyLabel = enemy.isBoss ? `👾👾 ${enemy.name}` : enemy.name;
  title.textContent = `${enemyLabel} • ${currentQuestion.shapeName}`;
  shapeIconEl.textContent = enemy.isBoss ? "👾" : (SHAPE_ICONS[currentQuestion.shapeName] || "📐");
  questNumberEl.textContent = `#${questNumber}`;
  questionText.textContent = currentQuestion.prompt;
  formulaText.textContent = currentQuestion.formula;
  formulaText.classList.add("hidden");
  workedSolution.textContent = currentQuestion.worked;
  answerInput.value = "";
  answerInput.focus();
  feedback.textContent = enemy.isBoss
    ? "⚠️ Boss enemy! Solve the composite challenge for DOUBLE points."
    : "Defeat this enemy by solving the puzzle.";
  feedback.className = "feedback";
  hintBtn.textContent = "Show formula hint";

  if (currentQuestion.diagram) {
    diagramWrap.classList.remove("hidden");
    diagramContent.innerHTML = currentQuestion.diagram;
  } else {
    diagramWrap.classList.add("hidden");
    diagramContent.innerHTML = "";
  }

  mapStatusEl.textContent = enemy.isBoss
    ? `👾👾 ${enemy.name} encountered! Boss battle — double points await!`
    : `${enemy.name} encountered! Solve correctly to win.`;
  updateControlStates();
}

function triggerGameOver() {
  gameOver = true;
  currentEnemy = null;
  currentQuestion = null;
  title.textContent = "💀 Game Over";
  shapeIconEl.textContent = "💀";
  questionText.textContent = "Your health hit zero. Use Play Again to start a new run.";
  formulaText.textContent = "";
  formulaText.classList.add("hidden");
  workedSolution.textContent = "";
  diagramWrap.classList.add("hidden");
  diagramContent.innerHTML = "";
  mapStatusEl.textContent = "Game over — your hero has fallen.";

  const defeated = enemies.filter((e) => e.defeated).length;
  const accuracy = attempted === 0 ? 0 : Math.round((correct / attempted) * 100);
  gameOverStatsEl.innerHTML = `
    <p>⚡ Level reached: <strong>${level}</strong></p>
    <p>🪙 Coins earned: <strong>${coins}</strong></p>
    <p>💥 Points: <strong>${points}</strong></p>
    <p>👾 Enemies defeated: <strong>${defeated} / ${ENEMY_COUNT}</strong></p>
    <p>🎯 Accuracy: <strong>${accuracy}%</strong></p>
    <p>🔥 Best streak: <strong>${streak}</strong></p>
  `;
  gameOverScreenEl.classList.remove("hidden");

  updateCharPanel();
  updateControlStates();
  renderMap();
}

function triggerVictory() {
  gameOver = true;
  badges.add("Map Cleared!");
  const accuracy = attempted === 0 ? 0 : Math.round((correct / attempted) * 100);
  points += MAP_CLEARED_BONUS_POINTS;
  coins += MAP_CLEARED_BONUS_COINS;
  level = calculateLevel(points);

  victoryBonusMsgEl.textContent = `🎁 Bonus reward: +${MAP_CLEARED_BONUS_POINTS} points & +${MAP_CLEARED_BONUS_COINS} 🪙 coins!`;
  victoryStatsEl.innerHTML = `
    <p>⚡ Final level: <strong>${level}</strong></p>
    <p>🪙 Total coins: <strong>${coins}</strong></p>
    <p>💥 Total points: <strong>${points}</strong></p>
    <p>🎯 Accuracy: <strong>${accuracy}%</strong></p>
    <p>🔥 Streak: <strong>${streak}</strong></p>
  `;
  victoryScreenEl.classList.remove("hidden");

  mapStatusEl.textContent = "🎉 All enemies defeated! Map cleared!";
  updateScoreboard();
  renderMap();
}

function checkMapTileEffects() {
  const potion = potions.find((p) => !p.used && p.x === playerPos.x && p.y === playerPos.y);
  if (potion) {
    potion.used = true;
    const hpBefore = hp;
    hp = Math.min(MAX_HEALTH, hp + POTION_HEAL_AMOUNT);
    const healedAmount = hp - hpBefore;
    mapStatusEl.textContent =
      healedAmount > 0
        ? `Potion collected! Health restored by ${healedAmount}.`
        : "Potion collected, but your health was already full.";
  }

  const enemy = enemies.find((e) => !e.defeated && e.x === playerPos.x && e.y === playerPos.y);
  if (enemy) {
    startEncounter(enemy);
  }

  updateScoreboard();
  renderMap();
}

function movePlayer(dx, dy) {
  if (isMovementLocked()) {
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
    hp = Math.min(MAX_HEALTH, hp + CORRECT_ANSWER_HEAL_AMOUNT);
    const streakBonus = Math.max(streak - 1, 0) * STREAK_BONUS_STEP;
    const multiplier = currentEnemy.isBoss ? BOSS_POINT_MULTIPLIER : 1;
    const pointsEarned = (basePoints + streakBonus) * multiplier;
    const actualCoins = coinsEarned * multiplier;
    points += pointsEarned;
    coins += actualCoins;
    level = calculateLevel(points);

    currentEnemy.defeated = true;
    const defeatedEnemy = currentEnemy.name;
    const wasBoss = currentEnemy.isBoss;
    currentEnemy = null;
    currentQuestion = null;

    feedback.textContent = wasBoss
      ? `⚡ Boss defeated! ${defeatedEnemy} vanquished for double points!`
      : `Great job! ${defeatedEnemy} defeated.`;
    feedback.className = "feedback good";
    showRewardMessage(`+${pointsEarned} points  •  +${actualCoins} 🪙${wasBoss ? "  •  ×2 BOSS BONUS!" : ""}${streak > 1 ? `  •  🔥 ×${streak} streak!` : ""}`);

    const remainingEnemies = enemies.filter((enemy) => !enemy.defeated).length;
    if (remainingEnemies === 0) {
      showExplorationQuestCard();
      updateScoreboard();
      renderMap();
      triggerVictory();
      return;
    }

    mapStatusEl.textContent = `${defeatedEnemy} defeated. ${remainingEnemies} enemies remain.`;
    showExplorationQuestCard();
  } else {
    streak = 0;
    hp = Math.max(0, hp - WRONG_ANSWER_DAMAGE);
    feedback.textContent = `Not quite, ${charName}. The answer was ${currentQuestion.answer} cm².`;
    feedback.className = "feedback bad";
    showRewardMessage(`Wrong answer: enemy attack deals ${WRONG_ANSWER_DAMAGE} damage.`);

    if (checkForGameOver()) {
      return;
    }

    mapStatusEl.textContent = `${currentEnemy.name} attacked you!`;
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
    if (gameStarted) {
      renderMap();
    }
  });
});

startQuestBtn.addEventListener("click", () => {
  startGame();
});

function startGame() {
  const name = charNameInputEl.value.trim();
  const playerName = name || "Hero";
  charNameErrorEl.classList.add("hidden");
  charName = playerName;
  removeSphereQuestions = optionNoSphereEl?.checked || false;
  removeSlantHeightQuestions = optionNoSlantEl?.checked || false;
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
}

charNameInputEl.addEventListener("input", () => {
  if (charNameInputEl.value.trim()) {
    charNameErrorEl.classList.add("hidden");
  }
});

charNameInputEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    startGame();
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

gameOverPlayAgainBtn.addEventListener("click", () => { window.location.reload(); });
victoryPlayAgainBtn.addEventListener("click", () => { window.location.reload(); });

document.addEventListener("keydown", (event) => {
  if (isMovementLocked()) return;
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
