const question = document.querySelector('#question');
const choices = Array.from(document.querySelectorAll('.choice-container'));
const progressText = document.querySelector("#progressText");
const scoreText = document.querySelector("#score");
const progressBarFull = document.querySelector("#progressBarFull");

const loader = document.querySelector('#loader');
const game = document.querySelector('#game');

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

let count = 10;
let choiceClicked = false;

let crtQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let setQuestions = [];

let questions = [];

// request json api
fetch('https://opentdb.com/api.php?amount=30&category=9&difficulty=easy&type=multiple')
    .then(res => res.json())
    .then(loadedQuestions => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);
            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });
        startGame();
    })
    .catch(err => {
        console.error(err);
    });

startGame = () => {
    questionCounter = 0;
    score = 0;
    setQuestions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

getNewQuestion = () => {
    // set final score in local storage and redirect to end page
    if (setQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem("mostRecentScore", score);
        return location.assign('/end.html');
    }
    questionCounter++;

    // progress bar
    progressText.innerText = `Question \u00A0\u00A0 ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
    
    // set random question in view
    const questionIndex = Math.floor(Math.random() * setQuestions.length);
    crtQuestion = setQuestions[questionIndex];
    question.innerText = crtQuestion.question;

    // set answer choices in view
    choices.forEach((choice) => {
        const num = choice.dataset['number'];
        choice.lastElementChild.textContent = crtQuestion['choice' + num];
    });
    
    // remove finished question
    setQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;

    // countdown timer
    var countdownTimer = setInterval(() => {
        document.querySelector('#count').innerHTML = count;
        count--;
        if (choiceClicked) {
            choiceClicked = false;
            clearInterval(countdownTimer);
            count = 10;
        }
        if (count < 0) {
            clearInterval(countdownTimer);
            count = 10;
            getNewQuestion();
        }
    }, 1000);
};

choices.forEach(choice => {
    choice.addEventListener('click', (e) => {
        
        if (!acceptingAnswers) return;
        
        acceptingAnswers = false;
        choiceClicked = true;

        const selectedChoice = e.target.parentElement;
        const selectedAnswer = selectedChoice.dataset['number'];
        const classToApply = selectedAnswer == crtQuestion.answer ? "correct" : "incorrect";
        
        if (classToApply === "correct") {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.classList.remove(classToApply);
            getNewQuestion();
        }, 800);
    });
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};