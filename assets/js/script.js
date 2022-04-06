// TODO: css
// TODO: create button functions
const body = $('body');
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
const initialTime = 50;
const penalty = 10;
const numberOfAnswers = 4;

let timer;
let scoreArray = [];
let previousState = "start";
let timeLeft = initialTime;
let questionIndex = 0;
let questionArray = [
    {
        question: "What is love?",
        wrongAnswer1: "Baby don't hurt me",
        wrongAnswer2: "don't hurt me",
        wrongAnswer3: "no more",
        correctAnswer: "*nods head violently*"
    },

    {
        question: "Never gonna _____",
        wrongAnswer1: "give you up",
        wrongAnswer2: "gonna let you down",
        wrongAnswer3: "run around and desert you",
        correctAnswer: "DUCKROLL"
    },

    {
        question: "Wanna know how I got these scars?",
        wrongAnswer1: "My father was a drinker, and a fiend...",
        wrongAnswer2: "So I had a wife, beautiful... like you...",
        wrongAnswer3: "YOU GET WHAT A *#$Y#I@ DESERVE",
        correctAnswer: "no"
    },

    {
        question: "You're gonna need a _____",
        wrongAnswer1: "smile you son of a $&#(#",
        wrongAnswer2: "SHARK!?",
        wrongAnswer3: "lifeless eyes, like a doll's eyes",
        correctAnswer: "bigger boat"
    },

    {
        question: "What do you call a royale with cheese in France?",
        wrongAnswer1: "Quarter pounder",
        wrongAnswer2: "Big Kahuna burger",
        wrongAnswer3: "Ezekiel 25, 17",
        correctAnswer: "None of these"
    }
]

const shuffleArray = (array) => {
    for (let newIndex = array.length - 1; newIndex > 0; newIndex--) {
        const oldIndex = Math.floor(Math.random() * (newIndex+1));
        [array[newIndex], array[oldIndex]] = [array[oldIndex], array[newIndex]];
    }
    return array;
}

const toggleDisplay = (cls, ...elements) => {
    for (let element of elements) {
        element.css ('display', cls)
    }
}


const setState = (state) => {
    previousState = mainEl.attr('data-state');
    mainEl.attr('data-state', state);
}

const clearAll = () => {
    header.empty();
    mainEl.empty();
}

const stopCountdown = () => {
    clearInterval(timer);
}

const countdown = () => {
    timer = setInterval(() => {
        timeLeft--;
        timeEl.text("Time left: " + timeLeft + "s");

        if(timeLeft <= 0) {
            timeEl.text("Time left: 0s");
            displayQuizFailed();
            clearInterval(timer);
        } else if (questionIndex >= questionArray.length) {
            clearInterval(timer);
        }
    }, 1000);
}

const resetQuiz = () => {
    timeLeft = initialTime;
    questionIndex = 0;
    timeEl.text('Time: ' + timeLeft + 's');
}

const getHighScores = () => {
    scoreArray = JSON.parse(localStorage.getItem('highScores'));
}

const storeScore = () => {
    localStorage.setItem('highScores', JSON.stringify(scoreArray));
}

const createStartButton = () => {
    startButtonEl.text(startButtonText);

    return startButtonEl;
}

const createTitleEl = () => {
    titleEl.text(titleText);
    return titleEl;
}

const createStartTextEl = () => {
    startTextEl.text(startText);
    return startTextEl;
}

const displayStart = () => {

    if (mainEl.attr('data-state') === 'start') {
        return;
    } else {
        clearAll();
        resetQuiz();
        
        header.append(createTitleEl());
        mainEl.append(createStartTextEl());
        mainEl.append(createStartButton());
    }
}

const createQuestionEl = () => {
    let questionEl = $('<h2 class=left id=question>');
    questionEl.text(questionArray[questionIndex].question);
    return questionEl;
}

const displayQuestion = () => {
    clearAll();
    setState('quiz');
    mainEl.append(createQuestionEl());
}

