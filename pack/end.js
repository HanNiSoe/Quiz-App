const username = document.querySelector('#username');
const saveBtn = document.querySelector('#saveBtn');
const finalScore = document.querySelector('#finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

finalScore.innerText = mostRecentScore;

username.addEventListener('keyup', () => {
    saveBtn.disabled = !username.value;
});

saveHighScore = (e) => {
    e.preventDefault();
    const score = {
        score: mostRecentScore,
        name: username.value,
    };
    highScores.push(score);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(10);
    localStorage.setItem('highScores', JSON.stringify(highScores));
    if(highScores.includes(score)) {
        localStorage.setItem('mostRecentUser',username.value);
        location.assign('/highscore.html')
    } else {
        location.assign('/');
    } 
};