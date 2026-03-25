import { nflTeams } from "../../data/nflTeamData.js";

buildSummary();

function buildSummary() {
  const games = JSON.parse(localStorage.getItem("games"));
  const team = JSON.parse(localStorage.getItem("team"));
  if (team.name === "Raiders") team.color = "#000000";

  const homeGamesBox = document.querySelector('.homeGamesBox');
  const awayGamesBox = document.querySelector('.awayGamesBox');

  let wins = localStorage.getItem("wins");
  let losses = localStorage.getItem("losses");

  document.querySelector('.wins').textContent = wins;
  document.querySelector('.losses').textContent = losses;

  document.querySelector('.header').style.backgroundColor = `${team.color}`;
  document.querySelector('.footer').style.backgroundColor = `${team.color}`;

  document.querySelector('.headerLogo').src = team.logo;
  document.querySelector('.headerTeamText').textContent = `${team.name} 2026 Season Prediction`;
  
  games
    .filter(game => game.home === team.name || game.away === team.name)
    .sort((a, b) => {
      // 1. Home games first
      const aHome = a.home === team.name;
      const bHome = b.home === team.name;
      if (aHome !== bHome) return bHome - aHome;

      // 2. Division games next
      if (a.division !== b.division) return b.division - a.division;

      // 3. Conference games next
      if (a.conference !== b.conference) return b.conference - a.conference;

      return 0; // keep original order otherwise
    })
    .forEach((game) => {
      let away = nflTeams.find(t => t.name === game.away);
      let home = nflTeams.find(t => t.name === game.home);
      if (away.name === "Raiders") away.color = "#000000";
      if (home.name === "Raiders") home.color = "#000000";
      let winner = game.result;
      let teamResultStyle = "";
      let oppResultStyle = "";
      if (winner === team.name) { teamResultStyle = "win"; oppResultStyle = "loss"; } else { teamResultStyle = "loss"; oppResultStyle = "win"; }

      if (home.name === team.name) {
        homeGamesBox.innerHTML += `
          <div class="game">
            <div class="team away ${oppResultStyle}" style="background-color: ${away.color}">
              <img class="logo" src="${away.logo}">
            </div>
            <div class="team home ${teamResultStyle}" style="background-color: ${home.color}">
              <img class="logo" src="${home.logo}">
            </div>
            <div class="outcome ${teamResultStyle}"></div>
          </div>
        `;
      } else {
        awayGamesBox.innerHTML += `
          <div class="game">
            <div class="outcome ${teamResultStyle}"></div>
            <div class="team away ${teamResultStyle}" style="background-color: ${away.color}">
              <img class="logo" src="${away.logo}">
            </div>
            <div class="team home ${oppResultStyle}" style="background-color: ${home.color}">
              <img class="logo" src="${home.logo}">
            </div>
          </div>
        `;
      }
      
    });
}

document.querySelector('.summary').addEventListener("click", () => {
  exportSummary();
});

document.querySelector('.button.schedule').addEventListener("click", () => {
  window.location.href = 'standings.html';
});

document.querySelector('.button.mock').addEventListener("click", () => {
  window.location.href = 'index.html';
});

async function exportSummary() {
  document.querySelectorAll('.team').forEach((el) => {
    el.style.boxShadow = "inset 0 0 20px black";
  });

  const grayedElements = document.querySelectorAll(".team.loss");
  grayedElements.forEach(el => {
    const color = getComputedStyle(el).backgroundColor;
    const { r, g, b } = parseRgbString(color);
    el.dataset.originalOpacity = el.style.opacity;
    el.dataset.originalColor = el.style.backgroundColor;

    el.style.opacity = "0.6"; // simulate dimming
    el.style.backgroundColor = getGrayscaleColor(r, g, b);
  });

  await new Promise(requestAnimationFrame);

  html2canvas(document.getElementById("summary"), {
    useCORS: true,
    scale: 3, // super sharp
    backgroundColor: null
  }).then((canvas) => {

    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = `team-season-prediction.png`;
    link.click();

  });
  

  grayedElements.forEach(el => {
    el.style.opacity = el.dataset.originalOpacity || "";
    el.style.backgroundColor = el.dataset.originalColor || "";
  });
  document.querySelectorAll('.team').forEach((el) => {
    el.style.boxShadow = "inset 0 0 20px rgba(0, 0, 0, 0.5)";
  });
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return { h, s, l };
}

function hslToRgb(h, s, l) {
  let r, g, b;

  r = g = b = l;

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

function getGrayscaleColor(r, g, b ) {
  const { h, l } = rgbToHsl(r, g, b);

  // set saturation to 0
  const gray = hslToRgb(h, 0, l);
  const final = `rgb(${gray.r}, ${gray.g}, ${gray.b})`

  return final;
}

function parseRgbString(rgbString) {
  const values = rgbString.match(/\d+/g).map(Number);
  return {
    r: values[0],
    g: values[1],
    b: values[2]
  };
}