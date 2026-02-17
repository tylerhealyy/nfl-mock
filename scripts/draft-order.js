import { nflTeams } from "./nfl-team-data.js";
import { playerData } from "./player-data.js";
import { playerData26 } from "./playerData26.js";
import { draftPlayer } from "./index.js";

let rankUsed;
let selectedBoard = JSON.parse(localStorage.getItem('boardInput'));
let autoDraftEmphasis = JSON.parse(localStorage.getItem('autoDraftEmphasisInput'));
let autoDraftVariability = JSON.parse(localStorage.getItem('autoDraftVariabilityInput'));
const offPositionList = ["QB", "RB", "WR", "TE", "OT", "IOL"];
const defPositionList = ["ED", "DT", "LB", "CB", "S"];
const picksPerRound = [{round:1, picks:0},
{round:2, picks:32},
{round:3, picks:64},
{round:4, picks:100},
{round:5, picks:138},
{round:6, picks:179},
{round:7, picks:216}
];

export function buildDraftOrder2(rounds) { // Read the number of rounds to display the correct number of picks in the draft panel
  switch (rounds) {
    case "1":
      for (let i = 1; i < 33; i++) {
        buildPanelItems(i, rounds);
        addRoundDividers(i, rounds);
      }
      break;
    case "2":
      for (let i = 1; i < 65; i++) {
        buildPanelItems(i, rounds);
        addRoundDividers(i, rounds);
      }
      break;
    case "3":
      for (let i = 1; i < 101; i++) {
        buildPanelItems(i, rounds);
        addRoundDividers(i, rounds);
      }
      break;
    case "4":
      for (let i = 1; i < 139; i++) {
        buildPanelItems(i, rounds);
        addRoundDividers(i, rounds);
      }
      break;
    case "5":
      for (let i = 1; i < 181; i++) {
        buildPanelItems(i, rounds);
        addRoundDividers(i, rounds);
      }
      break;
    case "6":
      for (let i = 1; i < 217; i++) {
        buildPanelItems(i, rounds);
        addRoundDividers(i, rounds);
      }
      break;
    case "7":
      for (let i = 1; i < 258; i++) {
        buildPanelItems(i, rounds);
        addRoundDividers(i, rounds);
      }
      break;
  }
}

