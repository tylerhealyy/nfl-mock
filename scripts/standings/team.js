document.documentElement.setAttribute("data-theme", "dark");
import { nflTeams27 } from "../../data/nflTeamData27.js";

loadGames();
const games = JSON.parse(localStorage.getItem('games'));

let userTeam;
const graphicElem = document.querySelector('.graphic');

const teamSelectGrid = document.querySelector('.teamSelect');
nflTeams27.forEach(t => {
  teamSelectGrid.insertAdjacentHTML('beforeend', `
      <div class="teamImg"><img class="img" data-team="${t.name}" src="teamLogos/${t.name.toLowerCase()}.png"></div>
    `)
});

const allTeamImages = document.querySelectorAll('.img');
const graphicHeader = document.querySelector('.graphic .header');
const recordElem = document.querySelector('.record');
allTeamImages.forEach((i) => {
  i.addEventListener("click", () => {
    allTeamImages.forEach((other) => {
      other.style.opacity = '0.3';
      other.style.filter = 'drop-shadow(0 0 5px black)';
    });

    const team = i.dataset.team;
    userTeam = nflTeams27.find(t => t.name === team);
    i.style.opacity = '1';
    i.style.filter = 'drop-shadow(0 0 5px white)';
    graphicHeader.textContent = `${userTeam.name} Season Prediction`;
    graphicHeader.style.backgroundColor = `${userTeam.color}`;
    graphicElem.style.border = `1px solid ${userTeam.color}`;
    recordElem.textContent = '0-0';
    showGames();
  });
});

const gamesGrid = document.querySelector('.gamesGrid');
function showGames() {
  gamesGrid.innerHTML = '';
  const userGames = getUserGames();
  let wins = 0;
  let losses = 0;

  userGames.forEach(g => {
    g.result = null;
    let gameInfo = '';
    if (g.Day === 'SNF') {gameInfo = `<img src="teamLogos/snf.png">`}
    else if (g.Day === 'MNF') {gameInfo = `<img src="teamLogos/mnf.png">`}
    else if (g.Day === 'TNF') {gameInfo = `<img src="teamLogos/tnf.png">`}
    else {gameInfo = `${g.Day}<br>${g.Time}`}
    gamesGrid.insertAdjacentHTML('beforeend', `
        <div class="game" data-gameid="${g.GameId}">
          <div class="gameInfo">${gameInfo}</div>
          <div class="gameImg" data-team="${nflTeams27.find(t => t.name === g.Away).name}" style="
            --color: ${nflTeams27.find(t => t.name === g.Away).color};
          "><img src="teamLogos/${g.Away.toLowerCase()}.png"></div>
          <div class="gameImg" data-team="${nflTeams27.find(t => t.name === g.Home).name}" style="
            --color: ${nflTeams27.find(t => t.name === g.Home).color};
          "><img src="teamLogos/${g.Home.toLowerCase()}.png"></div>
          <div class="indicator"></div>
        </div>
      `);
  });
  gamesGrid.insertAdjacentHTML('beforeend', `
      <div style="font-weight: 700; text-shadow: 0 0 5px black;">MockParadox.com</div>
    `);

  document.querySelectorAll('.gameImg').forEach(t => {
    const thisGame = t.closest('.game');
    t.addEventListener("click", () => {
      const teamClicked = nflTeams27.find(j => j.name === t.dataset.team);
      const gameClicked = userGames.find(g => g.GameId === thisGame.dataset.gameid);
      const indicator = thisGame.querySelector('.indicator');
      const bothTeams = thisGame.querySelectorAll('.gameImg');

      const prevWinner = gameClicked.result;

      if (prevWinner) {
        if (prevWinner === userTeam.name) {wins--} else {losses--}
      }

      if (prevWinner === teamClicked.name) {
        gameClicked.result = null;
        bothTeams.forEach(u => {
          u.style.backgroundColor = `${nflTeams27.find(m => m.name === u.dataset.team).color}`;
          u.style.opacity = '1';
          u.style.boxShadow = 'inset 0 0 25px rgba(0, 0, 0, 0.5)';
        });
        indicator.style.backgroundColor = 'white';

        recordElem.textContent = `${wins}-${losses}`;
        return;
      }

      gameClicked.result = `${teamClicked.name}`;
      if (teamClicked.name === userTeam.name) {wins++; indicator.style.backgroundColor = 'rgb(0,255,0)';} else {losses++; indicator.style.backgroundColor = 'rgb(255,0,0)';}
      
      bothTeams.forEach(team => {
        team.style.backgroundColor = 'rgb(30, 30, 30)';
        team.style.opacity = '0.3';
      });
      t.style.backgroundColor = `${teamClicked.color}`;
      t.style.opacity = '1';
      t.style.boxShadow = 'inset 0 0 50px rgba(0, 0, 0, 0.5)';
      
      recordElem.textContent = `${wins}-${losses}`;
    });
  });
}

function getUserGames() {
  let userGames = [];

  userGames = games.filter(
    game => game.Away === userTeam.name || game.Home === userTeam.name
  );

  return userGames;
}

async function loadGames() {
  const games = await fetch('data/nflSchedule26.csv');
  const text = await games.text();

  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim());

  const result = lines.slice(1).map(line => {
    const [GameId, Away, Home, Week, Day, Time] = line.split(",");

    return {GameId, Away, Home, Week, Day, Time, result: null};
  });

  let gamesArray = [];

  result.forEach(g => {
    gamesArray.push(g);
  });

  localStorage.setItem('games', JSON.stringify(gamesArray));
}

document.querySelector('.downloadBtn').addEventListener("click", () => {
  html2canvas(document.getElementById("capture"), {
    useCORS: true,
    scale: 3, // super sharp
    backgroundColor: null
  }).then((canvas) => {

    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = `${userTeam.name}-season-prediction.png`;
    link.click();

  });
});