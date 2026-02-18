import { playerData } from "./player-data.js";
import { playerData26 } from "./playerData26.js";
import { nflTeams } from "./nfl-team-data.js";
import { buildDraftOrder2 } from "./draft-order.js";
import { singleAutoPick } from "./draft-order.js";
import { tradeValueData } from "./tradeValueData.js";
import { futurePickValueData } from "./tradeValueData.js";

let playerList = '';
let otc = 1;
localStorage.setItem('otc', JSON.stringify(otc));
let tradeID = 0;
localStorage.setItem('totalTrades', tradeID);
let viewing;
let selectedValue;
let nameValue = '';
let teamsValue = '';
let selectedBoard;
let rankUsed;
let scoringData = [];
let dataForSave = [];
const offPositionList = ["QB", "RB", "WR", "TE", "OT", "IOL"];
const defPositionList = ["ED", "DT", "LB", "CB", "S"];
const allPositionList = ["QB", "RB", "WR", "TE", "OT", "IOL", "ED", "DT", "LB", "CB", "S"];
const picksPerRound = [{round:1, picks:0},
{round:2, picks:32},
{round:3, picks:64},
{round:4, picks:100},
{round:5, picks:138},
{round:6, picks:179},
{round:7, picks:216}
];

nflTeams.forEach((team) => { // Reset all picks on every refresh
  team.test.forEach((pick) => {
    pick.p = "";
    pick.pn = "";
    pick.pos = "";
    localStorage.setItem(`${pick.n}${team.name}`, JSON.stringify(pick));
  });

  let h = 1;
  while (h < 20) {
    if (localStorage.getItem(`${h}${team.name}received`)) {
      localStorage.removeItem(`${h}${team.name}received`);
      localStorage.removeItem(`${h}${team.name}partner`);
    }
    h += 1;
  }
});

for (let i = 1; i < 20; i++) {
  if (localStorage.getItem(`trade${i}-1`)) {
    localStorage.removeItem(`trade${i}-1`);
    localStorage.removeItem(`trade${i}-1string`);
    localStorage.removeItem(`trade${i}-2`);
    localStorage.removeItem(`trade${i}-2string`);
  } else break;
}

window.addEventListener("DOMContentLoaded", () => {
  for (let i = 1; i < 258; i++) {
    localStorage.removeItem(`${i}info`);
    localStorage.removeItem(`${i}logo`);
  }
  nflTeams.forEach((team) => {
    localStorage.removeItem(`${team.name}test`);
  });
  selectedValue = JSON.parse(localStorage.getItem('roundsInput'));
  buildDraftOrder2(selectedValue); // Builds the draft order display on left side
  changeHeader();
  localStorage.removeItem("functionExecuted");
});

document.querySelector('.begin').addEventListener("click", () => {
  startDraft();
  document.querySelector('.begin').innerHTML = 'PAUSE';
  document.querySelector('.begin').style.background = 'white';
  document.querySelector('.begin').style.color = 'black';
  document.querySelector('.begin').style.textShadow = 'none';
  document.querySelector('.begin').style.boxShadow = 'inset 0px 0px 20px rgba(0, 0, 0, 0.25)';
  document.querySelector('.begin').addEventListener("mouseover", () => document.querySelector('.begin').style.backgroundColor = 'rgb(194, 194, 194)');
  document.querySelector('.begin').addEventListener("mouseout", () => document.querySelector('.begin').style.backgroundColor = 'white');
  document.querySelector('.profile-js').setAttribute("style", `background-color: rgb(20, 20, 20);`);
});

