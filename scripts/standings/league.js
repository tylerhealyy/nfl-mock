document.documentElement.setAttribute("data-theme", "dark");
import { nflTeams27 } from "../../data/nflTeamData27.js";

let selectedWeek = 1;
const divisions = ['an', 'ae', 'as', 'aw', 'nn', 'ne', 'ns', 'nw'];
const divisionNames = {
  'an': 'AFC North',
  'ae': 'AFC East',
  'as': 'AFC South',
  'aw': 'AFC West',
  'nn': 'NFC North',
  'ne': 'NFC East',
  'ns': 'NFC South',
  'nw': 'NFC West'
}
let afcRound2Teams = [];
let nfcRound2Teams = [];
let afcRound3Teams = [];
let nfcRound3Teams = [];
let totalGamesPicked = 0;

let teams = [];
nflTeams27.forEach(team => {
  const conf = team.division.includes("a") ? 'afc' : 'nfc';
  const obj = {name: team.name, wins: 0, losses: 0, color: team.color, division: team.division, abbv: team.abbv, conf: conf, divWins: 0, confWins: 0};
  teams.push(obj);
});

loadGames();
const games = JSON.parse(localStorage.getItem('games'));
displayGames();

function displayGames() {
  document.querySelector('.list').innerHTML = `
    <div class="fixture labels">
      <div class="day">Day</div>
      <div class="time">ET</div>
      <div class="away">Away</div>
      <div class="home">Home</div>
    </div> 
  `;
  games.forEach(game => {
    const away = teams.find(t => t.name === game.Away);
    const home = teams.find(t => t.name === game.Home);

    const list = document.querySelector('.list');

    if (game.Week == selectedWeek) {
      list.insertAdjacentHTML('beforeend', `
        <div class="fixture" data-gameid="${game.GameId}">
          <div class="day">${game.Day}</div>
          <div class="time">${game.Time}</div>
          <div class="away teamJs">
            <img src="teamLogos/${game.Away.toLowerCase()}.png">
            <div class="team">${game.Away.toUpperCase()}</div>
            <div class="record">${away.wins}-${away.losses}</div>
          </div>
          <div class="home teamJs">
            <img src="teamLogos/${game.Home.toLowerCase()}.png">
            <div class="team">${game.Home.toUpperCase()}</div>
            <div class="record">${home.wins}-${home.losses}</div>
          </div>
        </div>
      `);

      const fixture = list.lastElementChild;

      if (game.result === away.name) {
        fixture.querySelector('.away').style.boxShadow = `inset 0 -4px 0 ${away.color}`;
        fixture.querySelector('.away').style.backgroundColor = 'rgb(120, 120, 120)';
        fixture.querySelector('.home').style.backgroundColor = 'rgb(20, 20, 20)';
      } else if (game.result === home.name) {
        fixture.querySelector('.home').style.boxShadow = `inset 0 -4px 0 ${home.color}`;
        fixture.querySelector('.home').style.backgroundColor = 'rgb(120, 120, 120)';
        fixture.querySelector('.away').style.backgroundColor = 'rgb(20, 20, 20)';
      }
    }
  });

  reinstateFunction();
}

