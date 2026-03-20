import { nflTeams } from "../../data/nflTeamData.js";
import { schedules } from "../../data/schedules.js";

const divisions = ['an', 'ae', 'as', 'aw', 'nn', 'ne', 'ns', 'nw'];

document.body.addEventListener('click', (e) => {
  if (e.target.closest('#teamMode')) {
    doTeamMode();
  }

  if (e.target.closest('.backButton')) {
    backToHome();
  }

  if (e.target.closest('#leagueMode')) {
    window.location.href='index.html';
  }
});

function doTeamMode() {
  const titleElem = document.querySelector('.title');
  const contentElem = document.querySelector('.content');

  titleElem.innerHTML = '';
  titleElem.classList.remove('titleIndicator');

  contentElem.innerHTML = `
    <div class="teamSelect">
      <div class="teamText">Select Team</div>
      <div class="teamOptions"></div>
    </div>
  `;

  const teamOptions = document.querySelector('.teamOptions');

  let html = '';

  divisions.forEach((division) => {
    html += `<div class="teamDivision" id="division-${division}">`;

    nflTeams
    .sort((a, b) => a.city.localeCompare(b.city))
    .forEach((team) => {
      if (team.division === division) {
        html += `
          <div class="teamButton" data-team="${team.name}" style="background-color: ${team.color}">
            <img class="teamButtonIcon" src="${team.logo}">
          </div>
        `;
      }
    });

    html += `</div>`;
  });

  teamOptions.innerHTML = html;

  let teamSelected = '';

  document.querySelectorAll('.teamButton').forEach((teamBtn) => {
    teamBtn.addEventListener("click", () => {
      teamSelected = teamBtn.dataset.team;
      showTeamSchedule(teamSelected);
    });
  });

  document.body.insertAdjacentHTML('beforeend', `
    <div class="backButton">
      <img class="backButtonIcon" src="icons/backArrow.png">
    </div>
  `);
}

function backToHome() {
  document.querySelector('.backButton')?.remove();

  const titleElem = document.querySelector('.title');
  const contentElem = document.querySelector('.content');

  titleElem.classList.add('titleIndicator');
  titleElem.innerHTML = 'NFL Standings Predictor';

  contentElem.innerHTML = `
    <div class="modeSelect">
      <div class="modeText">Select Mode</div>
      <div class="modeOptions">
        <div class="modeButton" id="teamMode">
          <div class="modeButtonIconBox">
            <img class="modeButtonIcon" src="teamLogos/steelers.png">
          </div>
          <div class="modeButtonText">Team</div>
        </div>
        <div class="modeButton" id="leagueMode">
          <div class="modeButtonIconBox">
            <img class="modeButtonIcon" src="teamLogos/nfl.png">
          </div>
          <div class="modeButtonText">League</div>
        </div>
      </div>
    </div>
  `;
}

function showTeamSchedule(teamSelected) {
  const contentElem = document.querySelector('.content');
  contentElem.innerHTML = '';

  let teamHomeGames = schedules[teamSelected].home;
  let teamAwayGames = schedules[teamSelected].away;

  let teamObj = nflTeams.find(t => t.name === teamSelected);

  let wins = 0;
  let losses = 0;

  contentElem.innerHTML = `
    <div class="teamSchedule">
      <div class="teamText">
        <img class="scheduleLogo" src="${teamObj.logo}">
        Who Wins?
      </div>
      <div class="scheduleGrid"></div>
    </div>
    <div class="scheduleFooter">
      <div>Record</div>
      <div>
        <span class="recordWins">0</span>
        -
        <span class="recordLosses">0</span>
      </div>
    </div>
    <div class="finishButton hide" style="background-color: ${teamObj.color}">Finish</div>
  `;

  const finishButton = document.querySelector('.finishButton');
  const scheduleGrid = document.querySelector('.scheduleGrid');

  scheduleGrid.innerHTML += `
    <div>Home Games</div>
  `;

  teamHomeGames.forEach((game) => {

    let oppObj;
    nflTeams.forEach((team) => {
      if (team.name === game) {
        oppObj = team;
      }
    });

    scheduleGrid.innerHTML += `
      <div class="game">
        <div class="gameSection gameTeam" data-team="${oppObj.name}" style="
          border-top-left-radius: 1vw;
          border-bottom-left-radius: 1vw;
        "><img class="gameLogo" src="${oppObj.logo}"></div>
        <div class="gameSection gameMiddle" style="
          background-color: white;
          color: black;
          text-shadow: none;
          border-left: 1px solid black;
          border-right: 1px solid black;
        ">@</div>
        <div class="gameSection gameTeam" data-team="${teamObj.name}" style="
          border-top-right-radius: 1vw;
          border-bottom-right-radius: 1vw;
        "><img class="gameLogo" src="${teamObj.logo}"></div>
      </div>
    `;
  });

  scheduleGrid.innerHTML += `
    <div>Away Games</div>
  `;

  teamAwayGames.forEach((game) => {
    
    let oppObj;
    nflTeams.forEach((team) => {
      if (team.name === game) {
        oppObj = team;
      }
    });

    scheduleGrid.innerHTML += `
      <div class="game">
        <div class="gameSection gameTeam" data-team="${teamObj.name}" style="
          border-top-left-radius: 1vw;
          border-bottom-left-radius: 1vw;
        "><img class="gameLogo" src="${teamObj.logo}"></div>
        <div class="gameSection gameMiddle" style="
          background-color: white;
          color: black;
          text-shadow: none;
          border-left: 1px solid black;
          border-right: 1px solid black;
        ">@</div>
        <div class="gameSection gameTeam" data-team="${oppObj.name}" style="
          border-top-right-radius: 1vw;
          border-bottom-right-radius: 1vw;
        "><img class="gameLogo" src="${oppObj.logo}"></div>
      </div>
    `;
  });

  document.querySelectorAll(".gameTeam").forEach(box => {
    box.addEventListener("click", () => {
      let teamClicked = nflTeams.find(p => p.name === box.dataset.team);
      const game = box.closest(".game");
      const teams = game.querySelectorAll(".gameTeam");

      const isAlreadySelected = box.classList.contains("selected");

      const winsElem = document.querySelector('.recordWins');
      const lossesElem = document.querySelector('.recordLosses');

      const prevResult = game.dataset.result;
      if (prevResult === "win") wins--;
      if (prevResult === "loss") losses--;

      if (box.classList.contains("selected")) {
        delete game.dataset.result;

        teams.forEach(t => {
          t.classList.remove("selected", "grayed");
          t.style.backgroundColor = "rgb(200, 200, 200)";
        });

        winsElem.textContent = wins;
        lossesElem.textContent = losses;

        finishButton.classList.toggle('hide', wins + losses !== 17);

        return;
      }

      let newResult;
      if (box.dataset.team === teamObj.name) { wins++; newResult = "win"; }
      else { losses++; newResult = "loss"; }

      game.dataset.result = newResult;

      winsElem.textContent = wins;
      lossesElem.textContent = losses;

      teams.forEach(t => {
        t.classList.remove("selected", "grayed");
        t.style.backgroundColor = "rgb(200, 200, 200)";
      });

      box.classList.add("selected");
      box.style.backgroundColor = teamClicked.color;

      teams.forEach(t => { if (t !== box) { t.classList.add("grayed"); } });

      finishButton.classList.toggle('hide', wins + losses !== 17);
      
    });
  });

  finishButton.addEventListener("click", () => {
    console.log('finished');
  });
  
}