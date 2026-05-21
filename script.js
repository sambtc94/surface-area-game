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
];

const title = document.getElementById("shape-title");
const questionText = document.getElementById("question-text");
const formulaText = document.getElementById("formula-text");
const workedSolution = document.getElementById("worked-solution");
const answerInput = document.getElementById("answer-input");
const feedback = document.getElementById("feedback");
const checkBtn = document.getElementById("check-btn");
const nextBtn = document.getElementById("next-btn");

const correctCountEl = document.getElementById("correct-count");
const attemptedCountEl = document.getElementById("attempted-count");
const accuracyEl = document.getElementById("accuracy");
const streakCountEl = document.getElementById("streak-count");

let currentQuestion;
let attempted = 0;
let correct = 0;
let streak = 0;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function nextQuestion() {
  const shape = shapes[randomInt(0, shapes.length - 1)];
  currentQuestion = shape.buildQuestion();

  title.textContent = shape.name;
  questionText.textContent = currentQuestion.prompt;
  formulaText.textContent = currentQuestion.formula;
  workedSolution.textContent = currentQuestion.worked;
  answerInput.value = "";
  feedback.textContent = "";
  feedback.className = "feedback";
  answerInput.focus();
}

function updateScoreboard() {
  correctCountEl.textContent = String(correct);
  attemptedCountEl.textContent = String(attempted);
  const accuracy = attempted === 0 ? 0 : Math.round((correct / attempted) * 100);
  accuracyEl.textContent = `${accuracy}%`;
  streakCountEl.textContent = String(streak);
}

function checkAnswer() {
  const value = Number(answerInput.value);
  if (!answerInput.value || Number.isNaN(value)) {
    feedback.textContent = "Please enter a number first.";
    feedback.className = "feedback bad";
    return;
  }

  attempted += 1;
  const isCorrect = Math.abs(value - currentQuestion.answer) < 0.15;

  if (isCorrect) {
    correct += 1;
    streak += 1;
    feedback.textContent = `Correct! ${currentQuestion.answer} cm² is right.`;
    feedback.className = "feedback good";
  } else {
    streak = 0;
    feedback.textContent = `Not quite. Correct answer: ${currentQuestion.answer} cm².`;
    feedback.className = "feedback bad";
  }

  updateScoreboard();
}

checkBtn.addEventListener("click", checkAnswer);
nextBtn.addEventListener("click", nextQuestion);
answerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkAnswer();
  }
});

nextQuestion();
updateScoreboard();
