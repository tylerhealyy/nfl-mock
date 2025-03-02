import { nflTeams } from "./nfl-team-data.js";

export function buildDraftOrder2(rounds) { // Read the number of rounds to display the correct number of picks in the draft panel
  switch (rounds) {
    case "1":
      for (let i = 1; i < 33; i++) {
        buildPanelItems(i);
        addRoundDividers(i, rounds);
      }
      break;
    case "2":
      for (let i = 1; i < 65; i++) {
        buildPanelItems(i);
        addRoundDividers(i, rounds);
      }
      break;
    case "3":
      for (let i = 1; i < 102; i++) {
        buildPanelItems(i);
        addRoundDividers(i, rounds);
      }
      break;
    case "4":
      for (let i = 1; i < 140; i++) {
        buildPanelItems(i);
        addRoundDividers(i, rounds);
      }
      break;
    case "5":
      for (let i = 1; i < 179; i++) {
        buildPanelItems(i);
        addRoundDividers(i, rounds);
      }
      break;
    case "6":
      for (let i = 1; i < 218; i++) {
        buildPanelItems(i);
        addRoundDividers(i, rounds);
      }
      break;
    case "7":
      for (let i = 1; i < 258; i++) {
        buildPanelItems(i);
        addRoundDividers(i, rounds);
      }
      break;
  }
}

function buildPanelItems(i) { // Build HTML for each pick
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