function buildPanelItems(i, rounds) { // Build HTML for each pick
  nflTeams.forEach((team) => {
    let newTest;
    if (JSON.parse(localStorage.getItem(`${team.name}test`))) {
      newTest = JSON.parse(localStorage.getItem(`${team.name}test`));
    } else {
      newTest = team.test;
    }
    if (newTest.some(v => v.n === i)) { // If a team owns a pick, display that team's card in that spot on the panel
      const storedInfo = JSON.parse(localStorage.getItem(`${i}info`));
      const storedLogo = JSON.parse(localStorage.getItem(`${i}logo`));
      function getInfo() {
        if (storedInfo) {
          return storedInfo;
        } else {
          return '';
        }
      }
      function getLogo() {
        if (storedLogo) {
          return storedLogo;
        } else {
          return '';
        }
      }

      const draftOrderPanelElem = document.querySelector('.draft-order-panel');

      draftOrderPanelElem.innerHTML += `
        <div class="draft-order-item" data-team="${team.name}" data-order="${i}" style="
          background-color: rgb(0, 0, 0);
          box-shadow: inset 0px 0px 180px ${team.color};
        ">
          <div class="pick-number">${i}</div>
          <div class="pick-logo">
            <img src="${team.logo}" class="pick-image">
          </div>
          <div class="pick-player" data-info="${i}">${getInfo()}</div>
          <div class="pick-player-logo" data-logo="${i}">${getLogo()}</div>
        </div>
      `;

      const draftOrderItems = document.querySelectorAll(`.draft-order-item`);
      const displayBoxElem = document.querySelector('.profile-js');

      draftOrderItems.forEach((item) => {
        item.addEventListener("click", () => {
          displayBoxElem.innerHTML = '';

          nflTeams.forEach((team) => { // block is undefined somewhere
            if (team.name === item.dataset.team) {
              displayBoxElem.setAttribute("style", `
                background-color: ${team.color};
                box-shadow: inset 0px 0px 500px 10px black;
                color: white;
                text-shadow: 0px 0px 5px rgba(0, 0, 0, 1);
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 0px 15px 0px 15px;
                overflow: scroll;
                `);
      
              displayBoxElem.innerHTML = `
                <img class="closeButton" src="../images/closeIcon.png">
                <div class="teamHeader">
                  <img class="teamHeaderImage" src="${team.logo}">
                  <div class="teamHeaderName">
                    <div class="teamHeaderCity">${team.city}</div>
                    <div class="teamHeaderMascot" style="font-size: 60px">${team.name}</div>
                  </div>
                </div>
      
                <div class="seasonInfo">
                  <div class="seasonRecord" style="padding-left: 20px">2025 Record: ${team.record}</div>
                  <div class="seasonCap">2026 Cap Space: ${team.capSpace}</div>
                </div>
      
                <div class="staffInfo">
                  <div class="gmAndHc" style="padding-left: 20px">GM: ${team.gm}<br>HC: ${team.hc}</div>
                  <div class="coordinators">OC: ${team.oc}<br>DC: ${team.dc}</div>
                </div>

                <div class="teamNeeds">
                  <div class="needsHeader">Team Needs:</div>
                  <div class="needsContainer"></div>
                </div>
      
                <div class="teamPicksHeader">2026 Draft Picks</div>
                <div class="teamPickInfo currentPicks"></div>
                <div class="teamPicksHeader">2027 Draft Picks</div>
                <div class="teamPickInfo futurePicks"></div>
      
                <div class="rosterHeader">2026 Roster</div>
                <div class="roster">
                  <div class="rosterOffense"></div>
                  <div class="rosterDefense"></div>
                </div>
              `;
      
              const closeButtonElement = document.querySelector('.closeButton');
              const teamNeedsElement = document.querySelector('.needsContainer');
              const teamPickInfoElement = document.querySelector('.currentPicks');
              const teamFuturePickInfoElement = document.querySelector('.futurePicks');
              const rosterOffenseElement = document.querySelector('.rosterOffense');
              const rosterDefenseElement = document.querySelector('.rosterDefense');
      
              closeButtonElement.addEventListener("click", () => {
                displayBoxElem.setAttribute("style", `
                  background-color: rgb(20, 20, 20);
                  color: rgb(223, 223, 223);
                  text-shadow: none;
                  display: grid;
                  grid-template-rows: 90px 70px 1fr;
                  flex-direction: none;
                  align-items: none;
                  padding: 0px;
                `);
      
                displayBoxElem.innerHTML = ``;
              });

              team.needs.forEach((need) => {
                teamNeedsElement.innerHTML += `<div class="needPosition">${need}</div>`;
              });
              
              let newTest;
              if (JSON.parse(localStorage.getItem(`${team.name}test`))) {
                newTest = JSON.parse(localStorage.getItem(`${team.name}test`));
              } else {
                newTest = team.test;
              }
              newTest
                .sort((a, b) => a.n - b.n)
                .forEach((pick) => {
                  const picksInThisRound = picksPerRound.find(r => r.round === pick.r).picks;
                  const roundPickNumber = pick.n - (picksInThisRound);
        
                  teamPickInfoElement.innerHTML += `
                    <div class="teamPickCard">
                      <div class="pickCardTop">
                        <div class="pickCardRound">${pick.r}.${roundPickNumber}</div>
                        <div class="pickCardOverall">${pick.n}</div>
                      </div>
                      <div class="pickCardBottom">
                        <div class="pickCardTeam pickId${pick.n}">${pick.t}</div>
                      </div>
                    </div>
                  `;

                  if (pick.p !== '') {
                    document.querySelector('.teamPickCard:last-child').setAttribute("style", `opacity: 0.25`);
                  }
        
                  const pickCardTeamElem = document.querySelector(`.pickId${pick.n}`);
        
                  nflTeams.forEach((pickTeam) => {
                    if (pickTeam.abbv === pick.t) {
                      pickCardTeamElem.setAttribute("style", `background-color: ${pickTeam.color}`);
                    }
                  });
                });

              team
                .futurePicks.sort((a, b) => a.r - b.r)
                .forEach((pick) => {
                  teamFuturePickInfoElement.innerHTML += `
                    <div class="futurePickCard">
                      <div class="futurePickCardRound">${pick.r}</div>
                      <div class="futurePickCardTeam">${pick.t}</div>
                    </div>
                  `;

                  const futurePickCardTeamElem = teamFuturePickInfoElement.lastElementChild.querySelector('.futurePickCardTeam');

                  nflTeams.forEach((pickTeam) => {
                    if (pickTeam.abbv === pick.t) {
                      futurePickCardTeamElem.setAttribute("style", `background-color: ${pickTeam.color}`);
                    }
                  });
                });
      
              offPositionList.forEach((position) => {
                rosterOffenseElement.innerHTML += `
                  <div class="rosterPositionGroup">
                    <div class="rosterPosition">${position}</div>
                    <div class="rosterPlayersBox ${position}Box"></div>
                  </div>
                `;
                
                team[position].forEach((player) => {
                  //const playerBoxElement = document.querySelector('.rosterPlayersBox');
                  document.querySelector(`.${position}Box`).innerHTML += `
                    <div class="rosterPlayer" style="background-color: ${team.color}">${player}</div>
                  `;
                });
              });
      
              defPositionList.forEach((position) => {
                rosterDefenseElement.innerHTML += `
                  <div class="rosterPositionGroup">
                    <div class="rosterPosition">${position}</div>
                    <div class="rosterPlayersBox ${position}Box"></div>
                  </div>
                `;
                
                team[position].forEach((player) => {
                  //const playerBoxElement = document.querySelector('.rosterPlayersBox');
                  document.querySelector(`.${position}Box`).innerHTML += `
                    <div class="rosterPlayer" style="background-color: ${team.color}">${player}</div>
                  `;
                });
              });

              newTest.forEach((pick) => {
                if (pick.p !== "") {
                  document.querySelector(`.${pick.pos}Box`).innerHTML += `
                    <div class="rosterPlayer" style="
                      background-color: rgb(0, 255, 0);
                      color: black;
                      text-shadow: none;
                      border: 3px solid black">(${pick.n}) ${pick.pn}</div>
                  `;
                }
              });
            }
          });
        });
      });
    }
  });

  
}

