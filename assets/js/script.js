// TODO: Button randomizer
// TODO: Question randomizer
// TODO: css
// TODO: create button functions

const header = $('header');
const titleEl = $('#title');
const startTextEl = $('#start-text');
const startButtonEl = $('#start-button');
const mainEl = $('#main');
const timeEl = $('#time');
const highScoresEl = $('#view-high-scores');
const afterMainEl = $('#after-main');

const titleText = titleEl.text();
const startText = startTextEl.text();
const startButtonText = startButtonEl.text();
const initialTime = 75;
const penalty = 10;

let initialsInputEl;

let answerButtonArray = [];
let scoreArray = [];
let previousState = "start";
let timer;
let timeLeft = initialTime;
let questionIndex = 0;

questionArray = [
    {
        question: "Commonly used data types DO NOT include",
        wrongAnswer1: "strings",
        wrongAnswer2: "booleans",
        wrongAnswer3: "numbers",
        correctAnswer: "alerts"
    },

    {
        question: "The condition in an if / else statement is enclosed within ______.",
        wrongAnswer1: "quotes",
        wrongAnswer2: "curly brackets",
        wrongAnswer3: "square brackets",
        correctAnswer: "parentheses"
    },

    {
        question: "String values must be enclosed within ______ when being assigned to variables.",
        wrongAnswer1: "commas",
        wrongAnswer2: "curly brackets",
        wrongAnswer3: "parentheses",
        correctAnswer: "quotes"
    },

    {
        question: "Arrays in JavaScript can be used to store ______.",
        wrongAnswer1: "numbers and strings",
        wrongAnswer2: "other arrays",
        wrongAnswer3: "booleans",
        correctAnswer: "all of the above"
    },

    {
        question: "A very useful tool used during development and debugging for printing content to the debugger is:",
        wrongAnswer1: "JavaScript",
        wrongAnswer2: "terminal/bash",
        wrongAnswer3: "for loops",
        correctAnswer: "console.log"
    }
]

const stopCountdown = () => {
    clearInterval(timer);
}

const setState = (state) => {
    previousState = mainEl.attr('data-state');
    mainEl.attr('data-state', state);
}

const clearAll = () => {
    header.empty();
    mainEl.empty();
}

const displayQuestion = () => {
    clearAll();
    setState('quiz');
    let questionEl = $('<h2 class=center id=question>');
    questionEl.text(questionArray[questionIndex].question);
    mainEl.append(questionEl);
}

const fadeElement = (element) => {
    let fadeTime = 1;
    let fadeInterval = setInterval(() => {
        fadeTime--;
        if (fadeTime <= 0) {
            element.css('opacity', '0');
            clearInterval(fadeInterval);
        }
    }, 1000);
}

const displayFeedback = (string) => {

    if (afterMainEl.has('#feedback')) {
        $('#feedback').remove();
    }

    let feedbackEl = $('<div class=center id=feedback>');
    feedbackEl.text(string);
    afterMainEl.append(feedbackEl);
    fadeElement(feedbackEl);
}

const getHighScores = () => {
    scoreArray = JSON.parse(localStorage.getItem('highScores'));
}

const storeScore = () => {
    localStorage.setItem('highScores', JSON.stringify(scoreArray));
}

const createHighScoreList = (olElement) => {
    getHighScores();
    
    for (let i = 0; i < scoreArray.length; i++) {
        let scoreLiEl = $('<li class=center id=score-' + i + '>');
        scoreLiEl.text('Score: ' + scoreArray[i].score + ' - ' + scoreArray[i].initials);
        olElement.append(scoreLiEl);
    }
}

const resetQuiz = () => {
    timeLeft = initialTime;
    questionIndex = 0;
    timeEl.text('Time: ' + timeLeft + 's');
}

const displayStart = () => {
    clearAll();
    resetQuiz();

    titleEl.text(titleText);
    startTextEl.text(startText);
    startButtonEl.text(startButtonText);

    header.append(titleEl);
    mainEl.append(startTextEl);
    mainEl.append(startButtonEl);

    startButtonEl.on('click', startQuiz);
}

const goBack = () => {
    clearAll();

    if (previousState === 'completed') {
        displayCompleted();
    } else if (previousState === 'quiz') {
        displayQuestion();
        displayAnswerButtons();
    } else {
        displayStart();
    }
}

const clearHighScores = () => {
    scoreArray = [];
    storeScore();
    displayHighScores();
}

const createBackButton = () => {
    let backButtonEl = $('<button class=center id=back-button>');
    backButtonEl.text('Back');
    mainEl.append(backButtonEl);
    backButtonEl.on('click', goBack);
}

