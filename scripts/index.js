import { playerData } from "./player-data.js";
import { nflTeams } from "./nfl-team-data.js";
import { buildDraftOrder2 } from "./draft-order.js";

let playerList = '';
let otc = 1;
let viewing;
let selectedValue;

document.querySelector('.name-input').value = '';
let nameValue = document.querySelector('.name-input').value;
localStorage.setItem("savedName", nameValue);

nflTeams.forEach((team) => { // Reset all picks on every refresh
  team.test.forEach((pick) => {
    pick.p = "";
    localStorage.setItem(`${pick.n}${team.name}`, JSON.stringify(pick));
  });
});

document.querySelector('.start-button').addEventListener("click", () => { // Add functionality to 'start draft' button
  startDraft();
});

function startDraft() { // Close pre-draft settings and start draft
  let radios = document.getElementsByName("rounds");

  for (let radio of radios) { // Read how many rounds the user selected
    if (radio.checked) {
      selectedValue = radio.value;
      break;
    }
  }

  nameValue = document.querySelector('.name-input').value; // Get inputted name and store it
  if (nameValue === '') {
    nameValue = 'Nobody';
  }
  localStorage.setItem("savedName", JSON.stringify(nameValue));
  
  document.querySelector('.pre-draft-options').innerHTML = ''; // Remove pre-draft options screen

  for (let i = 1; i < 301; i++) { // Build the list of all players
    playerData.forEach((player) => {
      if (player.rank === i) {
        buildPlayerList(player);
      }
    });
  }
  document.querySelector('.players-player-js').innerHTML += playerList; // Display player list

  positionSort(); // Add functionality to position buttons
  
  const playerCard = document.querySelectorAll('.player-card-js');
  displayProfile(playerCard, selectedValue); // Add event listeners to every player card on the screen that displays their profile

  buildDraftOrder2(selectedValue); // Builds the draft order display on left side
}

