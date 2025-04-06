import { nflTeams } from "./nfl-team-data.js";
import { playerData } from "./player-data.js";

localStorage.removeItem("functionExecuted");
window.addEventListener("DOMContentLoaded", () => {
  const key = "functionExecuted";

  if (!localStorage.getItem(key)) {
      buildSummary(1, 33); // Call your function
      localStorage.setItem(key, "true"); // Mark it as executed
  }
});


document.querySelector('.rs-header-round').innerHTML = `First `;

document.querySelectorAll('.rs-user').forEach((user) => {
  user.innerHTML = JSON.parse(localStorage.getItem("nameInput"));
});

document.querySelector('.ts-team-select').addEventListener("change", () => {
  let team = document.querySelector('.ts-team');
  let rounds = document.querySelector('.ts-rounds');
  team.innerHTML = document.querySelector('.ts-team-select').value;
  rounds.innerHTML = ` ${JSON.parse(localStorage.getItem('roundsInput'))} `;
  let draftee;
  buildTeamSummary(draftee);
});

let roundsInput = JSON.parse(localStorage.getItem('roundsInput'));
if (roundsInput === '1') {
  hideNext();
}

let summaryViewing = 1;
document.querySelector('.next-summary').addEventListener("click", () => {
  switch (String(summaryViewing)) {
    case '1':
      buildSummary(33, 65);
      summaryViewing += 1;
      showLast();
      document.querySelector('.rs-header-round').innerHTML = `Second `;
      if (roundsInput === '2') {
        hideNext();
      }
      break;
    case '2':
      buildSummary(65, 102);
      summaryViewing += 1;
      document.querySelector('.rs-grid').style.gridTemplateRows = 'repeat(19, 54px)';
      document.querySelector('.rs-header-round').innerHTML = `Third `;
      if (roundsInput === '3') {
        hideNext();
      }
      break;
    case '3':
      buildSummary(102, 140);
      summaryViewing += 1;
      document.querySelector('.rs-header-round').innerHTML = `Fourth `;
      if (roundsInput === '4') {
        hideNext();
      }
      break;
    case '4':
      buildSummary(140, 179);
      summaryViewing += 1;
      document.querySelector('.rs-grid').style.gridTemplateRows = 'repeat(20, 54px)';
      document.querySelector('.rs-header-round').innerHTML = `Fifth `;
      if (roundsInput === '5') {
        hideNext();
      }
      break;
    case '5':
      buildSummary(179, 219);
      summaryViewing += 1;
      document.querySelector('.rs-header-round').innerHTML = `Sixth `;
      if (roundsInput === '6') {
        hideNext();
      }
      break;
    case '6':
      buildSummary(219, 258);
      summaryViewing += 1;
      hideNext();
      document.querySelector('.rs-header-round').innerHTML = `Seventh `;
      break;
  }
});
document.querySelector('.last-summary').addEventListener("click", () => {
  switch (String(summaryViewing)) {
    case '2':
      buildSummary(1, 33);
      summaryViewing -= 1;
      hideLast();
      showNext();
      document.querySelector('.rs-header-round').innerHTML = `First `;
      break;
    case '3':
      buildSummary(33, 65);
      summaryViewing -= 1;
      showNext();
      document.querySelector('.rs-grid').style.gridTemplateRows = 'repeat(16, 54px)';
      document.querySelector('.rs-header-round').innerHTML = `Second `;
      break;
    case '4':
      buildSummary(65, 102);
      summaryViewing -= 1;
      showNext();
      document.querySelector('.rs-header-round').innerHTML = `Third `;
      break;
    case '5':
      buildSummary(102, 140);
      summaryViewing -= 1;
      showNext();
      document.querySelector('.rs-grid').style.gridTemplateRows = 'repeat(19, 54px)';
      document.querySelector('.rs-header-round').innerHTML = `Fourth `;
      break;
    case '6':
      buildSummary(140, 179);
      summaryViewing -= 1;
      showNext();
      document.querySelector('.rs-header-round').innerHTML = `Fifth `;
      break;
    case '7':
      buildSummary(179, 219);
      summaryViewing -= 1;
      showNext();
      document.querySelector('.rs-header-round').innerHTML = `Sixth `;
      break;
  }
});

function buildSummary(low, high) {
  document.querySelector('.rs-grid').innerHTML = '';
  let draftee;
  nflTeams.forEach((team) => {
    let selectedTeams = JSON.parse(localStorage.getItem('teamsInput'));
    if (selectedTeams.includes(team.name)) {
      document.querySelector('.ts-team').innerHTML = team.name;
      document.querySelector(`option[value="${team.name}"]`).selected = true;
      let rounds = document.querySelector('.ts-rounds');
      rounds.innerHTML = ` ${JSON.parse(localStorage.getItem('roundsInput'))} `;
    }
  });

  for (let i = low; i < high; i++) { // Build first round summaries (horizontal and vertical)
    nflTeams.forEach((team) => {
      let newTest;
      if (JSON.parse(localStorage.getItem(`${team.name}test`))) {
        newTest = JSON.parse(localStorage.getItem(`${team.name}test`));
      } else {
        newTest = team.test;
      }

      if (newTest.some(obj => obj.n === i)) {
        let example = JSON.parse(localStorage.getItem(`${i}${team.name}`)); // Get each pick that was saved when the draft button was clicked
        playerData.forEach((player) => {
          if (example.p === `${player.position} ${player.name}`) {
            draftee = player; // access player data
          }
        });
  
        document.querySelector('.rs-grid').innerHTML += `
          <div class="rs-pick" style="
            background: linear-gradient(to left, white, white, ${team.color});
            background: radial-gradient(ellipse 350px 100px, white, ${team.color});
          ">
            <div class="rs-pick-number">${i}</div>
            <img src="${team.logo}" class="rs-pick-image">
            <div class="rs-pick-player">
              <div class="rs-pick-name">${draftee.name}</div>
              <div class="rs-pick-info">${draftee.position} ${draftee.school}</div>
            </div>
            <img src="${draftee.schoolLogo}" class="rs-school-image">
          </div>
        `;
      }
    });
  }
  
  buildTeamSummary(draftee);
}