const createClearButton = () => {
    let clearButtonEl = $('<button class=display center id=clear-button>');
    clearButtonEl.text('Clear High Scores');
    mainEl.append(clearButtonEl);
    clearButtonEl.on('click', clearHighScores);
}

const displayHighScores = () => {
    clearAll();

    setState('high scores');
    
    highScoreTitleEl = $('<h1 class=center id=high-score-title>');
    highScoreTitleEl.text('High Scores');

    let highScoreListEl = $('<ol class=center id=high-scores-list>')
    highScoreListEl.css('width', 'fit-content');
    createHighScoreList(highScoreListEl);

    header.append(highScoreTitleEl);
    mainEl.append(highScoreListEl);
    createBackButton();
    createClearButton();
}

const addScore = (anotherScore) => {
    getHighScores();
    scoreArray.push(anotherScore);
    scoreArray.sort((a, b) => b.score - a.score);
}

const submitHighScore = (event) => {
    event.preventDefault();

    setState('submitted');

    if (initialsInputEl.val().trim() === "") {
        displayHighScores();
        return;
    }

    let newScore = {
        score: timeLeft,
        initials: initialsInputEl.val()
    }
    
    addScore(newScore);
    storeScore();
    displayHighScores();
}

const displayCompleted = () => {
    setState('completed');

    stopCountdown();

    let finishTextEl = $('<h2 class=center id=finish-text>');
    finishTextEl.text('All done!');

    let formEl = $('<form class=center method=POST>');

    let initialsLabelEl = $('<label class=center for=initials>');
    initialsLabelEl.text('Enter initials:');

    initialsInputEl = $('<input class=center type=text name=initials id=initials>');
    
    let submitButtonEl = $('<button class=center id=submit-button>');
    submitButtonEl.text('Submit');

    formEl.append(initialsLabelEl);
    formEl.append(initialsInputEl);
    formEl.append(submitButtonEl);
  
    mainEl.append(finishTextEl);
    mainEl.append(formEl);

    submitButtonEl.on('click', submitHighScore)
}

const goToNextQuestion = () => {
    clearAll();
    if (questionIndex < questionArray.length-1) {
        questionIndex++;
        displayQuestion();
        displayAnswerButtons();
    } else {
        displayCompleted();
    }
}

const checkAnswer = (event) => {
    event.preventDefault();

    let target = $(event.target);

    if (questionArray[questionIndex].correctAnswer === target.text()) {
        displayFeedback('Correct!');
        goToNextQuestion();
    } else {
        displayFeedback('Wrong!');
        timeLeft -= penalty;
    }
}

const displayAnswerButtons = () => {

    let answerButton1El = $('<button class="answer-button display center" id=answer-button-1>')
    answerButton1El.text(questionArray[questionIndex].wrongAnswer1);
    mainEl.append(answerButton1El);

    let answerButton2El = $('<button class="answer-button display center" id=answer-button-2>')
    answerButton2El.text(questionArray[questionIndex].wrongAnswer2);
    mainEl.append(answerButton2El);

    let answerButton3El = $('<button class="answer-button display center" id=answer-button-3>')
    answerButton3El.text(questionArray[questionIndex].wrongAnswer3);
    mainEl.append(answerButton3El);

    let answerButton4El = $('<button class="answer-button display center" id=answer-button-4>')
    answerButton4El.text(questionArray[questionIndex].correctAnswer);
    mainEl.append(answerButton4El);

    answerButton1El.on('click', checkAnswer);
    answerButton2El.on('click', checkAnswer);
    answerButton3El.on('click', checkAnswer);
    answerButton4El.on('click', checkAnswer);
}

const quizFailed = () => {
    clearAll();
    let failedTextEl = $('<h2 class=center id=failed-text>')
    failedTextEl.text('You\'ve run out of time, loser!');
    mainEl.append(failedTextEl);
    createBackButton();
}

const countdown = () => {
    timer = setInterval(() => {
        timeLeft--;
        timeEl.text("Time left: " + timeLeft + "s");

        if(timeLeft <= 0) {
            timeEl.text("Time left: 0s");
            quizFailed();
            clearInterval(timer);
        } else if (questionIndex >= questionArray.length) {
            clearInterval(timer);
        }
    }, 1000);
}

const startQuiz = (event) => {
    event.preventDefault();
    displayQuestion();
    displayAnswerButtons();
    countdown();
}

const init = () => {
    resetQuiz();
    displayStart();
}

highScoresEl.on('click', displayHighScores);

init();