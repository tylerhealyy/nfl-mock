import { nflTeams } from "./nfl-team-data.js";
import { playerData } from "./player-data.js";
import { consensusData } from "./consensus-draft.js";

let score = 0;
//let version = JSON.parse(localStorage.getItem('version'));

window.addEventListener("DOMContentLoaded", () => {
  const key = "functionExecuted";

  if (!localStorage.getItem(key)) {
      buildSummary(1, 33); // Call your function
      localStorage.setItem(key, "true"); // Mark it as executed
  } else {
    document.querySelector('.round-summary').innerHTML = JSON.parse(localStorage.getItem('roundSummary'));
  }
  
  // getScore();

  /*if (localStorage.getItem('functionExecuted')) {
    saveRS();
  }*/
});

function saveRS() {
  let rsToSave = document.querySelector('.round-summary').outerHTML;

  if (!localStorage.getItem(`${JSON.parse(localStorage.getItem('nameInput'))}${version}`)) {
    localStorage.setItem('version', JSON.stringify(1));
    localStorage.setItem(`${JSON.parse(localStorage.getItem('nameInput'))}${version}`, JSON.stringify(rsToSave));
  } else {
    version += 1;
    localStorage.setItem('version', JSON.stringify(version));
    localStorage.setItem(`${JSON.parse(localStorage.getItem('nameInput'))}${version}`, JSON.stringify(rsToSave));
  }

  //console.log(localStorage.getItem('nameInput'), version);
  //console.log(JSON.parse(localStorage.getItem(`Auto Draft${version}`)));
}

