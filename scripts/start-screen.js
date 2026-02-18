import { nflTeams } from "./nfl-team-data.js";

const displayBoxElem = document.querySelector('.hickory');
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

displayBoxElem.innerHTML = `
  <button class="start-button" id="start-btn">Start Draft</button>
  <div class="pick-board optionBox">
    <div class="pick-board-text optionBoxText">
      Select Big Board
    </div>
    <select class="board-input">
      <option value="consensus">Consensus (Rec. for 3+ Rounds)</option>
      <option value="pff">PFF (Top 100)</option>
      <option value="sis">SIS (Top 100)</option>
    </select>
  </div>
  <div class="pick-rounds optionBox">
    <div class="pick-rounds-text optionBoxText">
      Select Number of Rounds
    </div>
    <input class="rounds-input" type="range" min="1" max="7" value="1">
    <div class="rounds-labels">
      <span>1</span>
      <span>2</span>
      <span>3</span>
      <span>4</span>
      <span>5</span>
      <span>6</span>
      <span>7</span>
    </div>
  </div>
  <div class="pick-speed optionBox">
    <div class="pick-speed-text optionBoxText">
      Select Auto-Draft Speed
    </div>
    <input class="speed-input" type="range" min="1" max="4" value="2">
    <div class="speed-labels">
      <span>Slow<br>(1.5s)</span>
      <span>Normal<br>(0.8s)</span>
      <span>Fast<br>(0.1s)</span>
      <span>Ultra<br>(0.001s)</span>
    </div>
  </div>
  <div class="pick-autoDraftEmphasis optionBox">
    <div class="pick-autoDraftEmphasis-text optionBoxText">
      Select Auto-Draft Philosophy
    </div>
    <input class="autoDraftEmphasis-input" type="range" min="1" max="5" value="3">
    <div class="autoDraftEmphasis-labels">
      <span>BPA</span>
      <span>Balanced</span>
      <span>Need</span>
    </div>
  </div>
  <div class="pick-autoDraftVariability optionBox">
    <div class="pick-autoDraftVariability-text optionBoxText">
      Select Auto-Draft Randomness
    </div>
    <input class="autoDraftVariability-input" type="range" min="1" max="5" value="3">
    <div class="autoDraftVariability-labels">
      <span>Strict</span>
      <span>Balanced</span>
      <span>Chaos</span>
    </div>
  </div>
  <div class="user-name optionBox">
    <div class="user-name-text optionBoxText">
      Name or Social Media Handle
    </div>
    <input class="user-name-input" placeholder="Ex. @MoveTheSticks" value="">
  </div>
`;

for (let i = 1; i <= 32; i++) {
  nflTeams.forEach((team) => {
    if (team.order === i) {
      document.getElementById('teams').innerHTML += `
        <div class="team-block" id="team-block" data-team="${team.name}">
          <img src="${team.logo}" class="team-block-logo">  
          <img src="https://www.freeiconspng.com/uploads/white-down-arrow-png-2.png" class="teamBlockEllipsis">
        </div>
      `;
    }
  });
}

document.querySelectorAll('.team-block').forEach((block) => {
  block.addEventListener("click", () => {
    if (!block.style.backgroundColor) {
      nflTeams.forEach((team) => {
        if (team.name === block.dataset.team) {
          block.setAttribute("style", `background-color: ${team.color}`);
        }
      });
    } else {
      block.setAttribute("style", "background-color: none");
    }
  });
});

