const iconSun = document.querySelector(".icon-sun-image");
const iconMoon = document.querySelector(".icon-moon-image");
const themeBtn = document.getElementById("theme-toggle");

const quizOptions = document.querySelector(".quiz-options");

const quizCategoryContainer = document.querySelector(
  ".quiz-category-container"
);
const headerQuizIcon = document.querySelector(".quiz-icon");
const quizCategoryText = document.querySelector(".quiz-category-text");

const answerBoxes = document.querySelectorAll(".answer-option");
const answersText = document.querySelectorAll(".answer-text");
const currentQuestion = document.querySelector(".current-question");
const questionTextBox = document.querySelector(".question-text");
const progress = document.querySelector(".progress");
const submitBtn = document.querySelector(".btn-container.submit-answer");
const nextBtn = document.querySelector(".btn-container.next-question");
const restartBtn = document.querySelector(".restart-btn");

const playerScoreText = document.querySelector(".player-score");
const errorMessage = document.querySelector(".error-message");

const startScreen = document.getElementById("start");
const gameScreen = document.querySelector(".game-screen");
const endScreen = document.querySelector(".end-screen");

const endScreenSection = document.querySelector(".end-section-container");

let currentQuestionNumber = 0;
let bgIconChoice = "";
let iconChoice = null;
let textChoice = "";
let correctAnswers = 0;
let selectedAnswerText = "";
let selectedAnswerBox = null;
let correctAnswerText = "";
let correctAnswerBox = null;
let quizList = null;

function resetParameters() {
  selectedAnswerText = "";
  selectedAnswerBox = null;
  correctAnswerText = "";
  correctAnswerBox = null;
  answerBoxes.forEach((answerBox) => {
    answerBox.classList.remove("active", "correct", "wrong");
    const icon = answerBox.querySelector(".answer-icon img");
    icon.src = "";
  });
}

function checkAnswer() {
  const icon = correctAnswerBox.querySelector(".answer-icon img");
  icon.src = "assets/images/icon-correct.svg";
  errorMessage.style.display = "none";
  if (correctAnswerText === selectedAnswerText) {
    selectedAnswerBox.classList.add("correct");
    correctAnswers++;
  } else {
    const selectedAnswerIcon =
      selectedAnswerBox.querySelector(".answer-icon img");
    selectedAnswerIcon.src = "assets/images/icon-incorrect.svg";
    selectedAnswerBox.classList.add("wrong");
  }
  currentQuestionNumber++;
  submitBtn.style.display = "none";
  nextBtn.style.display = "flex";
}

function endScreenDisplay() {
  const finalIcon = endScreenSection.querySelector("img");
  const textIcon = endScreenSection.querySelector(".selected-quiz-text");
  gameScreen.style.display = "none";
  endScreen.style.display = "flex";
  finalIcon.src = iconChoice;
  finalIcon.classList.add(bgIconChoice);
  textIcon.textContent = textChoice;
  playerScoreText.textContent = correctAnswers;
}

function nextQuestion(quizzes) {
  resetParameters();
  if (currentQuestionNumber == 10) endScreenDisplay();
  else {
    progress.style.width = ((currentQuestionNumber + 1) / 10) * 100 + "%";
    currentQuestion.textContent = currentQuestionNumber + 1;
    questionTextBox.textContent = quizzes[currentQuestionNumber].question;
    answersText.forEach((answerText, index) => {
      answerText.textContent = quizzes[currentQuestionNumber].options[index];
    });

    answerBoxes.forEach((answerBox) => {
      correctAnswerText = quizzes[currentQuestionNumber].answer;
      if (
        answerBox.querySelector(".answer-letter-text-container .answer-text")
          .textContent === correctAnswerText
      )
        correctAnswerBox = answerBox;
      answerBox.addEventListener("click", () => {
        answerBoxes.forEach((box) => box.classList.remove("active"));
        answerBox.classList.add("active");
        selectedAnswerBox = answerBox;
        selectedAnswerText =
          answerBox.querySelector(".answer-text").textContent;
      });
    });
    submitBtn.style.display = "flex";
    nextBtn.style.display = "none";
  }
}

function staticGameScreen(quizzes) {
  startScreen.style.display = "none";
  gameScreen.style.display = "flex";
  iconChoice = quizzes.icon;
  headerQuizIcon.src = iconChoice;
  bgIconChoice = quizzes.title.toLowerCase() + "-bg";
  headerQuizIcon.classList.add(`${bgIconChoice}`);
  textChoice = quizzes.title;
  quizCategoryText.textContent = textChoice;
  quizCategoryContainer.style.visibility = "visible";
}

async function fetchData(option) {
  try {
    const response = await fetch("data.json");
    if (!response.ok)
      throw new Error("Network response was not ok " + response.statusText);
    const data = await response.json();
    quizList = data.quizzes.find((quiz) => quiz.title == option);
    staticGameScreen(quizList);
    nextQuestion(quizList.questions);
  } catch (error) {
    console.log("There has been a problem with your fetch operation: ", error);
  }
}

quizOptions.addEventListener("click", (e) => {
  const optionElement = e.target.closest(".option");
  if (optionElement) {
    const optionTitle = optionElement.dataset.option;
    fetchData(optionTitle);
  }
});

submitBtn.addEventListener("click", (e) => {
  if (!selectedAnswerText) errorMessage.style.display = "flex";
  else checkAnswer();
});

nextBtn.addEventListener("click", (e) => {
  nextQuestion(quizList.questions);
});

restartBtn.addEventListener("click", () => {
  currentQuestionNumber = 0;
  bgIconChoice = "";
  iconChoice = null;
  textChoice = "";
  correctAnswers = 0;
  quizList = null;
  quizCategoryContainer.style.visibility = "hidden";
  endScreen.style.display = "none";
  startScreen.style.display = "flex";
});

themeBtn.addEventListener("click", () => {
  if (document.body.classList.contains("light-theme")) {
    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
    iconSun.src = "assets/images/icon-sun-light.svg";
    iconMoon.src = "assets/images/icon-moon-light.svg";
  } else {
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
    iconSun.src = "assets/images/icon-sun-dark.svg";
    iconMoon.src = "assets/images/icon-moon-dark.svg";
  }
});
