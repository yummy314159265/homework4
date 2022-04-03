// sections
const header = document.querySelector("header");
const startDiv = document.querySelector(".start")
const quizDiv = document.querySelector(".quiz");
const finishedDiv = document.querySelector(".finished");
const questionDiv = document.querySelector(".question");
const highScoresDiv = document.querySelector(".high-scores");
const failedDiv = document.querySelector(".failed")
// buttons
const viewHighScores = document.querySelector("#view-high-scores");
const startButton = document.querySelector("#start-button");
const answerButtons = document.querySelectorAll(".answer-button");
const answerButton1 = document.querySelector("#button1");
const answerButton2 = document.querySelector("#button2");
const answerButton3 = document.querySelector("#button3");
const answerButton4 = document.querySelector("#button4");
const backButton = document.querySelector("#back");
const clearButton = document.querySelector("#clear");
const submitButton = document.querySelector("#submit");
const tryAgainButton = document.querySelector("#try-again");
// displays
const timeDisplay = document.querySelector("#time-text");
const feedbackDisplay = document.querySelector("#feedback");
const scoreDisplay = document.querySelector("#score");
// high score
const highScoreList = document.querySelector("#high-score-list");
const initialsInput = document.querySelector("#initials");
// initial amount of time for quiz
const initialTime = 75;

// declaring global variables
let quizState;
let secondsLeft;
let score;
let scoreArray;
let buttonArray;
let questionIndex;
let questionArray;

// helper functions

// randomizes array order
const shuffleArray = (array) => {

    for (let newIndex = array.length - 1; newIndex > 0; newIndex--) {
        const oldIndex = Math.floor(Math.random() * (newIndex+1));
        [array[newIndex], array[oldIndex]] = [array[oldIndex], array[newIndex]];
    }

    return array;
}

// displays or hides divs
const toggleDiv = (state, ...divs) => {
    for (let div of divs) {
        if (state === "on") {
            div.setAttribute("style", "display: block;");
        } else {
            div.setAttribute("style", "display: none;");
        }
    }
}

// removes all children from a node
const removeAllChildren = (node) => {
    while (node.hasChildNodes()){
        node.removeChild(node.firstChild);
    }
}

// fades text after a length of time
const fadeText = (text, length) => {
    let textInterval = setInterval(() => {
        length--;

        if (length <= 0) {
            text.setAttribute("style", "font-style: italic; opacity: 0;");
            clearInterval(textInterval);
        }
    }, 1000);
}

// counts down the time left
const timer = () => {
    let timerInterval = setInterval(() => {

        secondsLeft--;
        timeDisplay.textContent = "Time: "+ secondsLeft + "s";

        if(secondsLeft <= 0) {
            quizFailed();
            clearInterval(timerInterval);
        } else if (questionIndex >= questionArray.length) {
            clearInterval(timerInterval);
        }

    }, 1000);
}

// display finished quiz section
const finishedQuiz = () => {
    toggleDiv("off", startDiv, quizDiv, highScoresDiv, failedDiv);
    toggleDiv("on", header, finishedDiv);
}

// displays the quiz unless it's at the end of the questionArray, then it finishes the quiz
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
        scoreDisplay.textContent = score;
        quizState = "quiz finished";
        finishedQuiz();
    }
}

// starts the timer, shuffles the questions, puts the text content in the quiz div, then displays the quiz div
const startQuiz = (event) => {
    event.preventDefault();
    quizState = "quiz started";
    timer();

    questionArray = shuffleArray(questionArray);
    cycleQuiz();
    toggleDiv("off", startDiv, finishedDiv, highScoresDiv, failedDiv);
    toggleDiv("on", header, quizDiv);
}

// if user runs out of time, displays quiz failed page
const quizFailed = () => {
    if (secondsLeft <= 0) {
        quizState = "quiz failed";
        toggleDiv("off", startDiv, finishedDiv, highScoresDiv, quizDiv);
        toggleDiv("on", header, failedDiv);
    }
}