document.querySelector('.trade').addEventListener("click", () => {
  let team1;
  let team2;
  let team1Total, team2Total = 0;
  let team1Abbv, team2Abbv = '';
  let team1SelectedCurrent = [];
  let team1SelectedFuture = [];
  let team1SelectedPlayers = [];
  let team2SelectedCurrent = [];
  let team2SelectedFuture = [];
  let team2SelectedPlayers = [];
  let newTest1;
  let newTest2;
  const tradePage = document.createElement('div');
  tradePage.classList.add('tradePage');
  document.body.appendChild(tradePage);

  tradePage.innerHTML = `
    <img class="tradeCloseBtn" src="https://img.icons8.com/ios_filled/512/FFFFFF/delete-sign--v2.png">
    <div class="team1 tradeHalf"></div>
    <div class="divider"></div>
    <div class="team2 tradeHalf"></div>
  `;

  const otcHeaderElem = document.querySelector('.otc-header');
  otcHeaderElem.innerHTML = `
    <div class="tradeHeader">
      <img class="tradeSubmitBtn" src="https://static.vecteezy.com/system/resources/previews/049/440/373/non_2x/swap-icon-logo-set-vector.jpg">
      <div class="tradeValueCalc">
        <div class="tradeValueText">Fair</div>
        <div class="tradeValueBalance">0</div>
      </div>
      <div class="team1 headerHalf headerHalf1"></div>
      <div class="headerDivider"></div>
      <div class="team2 headerHalf headerHalf2"></div>
    </div>
  `;

  const headerHalfElems = document.querySelectorAll('.headerHalf');
  headerHalfElems.forEach((headerHalf) => {
    let teamNumber;
    if (headerHalf.classList.contains('team1')) teamNumber = 1; else teamNumber = 2;
    headerHalf.innerHTML = `
      <div class="selectedCurrentPicks scp${teamNumber}"></div>
      <div class="selectedFuturePicks sfp${teamNumber}"></div>
      <div class="selectedPlayers sp${teamNumber}"></div>
    `;
  });

  const tradeCloseBtn = document.querySelector('.tradeCloseBtn');
  tradeCloseBtn.addEventListener("click", () => {
    document.body.removeChild(tradePage);
    otcHeaderElem.innerHTML = '';
    changeHeader();
  });

  const tradeHalfElems = document.querySelectorAll('.tradeHalf');
  tradeHalfElems.forEach((half) => {
    half.innerHTML = `
      <select class="teamSelect">
        <option selected class="teamSelectOption" value="none">Choose Team</option>
      </select>
      <div class="teamTradePage"></div>
    `;

    const teamSelectInput = half.querySelector('.teamSelect');
    const displayBoxElem = half.querySelector('.teamTradePage');

    nflTeams
      .sort((a, b) => a.city.localeCompare(b.city))
      .forEach(team => {
        teamSelectInput.innerHTML += `
          <option value="${team.name}" style="
            background-color: ${team.color};
          ">${team.city} ${team.name}</option>
        `;
      });

    teamSelectInput.addEventListener("change", () => {
      if (teamSelectInput.parentElement.classList.contains('team1')) {
        team1SelectedCurrent.length = 0; team1SelectedFuture.length = 0; team1SelectedPlayers.length = 0;
      } else {
        team2SelectedCurrent.length = 0; team2SelectedFuture.length = 0; team2SelectedPlayers.length = 0;
      }
      nflTeams.forEach((team) => {
        let teamNumber;
        if (team.name === teamSelectInput.value) {
          if (half.classList.contains('team1')) {
            team1 = team;
            teamNumber = 1;
            team1Total = 0;
            team1Abbv = team.abbv;
            if (team1Abbv === team2Abbv) {
              half.setAttribute("style", `background-color: rgb(20,20,20); box-shadow: none;`);
              document.querySelector('.headerHalf1').setAttribute("style", `background-color: rgb(20,20,20); box-shadow: none;`);
              displayBoxElem.innerHTML = '';
              teamSelectInput.value = "none";
              alert("Can't trade between the same team buddy");
              return;
            }
            document.querySelector('.headerHalf2').innerHTML = `
              <div class="selectedCurrentPicks scp2"></div>
              <div class="selectedFuturePicks sfp2"></div>
              <div class="selectedPlayers sp2"></div>
            `;
            document.querySelector('.otc-header .team1').setAttribute("style", `
              background-color: ${team.color};
              box-shadow: inset 0px 0px 150px 10px black;
            `);
            if (team2Total !== 0) {
              document.querySelector('.tradeValueText').textContent = `${team1Abbv} Owes:`;
              document.querySelector('.tradeValueBalance').textContent = Math.abs(Math.round((team1Total-team2Total) * 10) / 10);
            } else {
              document.querySelector('.tradeValueText').textContent = `Fair!`;
              document.querySelector('.tradeValueBalance').textContent = Math.abs(Math.round((team1Total-team2Total) * 10) / 10);
            }

            if (JSON.parse(localStorage.getItem(`${team1.name}test`))) {
              newTest1 = JSON.parse(localStorage.getItem(`${team1.name}test`));
            } else {
              newTest1 = team1.test;
            }

          } else {
            team2 = team;
            teamNumber = 2;
            team2Total = 0;
            team2Abbv = team.abbv;
            if (team1Abbv === team2Abbv) {
              half.setAttribute("style", `background-color: rgb(20,20,20); box-shadow: none;`);
              document.querySelector('.headerHalf2').setAttribute("style", `background-color: rgb(20,20,20); box-shadow: none;`);
              displayBoxElem.innerHTML = '';
              teamSelectInput.value = "none";
              alert("Can't trade between the same team buddy");
              return;
            }
            document.querySelector('.headerHalf1').innerHTML = `
              <div class="selectedCurrentPicks scp1"></div>
              <div class="selectedFuturePicks sfp1"></div>
              <div class="selectedPlayers sp1"></div>
            `;
            document.querySelector('.otc-header .team2').setAttribute("style", `
              background-color: ${team.color};
              box-shadow: inset 0px 0px 150px 10px black;  
            `);
            if (team1Total !== 0) {
              document.querySelector('.tradeValueText').textContent = `${team2Abbv} Owes:`;
              document.querySelector('.tradeValueBalance').textContent = Math.abs(Math.round((team1Total-team2Total) * 10) / 10);
            } else {
              document.querySelector('.tradeValueText').textContent = `Fair!`;
              document.querySelector('.tradeValueBalance').textContent = Math.abs(Math.round((team1Total-team2Total) * 10) / 10);
            }
  
            if (JSON.parse(localStorage.getItem(`${team2.name}test`))) {
              newTest2 = JSON.parse(localStorage.getItem(`${team2.name}test`));
            } else {
              newTest2 = team2.test;
            }
          }

          half.setAttribute("style", `background-color: ${team.color};
            box-shadow: inset 0px 0px 1000px 100px black;`);

          displayBoxElem.innerHTML = '';
          displayBoxElem.innerHTML = `
            <div class="teamHeader">
              <img class="teamHeaderImage" src="${team.logo}">
              <div class="teamHeaderName">
                <div class="teamHeaderCity">${team.city}</div>
                <div class="teamHeaderMascot" style="font-size: 60px">${team.name}</div>
              </div>
            </div>

            <div class="teamNeeds">
              <div class="needsHeader">Team Needs:</div>
              <div class="needsContainer"></div>
            </div>
  
            <div class="teamPicksHeader">2026 Draft Picks</div>
            <div class="teamPickInfo currentPicks tradePicks"></div>
            <div class="teamPicksHeader">2027 Draft Picks</div>
            <div class="teamPickInfo futurePicks"></div>
  
            <div class="rosterHeader">2026 Roster</div>
            <div class="roster">
              <div class="rosterOffense"></div>
              <div class="rosterDefense"></div>
            </div>
          `;
  
          const teamNeedsElement = half.querySelector('.needsContainer');
          const teamPickInfoElement = half.querySelector('.currentPicks');
          const teamFuturePickInfoElement = half.querySelector('.futurePicks');
          const rosterOffenseElement = half.querySelector('.rosterOffense');
          const rosterDefenseElement = half.querySelector('.rosterDefense');
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
                <div class="teamPickCard team${teamNumber}pick" style="width: 50px; cursor: pointer;">
                  <div class="pickCardTop"">
                    <div class="pickCardRound">${tradeValueData[pick.n - 1]}</div>
                    <div class="pickCardOverall" style="font-size: 24px; height: 25px;">${pick.n}</div>
                  </div>
                  <div class="pickCardBottom">
                    <div class="pickCardTeam pickId${pick.n}">${pick.t}</div>
                  </div>
                </div>
              `;

              if (pick.p !== '') {
                half.querySelector('.teamPickCard:last-child').setAttribute("style", `opacity: 0.25; width: 50px;`);
              }
    
              const pickCardTeamElem = half.querySelector(`.pickId${pick.n}`);
    
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
                <div class="futurePickCard team${teamNumber}pick" style="width: 65px; cursor: pointer;">
                  <div class="futurePickCardRound">${pick.r}</div>
                  <div class="futurePickCardTeam" style="width: 45px;">${pick.t}</div>
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
              half.querySelector(`.${position}Box`).innerHTML += `
                <div class="rosterPlayer team${teamNumber}player" style="background-color: ${team.color}; cursor: pointer;">${player}</div>
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
              half.querySelector(`.${position}Box`).innerHTML += `
                <div class="rosterPlayer team${teamNumber}player" style="background-color: ${team.color}; cursor: pointer;">${player}</div>
              `;
            });
          });

          newTest.forEach((pick) => {
            if (pick.p !== "") {
              half.querySelector(`.${pick.pos}Box`).innerHTML += `
                <div class="rosterPlayer team${teamNumber}player" style="
                  background-color: rgb(0, 255, 0);
                  color: black;
                  text-shadow: none;
                  border: 3px solid black;
                  cursor: pointer;">(${pick.n}) ${pick.pn}</div>
              `;
            }
          });
          
          const pickCardElem = half.querySelectorAll('.teamPickCard');
          const futurePickCardElem = half.querySelectorAll('.futurePickCard');
          const rosterPlayerElems = half.querySelectorAll('.rosterPlayer');

          pickCardElem.forEach((card) => {
            const teamNumber = card.classList.contains('team1pick') ? 2 : 1;
            let selectedList = [];
            let teamOfPick;
            if (teamNumber === 1) {selectedList = team2SelectedCurrent; teamOfPick = team2;} else {selectedList = team1SelectedCurrent; teamOfPick = team1;}
            const cardInfo = document.createElement('div');
            cardInfo.classList.add('teamPickCard');
            cardInfo.classList.add('tpcSummary');
            cardInfo.innerHTML = card.innerHTML;

            let newTest;
            if (JSON.parse(localStorage.getItem(`${teamOfPick.name}test`))) {
              newTest = JSON.parse(localStorage.getItem(`${teamOfPick.name}test`));
            } else {
              newTest = teamOfPick.test;
            }

            let overallPick = parseInt(card.querySelector('.pickCardOverall').textContent);
            let value = tradeValueData[overallPick - 1];

            card.addEventListener("click", () => {
              let overallPickForList = parseInt(card.querySelector('.pickCardOverall').textContent);

              if (card.style.opacity === "0.25") return;

              const pick = newTest.find(p => p.n === overallPickForList);
              const index = selectedList.indexOf(pick);

              if (!card.style.border) {

                selectedList.push(pick);

                card.style.border = "4px solid rgb(0, 255, 0)";
                document.querySelector(`.scp${teamNumber}`).appendChild(cardInfo);

                if (teamNumber === 2) team1Total += value; else team2Total += value;
                document.querySelector('.tradeValueBalance').textContent = Math.abs(Math.round((team1Total-team2Total) * 10) / 10);

                if (team1Total > team2Total) {
                  document.querySelector('.tradeValueText').textContent = `${team2Abbv} owes:`;
                } else if (team2Total > team1Total) {
                  document.querySelector('.tradeValueText').textContent = `${team1Abbv} owes:`;
                } else {
                  document.querySelector('.tradeValueText').textContent = `Fair!`;
                }

              } else {

                selectedList.splice(index, 1);

                card.style.border = "";
                document.querySelector(`.scp${teamNumber}`).removeChild(cardInfo);

                if (teamNumber === 2) team1Total -= value; else team2Total -= value;
                document.querySelector('.tradeValueBalance').textContent = Math.abs(Math.round((team1Total-team2Total) * 10) / 10);

                if (team1Total > team2Total) {
                  document.querySelector('.tradeValueText').textContent = `${team2Abbv} owes:`;
                } else if (team2Total > team1Total) {
                  document.querySelector('.tradeValueText').textContent = `${team1Abbv} owes:`;
                } else {
                  document.querySelector('.tradeValueText').textContent = `Fair!`;
                }

              }

            });
          });
          futurePickCardElem.forEach((card) => {
            const teamNumber = card.classList.contains('team1pick') ? 2 : 1;
            const pickInfo = {r: parseInt(card.querySelector('.futurePickCardRound').textContent), t: card.querySelector('.futurePickCardTeam').textContent};
            let selectedList = [];
            let teamOfPick;
            if (teamNumber === 1) {selectedList = team2SelectedFuture; teamOfPick = team2;} else {selectedList = team1SelectedFuture; teamOfPick = team1;}
            const cardInfo = document.createElement('div');
            cardInfo.classList.add('futurePickCard');
            cardInfo.classList.add('fpcSummary');
            cardInfo.innerHTML = card.innerHTML;

            let value = futurePickValueData[parseInt(card.querySelector('.futurePickCardRound').textContent) - 1].value;

            card.addEventListener("click", () => {

              const pick = teamOfPick.futurePicks.find(p => p.r === pickInfo.r && p.t === pickInfo.t);
              const index = selectedList.indexOf(pick);

              if (!card.style.border) {
                selectedList.push(pick);
                card.style.border = "4px solid rgb(0, 255, 0)";
                document.querySelector(`.sfp${teamNumber}`).appendChild(cardInfo);
                if (teamNumber === 2) team1Total += value; else team2Total += value;
                document.querySelector('.tradeValueBalance').textContent = Math.abs(Math.round((team1Total-team2Total) * 10) / 10);
                if (team1Total > team2Total) {
                  document.querySelector('.tradeValueText').textContent = `${team2Abbv} owes:`;
                } else if (team2Total > team1Total) {
                  document.querySelector('.tradeValueText').textContent = `${team1Abbv} owes:`;
                } else {
                  document.querySelector('.tradeValueText').textContent = `Fair!`;
                }
              } else {
                selectedList.splice(index, 1);
                card.style.border = "";
                document.querySelector(`.sfp${teamNumber}`).removeChild(cardInfo);
                if (teamNumber === 2) team1Total -= value; else team2Total -= value;
                document.querySelector('.tradeValueBalance').textContent = Math.abs(Math.round((team1Total-team2Total) * 10) / 10);
                if (team1Total > team2Total) {
                  document.querySelector('.tradeValueText').textContent = `${team2Abbv} owes:`;
                } else if (team2Total > team1Total) {
                  document.querySelector('.tradeValueText').textContent = `${team1Abbv} owes:`;
                } else {
                  document.querySelector('.tradeValueText').textContent = `Fair!`;
                }
              }
            });
          });
          rosterPlayerElems.forEach((player) => {
            const teamNumber = player.classList.contains('team1player') ? 2 : 1;
            let selectedList = [];
            let teamOfPlayer;
            let positionOfPlayer = player.parentElement.previousElementSibling.textContent;
            if (teamNumber === 1) {selectedList = team2SelectedPlayers; teamOfPlayer = team2;} else {selectedList = team1SelectedPlayers; teamOfPlayer = team1;}
            const cardInfo = document.createElement('div');
            cardInfo.classList.add('rosterPlayer');
            cardInfo.classList.add(`team${teamNumber}player`);
            cardInfo.classList.add('rpSummary');
            cardInfo.innerHTML = player.innerHTML;
            cardInfo.setAttribute("style", `background-color: ${team.color}`);

            player.addEventListener("click", () => {

              const playerName = player.textContent;
              const playerInfo = teamOfPlayer[positionOfPlayer].find(p => p === playerName);
              const index = selectedList.indexOf(playerInfo);

              if (!player.style.border) {
                selectedList.push(playerInfo);
                player.style.border = "4px solid rgb(0,255,0)";
                document.querySelector(`.sp${teamNumber}`).appendChild(cardInfo);
              } else if (player.style.border === "3px solid black") return;
              else {
                player.style.border = "";
                document.querySelector(`.sp${teamNumber}`).removeChild(cardInfo);
                selectedList.splice(index, 1);
              }
            });
          });

        } else if (teamSelectInput.value === 'none') {
          if (half.classList.contains('team1')) team1 = null; else team2 = null;
          displayBoxElem.innerHTML = '';
          half.setAttribute("style", `background-color: rgb(20,20,20);`);

          if (teamSelectInput.parentElement.classList.contains('team1')) {
            const teamNumberLocal = 2;
            document.querySelector('.headerHalf2').innerHTML = `
              <div class="selectedCurrentPicks scp${teamNumberLocal}"></div>
              <div class="selectedFuturePicks sfp${teamNumberLocal}"></div>
              <div class="selectedPlayers sp${teamNumberLocal}"></div>
            `;
            document.querySelector('.headerHalf1').setAttribute("style", `background-color: rgb(20,20,20);`);
            team1Total = 0;
            document.querySelector('.tradeValueBalance').textContent = Math.abs(Math.round((team1Total-team2Total) * 10) / 10);
            document.querySelector('.tradeValueText').textContent = `Owes:`;
          } else {
            const teamNumberLocal = 1;
            document.querySelector('.headerHalf1').innerHTML = `
              <div class="selectedCurrentPicks scp${teamNumberLocal}"></div>
              <div class="selectedFuturePicks sfp${teamNumberLocal}"></div>
              <div class="selectedPlayers sp${teamNumberLocal}"></div>
            `;
            document.querySelector('.headerHalf2').setAttribute("style", `background-color: rgb(20,20,20);`);
            team2Total = 0;
            document.querySelector('.tradeValueBalance').textContent = Math.abs(Math.round((team1Total-team2Total) * 10) / 10);
            document.querySelector('.tradeValueText').textContent = `Owes:`;
          }
        }
      });
    });
  });

  document.querySelector('.tradeSubmitBtn').addEventListener("click", () => {
    if (!team1 || !team2) return; else {

      tradeID += 1;
      localStorage.setItem('totalTrades', tradeID);

      let team1Assets = {team: team1.abbv, currentPicks: [], futurePicks: [], players: []};
      let team2Assets = {team: team2.abbv, currentPicks: [], futurePicks: [], players: []};
      let team1Strings = [];
      let team2Strings = [];
      let team1String = `<span style="
        font-weight: 700;
        background-color: ${team1.color};
        color: white;
        text-shadow: 0px 0px 3px black;
        padding: 0px 5px 0px 5px;
        border-radius: 3px;
      ">${team1.abbv}</span> gets: `;
      let team2String = `<span style="
        font-weight: 700;
        background-color: ${team2.color};
        color: white;
        text-shadow: 0px 0px 3px black;
        padding: 0px 5px 0px 5px;
        border-radius: 3px;
      ">${team2.abbv}</span> gets: `;

      team1SelectedCurrent.forEach((pick) => {
        const index = newTest1.findIndex(p => p.n === pick.n);
        if (index !== -1) newTest1.splice(index, 1);
        newTest2.push(pick);
        team2Assets.currentPicks.push(pick);
        team2Strings.push(`${pick.n}`);
      });
      team1SelectedFuture.forEach((pick) => {
        team1.futurePicks = team1.futurePicks.filter(p => !(p.r === pick.r && p.t === pick.t));
        team2.futurePicks.push(pick);
        team2Assets.futurePicks.push(pick);
        team2Strings.push(`'27 ${pick.r}RP (${pick.t})`);
      });
      team1SelectedPlayers.forEach((player) => {
        allPositionList.forEach((position) => {
          if (team1[position].includes(player)) {
            team1[position] = team1[position].filter(p => p !== player);
            team2[position].push(player);
            team2Assets.players.push(player);
            team2Strings.push(`${player}`);
          }
        });
      });
      team2SelectedCurrent.forEach((pick) => {
        const index = newTest2.findIndex(p => p.n === pick.n);
        if (index !== -1) newTest2.splice(index, 1);
        newTest1.push(pick);
        team1Assets.currentPicks.push(pick);
        team1Strings.push(`${pick.n}`);
      });
      team2SelectedFuture.forEach((pick) => {
        team2.futurePicks = team2.futurePicks.filter(p => !(p.r === pick.r && p.t === pick.t));
        team1.futurePicks.push(pick);
        team1Assets.futurePicks.push(pick);
        team1Strings.push(`'27 ${pick.r}RP (${pick.t})`);
      });
      team2SelectedPlayers.forEach((player) => {
        allPositionList.forEach((position) => {
          if (team2[position].includes(player)) {
            team2[position] = team2[position].filter(p => p !== player);
            team1[position].push(player);
            team1Assets.players.push(player);
            team1Strings.push(`${player}`);
          }
        });
      });

      team1Strings.forEach((item, index) => {if (index === team1Strings.length - 1) team1String += `${item}`; else team1String += `${item}, `;});
      team2Strings.forEach((item, index) => {if (index === team2Strings.length - 1) team2String += `${item}`; else team2String += `${item}, `;});

      localStorage.setItem(`${team1.name}test`, JSON.stringify(newTest1));
      localStorage.setItem(`${team2.name}test`, JSON.stringify(newTest2));

      localStorage.setItem(`trade${tradeID}-1`, JSON.stringify(team1Assets));
      localStorage.setItem(`trade${tradeID}-1string`, team1String);
      localStorage.setItem(`trade${tradeID}-2`, JSON.stringify(team2Assets));
      localStorage.setItem(`trade${tradeID}-2string`, team2String);

      document.body.removeChild(tradePage);
      document.querySelector('.draft-order-panel').innerHTML = '';
      buildDraftOrder2(selectedValue);
      otcHeaderElem.innerHTML = '';
      changeHeader();
    }
  });
});