function reinstateFunction() {
  const fixtureTeams = document.querySelectorAll('.teamJs');
  fixtureTeams.forEach(t => {
    t.addEventListener("click", () => {
      const fixture = t.closest('.fixture');
      const otherTeam = [...fixture.querySelectorAll('.teamJs')].find(team => team !== t);
      const teamRecord = t.querySelector('.record');
      const oppRecord = otherTeam.querySelector('.record');
      const teamName = t.querySelector('.team').textContent;
      const oppName = otherTeam.querySelector('.team').textContent;
      const team = teams.find(tm => tm.name.toUpperCase() === teamName);
      const opp = teams.find(tm => tm.name.toUpperCase() === oppName);

      const game = games.find(g => g.GameId === fixture.dataset.gameid);
      const divGame = team.division === opp.division ? true : false;
      const confGame = team.conf === opp.conf ? true : false;
      const prevWinner = game.result;

      if (prevWinner) {
        if (prevWinner === team.name) { team.wins--; opp.losses--;
          if (divGame) {team.divWins--}
          if (confGame) {team.confWins--}
        }
        else { team.losses--; opp.wins--; otherTeam.style.boxShadow = 'none'; otherTeam.style.backgroundColor = 'rgb(20, 20, 20)'; totalGamesPicked--;
          if (divGame) {opp.divWins--}
          if (confGame) {opp.confWins--}
        };
      }

      if (prevWinner === team.name) {
        game.result = null;
        totalGamesPicked--;

        teamRecord.textContent = `${team.wins}-${team.losses}`;
        oppRecord.textContent = `${opp.wins}-${opp.losses}`;
        t.style.boxShadow = 'none';
        t.style.backgroundColor = 'transparent';
        otherTeam.style.backgroundColor = 'transparent';

        updateStandings();
        updatePlayoffPicture(teams);
        updateDraftOrder();
        return;
      }

      game.result = team.name;
      totalGamesPicked++;

      team.wins++;
      opp.losses++;

      if (divGame) {team.divWins++}
      if (confGame) {team.confWins++}

      teamRecord.textContent = `${team.wins}-${team.losses}`;
      oppRecord.textContent = `${opp.wins}-${opp.losses}`;
      t.style.boxShadow = `inset 0px -4px 0px ${nflTeams27.find(t => t.name === team.name).color}`;
      t.style.backgroundColor = `rgb(120, 120, 120)`;
      otherTeam.style.backgroundColor = `rgb(20, 20, 20)`;

      updateStandings();
      updatePlayoffPicture(teams);
      updateDraftOrder();
    });
  });
}

const weeksTab = document.querySelector('.games .header');
for (let i = 1; i < 19; i++) {
  weeksTab.innerHTML += `
    <div class="week" data-week="${i}">Week ${i}</div>
  `;
}

const weekBtns = document.querySelectorAll('.week');
weekBtns.forEach(btn => {
  if (btn.dataset.week === "1") btn.style.backgroundColor = 'rgb(120, 120, 120)';
  btn.addEventListener("click", () => {
    selectedWeek = btn.dataset.week;
    displayGames();

    weekBtns.forEach(b => {
      b.style.backgroundColor = 'rgb(60, 60, 60)';
    });

    btn.style.backgroundColor = 'rgb(120, 120, 120)';

    btn.scrollIntoView({
      inline: 'center',
      block: 'nearest',
      behavior: 'smooth'
    });
  });
});

async function loadGames() {
  const games = await fetch('data/nflSchedule26.csv');
  const text = await games.text();

  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim());

  const result = lines.slice(1).map(line => {
    const [GameId, Away, Home, Week, Day, Time] = line.split(",");

    return {GameId, Away, Home, Week, Day, Time, result: null};
  });

  let gamesArray = [];

  result.forEach(g => {
    gamesArray.push(g);
  });

  localStorage.setItem('games', JSON.stringify(gamesArray));
}

updateStandings();

function updateStandings() {
  document.querySelector('.standings').innerHTML = '';

  divisions.forEach(d => {
    const dName = divisionNames[d];
    document.querySelector('.standings').insertAdjacentHTML('beforeend', `
      <div class="division">
        <div class="header" data-division="${d}">${dName}</div>
      </div>
    `);

    let divTeams = [];
    teams.forEach(t => {
      if (t.division === d) {
        divTeams.push(t);
      }
    });

    let teamId = 1;
    const lastDivision = document.querySelector('.standings').lastElementChild;
    divTeams.sort((a, b) => {
      if (a.wins === b.wins) {
        if (a.losses === b.losses) {
          if (a.divWins === b.divWins) {
            if (a.confWins === b.confWins) {
              return a.name.localeCompare(b.name);
            }
            return b.confWins - a.confWins;
          }
          return b.divWins - a.divWins;
        }
        return a.losses - b.losses;
      }
      return b.wins - a.wins;
    })
      .forEach(t => {
        lastDivision.insertAdjacentHTML('beforeend', `
          <div class="team">
            <div class="rank">${teamId}</div>
            <img src="teamLogos/${t.name.toLowerCase()}.png">
            <div class="name">${t.abbv}</div>
            <div class="record">${t.wins}-${t.losses}</div>
          </div>
        `);
        teamId++;
      });
  });
}

