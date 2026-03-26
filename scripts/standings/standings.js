import { nflTeams } from "../../data/nflTeamData.js";
import { gamesList } from "../../data/schedules.js";

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

  if (e.target.closest('#backToMock')) {
    window.location.href = 'index.html';
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
        <div class="modeButton league" id="leagueMode">
          <div class="modeButtonIconBox">
            <img class="modeButtonIcon" src="teamLogos/nfl.png">
          </div>
          <div class="modeButtonText">Coming Soon</div>
        </div>
        <div class="modeButton mock" id="backToMock">
          <div class="modeButtonIconBox">
            <img class="modeButtonIcon mock" src="apple-touch-icon.png">
          </div>
          <div class="modeButtonText">Back To Home</div>
        </div>
      </div>
    </div>
  `;
}

function showTeamSchedule(teamSelected) {
  let gamesForSummary = [];
  localStorage.setItem("games", JSON.stringify(gamesForSummary));
  const contentElem = document.querySelector('.content');
  contentElem.innerHTML = '';

  let teamObj = nflTeams.find(t => t.name === teamSelected);
  localStorage.setItem("team", JSON.stringify(teamObj));

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

  gamesList
    .filter(game => game.home === teamObj.name || game.away === teamObj.name)
    .sort((a, b) => {
      // 1. Home games first
      const aHome = a.home === teamObj.name;
      const bHome = b.home === teamObj.name;
      if (aHome !== bHome) return bHome - aHome;

      // 2. Division games next
      if (a.division !== b.division) return b.division - a.division;

      // 3. Conference games next
      if (a.conference !== b.conference) return b.conference - a.conference;

      return 0; // keep original order otherwise
    })
    .forEach((game) => {
      gamesForSummary.push(game);
      let homeTeam, awayTeam;
      if (teamObj.name === game.home) {
        homeTeam = teamObj;
        awayTeam = nflTeams.find(t => t.name === game.away);
      } else if (teamObj.name === game.away) {
        homeTeam = nflTeams.find(t => t.name === game.home);
        awayTeam = teamObj;
      } else {
        return; // skip game entirely
      }

      scheduleGrid.innerHTML += `
        <div class="game" data-gameid="${game.gameId}">
          <div class="gameSection gameTeam" data-team="${awayTeam.name}" style="
            border-top-left-radius: 1vw;
            border-bottom-left-radius: 1vw;
          "><img class="gameLogo" src="${awayTeam.logo}"></div>
          <div class="gameSection gameMiddle" style="
            background-color: white;
            color: black;
            text-shadow: none;
            border-left: 1px solid black;
            border-right: 1px solid black;
          ">@</div>
          <div class="gameSection gameTeam" data-team="${homeTeam.name}" style="
            border-top-right-radius: 1vw;
            border-bottom-right-radius: 1vw;
          "><img class="gameLogo" src="${homeTeam.logo}"></div>
        </div>
      `;
  });

  document.querySelectorAll(".gameTeam").forEach(box => {
    box.addEventListener("click", () => {
      const gameElem = box.closest(".game");
      const gameId = Number(gameElem.dataset.gameid);
      const game = gamesList.find(g => g.gameId === gameId);

      const winsElem = document.querySelector('.recordWins');
      const lossesElem = document.querySelector('.recordLosses');

      const teams = gameElem.querySelectorAll(".gameTeam");
      const clickedTeam = box.dataset.team;

      const prevWinner = game.result;

      // 🧹 STEP 1: Undo previous result
      if (prevWinner) {
        if (prevWinner === teamObj.name) wins--;
        else losses--;
      }

      // 🔁 STEP 2: Clicking same team → reset
      if (prevWinner === clickedTeam) {
        game.result = null;
        localStorage.setItem("games", JSON.stringify(gamesForSummary));

        teams.forEach(t => {
          t.classList.remove("selected", "grayed");
          t.style.backgroundColor = "rgb(200, 200, 200)";
        });

        winsElem.textContent = wins;
        lossesElem.textContent = losses;
        localStorage.setItem("wins", JSON.stringify(wins));
        localStorage.setItem("losses", JSON.stringify(losses));
        finishButton.classList.toggle('hide', wins + losses !== 17);
        return;
      }

      // 🟢 STEP 3: Apply new result
      game.result = clickedTeam;
      localStorage.setItem("games", JSON.stringify(gamesForSummary));

      if (clickedTeam === teamObj.name) wins++;
      else losses++;

      // 🎨 STEP 4: Update styles
      teams.forEach(t => {
        t.classList.remove("selected", "grayed");
        t.style.backgroundColor = "rgb(200, 200, 200)";
      });

      box.classList.add("selected");
      box.style.backgroundColor = nflTeams.find(t => t.name === clickedTeam).color;

      teams.forEach(t => {
        if (t !== box) t.classList.add("grayed");
      });

      winsElem.textContent = wins;
      lossesElem.textContent = losses;
      localStorage.setItem("wins", JSON.stringify(wins));
      localStorage.setItem("losses", JSON.stringify(losses));
      finishButton.classList.toggle('hide', wins + losses !== 17);
    });
  });

  /*document.querySelectorAll(".gameTeam").forEach(box => {
    box.addEventListener("click", () => {
      let teamClicked = nflTeams.find(p => p.name === box.dataset.team);
      const game = box.closest(".game");
      const teams = game.querySelectorAll(".gameTeam");

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
  });*/

  finishButton.addEventListener("click", () => {
    window.location.href = 'standingsSummary.html';
  });
  
}

async function getGameListArray() {
  const csv = await fetch(`data/games2026.csv`);
  const csvText = await csv.text();
  const lines = csvText.trim().split("\n");

  const headers = lines[0].split(",").map(h => h.trim());

  const parseValue = (value) => {
    const v = value.trim();

    if (v === "") return null;

    // Boolean conversion
    if (v === "TRUE") return true;
    if (v === "FALSE") return false;

    // Number conversion (only if it's actually a number)
    if (!isNaN(v)) return Number(v);

    return v;
  };

  return lines.slice(1).map(line => {
    const values = line.split(",");

    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = parseValue(values[i] || "");
    });

    return obj;
  });
}