function startDraft() { // Close pre-draft settings and start draft

  selectedValue = JSON.parse(localStorage.getItem('roundsInput'));
  nameValue = JSON.parse(localStorage.getItem('nameInput'));
  if (nameValue === '') {
    nameValue = 'Anonymous';
    localStorage.setItem('nameInput', JSON.stringify(nameValue));
  }
  teamsValue = JSON.parse(localStorage.getItem('teamsInput'));
  if (teamsValue.length === 0 && nameValue === 'Anonymous') {
    nameValue = 'Auto Draft';
    localStorage.setItem('nameInput', JSON.stringify(nameValue));
  }
  selectedBoard = JSON.parse(localStorage.getItem('boardInput'));

  if (document.querySelector('.begin').innerHTML !== 'PAUSE') {
    for (let i = 1; i < 1000; i++) { // Build the list of all players
      playerData26.forEach((player) => {
        if (player[`${selectedBoard}`] === i) {buildPlayerList(player)}
      });
    }
    document.querySelector('.players-player-js').innerHTML += playerList; // Display player list
  }

  positionSort(); // Add functionality to position buttons
  const playerCard = document.querySelectorAll('.player-card-js');
  displayProfile(playerCard, selectedValue); // Add event listeners to every player card on the screen that displays their profile
  singleAutoPick(selectedValue);
}

