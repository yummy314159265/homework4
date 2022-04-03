const header = document.querySelector("header");
const viewHighScores = document.querySelector("#view-high-scores");
const startButton = document.querySelector("#start-button");
const startDiv = document.querySelector(".start")
const quizDiv = document.querySelector(".quiz");
const finishedDiv = document.querySelector(".finished");
const questionDiv = document.querySelector(".question");
const highScoresDiv = document.querySelector(".high-scores");
const answerButtons = document.querySelectorAll(".answer-button");
const answerButton1 = document.querySelector("#button1");
const answerButton2 = document.querySelector("#button2");
const answerButton3 = document.querySelector("#button3");
const answerButton4 = document.querySelector("#button4");
const timeDisplay = document.querySelector("#time-text");
const feedbackDisplay = document.querySelector("#feedback");
const scoreText = document.querySelector("#score");
const highScoreList = document.querySelector("#high-score-list");
const initials = document.querySelector("#initials");
const backButton = document.querySelector("#back");
const clearButton = document.querySelector("#clear");
const submitButton = document.querySelector("#submit");
const initialTime = 75;

let secondsLeft = initialTime;
let score = 0;
let scoreArray = [];
let buttonArray = [answerButton1, answerButton2, answerButton3, answerButton4]
let questionIndex = 0;

let questionArray = [
    {
        ask: "Commonly used data types DO NOT include",
        wrongAnswer1: "strings",
        wrongAnswer2: "booleans",
        wrongAnswer3: "numbers",
        correctAnswer: "alerts"
    },

    {
        ask: "The condition in an if / else statement is enclosed within ______.",
        wrongAnswer1: "quotes",
        wrongAnswer2: "curly brackets",
        wrongAnswer3: "square brackets",
        correctAnswer: "parentheses"
    },

    {
        ask: "String values must be enclosed within ______ when being assigned to variables.",
        wrongAnswer1: "commas",
        wrongAnswer2: "curly brackets",
        wrongAnswer3: "parentheses",
        correctAnswer: "quotes"
    },

    {
        ask: "Arrays in JavaScript can be used to store ______.",
        wrongAnswer1: "numbers and strings",
        wrongAnswer2: "other arrays",
        wrongAnswer3: "booleans",
        correctAnswer: "all of the above"
    },

    {
        ask: "A very useful tool used during development and debugging for printing content to the debugger is:",
        wrongAnswer1: "JavaScript",
        wrongAnswer2: "terminal/bash",
        wrongAnswer3: "for loops",
        correctAnswer: "console.log"
    }
]

const shuffleArray = (array) => {

    for (let newIndex = array.length - 1; newIndex > 0; newIndex--) {
        const oldIndex = Math.floor(Math.random() * (newIndex+1));
        [array[newIndex], array[oldIndex]] = [array[oldIndex], array[newIndex]];
    }

    return array;
}

const finishedQuiz = () => {
    header.setAttribute("style", "display: block;");
    startDiv.setAttribute("style", "display: none;");
    quizDiv.setAttribute("style", "display: none;");
    highScoresDiv.setAttribute("style", "display: none;")
    finishedDiv.setAttribute("style", "display: block;");
}

const cycleQuiz = () => {
    if (questionIndex < questionArray.length) {
        buttonArray = shuffleArray(buttonArray);
        questionDiv.textContent = questionArray[questionIndex].ask;
        buttonArray[0].textContent = questionArray[questionIndex].wrongAnswer1;
        buttonArray[1].textContent = questionArray[questionIndex].wrongAnswer2;
        buttonArray[2].textContent = questionArray[questionIndex].wrongAnswer3;
        buttonArray[3].textContent = questionArray[questionIndex].correctAnswer;
    } else {
        score = secondsLeft - 1;
        scoreText.textContent = score;
        finishedQuiz();
    }
}

