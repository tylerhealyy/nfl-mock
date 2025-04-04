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
        ">
          <div class="pick-number">${i}</div>
          <div class="pick-logo">
            <img src="${team.logo}" class="pick-image">
          </div>
          <div class="pick-player" data-info="${i}">${getInfo()}</div>
          <div class="pick-player-logo" data-logo="${i}">${getLogo()}</div>
        </div>
      `;
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


let listOfUserTeams = JSON.parse(localStorage.getItem('teamsInput'));
let autoPickTeam = '';
export function singleAutoPick(rounds) {
  let otc = JSON.parse(localStorage.getItem('otc'));
  let team = nflTeams.find(t => t.test.some(y => y.n === otc));

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
  return playerData
    .map(player => {
      let score = 1000 - player.consensus; // Base score on player rating
      
      if (team.needs.includes(player.position)) {
        score += Math.floor(Math.random() * (15 - 5 + 1)) + 5; // Boost for positions of need
      }

      if (player.name === 'Ashton Jeanty' || 'Tyler Warren') {
        score += 5;
      }

      if (player.name === 'Abdul Carter') {
        score += 10;
      }

      if (player.name === 'Travis Hunter' || 'Cam Ward') {
        score += 25;
      }

      if (player.name === 'Mason Graham') {
        score -= 10;
      }

      if (team.drafted.includes(player.position)) {
        score -= 5;
      }

      if (team.nogo.includes(player.position)) {
        score = 0;
      }

      if (Math.random() < 0.2) {
        score += Math.floor(Math.random() * 17) - 8; // Occasionally throw in a "surprise pick"
      }

      if (otc > 5 && otc < 33 && Math.random() < 0.2) {
        score += Math.floor(Math.random() * 31) - 15;
      }

      if (otc > 33 && Math.random() < 0.2) {
        score += Math.floor(Math.random() * 61) - 30;
      }

      return { ...player, score };
    })
    .sort((a, b) => b.score - a.score)[0]; // Select best score
}

function playOTCSound() {
  let audio = new Audio('../sounds/nfl-draft-chime.mp3');
  audio.play().catch(error => console.error("Audio playback failed:", error));
}