function buildPlayerList(player) { // Goes through every player in the player data script and adds this html for each player
  rankUsed = player[`${selectedBoard}`];

  playerList += `
    <div class="players-player-card player-card-js" data-rank="${rankUsed}">
      <div class="players-player-card-rank">
        ${rankUsed}
      </div>
      <div class="players-player-card-name">
        ${player.name}
      </div>
      <div class="players-player-card-position">
        ${player.position}
      </div>
      <div class="players-player-card-school">
        ${player.school}
      </div>
      <img class="college-image" src="${player.schoolLogo}">
    </div>
  `;
}

function positionSort() { // Add functionality to position buttons
  document.querySelectorAll('.js-position-button').forEach((button) => {
    button.addEventListener("click", () => {
      playerList = ''; // Clear player list first, so we can fill it with the correct players
  
      if (button.innerHTML === 'ALL') { // Show all players when 'ALL' button clicked
        playerList = '';
        for (let i = 1; i < 1000; i++) {
          playerData26.forEach((player) => {
            if (player[`${selectedBoard}`] === i) {buildPlayerList(player)}
          });
        }
      }
  
      
      for (let i = 1; i < 1000; i++) { // Any other button clicked, only add players of that position to the list
        playerData26.forEach((player) => {
          if (player[`${selectedBoard}`] === i) {
            if (player.position === button.innerHTML) buildPlayerList(player);
          }
        });
      }
  
      document.querySelector('.players-player-js').innerHTML = playerList; // Display the list

      const playerCard = document.querySelectorAll('.player-card-js');
      displayProfile(playerCard, selectedValue); // Add event listeners to every player card in the new, sorted list that displays each player's profile
    });
  });
}

