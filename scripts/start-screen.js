import { nflTeams } from "./nfl-team-data.js";

nflTeams.forEach((team) => {
  document.getElementById('teams').innerHTML += `
    <div class="team-block" id="team-block" data-team="${team.name}">
      <img src="${team.logo}" class="team-block-logo">  
    </div>
  `;
});

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

document.getElementById('start-btn').addEventListener("click", () => {
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

  window.location.href='start.html';
});