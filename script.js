const shapes = [
  {
    name: "Cube",
    buildQuestion() {
      const side = randomInt(2, 12);
      const answer = 6 * side * side;
      return {
        prompt: `A cube has side length ${side} cm. Find its total surface area.`,
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
      return {
        prompt: `A rectangular prism has length ${l} cm, width ${w} cm and height ${h} cm. Find its total surface area.`,
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
      return {
        prompt: `A cylinder has radius ${r} cm and height ${h} cm. Give your answer to 1 decimal place.`,
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
      return {
        prompt: `A sphere has radius ${r} cm. Give its total surface area to 1 decimal place.`,
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
      return {
        prompt: `A triangular prism has an isosceles triangular cross-section with base ${base} cm and height ${triangleHeight} cm, and prism length ${prismLength} cm. Give the total surface area to 1 decimal place.`,
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
const LEVEL_POINT_STEP = 250;
const STREAK_BONUS_STEP = 10;
const POINTS_WITH_HINT = 80;
const POINTS_WITHOUT_HINT = 100;
const COINS_WITH_HINT = 1;
const COINS_WITHOUT_HINT = 3;

let currentQuestion;
let attempted = 0;
let correct = 0;
let streak = 0;
let points = 0;
let coins = 0;
let level = 1;
let hintsUsed = 0;
let hintShown = false;
const badges = new Set();

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function nextQuestion() {
  if (shapes.length === 0) {
    title.textContent = "Question unavailable";
    questionText.textContent = "No question generators are configured.";
    formulaText.textContent = "";
    workedSolution.textContent = "";
    return;
  }

  const shape = shapes[randomInt(0, shapes.length - 1)];
  let shapeName = shape.name;

  try {
    currentQuestion = shape.buildQuestion();
  } catch (error) {
    console.warn("Question generation failed, using fallback question.", error);
    currentQuestion = {
      prompt: fallbackQuestion.prompt,
      formula: fallbackQuestion.formula,
      answer: fallbackQuestion.answer,
      worked: fallbackQuestion.worked,
    };
    shapeName = fallbackQuestion.shapeName;
  }

  title.textContent = shapeName;
  questionText.textContent = currentQuestion.prompt;
  formulaText.textContent = currentQuestion.formula;
  formulaText.classList.add("hidden");
  hintBtn.textContent = "Show formula hint";
  hintBtn.disabled = false;
  hintShown = false;
  workedSolution.textContent = currentQuestion.worked;
  answerInput.value = "";
  feedback.textContent = "";
  feedback.className = "feedback";
  answerInput.focus();
}

function updateBadges() {
  if (correct >= 5) badges.add("Rookie Solver");
  if (streak >= 3) badges.add("Streak Star");
  if (level >= 4) badges.add("Area Master");
  badgeListEl.textContent = badges.size > 0 ? `Badges: ${Array.from(badges).join(" • ")}` : "Badges: None yet";
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
}

function showRewardMessage(message) {
  rewardMessageEl.textContent = message;
}

function showHint() {
  if (!currentQuestion) return;
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
  if (!currentQuestion) {
    feedback.textContent = "Question failed to load. Please click Next question.";
    feedback.className = "feedback bad";
    return;
  }

  const value = Number(answerInput.value);
  if (!answerInput.value || Number.isNaN(value)) {
    feedback.textContent = "Please enter a number first.";
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
    const streakBonus = Math.max(streak - 1, 0) * STREAK_BONUS_STEP;
    const pointsEarned = basePoints + streakBonus;
    points += pointsEarned;
    coins += coinsEarned;
    level = Math.floor(points / LEVEL_POINT_STEP) + 1;
    feedback.textContent = `Correct! ${currentQuestion.answer} cm² is right.`;
    feedback.className = "feedback good";
    showRewardMessage(`Reward +${pointsEarned} points, +${coinsEarned} coins!`);
  } else {
    streak = 0;
    feedback.textContent = `Not quite. Correct answer: ${currentQuestion.answer} cm².`;
    feedback.className = "feedback bad";
    showRewardMessage("No reward this round. Try again for a streak bonus!");
  }

  updateScoreboard();
}

checkBtn.addEventListener("click", checkAnswer);
nextBtn.addEventListener("click", nextQuestion);
hintBtn.addEventListener("click", showHint);
answerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkAnswer();
  }
});

nextQuestion();
updateScoreboard();