function displayProfile(playerCard, selectedValue) { // Add event listeners to player cards that display their profile
  playerCard.forEach((card) => {
    card.addEventListener("click", () => {
      viewing = card.dataset.rank; // Read which player card is clicked
      const playerRank = card.dataset.rank; // Read which player card is clicked
      const profileHTML = document.querySelector(".profile-js");
      profileHTML.innerHTML = null; // Clear profile so the new one can be added

      playerData26.forEach((player) => {
        rankUsed = player[`${selectedBoard}`];
        if (rankUsed === Number(playerRank)) { // Get the correct player data to display
          profileHTML.setAttribute("style", `
            background-color: rgb(20, 20, 20);
            text-shadow: none;
            display: grid;
            grid-template-rows: 90px 70px 1fr;
            flex-direction: none;
            align-items: none;
            padding: 0px;
          `);
          
          profileHTML.innerHTML += `
            <div class="info">
              <div class="info-logo">
                <img class="info-image" src="${player.schoolLogo}">
              </div>
              <div class="info-info">
                <div class="info-name">${player.name}</div>
                <div class="info-position-school">${player.position} ${player.school}</div>
              </div>
              <div class="info-draft-button">
                <button class="draft-button draft-button-js">DRAFT</button>
              </div>
            </div>

            <div class="measurables">
              <div class="height measurable-item">
                <div class="measurable-text">Height</div>
                <div class="measurable-value">${player.height}</div>
              </div>
              <div class="weight measurable-item">
                <div class="measurable-text">Weight</div>
                <div class="measurable-value">${player.weight}</div>
              </div>
              <div class="measurable-item">
                <div class="measurable-text">Consensus</div>
                <div class="measurable-value">${player.consensus}</div>
              </div>
              <div class="measurable-item">
                <div class="measurable-text">SIS Projected Role</div>
                <div class="measurable-value">${player.pffGrade}</div>
              </div>
            </div>

            <div class="stats">
              <div class="analysis">
                <span class="heading">Pre-Draft Analysis</span><br>${player.analysis}
              </div>
              <button class="ref">
                <a href="${player.stats}" target="_blank" class="fbref">SIS Full Report</a>
              </button>
            </div>
          `;
          document.querySelector('.draft-button-js').addEventListener("click", () => { // Add functionality to the draft button
            userDraftPlayer(selectedValue, player);
          });
        }
      });

      
    });
  });
}