const goToNextQuestion = () => {
    clearAll();
    if (questionIndex < questionArray.length-1) {
        questionIndex++;
        displayQuestion();
        displayAnswerButtons();
    } else {
        $('#feedback').attr('class', 'center');
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

const randomizeAnswerButtons = (...buttons) => shuffleArray(buttons);

const createAnswerButtons = () => {
    let answerButton1El = $('<button class=answer-button>')
    answerButton1El.text(questionArray[questionIndex].wrongAnswer1);

    let answerButton2El = $('<button class=answer-button>')
    answerButton2El.text(questionArray[questionIndex].wrongAnswer2);

    let answerButton3El = $('<button class=answer-button>')
    answerButton3El.text(questionArray[questionIndex].wrongAnswer3);

    let answerButton4El = $('<button class=answer-button>')
    answerButton4El.text(questionArray[questionIndex].correctAnswer);

    let answerButtonArray = randomizeAnswerButtons(answerButton1El, answerButton2El, answerButton3El, answerButton4El);

    return answerButtonArray;
}

const displayAnswerButtons = () => {
    let answerButtons = createAnswerButtons();
    for (let i=0; i < answerButtons.length; i++) {
        answerButtons[i].attr('id', 'answer-button-' + (i + 1));
        mainEl.append(answerButtons[i]);
    }
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

const createFeedbackEl = (string) => {
    let feedbackEl = $('<div class=left id=feedback>');
    feedbackEl.text(string);
    return feedbackEl;
}

const displayFeedback = (string) => {

    if (afterMainEl.has('#feedback')) {
        $('#feedback').remove();
    }

    feedback = createFeedbackEl(string);
    afterMainEl.append(feedback);
    fadeElement(feedback);
}

const goBack = () => {
    clearAll();
    toggleDisplay('block', highScoresEl, timeEl);

    if (previousState === 'completed') {
        displayCompleted();
    } else if (previousState === 'quiz') {
        displayQuestion();
        displayAnswerButtons();
    } else {
        init();
    }
}

const createBackButton = () => {
    let backButtonEl = $('<button class="center sml-btn" id=back-button>');
    backButtonEl.text('Back');
    return backButtonEl;
}

const clearHighScores = () => {
    scoreArray = [];
    storeScore();
    displayHighScores();
}

const createClearButton = () => {
    let clearButtonEl = $('<button class="center sml-btn" id=clear-button>');
    clearButtonEl.text('Clear High Scores');

    return clearButtonEl;
}

const createHighScoreTitleEl = () => {
    let highScoreTitleEl = $('<h1 class=center id=high-score-title>');
    highScoreTitleEl.text('High Scores');

    return highScoreTitleEl;
}

const createHighScoreList = (olElement) => {
    getHighScores();
    
    for (let i = 0; i < scoreArray.length; i++) {
        let scoreLiEl = $('<li class=left id=score-' + i + '>');
        scoreLiEl.text('Score: ' + scoreArray[i].score + ' - ' + scoreArray[i].initials);
        olElement.append(scoreLiEl);
    }

    return olElement;
}

const createHighScoreListEl = () => {
    let highScoreListEl = $('<ol class=center id=high-scores-list>')
    highScoreListEl.css('width', 'fit-content');
    createHighScoreList(highScoreListEl);
    return highScoreListEl;
}

const displayHighScores = () => {
    
    clearAll();
    toggleDisplay('none', highScoresEl, timeEl);

    if (previousState !== "quiz") {
        setState('high scores');
    }
    
    header.append(createHighScoreTitleEl());
    mainEl.append(createHighScoreListEl());
    mainEl.append(createBackButton());
    mainEl.append(createClearButton());
}

const addScore = (anotherScore) => {
    getHighScores();
    scoreArray.push(anotherScore);
    scoreArray.sort((a, b) => b.score - a.score);
}

const getInitialsValue = () => $('#initials').val();


const submitHighScore = (event) => {
    event.preventDefault();

    setState('submitted');

    if (getInitialsValue().trim() === "") {
        displayHighScores();
        return;
    }

    let newScore = {
        score: timeLeft,
        initials: getInitialsValue()
    }
    
    addScore(newScore);
    storeScore();
    displayHighScores();
}

const createFinishTextEl = () => {
    let finishTextEl = $('<h2 class=center id=finish-text>');
    finishTextEl.text('All done!');
    return finishTextEl;
}

const createSubmitButton = () => {
    let submitButtonEl = $('<button class="center sml-btn" id=submit-button>');
    submitButtonEl.text('Submit');

    return submitButtonEl;
}

const createInitialsLabelEl = () => {
    let initialsLabelEl = $('<label class=center for=initials>');
    initialsLabelEl.text('Enter initials:');
    return initialsLabelEl;
}

const createInitialsInputEl = () => {
    let initialsInputEl = $('<input class=center type=text name=initials id=initials>');
    return initialsInputEl;
}

const createFormEl = () => {
    let formEl = $('<form class=center method=POST>');
    formEl.append(createInitialsLabelEl());
    formEl.append(createInitialsInputEl());
    formEl.append(createSubmitButton());
    return formEl;
}

const displayCompleted = () => {
    setState('completed');

    stopCountdown();

    mainEl.append(createFinishTextEl());
    mainEl.append(createFormEl());
}

const createFailedTextEl = () => {
    let failedTextEl = $('<h2 class=center id=failed-text>')
    failedTextEl.text('You\'ve run out of time, loser!');
    return failedTextEl;
}

const displayQuizFailed = () => {
    clearAll();
    setState('failed');
    previousState = 'start';

    mainEl.append(createFailedTextEl());
    mainEl.append(createBackButton());
}

const startQuiz = (event) => {
    event.preventDefault();
    questionArray = shuffleArray(questionArray);
    displayQuestion();
    displayAnswerButtons();
    countdown();
}

const init = () => {
    resetQuiz();
    displayStart();
}

body.on('click', '#view-high-scores', displayHighScores);
mainEl.on('click', '#start-button', startQuiz);
mainEl.on('click', '#back-button', goBack);
mainEl.on('click', '#submit-button', submitHighScore);
mainEl.on('click', '#clear-button', clearHighScores);
for (i=0; i < numberOfAnswers; i++) {
    mainEl.on('click', '#answer-button-' + (i+1), checkAnswer);
}

init();