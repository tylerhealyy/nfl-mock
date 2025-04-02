import { nflTeams } from "./nfl-team-data.js";
import { playerData } from "./player-data.js";
import { draftPlayer } from "./index.js";

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
      for (let i = 1; i < 102; i++) {
        buildPanelItems(i, rounds);
        addRoundDividers(i, rounds);
      }
      break;
    case "4":
      for (let i = 1; i < 140; i++) {
        buildPanelItems(i, rounds);
        addRoundDividers(i, rounds);
      }
      break;
    case "5":
      for (let i = 1; i < 179; i++) {
        buildPanelItems(i, rounds);
        addRoundDividers(i, rounds);
      }
      break;
    case "6":
      for (let i = 1; i < 218; i++) {
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
    if (team.test.some(v => v.n === i)) { // If a team owns a pick, display that team's card in that spot on the panel
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
      document.querySelector('.draft-order-panel').innerHTML += `
        <div class="draft-order-item" data-order="${i}" style="
          background-color: white;
          box-shadow: inset 0px 0px 80px ${team.color};
          cursor: pointer;
        ">
          <div class="pick-number">${i}</div>
          <div class="pick-logo">
            <img src="${team.logo}" class="pick-image">
          </div>
          <div class="pick-player" data-info="${i}">${getInfo()}</div>
          <div class="pick-player-logo" data-logo="${i}">${getLogo()}</div>
        </div>
      `;

      /*document.querySelectorAll('.draft-order-item').forEach((panelItem) => {
        panelItem.addEventListener("click", () => {
          //autoDraft(rounds, team);
          singleAutoPick(rounds);
        });
      });*/
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
  } else if (i === 101 && rounds > 3) {
    document.querySelector('.draft-order-panel').innerHTML += `
      <div class="draft-order-round">Round 4</div>
    `;
  } else if (i === 139 && rounds > 4) {
    document.querySelector('.draft-order-panel').innerHTML += `
      <div class="draft-order-round">Round 5</div>
    `;
  } else if (i === 178 && rounds > 5) {
    document.querySelector('.draft-order-panel').innerHTML += `
      <div class="draft-order-round">Round 6</div>
    `;
  } else if (i === 218 && rounds > 6) {
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
} else {
  speed = 100;
}

export async function autoDraft(rounds) {
  let iterations;
  switch(rounds) {
    case "1":
      iterations = 33;
      break;
    case "2":
      iterations = 65;
      break;
    case "3":
      iterations = 102;
      break;
    case "4":
      iterations = 140;
      break;
    case "5":
      iterations = 179;
      break;
    case "6":
      iterations = 219;
      break;
    case "7":
      iterations = 258;
      break;
  }

  let usedNumbers = new Set(); // Track used numbers

  for (let i = 1; i < iterations; i++) {
    let randomNumber;
    
    // Generate a unique random number
    do {
        randomNumber = Math.floor(Math.random() * 300) + 1;
    } while (usedNumbers.has(randomNumber));

    usedNumbers.add(randomNumber); // Store the used number

    function draftRandom(ranNum) {
      return playerData.find(player => player.rank === ranNum);
    }
    function draftBPA() {
      return playerData.reduce((lowest, player) => 
        player.rank < lowest.rank ? player : lowest, playerData[0]);
    }
    function draftByRandomTop() {
      const lowest10 = [...playerData].sort((a, b) => a.rank - b.rank).slice(0, 5); // Step 1: Sort players by rank (ascending order)
      return lowest10[Math.floor(Math.random() * lowest10.length)];// Step 2: Pick a random player from these 10
    }
    function draftByNeed() {
      const wrPlayers = playerData.filter(player => player.position === "WR"); // Step 1: Filter players by position "WR"
      const lowest10WR = wrPlayers.sort((a, b) => a.rank - b.rank).slice(0, 5); // Step 2: Sort these WR players by rank (ascending order)
      return lowest10WR[Math.floor(Math.random() * lowest10WR.length)]; // Step 3: Pick a random player from these 10
    }
    function aiDraftPick() {
      return playerData
        .map(player => {
          let score = 301 - player.rank; // Base score on player rating
          
          if (player.school === "Denver") {
            score += 300; // Boost for positions of need
          }

          if (Math.random() < 0) {
            score += 10; // Occasionally throw in a "surprise pick"
          }

          return { ...player, score };
        })
        .sort((a, b) => b.score - a.score)[0]; // Select best score
  }
  

    let selectedPlayer = aiDraftPick();

    if (selectedPlayer) {
        draftPlayer(rounds, selectedPlayer);
    }

    await new Promise(resolve => setTimeout(resolve, speed)); // Delay for next pick
  }
}

let autoPickTeam = '';
export async function singleAutoPick(rounds) {

  let iterations;
  switch(rounds) {
    case "1":
      iterations = 33;
      break;
    case "2":
      iterations = 65;
      break;
    case "3":
      iterations = 102;
      break;
    case "4":
      iterations = 140;
      break;
    case "5":
      iterations = 179;
      break;
    case "6":
      iterations = 219;
      break;
    case "7":
      iterations = 258;
      break;
  }

  for (let i = 1; i < iterations; i++) {
    nflTeams.forEach((team) => {
      if (team.test.some(y => y.n === JSON.parse(localStorage.getItem('otc')))) {
        autoPickTeam = team;
      }
    });
  
    let selectedPlayer = aiDraftPick(autoPickTeam);
    if (selectedPlayer) {
      draftPlayer(rounds, selectedPlayer);
    }
    
    console.log(autoPickTeam.needs, selectedPlayer.name, selectedPlayer.score, 301 - selectedPlayer.consensus);
  
    await new Promise(resolve => setTimeout(resolve, speed)); // Delay for next pick
  }
}

function aiDraftPick(team) {
  return playerData
    .map(player => {
      let score = 301 - player.consensus; // Base score on player rating
      
      if (team.needs.includes(player.position)) {
        score += Math.floor(Math.random() * (15 - 5 + 1)) + 5; // Boost for positions of need
      }

      if (player.name === 'Travis Hunter' || 'Abdul Carter' || 'Ashton Jeanty' || 'Tyler Warren') {
        score += 5;
      }

      if (player.name === 'Abdul Carter') {
        score += 5;
      }

      if (Math.random() < 0.1) {
        score += Math.floor(Math.random() * 5) + 1; // Occasionally throw in a "surprise pick"
      }

      if (Math.random() < 0.1) {
        score -= 5;
      }

      return { ...player, score };
    })
    .sort((a, b) => b.score - a.score)[0]; // Select best score
}