document.querySelectorAll('.teamBlockEllipsis').forEach((ellipsis) => {
  const block = ellipsis.parentElement;

  ellipsis.addEventListener("click", () => {
    setTimeout(() => {
      if (!block.style.backgroundColor) {
        nflTeams.forEach((team) => {
          if (team.name === block.dataset.team) {
            block.setAttribute("style", `background-color: ${team.color}`);
          }
        });
      } else {
        block.setAttribute("style", `background-color: none`);
      }
    }, 0);

    // Open team profile page
    displayBoxElem.innerHTML = '';

    nflTeams.forEach((team) => {
      if (team.name === block.dataset.team) {
        displayBoxElem.setAttribute("style", `
          background-color: ${team.color};
          box-shadow: inset 0px 0px 500px 50px black;
          text-shadow: 0px 0px 5px rgba(0, 0, 0, 1);
          `);

        displayBoxElem.innerHTML = `
          <img class="closeButton" src="https://img.icons8.com/ios_filled/512/FFFFFF/delete-sign--v2.png">
          <div class="teamHeader">
            <img class="teamHeaderImage" src="${team.logo}">
            <div class="teamHeaderName">
              <div class="teamHeaderCity">${team.city}</div>
              <div class="teamHeaderMascot">${team.name}</div>
            </div>
          </div>

          <div class="seasonInfo">
            <div class="seasonRecord">2025 Record: ${team.record}</div>
            <div class="seasonCap">2026 Cap Space: ${team.capSpace}</div>
          </div>

          <div class="staffInfo">
            <div class="gmAndHc">GM: ${team.gm}<br>HC: ${team.hc}</div>
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
            text-shadow: none;
          `);

          displayBoxElem.innerHTML = `
            <button class="start-button" id="start-btn">Start Draft</button>
            <div class="pick-board optionBox">
              <div class="pick-board-text optionBoxText">
                Select Big Board
              </div>
              <select class="board-input">
                <option value="consensus">Consensus (Recommended)</option>
                <option value="pff">PFF</option>
              </select>
            </div>
            <div class="pick-rounds optionBox">
              <div class="pick-rounds-text optionBoxText">
                Select Number of Rounds
              </div>
              <input class="rounds-input" type="range" min="1" max="7" value="1">
              <div class="rounds-labels">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
              </div>
            </div>
            <div class="pick-speed optionBox">
              <div class="pick-speed-text optionBoxText">
                Select Auto-Draft Speed
              </div>
              <input class="speed-input" type="range" min="1" max="4" value="2">
              <div class="speed-labels">
                <span>Slow<br>(1.5s)</span>
                <span>Normal<br>(0.8s)</span>
                <span>Fast<br>(0.1s)</span>
                <span>Ultra<br>(0.001s)</span>
              </div>
            </div>
            <div class="pick-autoDraftEmphasis optionBox">
              <div class="pick-autoDraftEmphasis-text optionBoxText">
                Select Auto-Draft Philosophy
              </div>
              <input class="autoDraftEmphasis-input" type="range" min="1" max="5" value="3">
              <div class="autoDraftEmphasis-labels">
                <span>BPA</span>
                <span>Balanced</span>
                <span>Need</span>
              </div>
            </div>
            <div class="pick-autoDraftVariability optionBox">
              <div class="pick-autoDraftVariability-text optionBoxText">
                Select Auto-Draft Randomness
              </div>
              <input class="autoDraftVariability-input" type="range" min="1" max="5" value="3">
              <div class="autoDraftVariability-labels">
                <span>Strict</span>
                <span>Balanced</span>
                <span>Chaos</span>
              </div>
            </div>
            <div class="user-name optionBox">
              <div class="user-name-text optionBoxText">
                Name or Social Media Handle
              </div>
              <input class="user-name-input" placeholder="Ex. @MoveTheSticks" value="">
            </div>
          `;

          document.querySelector('.start-button').addEventListener("click", () => {
            userTeams = [];

            teamInput.forEach((block) => {
              if (block.style.backgroundColor) {
                userTeams.push(block.dataset.team);
              }
            });

            localStorage.setItem('roundsInput', JSON.stringify(roundsInput.value));
            localStorage.setItem('speedInput', JSON.stringify(speedInput.value));
            localStorage.setItem('nameInput', JSON.stringify(nameInput.value));
            localStorage.setItem('teamsInput', JSON.stringify(userTeams));
            localStorage.setItem('boardInput', JSON.stringify(boardInput.value));
            localStorage.setItem('autoDraftEmphasisInput', JSON.stringify(autoDraftEmphasisInput.value));
            localStorage.setItem('autoDraftVariabilityInput', JSON.stringify(autoDraftVariabilityInput.value));

            window.location.href='start.html';
          });
        });

        team.needs.forEach((need) => {
          teamNeedsElement.innerHTML += `<div class="needPosition">${need}</div>`;
        });

        team.test.forEach((pick) => {
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

          const pickCardTeamElem = document.querySelector(`.pickId${pick.n}`);

          nflTeams.forEach((pickTeam) => {
            if (pickTeam.abbv === pick.t) {
              pickCardTeamElem.setAttribute("style", `background-color: ${pickTeam.color}`);
            }
          });
        });

        team.futurePicks.forEach((pick) => {
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
      }
    });

  });
});

const selectAllBtn = document.getElementById('select-all');
selectAllBtn.addEventListener("click", () => {
  if (selectAllBtn.textContent.trim() === 'Select All') {
    selectAllBtn.textContent = `Deselect All`;
    document.querySelectorAll('.team-block').forEach((block) => {
      nflTeams.forEach((team) => {
        if (team.name === block.dataset.team) {
          block.setAttribute("style", `background-color: ${team.color}`)
        }
      });
    });
  } else {
    selectAllBtn.textContent = 'Select All';
    document.querySelectorAll('.team-block').forEach((block) => {
      block.setAttribute("style", "background-color: none");
    });
  }
});

let userTeams = [];

let roundsInput = document.querySelector('.rounds-input');
let speedInput = document.querySelector('.speed-input');
let nameInput = document.querySelector('.user-name-input');
let teamInput = document.querySelectorAll('.team-block');
let boardInput = document.querySelector('.board-input');
let autoDraftEmphasisInput = document.querySelector('.autoDraftEmphasis-input');
let autoDraftVariabilityInput = document.querySelector('.autoDraftVariability-input');

boardInput.value = "consensus";
roundsInput.value = 1;
speedInput.value = 2;
autoDraftEmphasisInput.value = 3;
autoDraftVariabilityInput.value = 3;
nameInput.value = "";

document.querySelector('.start-button').addEventListener("click", () => {
  userTeams = [];

  teamInput.forEach((block) => {
    if (block.style.backgroundColor) {
      userTeams.push(block.dataset.team);
    }
  });

  localStorage.setItem('roundsInput', JSON.stringify(roundsInput.value));
  localStorage.setItem('speedInput', JSON.stringify(speedInput.value));
  localStorage.setItem('nameInput', JSON.stringify(nameInput.value));
  localStorage.setItem('teamsInput', JSON.stringify(userTeams));
  localStorage.setItem('boardInput', JSON.stringify(boardInput.value));
  localStorage.setItem('autoDraftEmphasisInput', JSON.stringify(autoDraftEmphasisInput.value));
  localStorage.setItem('autoDraftVariabilityInput', JSON.stringify(autoDraftVariabilityInput.value));

  window.location.href='start.html';
});