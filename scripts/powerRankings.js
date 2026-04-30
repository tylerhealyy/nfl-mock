import { nflTeams27 } from "../data/nflTeamData27.js";

const grid = document.querySelector('.grid');
let spotNum = 0;
const spotNumWidthLong = "polygon(0 0, 40% 0, 35% 100%, 0% 100%)";
const spotNumWidthShort = "polygon(0 0, 30% 0, 25% 100%, 0% 100%)";

document.getElementById('toggleTiers').checked = false;

nflTeams27.forEach(team => {
  spotNum++;
  grid.innerHTML += `
    <div class="spot" data-team="${team.name}" style="
      --bg: ${team.color};
      --width: ${spotNum < 10 ? spotNumWidthShort : spotNumWidthLong};
      ">
      <div class="left">${spotNum}</div>
      <div class="right">
        <img src="teamLogos/${team.name.toLowerCase()}.png" class="logo l4">
        <img src="teamLogos/${team.name.toLowerCase()}.png" class="logo l3">
        <img src="teamLogos/${team.name.toLowerCase()}.png" class="logo l1">
        <img src="teamLogos/${team.name.toLowerCase()}.png" class="logo l2">
        <img src="teamLogos/${team.name.toLowerCase()}.png" class="logo main">
      </div>
    </div>
  `;
});

document.getElementById('toggleTiers').addEventListener('change', (event) => {
  if (event.target.checked) {
    updateGridColors();
  } else {
    items.forEach(item => {
      item.style.border = `2px solid white`;
    });
  }
});

const inputs = document.querySelectorAll('.tierRange');
const MAX_TOTAL = 32;

inputs.forEach(input => {
  input.addEventListener("wheel", (e) => {

    e.preventDefault(); // stop page scrolling

    const step = Number(input.step) || 1;
    const min = input.min !== "" ? Number(input.min) : -Infinity;
    const max = input.max !== "" ? Number(input.max) : Infinity;

    let value = Number(input.value) || 0;

    if (e.deltaY < 0) {
      value += step; // scroll up
    } else {
      value -= step; // scroll down
    }

    // clamp to min/max
    value = Math.min(max, Math.max(min, value));

    input.value = value;

    input.dispatchEvent(new Event("input", { bubbles: true }));

    setTimeout(updateGridColors, 0);
  });

  input.addEventListener("input", () => {

    const values = [...inputs].map(i => Number(i.value) || 0);

    const total = values.reduce((a, b) => a + b, 0);

    if (total > MAX_TOTAL) {
      // sum of the OTHER inputs
      const othersTotal = total - (Number(input.value) || 0);

      // max allowed for this input
      const maxAllowed = MAX_TOTAL - othersTotal;

      input.value = Math.max(0, maxAllowed);
    }

    updateGridColors();
  });
});

const items = document.querySelectorAll(".grid .spot");
const colors = ["rgb(0, 255, 0)", "rgb(255, 255, 0)", "rgb(255, 165, 0)", "rgb(255, 0, 0)"];

function updateGridColors() {
  let ranges = [];
  let start = 0;

  inputs.forEach((input, i) => {
    const count = Number(input.value) || 0;

    ranges.push({
      start,
      end: start + count - 1,
      color: colors[i] || "gray"
    });

    start += count;
  });

  items.forEach((item) => {
    let color = "black";
    const updatedIndex = parseInt(item.querySelector('.left').textContent) - 1;

    for (const range of ranges) {
      if (updatedIndex >= range.start && updatedIndex <= range.end) {
        color = range.color;
        break;
      }
    }

    item.style.border = `2px solid ${color}`;
  });
}

new Sortable(document.querySelector(".grid"), {
  animation: 150,

  onEnd: function () {
    updateRank();
    if (document.getElementById('toggleTiers').checked) updateGridColors();
  }
});

function updateRank() {
  const spots = document.querySelectorAll('.spot');
  spots.forEach((spot, index) => {
    const left = spot.querySelector('.left');
    left.textContent = index + 1;

    spot.setAttribute("style", `
      --bg: ${nflTeams27.find(team => team.name === spot.dataset.team).color};
      --width: ${index < 9 ? spotNumWidthShort : spotNumWidthLong};
      `)
  });
}