const playoffTeams = document.querySelectorAll('.playoffTeam');
const wildCardTeams = document.querySelectorAll('.wildCard .playoffTeam');
const divisionalTeams = document.querySelectorAll('.divisional .playoffTeam');
const confChipTeams = document.querySelectorAll('.confChamp .playoffTeam');
const sbTeams = document.querySelectorAll('.sbTeam');
wildCardTeams.forEach(t => {
  t.addEventListener("click", () => {
    if (totalGamesPicked !== 272) return;

    const team = t.dataset.team;
    const conf = teams.find(b => b.name === team).conf;
    const game = t.closest('.game');
    const oppEl = [...game.querySelectorAll('.playoffTeam')]
      .find(teamEl => teamEl !== t);
    const opp = oppEl.dataset.team;
    
    t.style.backgroundColor = `${teams.find(k => k.name === team).color}`;
    t.style.opacity = '1';

    oppEl.style.backgroundColor = 'rgb(60, 60, 60)';
    oppEl.style.opacity = '0.5';
    advanceWildCard(team, conf, opp);
  });
});

divisionalTeams.forEach(t => {
  t.addEventListener("click", () => {
    const team = t.dataset.team;
    const conf = teams.find(b => b.name === team).conf;
    const game = t.closest('.game');
    const oppEl = [...game.querySelectorAll('.playoffTeam')]
      .find(teamEl => teamEl !== t);
    const opp = oppEl.dataset.team;
    
    t.style.backgroundColor = `${teams.find(k => k.name === team).color}`;
    t.style.opacity = '1';

    oppEl.style.backgroundColor = 'rgb(60, 60, 60)';
    oppEl.style.opacity = '0.5';
    advanceDivisional(team, conf, opp);
  });
});

confChipTeams.forEach(t => {
  t.addEventListener("click", () => {
    const team = t.dataset.team;
    const conf = teams.find(b => b.name === team).conf;
    const game = t.closest('.game');
    const oppEl = [...game.querySelectorAll('.playoffTeam')]
      .find(teamEl => teamEl !== t);
    const opp = oppEl.dataset.team;
    
    t.style.backgroundColor = `${teams.find(k => k.name === team).color}`;
    t.style.opacity = '1';

    oppEl.style.backgroundColor = 'rgb(60, 60, 60)';
    oppEl.style.opacity = '0.5';
    advanceConfChip(team, conf);
  });
});

sbTeams.forEach(t => {
  t.addEventListener("click", () => {
    const team = t.dataset.team;
    const game = t.closest('.superBowl');
    const oppEl = [...game.querySelectorAll('.sbTeam')]
      .find(teamEl => teamEl !== t);
    
    t.style.backgroundColor = `${teams.find(k => k.name === team).color}`;
    t.style.opacity = '1';
    t.style.border = `2px solid gold`;

    oppEl.style.backgroundColor = 'rgb(60, 60, 60)';
    oppEl.style.opacity = '0.5';
    oppEl.style.border = `2px solid black`;
  });
});