// first removes children from feedbackDisplay div, then creates a p element, sets its attributes, then if the button clicked on
// is the correct answer, show "Correct" in the feedbackDisplay div, add 1 to questionIndex and cycle through quiz, otherwise
// show "Wrong" and subtract 10 from seconds left, and if seconds left is less than 0, set it to 1 (otherwise the time will run through
// the setInterval one more time and go to -1).
const answerQuestion = (event) => {
    event.preventDefault();

    removeAllChildren(feedbackDisplay);

    let target = event.target;

    let feedbackText = document.createElement("p");
    feedbackText.setAttribute("style", "font-style: italic;");

    if (target.textContent === questionArray[questionIndex].correctAnswer) {
        feedbackText.textContent = "Correct!";
        questionIndex++;
        cycleQuiz();
    } else {
        feedbackText.textContent = "Wrong!";
        secondsLeft -= 10;
        if (secondsLeft <= 0) {
            secondsLeft = 1;
        }
    }

    feedbackDisplay.appendChild(feedbackText);

    fadeText(feedbackText, 1);
}

// returns user. if quiz state is "quiz started", bring user back to quiz div (if user is viewing high score during quiz),
// otherwise bring user back to start page and reinitialize secondsLeft and questionIndex
const goBack = (event) => {

    if (quizState === "quiz started") {
        event.preventDefault();
        toggleDiv("off", finishedDiv, highScoresDiv, startDiv, failedDiv);
        toggleDiv("on", header, quizDiv);
    } else {
        event.preventDefault();
        secondsLeft = initialTime;
        timeDisplay.textContent = "Time: "+ secondsLeft + "s";
        questionIndex = 0;
        toggleDiv("off", quizDiv, finishedDiv, highScoresDiv, failedDiv);
        toggleDiv("on", header, startDiv);
    }
}

// gets the score array from local storage, parses to an object, then adds each item as a list item in the high scores ordered list,
// then displays the high scores div
const highScoreDisplay = (event) => {
    event.preventDefault();

    highScoreList.innerHTML = "";

    scoreArray = JSON.parse(localStorage.getItem("highScores"));

    if (scoreArray) {
        for (let i = 0; i < scoreArray.length; i++) {
            let li = document.createElement("li");
            li.textContent = "Score: " + scoreArray[i].storedScore + " - " + scoreArray[i].storedInitials;
            console.log(scoreArray[i].storedInitials);
            highScoreList.appendChild(li);
        }
    }

    toggleDiv("off", header, startDiv, quizDiv, failedDiv, finishedDiv);
    toggleDiv("on", highScoresDiv);
}

// checks if there is an input in the text box, then if there is an input, creates a high score object with the score and initials,
// then adds the high score to score array, sorts it from highest score to lowest score, then stores it in local storage
// as a string, then calls the highScoreDisplay function
const submitHighScore = (event) => {
    event.preventDefault();

    if (initialsInput.value.trim() === "") {
        highScoreDisplay(event);
        return;
    }

    let newHighScore = {
        storedScore: score,
        storedInitials: initialsInput.value
    }

    scoreArray.push(newHighScore);
    scoreArray.sort((a, b) => b.storedScore - a.storedScore);

    localStorage.setItem("highScores", JSON.stringify(scoreArray));

    highScoreDisplay(event);
}

// clears the score array, sets that score array to the local storage string, then calls highScoreDisplay

const clearHighScores = (event) => {
    event.preventDefault();

    scoreArray = [];
    localStorage.setItem("highScores", JSON.stringify(scoreArray));

    highScoreDisplay(event);
}

// initializes global variables
const init = () => {
    quizState = "not started";
    secondsLeft = initialTime;
    score = 0;
    scoreArray = [];
    buttonArray = [answerButton1, answerButton2, answerButton3, answerButton4]
    questionIndex = 0;
    timeDisplay.textContent = "Time: "+ secondsLeft + "s";

    questionArray = [
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
}

// event listeners
startButton.addEventListener("click", startQuiz);
submitButton.addEventListener("click", submitHighScore);
backButton.addEventListener("click", goBack);
tryAgainButton.addEventListener("click", goBack);
viewHighScores.addEventListener("click", highScoreDisplay);
clearButton.addEventListener("click", clearHighScores);
for (let answer of answerButtons) {
    answer.addEventListener("click", answerQuestion);
}

// initialize page
init();