document.querySelector('.ts-summary').addEventListener("click", () => {
  html2canvas(document.getElementById("ts-capture"), {
    useCORS: true, // Allows cross-origin images
    allowTaint: true,
    scale: 3, // Increases rendering resolution
    backgroundColor: null // Ensures transparency is preserved
  }).then((canvas) => {
    let image = canvas.toDataURL("image/png"); // Convert canvas to image
    let link = document.createElement("a");
    link.href = image;
    link.download = "my-team-mock-draft.png"; // Download as PNG
    link.click();
  });
});
document.querySelector('.round-summary').addEventListener("click", () => {
  html2canvas(document.getElementById("rs-capture"), {
    useCORS: true, // Allows cross-origin images
    allowTaint: true,
    scale: 3, // Increases rendering resolution
    backgroundColor: null // Ensures transparency is preserved
  }).then((canvas) => {
    let image = canvas.toDataURL("image/png"); // Convert canvas to image
    let link = document.createElement("a");
    link.href = image;
    link.download = "my-mock-draft.png"; // Download as PNG
    link.click();
  });
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
      buildSummary(65, 103);
      summaryViewing += 1;
      document.querySelector('.rs-grid').style.gridTemplateRows = 'repeat(19, 54px)';
      document.querySelectorAll('.rs-pick:nth-child(n+17)').forEach(el => el.style.borderRight = '1px solid black');
      document.querySelectorAll('.rs-pick:nth-child(n+20)').forEach(el => el.style.borderRight = 'none');
      document.querySelectorAll('.rs-pick:nth-child(16n+16)').forEach(el => el.style.borderBottom = '1px solid black');
      document.querySelectorAll('.rs-pick:nth-child(19n+19)').forEach(el => el.style.borderBottom = 'none');
      document.querySelector('.rs-header-round').innerHTML = `Third `;
      if (roundsInput === '3') {
        hideNext();
      }
      break;
    case '3':
      buildSummary(103, 139);
      summaryViewing += 1;
      document.querySelector('.rs-grid').style.gridTemplateRows = 'repeat(18, 54px)';
      document.querySelectorAll('.rs-pick:nth-child(n+17)').forEach(el => el.style.borderRight = '1px solid black');
      document.querySelectorAll('.rs-pick:nth-child(n+19)').forEach(el => el.style.borderRight = 'none');
      document.querySelectorAll('.rs-pick:nth-child(16n+16)').forEach(el => el.style.borderBottom = '1px solid black');
      document.querySelectorAll('.rs-pick:nth-child(18n+18)').forEach(el => el.style.borderBottom = 'none');
      document.querySelector('.rs-header-round').innerHTML = `Fourth `;
      if (roundsInput === '4') {
        hideNext();
      }
      break;
    case '4':
      buildSummary(139, 177);
      summaryViewing += 1;
      document.querySelector('.rs-grid').style.gridTemplateRows = 'repeat(19, 54px)';
      document.querySelectorAll('.rs-pick:nth-child(n+17)').forEach(el => el.style.borderRight = '1px solid black');
      document.querySelectorAll('.rs-pick:nth-child(n+20)').forEach(el => el.style.borderRight = 'none');
      document.querySelectorAll('.rs-pick:nth-child(16n+16)').forEach(el => el.style.borderBottom = '1px solid black');
      document.querySelectorAll('.rs-pick:nth-child(19n+19)').forEach(el => el.style.borderBottom = 'none');
      document.querySelector('.rs-header-round').innerHTML = `Fifth `;
      if (roundsInput === '5') {
        hideNext();
      }
      break;
    case '5':
      buildSummary(177, 217);
      summaryViewing += 1;
      document.querySelector('.rs-grid').style.gridTemplateRows = 'repeat(20, 54px)';
      document.querySelectorAll('.rs-pick:nth-child(n+17)').forEach(el => el.style.borderRight = '1px solid black');
      document.querySelectorAll('.rs-pick:nth-child(n+21)').forEach(el => el.style.borderRight = 'none');
      document.querySelectorAll('.rs-pick:nth-child(16n+16)').forEach(el => el.style.borderBottom = '1px solid black');
      document.querySelectorAll('.rs-pick:nth-child(20n+20)').forEach(el => el.style.borderBottom = 'none');
      document.querySelector('.rs-header-round').innerHTML = `Sixth `;
      if (roundsInput === '6') {
        hideNext();
      }
      break;
    case '6':
      buildSummary(217, 258);
      summaryViewing += 1;
      hideNext();
      document.querySelector('.rs-grid').style.gridTemplateRows = 'repeat(21, 54px)';
      document.querySelectorAll('.rs-pick:nth-child(n+17)').forEach(el => el.style.borderRight = '1px solid black');
      document.querySelectorAll('.rs-pick:nth-child(n+22)').forEach(el => el.style.borderRight = 'none');
      document.querySelectorAll('.rs-pick:nth-child(16n+16)').forEach(el => el.style.borderBottom = '1px solid black');
      document.querySelectorAll('.rs-pick:nth-child(21n+21)').forEach(el => el.style.borderBottom = 'none');
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
      document.querySelectorAll('.rs-pick:nth-child(n+17)').forEach(el => el.style.borderRight = 'none');
      document.querySelectorAll('.rs-pick:nth-child(16n+16)').forEach(el => el.style.borderBottom = 'none');
      document.querySelector('.rs-header-round').innerHTML = `Second `;
      break;
    case '4':
      buildSummary(65, 103);
      summaryViewing -= 1;
      showNext();
      document.querySelector('.rs-grid').style.gridTemplateRows = 'repeat(19, 54px)';
      document.querySelectorAll('.rs-pick:nth-child(n+17)').forEach(el => el.style.borderRight = '1px solid black');
      document.querySelectorAll('.rs-pick:nth-child(n+20)').forEach(el => el.style.borderRight = 'none');
      document.querySelectorAll('.rs-pick:nth-child(16n+16)').forEach(el => el.style.borderBottom = '1px solid black');
      document.querySelectorAll('.rs-pick:nth-child(19n+19)').forEach(el => el.style.borderBottom = 'none');
      document.querySelector('.rs-header-round').innerHTML = `Third `;
      break;
    case '5':
      buildSummary(103, 139);
      summaryViewing -= 1;
      showNext();
      document.querySelector('.rs-grid').style.gridTemplateRows = 'repeat(18, 54px)';
      document.querySelectorAll('.rs-pick:nth-child(n+17)').forEach(el => el.style.borderRight = '1px solid black');
      document.querySelectorAll('.rs-pick:nth-child(n+19)').forEach(el => el.style.borderRight = 'none');
      document.querySelectorAll('.rs-pick:nth-child(16n+16)').forEach(el => el.style.borderBottom = '1px solid black');
      document.querySelectorAll('.rs-pick:nth-child(18n+18)').forEach(el => el.style.borderBottom = 'none');
      document.querySelector('.rs-header-round').innerHTML = `Fourth `;
      break;
    case '6':
      buildSummary(139, 177);
      summaryViewing -= 1;
      showNext();
      document.querySelector('.rs-grid').style.gridTemplateRows = 'repeat(19, 54px)';
      document.querySelectorAll('.rs-pick:nth-child(n+17)').forEach(el => el.style.borderRight = '1px solid black');
      document.querySelectorAll('.rs-pick:nth-child(n+20)').forEach(el => el.style.borderRight = 'none');
      document.querySelectorAll('.rs-pick:nth-child(16n+16)').forEach(el => el.style.borderBottom = '1px solid black');
      document.querySelectorAll('.rs-pick:nth-child(19n+19)').forEach(el => el.style.borderBottom = 'none');
      document.querySelector('.rs-header-round').innerHTML = `Fifth `;
      break;
    case '7':
      buildSummary(177, 217);
      summaryViewing -= 1;
      showNext();
      document.querySelector('.rs-grid').style.gridTemplateRows = 'repeat(20, 54px)';
      document.querySelectorAll('.rs-pick:nth-child(n+17)').forEach(el => el.style.borderRight = '1px solid black');
      document.querySelectorAll('.rs-pick:nth-child(n+21)').forEach(el => el.style.borderRight = 'none');
      document.querySelectorAll('.rs-pick:nth-child(16n+16)').forEach(el => el.style.borderBottom = '1px solid black');
      document.querySelectorAll('.rs-pick:nth-child(20n+20)').forEach(el => el.style.borderBottom = 'none');
      document.querySelector('.rs-header-round').innerHTML = `Sixth `;
      break;
  }
});