function updatePlayoffPicture(allTeams) {
  const afcTeams = [];
  const nfcTeams = [];
  allTeams.forEach(t => {
    if (t.conf === 'afc') {
      afcTeams.push(t);
    } else nfcTeams.push(t);
  });

  for (let j = 1; j < 3; j++) {
    const thisConference = j === 1 ? afcTeams : nfcTeams;
    const conf = j === 1 ? 'afc' : 'nfc';

    const divisions = {};

    thisConference.forEach(t => {
      if (!divisions[t.division]) {
        divisions[t.division] = [];
      }

      divisions[t.division].push(t);
    });

    const divisionWinners = Object.values(divisions).map(divisionTeams => {
      return divisionTeams.sort((a, b) => {
        if (a.wins === b.wins) {
          if (a.losses === b.losses) {
            if (a.divWins === b.divWins) {
              if (a.confWins === b.confWins) {
                return a.name.localeCompare(b.name);
              }
              return b.confWins - a.confWins;
            }
            return b.divWins - a.divWins;
          }
          return a.losses - b.losses;
        }
        return b.wins - a.wins;
      })[0];
    });

    divisionWinners.sort((a, b) => {
      if (a.wins === b.wins) {
        if (a.losses === b.losses) {
          if (a.divWins === b.divWins) {
            if (a.confWins === b.confWins) {
              return a.name.localeCompare(b.name);
            }
            return b.confWins - a.confWins;
          }
          return b.divWins - a.divWins;
        }
        return a.losses - b.losses;
      }
      return b.wins - a.wins;
    });

    const wildcardTeams = thisConference.filter(
      team => !divisionWinners.includes(team)
    );

    wildcardTeams.sort((a, b) => {
      if (a.wins === b.wins) {
        if (a.losses === b.losses) {
          if (a.division === b.division) {
            if (a.divWins === b.divWins) {
              if (a.confWins === b.confWins) {return a.name.localeCompare(b.name)}
              return b.confWins - a.confWins;
            }
            return b.divWins - a.divWins;
          }
          if (a.confWins === b.confWins) {return a.name.localeCompare(b.name)}
          return b.confWins - a.confWins;
        }
        return a.losses - b.losses;
      }
      return b.wins - a.wins;
    });

    const wildcards = wildcardTeams.slice(0, 3);
    const draftTeams = wildcardTeams.slice(3);
    localStorage.setItem(`${conf}DraftTeams`, JSON.stringify(draftTeams));

    const playoffSeeds = [...divisionWinners, ...wildcards];

    const conferenceSeeding = playoffSeeds.map((team, index) => ({
      seed: index + 1,
      ...team
    }));

    localStorage.setItem(`${conf}PlayoffSeeding`, JSON.stringify(conferenceSeeding));

    for (let i = 1; i < 8; i++) {
      const team = conferenceSeeding.find(t => t.seed === i);
      const place = document.querySelector(`.${conf}${i}`);
      place.style.backgroundColor = `${team.color}`;
      place.dataset.team = `${team.name}`;
      document.querySelector(`.${conf}${i}Img`).src = `teamLogos/${team.name.toLowerCase()}.png`;
    }

    if (totalGamesPicked === 272) {
      wildCardTeams.forEach(t => {
        t.style.pointerEvents = 'auto';
      });
    } else {
      wildCardTeams.forEach(t => {
        t.style.pointerEvents = 'none';
      });
    }
  }
}

function updateDraftOrder() {
  document.querySelector('.draftOrder .order').innerHTML = '';
  const afcDraftTeams = JSON.parse(localStorage.getItem('afcDraftTeams'));
  const nfcDraftTeams = JSON.parse(localStorage.getItem('nfcDraftTeams'));
  const draftTeams = [...afcDraftTeams, ...nfcDraftTeams];

  const draftOrder = draftTeams.sort((a, b) => {
    const aRecord = a.wins / (a.wins + a.losses);
    const bRecord = b.wins / (b.wins + b.losses);
    if (a.wins === b.wins) {
      if (a.losses === b.losses) {
        if (aRecord === bRecord) {
          return a.name.localeCompare(b.name);
        }
        return aRecord - bRecord;
      }
      return b.losses - a.losses;
    }
    return a.wins - b.wins;
  });

  for (let i = 0; i < 18; i++) {
    const team = draftOrder[i];
    const pickOwner = nflTeams27.find(t => t.test.some(p => p.r === 1 && p.t === team.abbv));
    const tradedPick = team.name === pickOwner.name ? '' : ` ${team.abbv}`;
    document.querySelector('.draftOrder .order').insertAdjacentHTML('beforeend', `
      <div class="slot">
        <div class="rank">${i + 1}</div>
        <img src="teamLogos/${pickOwner.name.toLowerCase()}.png">
        <div class="name">${pickOwner.abbv}<span style="font-size: 0.7rem; font-weight: 400;">${tradedPick}</span></div>
        <div class="record">${team.wins}-${team.losses}</div>
      </div>
      `)
  }
}

