const highScoresList = document.querySelector("#highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
const mostRecentUser = localStorage.getItem("mostRecentUser");
const congratText = document.querySelector(".congrat-text");
const goHomeBtn = document.querySelector(".btn");

congratText.innerHTML = mostRecentUser ? 
    `<p class="custom-margin word-break">Congratulations ${mostRecentUser} you're in top 10 list!</p>`: ``;

let counter = 1;

highScoresList.innerHTML = highScores
                            .map(score => {
                                return `<tr>
                                            <td class="text-center">${counter++}</td>
                                            <td>${score.name}</td>
                                            <td class="text-center">${score.score}</td>
                                        </tr>`;
                            }).join("");

goHomeBtn.addEventListener('click', (e) => localStorage.removeItem("mostRecentUser"));