export function draftPlayer(selectedValue, player) {
  let selectingTeam = '';
  rankUsed = player[`${selectedBoard}`];

  const teamPick = document.querySelectorAll('.pick-player'); // This is built in buildDraftOrder2(), it is where the player's name and info go
  teamPick.forEach((pick) => {
    if (otc === Number(pick.dataset.info)) { // otc starts at 1. The player selected when the first Draft button is clicked will match with the first team card in the draft panel
      pick.innerHTML = ` 
        <div class="pick-name">${player.name}</div>
        <div class="pick-info">${player.position} ${player.school} (${rankUsed})</div>
      `;
      savePickInfo(pick.dataset.info, pick);
    }
  });

  const teamPick1 = document.querySelectorAll('.pick-player-logo'); // This is built in buildDraftOrder2(), it is where the player's college team logo goes
  teamPick1.forEach((pick) => {
    if (otc === Number(pick.dataset.logo)) { // otc starts at 1. The player selected when the first Draft button is clicked will match with the first team card in the draft panel
      pick.innerHTML = `
        <img src="${player.schoolLogo}" class="college-image">
      `;
      savePickLogo(pick.dataset.logo, pick);
    }
  });
  

  nflTeams.forEach((team) => {
    let newTest;
    if (JSON.parse(localStorage.getItem(`${team.name}test`))) {
      newTest = JSON.parse(localStorage.getItem(`${team.name}test`));
    } else {
      newTest = team.test;
    }
    newTest.forEach((pick) => {
      if (pick.n === otc) { // Finds which team owns the pick number that is being made
        if (team.needs.includes(player.position)) {
          team.needs = team.needs.filter(pos => pos !== player.position);
        }
        team.drafted.push(player.position);

        pick.p = `${player.position} ${player.name}`; // Set the player name for the pick that is being made
        pick.pn = `${player.name}`;
        pick.pos = `${player.position}`;
        localStorage.setItem(`${pick.n}${team.name}`, JSON.stringify(pick)); // Save the player selected at this pick number for it can be displayed in the summary
        selectingTeam = team.name;
      }
    });
    localStorage.setItem(`${team.name}test`, JSON.stringify(newTest));
  });

  scoringData.push({n: otc, t: selectingTeam, p: player.name});
  localStorage.setItem(`scoringData`, JSON.stringify(scoringData));

  //dataForSave.push({team: selectingTeam, player: player.name});

  //if (otc === 10) saveData();

  switch(String(selectedValue)) { // Determine when to end draft and go to summary screen
    case "1": // Read which number of rounds was selected (selectedValue) and end the draft after the final pick in that round
      if (otc === 32) {
        window.location.href='new-summary.html';
        break;
      }
    case "2":
      if (otc === 64) {
        window.location.href='new-summary.html';
        break;
      }
    case "3":
      if (otc === 100) {
        window.location.href='new-summary.html';
        break;
      }
    case "4":
      if (otc === 138) {
        window.location.href='new-summary.html';
        break;
      }
    case "5":
      if (otc === 180) {
        window.location.href='new-summary.html';
        break;
      }
    case "6":
      if (otc === 216) {
        window.location.href='new-summary.html';
        break;
      }
    case "7":
      if (otc === 257) {
        window.location.href='new-summary.html';
        break;
      }
  }

  let indexToRemove = playerData26.findIndex(obj => obj.name === player.name);
  if (indexToRemove !== -1) {
    playerData26.splice(indexToRemove, 1); // Remove the selected player from the js file of all players' data
  }
  
  playerList = ''; // Reset player list so it can be rebuilt without the just-selected player

  for (let i = 1; i < 1000; i++) {
    playerData26.forEach((player) => {
      if (player[`${selectedBoard}`] === i) {buildPlayerList(player)}
    });
  }
  document.querySelector('.players-player-js').innerHTML = playerList; // display new player cards

  const playerCard = document.querySelectorAll('.player-card-js');
  displayProfile(playerCard, selectedValue); // Re-add event listeners to each player card

  

  otc += 1; // Move to next team in draft order
  localStorage.setItem('otc', JSON.stringify(otc));
  changeHeader(); // Change the display at top based on which team is now on the clock
  document.querySelector(".profile-js").innerHTML = null; // Clear the profile of the player that was just drafted

  const pickItem = document.querySelectorAll('.draft-order-item');
  for (let item of pickItem) {
    if (otc === Number(item.dataset.order)+4) {
      item.scrollIntoView(); // Auto-scroll when enough picks are made to move down the draft order panel
      break;
    }
  };
}