function advanceWildCard(team, conference, opp) {
  const round2Map = {
    afc: afcRound2Teams,
    nfc: nfcRound2Teams
  };

  const round2Teams = round2Map[conference];

  const round1Teams = JSON.parse(
    localStorage.getItem(`${conference}PlayoffSeeding`)
  );

  const teamClicked = round1Teams.find(t => t.name === team);

  if (round2Teams.length === 0) {
    round2Teams.push(
      round1Teams.find(t => t.seed === 1)
    );
  }

  const opponentIndex = round2Teams.findIndex(t => t.name === opp);

  if (opponentIndex !== -1) {round2Teams.splice(opponentIndex, 1)}

  const alreadyExists = round2Teams.some(t => t.name === team);

  if (!alreadyExists) {round2Teams.push(teamClicked)}

  if (round2Teams.length !== 4) {
    divisionalTeams.forEach(t => {t.style.pointerEvents = 'none'});
    return;
  } else {
    divisionalTeams.forEach(t => {t.style.pointerEvents = 'auto'});
  }

  round2Teams.sort((a, b) => a.seed - b.seed);
  localStorage.setItem(`${conference}Round2Teams`, JSON.stringify(round2Teams));

  const slots = [
    ['OneAway', 3],
    ['DivAway', 2],
    ['DivHome', 1]
  ];

  slots.forEach(([slot, index]) => {
    const team = round2Teams[index];

    const container = document.querySelector(`.${conference}${slot}`);
    const img = container.querySelector('img');
    const seedDiv = container.querySelector('div');

    img.src = `teamLogos/${team.name.toLowerCase()}.png`;
    container.dataset.team = `${team.name}`;
    container.style.backgroundColor = team.color;
    seedDiv.textContent = team.seed;
  });
}

function advanceDivisional(team, conference, opp) {
  const round3Map = {
    afc: afcRound3Teams,
    nfc: nfcRound3Teams
  };

  const round3Teams = round3Map[conference];

  const round2Teams = JSON.parse(
    localStorage.getItem(`${conference}Round2Teams`)
  );

  const teamClicked = round2Teams.find(t => t.name === team);

  const opponentIndex = round3Teams.findIndex(t => t.name === opp);

  if (opponentIndex !== -1) {round3Teams.splice(opponentIndex, 1)}

  const alreadyExists = round3Teams.some(t => t.name === team);

  if (!alreadyExists) {round3Teams.push(teamClicked)}

  if (round3Teams.length !== 2) {
    confChipTeams.forEach(t => {t.style.pointerEvents = 'none'});
    return;
  } else {
    confChipTeams.forEach(t => {t.style.pointerEvents = 'auto'});
  }

  round3Teams.sort((a, b) => a.seed - b.seed);

  const slots = [
    ['ConfAway', 1],
    ['ConfHome', 0]
  ];

  slots.forEach(([slot, index]) => {
    const team = round3Teams[index];

    const container = document.querySelector(`.${conference}${slot}`);
    const img = container.querySelector('img');
    const seedDiv = container.querySelector('div');

    img.src = `teamLogos/${team.name.toLowerCase()}.png`;
    container.dataset.team = `${team.name}`;
    container.style.backgroundColor = team.color;
    seedDiv.textContent = team.seed;
  });
}

function advanceConfChip(team, conference) {
  const container = document.querySelector(`.${conference}Sb`);
  const teamObj = teams.find(t => t.name === team);
  container.dataset.team = `${team}`;
  container.innerHTML = `
    <img src="teamLogos/${team.toLowerCase()}.png">
  `;
  container.style.backgroundColor = `${teamObj.color}`;
  sbTeams.forEach(t => {
    t.style.pointerEvents = 'auto';
  });
}

document.querySelector('.downloadBtn').addEventListener("click", () => {
  html2canvas(document.getElementById("capture"), {
    useCORS: true,
    scale: 3, // super sharp
    backgroundColor: null
  }).then((canvas) => {

    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = `nfl-season-prediction.png`;
    link.click();

  });
});