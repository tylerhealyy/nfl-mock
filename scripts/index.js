import { playerData } from "./player-data.js";
import { playerData26 } from "./playerData26.js";
import { nflTeams } from "./nfl-team-data.js";
import { buildDraftOrder2 } from "./draft-order.js";
import { singleAutoPick } from "./draft-order.js";

let playerList = '';
let otc = 1;
localStorage.setItem('otc', JSON.stringify(otc));
let viewing;
let selectedValue;
let nameValue = '';
let teamsValue = '';
let scoringData = [];
let dataForSave = [];

nflTeams.forEach((team) => { // Reset all picks on every refresh
  team.test.forEach((pick) => {
    pick.p = "";
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

let j = 1;
while (j < 20) {
  if (localStorage.getItem(`${j}tradeA`)) {
    localStorage.removeItem(`${j}tradeA`);
    localStorage.removeItem(`${j}tradeB`);
  }
  j += 1;
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
  tradeFunction(selectedValue);
  changeHeader();
  localStorage.removeItem("functionExecuted");
});

document.querySelector('.begin').addEventListener("click", () => {
  startDraft();
  document.querySelector('.begin').innerHTML = 'PAUSE';
  document.querySelector('.begin').style.background = 'white';
  document.querySelector('.begin').style.color = 'black';
  document.querySelector('.begin').style.textShadow = 'none';
  document.querySelector('.begin').addEventListener("mouseover", () => document.querySelector('.begin').style.backgroundColor = 'rgb(194, 194, 194)');
  document.querySelector('.begin').addEventListener("mouseout", () => document.querySelector('.begin').style.backgroundColor = 'white');
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

  for (let i = 1; i < 1000; i++) { // Build the list of all players
    playerData.forEach((player) => {
      if (player.consensus === i) {
        buildPlayerList(player);
      }
    });
  }
  document.querySelector('.players-player-js').innerHTML += playerList; // Display player list

  positionSort(); // Add functionality to position buttons
  const playerCard = document.querySelectorAll('.player-card-js');
  displayProfile(playerCard, selectedValue); // Add event listeners to every player card on the screen that displays their profile
  singleAutoPick(selectedValue);
}

function buildPlayerList(player) { // Goes through every player in the player data script and adds this html for each player
  playerList += `
    <div class="players-player-card player-card-js" data-rank="${player.consensus}">
      <div class="players-player-card-rank">
        ${player.consensus}
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
          playerData.forEach((player) => {
            if (player.consensus === i) {
              buildPlayerList(player);
            }
          });
        }
      }
  
      
      for (let i = 1; i < 1000; i++) { // Any other button clicked, only add players of that position to the list
        playerData.forEach((player) => {
          if (player.consensus === i) {
            if (player.position === button.innerHTML) {
              buildPlayerList(player);
            }
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

      playerData.forEach((player) => {
        if (player.consensus === Number(playerRank)) { // Get the correct player data to display
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
              <div class="age measurable-item">
                <div class="measurable-text">Age</div>
                <div class="measurable-value">${player.age}</div>
              </div>
              <div class="measurable-item">
                <div class="measurable-text">Consensus</div>
                <div class="measurable-value">${player.consensus}</div>
              </div>
              <div class="measurable-item">
                <div class="measurable-text">PFF</div>
                <div class="measurable-value">${player.rank}</div>
              </div>
            </div>

            <div class="stats">
              <div class="analysis">
                <span class="heading">Pre-Draft Analysis</span><br>${player.analysis}
              </div>
              <button class="ref">
                <a href="${player.stats}" target="_blank" class="fbref">Sports Reference</a>
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

export function draftPlayer(selectedValue, player) { // Read selected player to add it correctly to team data and draft order display
  let selectingTeam = '';

  const teamPick = document.querySelectorAll('.pick-player'); // This is built in buildDraftOrder2(), it is where the player's name and info go
  teamPick.forEach((pick) => {
    if (otc === Number(pick.dataset.info)) { // otc starts at 1. The player selected when the first Draft button is clicked will match with the first team card in the draft panel
      pick.innerHTML = ` 
        <div class="pick-name">${player.name}</div>
        <div class="pick-info">${player.position} ${player.school}</div>
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
    team.test.forEach((pick) => {
      if (pick.n === otc) { // Finds which team owns the pick number that is being made
        pick.p = `${player.position} ${player.name}`; // Set the player name for the pick that is being made
        localStorage.setItem(`${pick.n}${team.name}`, JSON.stringify(pick)); // Save the player selected at this pick number for it can be displayed in the summary
        selectingTeam = team.name;
      }
    });
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
      if (otc === 102) {
        window.location.href='new-summary.html';
        break;
      }
    case "4":
      if (otc === 138) {
        window.location.href='new-summary.html';
        break;
      }
    case "5":
      if (otc === 176) {
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

  let indexToRemove = playerData.findIndex(obj => obj.name === player.name);
  if (indexToRemove !== -1) {
    playerData.splice(indexToRemove, 1); // Remove the selected player from the js file of all players' data
  }
  
  playerList = ''; // Reset player list so it can be rebuilt without the just-selected player

  for (let i = 1; i < 1000; i++) {
    playerData.forEach((player) => {
      if (player.consensus === i) {
        buildPlayerList(player); // Rebuild player list
      }
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

function changeHeader() { // Change the display at top based on which team is now on the clock
  nflTeams.forEach((team) => {
    let newTest;
    if (JSON.parse(localStorage.getItem(`${team.name}test`))) {
      newTest = JSON.parse(localStorage.getItem(`${team.name}test`));
    } else {
      newTest = team.test;
    }

    if (newTest.some(obj => obj.n === otc)) { // If a team is next in the draft order, display their header
      let listedPicks = [];
      newTest.forEach((pick) => {
        listedPicks.push(pick.n);
      });
      document.querySelector('.otc-header').innerHTML = `
        <div class="otc-panel" style="
          background-color: white;
            box-shadow: inset 0px 0px 150px ${team.color};
        ">
          <div class="otc-logo">
            <img class="otc-image" src="${team.logo}">
          </div>
          <div class="otc-middle">
            <div class="otc-text">ON THE CLOCK</div>
            <div class="otc-picks">Picks: ${listedPicks}</div>
            <div class="otc-needs">Needs: ${team.needs}</div>
          </div>
          <div class="otc-team">${team.city}<br>${team.name}</div>
          <div class="otc-previous"></div>
        </div>
      `;
      newTest.forEach((pick) => { // If team is making their 2nd or later pick, this adds each of their previous picks to the header
        if (pick.p !== "" && pick.p !== undefined) { // If any of their picks contains a player, display that player in the header
          document.querySelector('.otc-previous').innerHTML += `
            <div class="otc-previous-pick">${pick.p}</div>
          `;
        }
      });
    }
  });
}

let tradeOrder = 0;
function showTrade(selectedValue) {
  // Prevent multiple popups from being created
  if (document.querySelector('.settings-popup')) return;

  document.body.insertAdjacentHTML('beforeend', `
    <div class="closer">
      <div class="shader"></div>
      <div class="settings-popup">
        <div class="settings-content">
          <div class="trade-panel">
            <div class="trade-team-section section-left">
              <select class="trade-team-selector selectorA">
                <option disabled selected>Choose Team 1</option>
                <option value="Cardinals">Arizona Cardinals</option>
                <option value="Falcons">Atlanta Falcons</option>
                <option value="Ravens">Baltimore Ravens</option>
                <option value="Bills">Buffalo Bills</option>
                <option value="Panthers">Carolina Panthers</option>
                <option value="Bears">Chicago Bears</option>
                <option value="Bengals">Cincinnati Bengals</option>
                <option value="Browns">Cleveland Browns</option>
                <option value="Cowboys">Dallas Cowboys</option>
                <option value="Broncos">Denver Broncos</option>
                <option value="Lions">Detroit Lions</option>
                <option value="Packers">Green Bay Packers</option>
                <option value="Texans">Houston Texans</option>
                <option value="Colts">Indianapolis Colts</option>
                <option value="Jaguars">Jacksonville Jaguars</option>
                <option value="Chiefs">Kansas City Chiefs</option>
                <option value="Raiders">Las Vegas Raiders</option>
                <option value="Chargers">Los Angeles Chargers</option>
                <option value="Rams">Los Angeles Rams</option>
                <option value="Dolphins">Miami Dolphins</option>
                <option value="Vikings">Minnesota Vikings</option>
                <option value="Patriots">New England Patriots</option>
                <option value="Saints">New Orleans Saints</option>
                <option value="Giants">New York Giants</option>
                <option value="Jets">New York Jets</option>
                <option value="Eagles">Philadelphia Eagles</option>
                <option value="Steelers">Pittsburgh Steelers</option>
                <option value="49ers">San Francisco 49ers</option>
                <option value="Seahawks">Seattle Seahawks</option>
                <option value="Buccaneers">Tampa Bay Buccaneers</option>
                <option value="Titans">Tennessee Titans</option>
                <option value="Commanders">Washington Commanders</option>
              </select>
              <ul id="teamA" class="trade-assets assets1"></ul>
              <ul id="teamAFtr" class="trade-assets assets1"></ul>
            </div>
            <div class="trade-team-section">
              <select class="trade-team-selector selectorB">
                <option disabled selected>Choose Team 2</option>
                <option value="Cardinals">Arizona Cardinals</option>
                <option value="Falcons">Atlanta Falcons</option>
                <option value="Ravens">Baltimore Ravens</option>
                <option value="Bills">Buffalo Bills</option>
                <option value="Panthers">Carolina Panthers</option>
                <option value="Bears">Chicago Bears</option>
                <option value="Bengals">Cincinnati Bengals</option>
                <option value="Browns">Cleveland Browns</option>
                <option value="Cowboys">Dallas Cowboys</option>
                <option value="Broncos">Denver Broncos</option>
                <option value="Lions">Detroit Lions</option>
                <option value="Packers">Green Bay Packers</option>
                <option value="Texans">Houston Texans</option>
                <option value="Colts">Indianapolis Colts</option>
                <option value="Jaguars">Jacksonville Jaguars</option>
                <option value="Chiefs">Kansas City Chiefs</option>
                <option value="Raiders">Las Vegas Raiders</option>
                <option value="Chargers">Los Angeles Chargers</option>
                <option value="Rams">Los Angeles Rams</option>
                <option value="Dolphins">Miami Dolphins</option>
                <option value="Vikings">Minnesota Vikings</option>
                <option value="Patriots">New England Patriots</option>
                <option value="Saints">New Orleans Saints</option>
                <option value="Giants">New York Giants</option>
                <option value="Jets">New York Jets</option>
                <option value="Eagles">Philadelphia Eagles</option>
                <option value="Steelers">Pittsburgh Steelers</option>
                <option value="49ers">San Francisco 49ers</option>
                <option value="Seahawks">Seattle Seahawks</option>
                <option value="Buccaneers">Tampa Bay Buccaneers</option>
                <option value="Titans">Tennessee Titans</option>
                <option value="Commanders">Washington Commanders</option>
              </select>
              <ul id="teamB" class="trade-assets assets1"></ul>
              <ul id="teamBFtr" class="trade-assets assets1"></ul>
            </div>
          </div>
          <div class="buttons">
            <button class="submit-trade">Submit Trade</button>
            <button class="close-settings">Close</button>
          </div>
        </div>
      </div>
    </div>
  `);

  let selectedA = [];
  let selectedB = [];
  const tradeTeamA = document.querySelector('.selectorA');
  const tradeTeamB = document.querySelector('.selectorB');

  function renderTeams() {
    let teamAList = document.getElementById('teamA');
    let teamAFtrList = document.getElementById('teamAFtr');
    let teamBList = document.getElementById('teamB');
    let teamBFtrList = document.getElementById('teamBFtr');
    teamAList.innerHTML = '';
    teamBList.innerHTML = '';

    tradeTeamA.addEventListener("change", () => {
      selectedA = [];
      teamAList.replaceChildren();
      teamAFtrList.replaceChildren();
      nflTeams.forEach((team) => {
        if (team.name === tradeTeamA.value) {
          team.test.forEach((pick) => {
            if (pick.n >= otc) {
              let li = document.createElement('li'); // Create <li> for each pick
              li.textContent = `R${pick.r} #${pick.n}`; // Fill in <li> content
              li.onclick = () => selectItem(li, pick, `${team.name}`); // Add class to color the <li>, and save the pick so we can trade it and remove the class later
              teamAList.appendChild(li);
            }
          });
          team.future.forEach((pick) => {
            if (true) {
              let li = document.createElement('li'); // Create <li> for each pick
              li.textContent = `${pick}`; // Fill in <li> content
              li.onclick = () => selectItem(li, pick, `${team.name}`); // Add class to color the <li>, and save the pick so we can trade it and remove the class later
              teamAFtrList.appendChild(li);
            }
          });
        }
      });
    });

    tradeTeamB.addEventListener("change", () => {
      selectedB = [];
      teamBList.replaceChildren();
      teamBFtrList.replaceChildren();
      nflTeams.forEach((team) => {
        if (team.name === tradeTeamB.value) {
          team.test.forEach((pick) => {
            if (pick.n >= otc) {
              let li = document.createElement('li'); // Create <li> for each pick
              li.textContent = `R${pick.r} #${pick.n}`; // Fill in <li> content
              li.onclick = () => selectItem(li, pick, `${team.name}`); // Add class to color the <li>, and save the pick so we can trade it and remove the class later
              teamBList.appendChild(li);
            }
          });
          team.future.forEach((pick) => {
            if (true) {
              let li = document.createElement('li'); // Create <li> for each pick
              li.textContent = `${pick}`; // Fill in <li> content
              li.onclick = () => selectItem(li, pick, `${team.name}`); // Add class to color the <li>, and save the pick so we can trade it and remove the class later
              teamBFtrList.appendChild(li);
            }
          });
        }
      });
    });
  }

  function selectItem(item, asset, team) {
    if (team === tradeTeamA.value) {
      if (!selectedA.some(v => v.element === item && v.asset === asset)) { // If it's not already selected, select it and highlight
        selectedA.push({ element: item, asset }); // Save the <li> and specific pick to switch the pick and move the <li> if it is traded
        item.classList.remove('deselected');
      } else { // If it is already selected, remove it from selected list and remove highlight
        selectedA = selectedA.filter(v => !(v.element === item && v.asset === asset));
        item.classList.add('deselected');
      }
    } else if (team === tradeTeamB.value) {
      if (!selectedB.some(v => v.element === item && v.asset === asset)) {
        selectedB.push({ element: item, asset });
        item.classList.remove('deselected');
      } else {
        selectedB = selectedB.filter(v => !(v.element === item && v.asset === asset));
        item.classList.add('deselected');
      }
    }
    item.classList.add('selected'); // Add color to newly selected one
  }

  let rounds = selectedValue;
  
  function trade(rounds) {
    if (selectedA.length !== 0 && selectedB.length !== 0) {
      tradeOrder += 1;

      let arrayTeamA = nflTeams.find(team => team.name === tradeTeamA.value);
      let arrayTeamB = nflTeams.find(team => team.name === tradeTeamB.value);
  
      selectedA.forEach((apick) => {
        arrayTeamA.test = arrayTeamA.test.filter(asset => asset !== apick.asset);
        arrayTeamB.test.push(apick.asset);
        arrayTeamA.future = arrayTeamA.future.filter(asset => asset !== apick.asset);
        if (typeof(apick.asset) === 'string') {
          arrayTeamB.future.push(apick.asset);
        }
        apick.element.classList.remove('selected');
      });
  
      selectedB.forEach((bpick) => {
        arrayTeamB.test = arrayTeamB.test.filter(asset => asset !== bpick.asset);
        arrayTeamA.test.push(bpick.asset);
        arrayTeamB.future = arrayTeamB.future.filter(asset => asset !== bpick.asset);
        if (typeof(bpick.asset) === 'string') {
          arrayTeamA.future.push(bpick.asset);
        }
        bpick.element.classList.remove('selected');
      });

      // save each team.test
      localStorage.setItem(`${arrayTeamA.name}test`, JSON.stringify(arrayTeamA.test));
      localStorage.setItem(`${arrayTeamB.name}test`, JSON.stringify(arrayTeamB.test));

      // before clearing selected lists, save them to use in trade summary

      let preTradeSummaryListA = [];
      selectedA.forEach((item) => {
        if (typeof(item.asset) === 'object') {
          preTradeSummaryListA.push(`R${item.asset.r} #${item.asset.n}`);
        } else {
          preTradeSummaryListA.push(item.asset);
        }
      });
      let tradeSummaryListA = `<span class="bold">${arrayTeamB.name}</span> get: `;
      preTradeSummaryListA.forEach((item, index) => {
        if (index === preTradeSummaryListA.length - 1) {
          tradeSummaryListA += `${item}`;
        } else {
          tradeSummaryListA += `${item}, `;
        }
      });

      let preTradeSummaryListB = [];
      selectedB.forEach((item) => {
        if (typeof(item.asset) === 'object') {
          preTradeSummaryListB.push(`R${item.asset.r} #${item.asset.n}`);
        } else {
          preTradeSummaryListB.push(item.asset);
        }
      });
      let tradeSummaryListB = `<span class="bold">${arrayTeamA.name}</span> get: `;
      preTradeSummaryListB.forEach((item, index) => {
        if (index === preTradeSummaryListB.length - 1) {
          tradeSummaryListB += `${item}`;
        } else {
          tradeSummaryListB += `${item}, `;
        }
      });

      localStorage.setItem(`${tradeOrder}${arrayTeamA.name}received`, tradeSummaryListB);
      localStorage.setItem(`${tradeOrder}${arrayTeamA.name}partner`, JSON.stringify(arrayTeamB.name));
      localStorage.setItem(`${tradeOrder}${arrayTeamB.name}received`, tradeSummaryListA);
      localStorage.setItem(`${tradeOrder}${arrayTeamB.name}partner`, JSON.stringify(arrayTeamA.name));
      localStorage.setItem(`${tradeOrder}tradeA`, tradeSummaryListA);
      localStorage.setItem(`${tradeOrder}tradeB`, tradeSummaryListB);

      selectedA = [];
      selectedB = [];

      document.querySelector('.closer').remove();
    }
    document.querySelector('.draft-order-panel').innerHTML = '';
    buildDraftOrder2(rounds);
    changeHeader();
  }

  renderTeams();

  document.querySelector('.submit-trade').addEventListener("click", () => {
    trade(rounds);
  });
  
  attachCloseEvent(); // Attach close event after popup is added
}

function tradeFunction(selectedValue) {
  document.querySelector('.trade').addEventListener("click", () => {
    showTrade(selectedValue); // Ensure this function recreates .settings-popup
    attachCloseEvent(); // Attach close event after .settings-popup is created
  });
}

function attachCloseEvent() {
  const closeBtn = document.querySelector('.close-settings');
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      document.querySelector('.closer').remove();
    }, { once: true }); // Ensure this event fires only once
  }
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