function userDraftPlayer(selectedValue, player) {
  draftPlayer(selectedValue, player);
  singleAutoPick(selectedValue);
}

function changeHeader() {
  nflTeams.forEach((team) => {
    let newTest;
    if (JSON.parse(localStorage.getItem(`${team.name}test`))) {
      newTest = JSON.parse(localStorage.getItem(`${team.name}test`));
    } else {
      newTest = team.test;
    }

    if (newTest.some(obj => obj.n === otc)) {

      document.querySelector('.otc-header').innerHTML = `
        <div class="otcPanel" style="
          background-color: rgb(0,0,0);
          box-shadow: inset 0px 0px 350px ${team.color};
        ">
          <div class="otcLogo">
            <img class="otcImage" src="${team.logo}">
          </div>
          <div class="otcInfo">
            <div class="otcPicks">
              <div class="otcInfoText">Picks</div>
            </div>
            <div class="otcNeeds">
              <div class="otcInfoText">Needs</div>
            </div>
          </div>
          <div class="otcPlayers"></div>
          <div class="otcText">ON<br>THE<br>CLOCK</div>
        </div>
      `;

      newTest
        .sort((a, b) => a.n - b.n)
        .forEach((pick) => {
          let pickOpacity;
          if (pick.p !== "") {pickOpacity = 0.25} else {pickOpacity = 1}
          document.querySelector('.otcPicks').innerHTML += `
            <div class="otcPickCard" style="opacity: ${pickOpacity};">${pick.n}</div>
          `;

          if (pick.p !== "") {
            document.querySelector('.otcPlayers').innerHTML += `
              <div class="otcPlayerDiv">
                <div class="otcPlayerOvr">${pick.n}</div>
                <div class="otcPlayerPos">${pick.pos}</div>
                <div class="otcPlayerName">${pick.pn}</div>
              </div>
            `;
          }
        });

      team.needs.forEach((need) => {
        document.querySelector('.otcNeeds').innerHTML += `
          <div class="otcNeedCard">${need}</div>
        `;
      });
      /*
        <div class="otcPanel" style="
          background-color: rgb(0,0,0);
          box-shadow: inset 0px 0px 350px ${team.color};
        ">
          <div class="otcLogo">
            <img class="otcImage" src="${team.logo}">
          </div>
          <div class="otcInfo">
            <div class="otcPicks"></div>
            <div class="otcNeeds"></div>
          </div>
          <div class="otcPlayers"></div>
          <div class="otcText">ON<br>THE<br>CLOCK</div>
        </div>

        newTest
          .sort((a, b) => a.n - b.n)
          .forEach((pick) => {
            let pickOpacity;
            if (pick.p !== "") {pickOpacity = 0.25} else {pickOpacity = 1}
            document.querySelector('.otcPicks').innerHTML += `
              <div class="otcPickCard" style="opacity: ${pickOpacity};">${pick.n}</div>
            `;
          });

        team.needs.forEach((need) => {
          document.querySelector('.otcNeeds').innerHTML += `
            <div class="otcNeedCard">${need}</div>
          `;
        });

      
      newTest.forEach((pick) => { // If team is making their 2nd or later pick, this adds each of their previous picks to the header
        if (pick.p !== "" && pick.p !== undefined) { // If any of their picks contains a player, display that player in the header
          document.querySelector('.otc-previous').innerHTML += `
            <div class="otc-previous-pick">${pick.p}</div>
          `;
        }
      });
      */
    }
  });
}

document.querySelector('.settings').addEventListener("click", () => { // Add functionality to restart button
  if(confirm("Are you sure you want to restart?")) {
    window.location.href = 'index.html';
  }
});

function savePickInfo(n, pick) {
  localStorage.setItem(`${n}info`, JSON.stringify(pick.innerHTML));
}

function savePickLogo(n, pick) {
  localStorage.setItem(`${n}logo`, JSON.stringify(pick.innerHTML));
}

/*function saveData() {
  const draft = {
    drafter: nameValue,
    picks: dataForSave,
    timestamp: Date.now()
  };
  console.log(draft)
  //db.ref("drafts").push(draft);
}*/