function buildTeamSummary(draftee) {
  let rounds = JSON.parse(localStorage.getItem('roundsInput'));
  let totalPicks;
  switch (String(rounds)) {
    case '1':
      totalPicks = 33;
      break;
    case '2':
      totalPicks = 65;
      break;
    case '3':
      totalPicks = 102;
      break;
    case '4':
      totalPicks = 140;
      break;
    case '5':
      totalPicks = 179;
      break;
    case '6':
      totalPicks = 219;
      break;
    case '7':
      totalPicks = 258;
      break;
  }

  document.querySelector('.ts-pick-list').innerHTML = '';
  nflTeams.forEach((team) => {
    if (document.querySelector('.ts-team-select').value === team.name) {

      let newTest;
      if (JSON.parse(localStorage.getItem(`${team.name}test`))) {
        newTest = JSON.parse(localStorage.getItem(`${team.name}test`));
      } else {
        newTest = team.test;
      }

      for (let i = 1; i < totalPicks; i++) {
        if (newTest.some(obj => obj.n === i)) {
          let example = JSON.parse(localStorage.getItem(`${i}${team.name}`)); // Get each pick that was saved when the draft button was clicked
          playerData.forEach((player) => {
            if (example.p === `${player.position} ${player.name}`) {
              draftee = player; // access player data
            }
          });

          document.querySelector('.ts-pick-list').innerHTML += `
            <div class="ts-pick" style="
              background: radial-gradient(ellipse 1500px 100px, white, ${team.color});
            ">
              <div class="rs-pick-number">${i}</div>
              <img src="${team.logo}" class="rs-pick-image">
              <div class="rs-pick-player">
                <div class="rs-pick-name">${draftee.name}</div>
                <div class="rs-pick-info">${draftee.position} ${draftee.school}</div>
              </div>
              <img src="${draftee.schoolLogo}" class="rs-school-image">
            </div>
          `;
        }
      }
    }
  });
}

function buildSummary2() {
  document.querySelector('.rs-grid').innerHTML = '';
  let draftee;
  nflTeams.forEach((team) => {
    let selectedTeams = JSON.parse(localStorage.getItem('teamsInput'));
    if (selectedTeams.includes(team.name)) {
      document.querySelector('.ts-team').innerHTML = team.name;
      document.querySelector(`option[value="${team.name}"]`).selected = true;
      let rounds = document.querySelector('.ts-rounds');
      rounds.innerHTML = ` ${JSON.parse(localStorage.getItem('roundsInput'))} `;
    }
  });

  for (let i = 33; i < 65; i++) { // Build first round summaries (horizontal and vertical)
    nflTeams.forEach((team) => {
      let newTest;
      if (JSON.parse(localStorage.getItem(`${team.name}test`))) {
        newTest = JSON.parse(localStorage.getItem(`${team.name}test`));
      } else {
        newTest = team.test;
      }

      if (newTest.some(obj => obj.n === i)) {
        let example = JSON.parse(localStorage.getItem(`${i}${team.name}`)); // Get each pick that was saved when the draft button was clicked
        playerData.forEach((player) => {
          if (example.p === `${player.position} ${player.name}`) {
            draftee = player; // access player data
          }
        });
  
        document.querySelector('.rs-grid').innerHTML += `
          <div class="rs-pick" style="
            background: linear-gradient(to left, white, white, ${team.color});
            background: radial-gradient(ellipse 350px 100px, white, ${team.color});
          ">
            <div class="rs-pick-number">${i}</div>
            <img src="${team.logo}" class="rs-pick-image">
            <div class="rs-pick-player">
              <div class="rs-pick-name">${draftee.name}</div>
              <div class="rs-pick-info">${draftee.position} ${draftee.school}</div>
            </div>
            <img src="${draftee.schoolLogo}" class="rs-school-image">
          </div>
        `;
      }
    });
  }
}

function hideNext() {
  document.querySelector('.next-summary').style.opacity = 0;
  document.querySelector('.next-summary').style.cursor = 'default';
}

function showNext() {
  document.querySelector('.next-summary').style.opacity = 1;
  document.querySelector('.next-summary').style.cursor = 'pointer';
}

function hideLast() {
  document.querySelector('.last-summary').style.opacity = 0;
  document.querySelector('.last-summary').style.cursor = 'default';
}

function showLast() {
  document.querySelector('.last-summary').style.opacity = 1;
  document.querySelector('.last-summary').style.cursor = 'pointer';
}