function addRoundDividers(i, rounds) { // Add round headers before the first pick in each round
  if (i === 32 && rounds > 1) {
    document.querySelector('.draft-order-panel').innerHTML += `
      <div class="draft-order-round">Round 2</div>
    `;
  } else if (i === 64 && rounds > 2) {
    document.querySelector('.draft-order-panel').innerHTML += `
      <div class="draft-order-round">Round 3</div>
    `;
  } else if (i === 100 && rounds > 3) {
    document.querySelector('.draft-order-panel').innerHTML += `
      <div class="draft-order-round">Round 4</div>
    `;
  } else if (i === 138 && rounds > 4) {
    document.querySelector('.draft-order-panel').innerHTML += `
      <div class="draft-order-round">Round 5</div>
    `;
  } else if (i === 180 && rounds > 5) {
    document.querySelector('.draft-order-panel').innerHTML += `
      <div class="draft-order-round">Round 6</div>
    `;
  } else if (i === 216 && rounds > 6) {
    document.querySelector('.draft-order-panel').innerHTML += `
      <div class="draft-order-round">Round 7</div>
    `;
  }
}

let speed = 800;
if (JSON.parse(localStorage.getItem('speedInput')) == 1) {
  speed = 1500;
} else if(JSON.parse(localStorage.getItem('speedInput')) == 2) {
  speed = 800;
} else if(JSON.parse(localStorage.getItem('speedInput')) == 3) {
  speed = 100;
} else {
  speed = 1;
}

let isPaused = true;
document.querySelector('.begin').addEventListener("click", () => {
  if (!isPaused) {
    isPaused = true;
  } else {
    isPaused = false;
  }
});

let listOfUserTeams = JSON.parse(localStorage.getItem('teamsInput'));
let autoPickTeam = '';
export function singleAutoPick(rounds) {
  if (isPaused) return;

  let otc = JSON.parse(localStorage.getItem('otc'));
  let team;

  nflTeams.forEach((tm) => {
    if (localStorage.getItem(`${tm.name}test`)) {
      if (JSON.parse(localStorage.getItem(`${tm.name}test`)).some(y => y.n === otc)) {
        team = tm;
      }
    } else {
      if (tm.test.some(y => y.n === otc)) {
        team = tm;
      }
    }
  });

  // If it's a user team, stop auto-picking
  if (!team || listOfUserTeams.includes(team.name)) {
    playOTCSound();
    return;
  }

  // AI makes a pick
  let selectedPlayer = aiDraftPick(team, otc);

  if (selectedPlayer) {
    draftPlayer(rounds, selectedPlayer);

    if (team.needs.includes(selectedPlayer.position)) {
      team.needs = team.needs.filter(pos => pos !== selectedPlayer.position);
    }

    team.drafted.push(selectedPlayer.position);
  }

  // Move to next pick
  otc += 1;
  localStorage.setItem('otc', otc);

  // Use setTimeout to create a delay before the next pick
  setTimeout(() => {
    singleAutoPick(rounds); // Recursively call with a delay
  }, speed); // 1 second delay per pick (adjust as needed)
}