function buildSummary(low, high) {
  document.querySelector('.rs-grid').innerHTML = '';
  document.querySelector('.rs-trades').innerHTML = '';
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

  for (let i = low; i < high; i++) {
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

  let f = 1;
  let addedAnything = false;
  while (f < 20) {
    const tradeA = localStorage.getItem(`${f}tradeA`);
    const tradeB = localStorage.getItem(`${f}tradeB`);
  
    if (tradeA) {
      const hasValidNumber = (str) => {
        const matches = str.match(/#\d+/g); // get all #numbers like #1, #25, etc.
        console.log(matches);
        if (!matches) return false;
  
        return matches.some(match => {
          const num = parseInt(match.slice(1)); // remove the '#' and convert to number
          return num >= low && num <= high-1;
        });
      };
  
      if (hasValidNumber(tradeA) || hasValidNumber(tradeB)) {
        document.querySelector('.rs-trades').innerHTML += `
          <div class="tst-item">${tradeA}<br>${tradeB}</div>
        `;
        addedAnything = true;
      }
  
      f += 1;
    } else {
      f = 20; // break the loop
    }
  }

  if (addedAnything) {
    document.querySelector('.rs-trades').insertAdjacentHTML('afterbegin', `
      <div class="tst-header">Trades</div>
    `);
    document.querySelector('.rs-trades').style.paddingTop = '5px';
    document.querySelector('.rs-trades').style.borderTop = '1px solid black';
  } else {
    document.querySelector('.rs-trades').style.paddingTop = '0px';
    document.querySelector('.rs-trades').style.borderTop = 'none';
  }

  let yourMom = document.querySelector('.round-summary').innerHTML;
  localStorage.setItem('roundSummary', JSON.stringify(yourMom));
  
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
      totalPicks = 103;
      break;
    case '4':
      totalPicks = 139;
      break;
    case '5':
      totalPicks = 177;
      break;
    case '6':
      totalPicks = 217;
      break;
    case '7':
      totalPicks = 258;
      break;
  }

  document.querySelector('.ts-pick-list').innerHTML = '';
  document.querySelector('.ts-trades').innerHTML = '';
  document.querySelector('.ts-trades').style.paddingTop = '0px';
  document.querySelector('.ts-trades').style.borderTop = 'none';
  document.querySelector('.ts-trades').style.height = 'none';
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

      let g = 1;
      while (g < 20) {
        if (localStorage.getItem(`${g}${team.name}received`)) {
          document.querySelector('.ts-trades').innerHTML += `<div class="tst-header">Trades</div>`;
          document.querySelector('.ts-trades').style.paddingTop = '5px';
          document.querySelector('.ts-trades').style.borderTop = '1px solid black';
          g = 20;
        }
        g += 1;
      }

      let h = 1;
      while (h < 20) {
        if (localStorage.getItem(`${h}${team.name}received`)) {
          let partner = JSON.parse(localStorage.getItem(`${h}${team.name}partner`));
          document.querySelector('.ts-trades').innerHTML += `
            <div class="tst-item">${localStorage.getItem(`${h}${team.name}received`)}<br>${localStorage.getItem(`${h}${partner}received`)}</div>
          `;
        }
        h += 1;
      }
    }
  });
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

function getScore() {
  let userDraft = JSON.parse(localStorage.getItem(`scoringData`));
  userDraft.forEach((userPick) => {
    if (userPick.n < 33) {
      let consensusPick = consensusData.find(u => u.n === userPick.n);

      if (userPick.t === consensusPick.t) {
        score += 2; // RIGHT team at RIGHT pick
      }

      if (userPick.t !== consensusPick.t) {
        let teamPick = userDraft.find(u => u.t === consensusPick.t);
        if (teamPick.p === consensusPick.p) {
          score += 6; // RIGHT team, RIGHT player at WRONG pick
        }
      }

      if (userPick.t === consensusPick.t && userPick.p === consensusPick.p) {
        score += 8; // RIGHT team, RIGHT player, at RIGHT pick
      }

      if (userPick.t !== consensusPick.t && userPick.p === consensusPick.p) {
        score += 4; // WRONG team, RIGHT player at RIGHT pick
      }
    }
  });
  console.log('Score: ', score, '/ 320');
  document.querySelector('.rsh-score').innerHTML = `Score:&nbsp;<span class="score-bold">${score}</span>&nbsp;/ 320`;
}