const startQuiz = (event) => {
    event.preventDefault();
    timer();
    header.setAttribute("style", "display: block;");
    startDiv.setAttribute("style", "display: none;");
    finishedDiv.setAttribute("style", "display: none;");
    highScoresDiv.setAttribute("style", "display: none;")
    quizDiv.setAttribute("style", "display: block;");
    questionArray = shuffleArray(questionArray);
    cycleQuiz();
}

const timer = () => {
    let timerInterval = setInterval(() => {

        secondsLeft--;
        timeDisplay.textContent = "Time: "+ secondsLeft + "s";


        if(secondsLeft <= 0 || questionIndex >= questionArray.length) {
            clearInterval(timerInterval);
        }

    }, 1000);
}
    
const answerQuestion = (event) => {
    event.preventDefault();

    if (feedbackDisplay.hasChildNodes()){
        feedbackDisplay.removeChild(feedbackDisplay.firstChild);
    }

    let feedbackText = document.createElement("p");
    feedbackText.textContent = "";
    feedbackText.setAttribute("style", "font-style: italic;")

    if (event.target.textContent === questionArray[questionIndex].correctAnswer) {
        feedbackText.textContent = "Correct!";
        questionIndex++;
        cycleQuiz();
    } else {

        feedbackText.textContent = "Wrong!";

        secondsLeft -= 10;

        if (secondsLeft < 0) {
            secondsLeft = 1;
        }
    }

    feedbackDisplay.appendChild(feedbackText);

    let feedbackDisplayTime = 1;

    let feedbackTextInterval = setInterval(() => {
        feedbackDisplayTime--;

        if (feedbackDisplayTime <= 0) {
            feedbackText.setAttribute("style", "opacity: 0;")
            clearInterval(feedbackTextInterval);
        }
    }, 1000);

}

const restart = (event) => {
    event.preventDefault();
    secondsLeft = initialTime;
    timeDisplay.textContent = "Time: "+ secondsLeft + "s";
    questionIndex = 0;
    quizDiv.setAttribute("style", "display: none;");
    finishedDiv.setAttribute("style", "display: none;");
    highScoresDiv.setAttribute("style", "display: none;")
    header.setAttribute("style", "display: block;");
    startDiv.setAttribute("style", "display: block;");
}

const highScoreDisplay = (event) => {
    event.preventDefault();
    header.setAttribute("style", "display: none;");
    startDiv.setAttribute("style", "display: none;");
    quizDiv.setAttribute("style", "display: none;");
    finishedDiv.setAttribute("style", "display: none;");
    highScoresDiv.setAttribute("style", "display: block;")

    highScoreList.innerHTML = "";

    scoreArray = JSON.parse(localStorage.getItem("highScores"));

    if (scoreArray) {
        for (let i = 0; i < scoreArray.length; i++) {
            let li = document.createElement("li");
            li.textContent = "Score: " + scoreArray[i].storedScore + " - " + scoreArray[i].storedInitials;
            highScoreList.appendChild(li);
        }
    }
}

const submitHighScore = (event) => {
    event.preventDefault();

    let newHighScore = {
        storedScore: score,
        storedInitials: initials.value
    }

    scoreArray.push(newHighScore);
    scoreArray.sort((a, b) => b.storedScore - a.storedScore);

    localStorage.setItem("highScores", JSON.stringify(scoreArray));

    highScoreDisplay(event);
}

const clearHighScores = (event) => {
    event.preventDefault();

    scoreArray = []
    localStorage.setItem("highScores", JSON.stringify(scoreArray));

    highScoreDisplay(event);
}

const init = () => {
    timeDisplay.textContent = "Time: "+ secondsLeft + "s";
}

startButton.addEventListener("click", startQuiz);
submitButton.addEventListener("click", submitHighScore);
backButton.addEventListener("click", restart);
viewHighScores.addEventListener("click", highScoreDisplay);
clearButton.addEventListener("click", clearHighScores);

for (let answer of answerButtons) {
    answer.addEventListener("click", answerQuestion);
}

init();