function buildPlayerList(player) { // Goes through every player in the player data script and adds this html for each player
  playerList += `
    <div class="players-player-card player-card-js" data-rank="${player.rank}">
      <div class="players-player-card-rank">
        ${player.rank}
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
        for (let i = 1; i < 301; i++) {
          playerData.forEach((player) => {
            if (player.rank === i) {
              buildPlayerList(player);
            }
          });
        }
      }
  
      
      for (let i = 1; i < 301; i++) { // Any other button clicked, only add players of that position to the list
        playerData.forEach((player) => {
          if (player.rank === i) {
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
        if (player.rank === Number(playerRank)) { // Get the correct player data to display
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
                <div class="measurable-text">PFF Rank</div>
                <div class="measurable-value">${player.rank}</div>
              </div>
              <div class="measurable-item">
                <div class="measurable-text">Pos Rank</div>
                <div class="measurable-value">${player.positionRank}</div>
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
            draftPlayer(selectedValue, player);
          });
        }
      });

      
    });
  });
}

function draftPlayer(selectedValue, player) { // Read selected player to add it correctly to team data and draft order display

  const teamPick = document.querySelectorAll('.pick-player'); // This is built in buildDraftOrder2(), it is where the player's name and info go
  teamPick.forEach((pick) => {
    if (otc === Number(pick.dataset.info)) { // otc starts at 1. The player selected when the first Draft button is clicked will match with the first team card in the draft panel
      pick.innerHTML = ` 
        <div class="pick-name">${player.name}</div>
        <div class="pick-info">${player.position} ${player.school}</div>
      `;
    }
  });

  const teamPick1 = document.querySelectorAll('.pick-player-logo'); // This is built in buildDraftOrder2(), it is where the player's college team logo goes
  teamPick1.forEach((pick) => {
    if (otc === Number(pick.dataset.logo)) { // otc starts at 1. The player selected when the first Draft button is clicked will match with the first team card in the draft panel
      pick.innerHTML = `
        <img src="${player.schoolLogo}" class="college-image">
      `;
    }
  });
  

  nflTeams.forEach((team) => {
    team.test.forEach((pick) => {
      if (pick.n === otc) { // Finds which team owns the pick number that is being made
        pick.p = `${player.position} ${player.name}`; // Set the player name for the pick that is being made
        localStorage.setItem(`${pick.n}${team.name}`, JSON.stringify(pick)); // Save the player selected at this pick number for it can be displayed in the summary
      }
    });
  });

  switch(String(selectedValue)) { // Determine when to end draft and go to summary screen
    case "1": // Read which number of rounds was selected (selectedValue) and end the draft after the final pick in that round
      if (otc === 32) {
        window.location.href='summary.html';
        break;
      }
    case "2":
      if (otc === 64) {
        window.location.href='summary.html';
        break;
      }
    case "3":
      if (otc === 101) {
        window.location.href='summary.html';
        break;
      }
    case "4":
      if (otc === 139) {
        window.location.href='summary.html';
        break;
      }
    case "5":
      if (otc === 178) {
        window.location.href='summary.html';
        break;
      }
    case "6":
      if (otc === 218) {
        window.location.href='summary.html';
        break;
      }
    case "7":
      if (otc === 257) {
        window.location.href='summary.html';
        break;
      }
  }

  let indexToRemove = playerData.findIndex(obj => obj.name === player.name);
  if (indexToRemove !== -1) {
    playerData.splice(indexToRemove, 1); // Remove the selected player from the js file of all players' data
  }
  
  playerList = ''; // Reset player list so it can be rebuilt without the just-selected player

  for (let i = 1; i < 301; i++) {
    playerData.forEach((player) => {
      if (player.rank === i) {
        buildPlayerList(player); // Rebuild player list
      }
    });
  }
  document.querySelector('.players-player-js').innerHTML = playerList; // display new player cards

  const playerCard = document.querySelectorAll('.player-card-js');
  displayProfile(playerCard, selectedValue); // Re-add event listeners to each player card

  

  otc += 1; // Move to next team in draft order
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

function changeHeader() { // Change the display at top based on which team is now on the clock
  nflTeams.forEach((team) => {
    if (team.picks.includes(otc)) { // If a team is next in the draft order, display their header
      document.querySelector('.otc-header').innerHTML = `
        <div class="otc-panel" style="
          background-color: white;
            box-shadow: inset 0px 0px 150px ${team.color};
        ">
          <img class="otc-image" src="${team.logo}">
          <div class="otc-middle">
            <div class="otc-text">ON THE CLOCK</div>
            <div class="otc-picks">Picks: ${team.picks}</div>
            <div class="otc-needs">Needs: ${team.needs}</div>
          </div>
          <div class="otc-team">${team.city}<br>${team.name}</div>
          <div class="otc-previous"></div>
        </div>
      `;
      team.test.forEach((pick) => { // If team is making their 2nd or later pick, this adds each of their previous picks to the header
        if (pick.p !== "") { // If any of their picks contains a player, display that player in the header
          document.querySelector('.otc-previous').innerHTML += `
            <div class="otc-previous-pick">${pick.p}</div>
          `;
        }
      });
    }
  });
}

//tradeFunction();

function showTrade() {
  // Prevent multiple popups from being created
  if (document.querySelector('.settings-popup')) return;

  document.body.insertAdjacentHTML('beforeend', `
    <div class="settings-popup">
      <div class="settings-content">
        <div class="trade-team-section section-left">
          <select class="trade-team-selector selector1">
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
          <div class="trade-assets assets1"></div>
        </div>
        <div class="trade-team-section">
          <select class="trade-team-selector selector2">
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
          <div class="trade-assets assets2"></div>
        </div>
      </div>
      <button class="close-settings">X</button>
      <button class="submit-trade">Submit</button>
    </div>
  `);

  let teamSelected = document.querySelectorAll('.trade-team-selector');

  const tradeTeam1 = document.querySelector('.selector1');
  tradeTeam1.addEventListener("change", () => {
    document.querySelector('.assets1').innerHTML = '';
    nflTeams.forEach((team) => {
      if (team.name === tradeTeam1.value) {
        team.test.forEach((pick) => {
          document.querySelector('.assets1').innerHTML += `
            <div class="trade-asset-item" onclick="
              this.dataset.ison = this.dataset.ison === 'true' ? 'false' : 'true';
              this.style.backgroundColor = this.dataset.ison === 'true' ? 'rgb(200, 200, 200)' : 'white';
            " data-ison="false" data-team="${team.name}">${pick.r}.${pick.n}</div>
          `;
        });
      }
    });
  });
  const tradeTeam2 = document.querySelector('.selector2');
  tradeTeam2.addEventListener("change", () => {
    document.querySelector('.assets2').innerHTML = '';
    nflTeams.forEach((team) => {
      if (team.name === tradeTeam2.value) {
        team.test.forEach((pick) => {
          document.querySelector('.assets2').innerHTML += `
            <div class="trade-asset-item" onclick="
              this.dataset.ison = this.dataset.ison === 'true' ? 'false' : 'true';
              this.style.backgroundColor = this.dataset.ison === 'true' ? 'rgb(200, 200, 200)' : 'white';
            " data-ison="false" data-team="${team.name}"><span class="asset-round">${pick.r}</span>.<span class="asset-number">${pick.n}</span></div>
          `;
        });
      }
    });
  });
  
  const submitBtn = document.querySelector('.submit-trade');
  submitBtn.addEventListener("click", () => {
    const assets = document.querySelectorAll('.trade-asset-item');
    assets.forEach((asset) => {
      const assetNumber = document.querySelector('.asset-number');
      const assetRound = document.querySelector('.asset-round');
      let pine = {r: parseFloat(assetRound.textContent), n: parseFloat(assetNumber.textContent), p: ""};
      console.log(`${asset.textContent} ${asset.dataset.ison}`)
      if (asset.dataset.ison === 'true') {
        nflTeams.forEach((team) => {

          if (team.name === asset.dataset.team) {
            console.log(team.name, asset.dataset.team)

            // I think the problem is still in the if statements. It's not accurately checking if the team already has the asset or not.
            // Because when selecting multiple assets to trade, it isn't doing add/remove correctly for each asset.
            if (!team.test.some(obj =>
                obj.r === assetRound.textContent &&
                obj.n === assetNumber.textContent &&
                obj.p === "")) {
              team.test.push(pine);
              console.log('added', team.test);
            } else {
              team.test.forEach((pick) => {
                if (`${pick.r}.${pick.n}` === asset.textContent) {
                  team.test.splice(team.test.findIndex(v => v.n === pick.n), 1);
                  console.log('removed', team.test);
                }
              });
            }
          }
        });
      }
    });
  });
  
  attachCloseEvent(); // Attach close event after popup is added
}

function tradeFunction() {
  document.querySelector('.trade').addEventListener("click", () => {
    showTrade(); // Ensure this function recreates .settings-popup
    attachCloseEvent(); // Attach close event after .settings-popup is created
  });
}

function attachCloseEvent() {
  const closeBtn = document.querySelector('.close-settings');
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      document.querySelector('.settings-popup').remove();
    }, { once: true }); // Ensure this event fires only once
  }
}



document.querySelector('.settings').addEventListener("click", () => { // Add functionality to restart button
  if(confirm("Are you sure you want to restart?")) {
    location.reload();
  }
});