function aiDraftPick(team, otc) {
  return playerData26
    .map(player => {
      rankUsed = player[`${selectedBoard}`];
      let score = 1000 - rankUsed; // Base score on player rating

      if (rankUsed === null) score = 0;
      if (player.name === 'Fernando Mendoza') score += 500;

      switch (autoDraftEmphasis) {
        case "1": // BPA
          if (player.name === 'Fernando Mendoza') score -= 500;
          break;
        case "2": // Mostly BPA
          if (team.needs.includes(player.position)) score += Math.floor(Math.random() * (5 - 1 + 1)) + 1;
          if (player.position === 'RB' && otc <= 5) score -= 2;
          if (player.position === 'WR' && otc <= 4) score -= 2;
          if (player.position === 'OT' && otc <= 32) score += 2;
          if (player.position === 'ED' && otc <= 10) score += 1;
          if (player.position === 'K' || player.position === 'P' || player.position === 'LS') score -= 10;
          if (team.drafted.includes(player.position) && player.position === 'QB') score = 0;
          if (team.nogo.includes(player.position)) score = 0;
          if (team.drafted.includes(player.position)) score -= 2;
          break;
        case "3": // Default
          if (team.needs.includes(player.position)) score += Math.floor(Math.random() * (15 - 5 + 1)) + 5;
          standardPositionalAdjustments();
          break;
        case "4": // Mostly Need
          if (team.needs.includes(player.position)) score += Math.floor(Math.random() * (30 - 15 + 1)) + 15;
          standardPositionalAdjustments();
          break;
        case "5": // Need
          if (team.needs.includes(player.position)) score += 100;
          standardPositionalAdjustments();
          break;
      }

      switch (autoDraftVariability) {
        case "1": // Strict (Almost No Variability)
          variability(0.05, 0.01, 3, 1, 5, 2, 9, 4, 5);
          break;
        case "2": // Little Variability
          variability(0.2, 0.02, 9, 4, 17, 8, 31, 15, 25);
          break;
        case "3": // Default
          variability(0.2, 0.05, 17, 8, 31, 15, 61, 30, 50);
          break;
        case "4": // Some Chaos
          variability(0.5, 0.1, 33, 16, 51, 25, 101, 50, 50);
          break;
        case "5": // Chaos
          variability(0.8, 0.2, 51, 25, 101, 50, 201, 100, 50);
          break;
      }

      function standardPositionalAdjustments() {
        if (player.position === 'RB' && otc <= 5) score -= 5;
        if (player.position === 'WR' && otc <= 4) score -= 5;
        if (player.position === 'OT' && otc <= 32) score += 5;
        if (player.position === 'ED' && otc <= 10) score += 3;
        if (player.position === 'K' || player.position === 'P' || player.position === 'LS') score -= 30;
        if (team.drafted.includes(player.position) && player.position === 'QB') score = 0;
        if (team.nogo.includes(player.position)) score = 0;
        if (team.drafted.includes(player.position)) score -= 5;
      }

      function variability(chance, qbChance, genWhole, genHalf, firstWhole, firstHalf, lateWhole, lateHalf, qb) {
        if (Math.random() < chance) score += Math.floor(Math.random() * genWhole) - genHalf;
        if (otc > 5 && otc < 33 && Math.random() < chance) score += Math.floor(Math.random() * firstWhole) - firstHalf;
        if (otc > 33 && Math.random() < chance) score += Math.floor(Math.random() * lateWhole) - lateHalf;
        if (player.position === 'QB' && Math.random() < qbChance) score += qb;
      }
      
      return { ...player, score };
    })
    .sort((a, b) => b.score - a.score)[0]; // Select best score
}

const otcAlertAudio = new Audio("../sounds/nfl-draft-chime2.mp3");
otcAlertAudio.preload = "auto";
otcAlertAudio.load();

function playOTCSound() {
  otcAlertAudio.currentTime = 0; // Rewind to start
  otcAlertAudio.play().catch((error) => {
    console.error("Audio playback failed:", error);
  });
}