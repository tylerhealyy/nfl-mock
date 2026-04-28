import { playerData27 } from "../data/playerData27.js";

document.documentElement.setAttribute("data-theme", "dark");
/*const noiseSrc = document.querySelector('.backgroundImg');
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
  if (savedTheme === "dark") noiseSrc.src = "photos/darkNoise.jpg";
} else {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.setAttribute(
    "data-theme",
    prefersDark ? "dark" : "light"
  );
  if (prefersDark) noiseSrc.src = "photos/darkNoise.jpg";
}*/

document.getElementById('mock').addEventListener("click", () => {
  window.location.href = 'simSettings.html';
});

document.getElementById('mockBtn').addEventListener("click", () => {
  window.location.href = 'simSettings.html';
});

document.getElementById('schedule').addEventListener("click", () => {
  window.location.href = 'standings.html';
});

document.querySelector('.lightTheme').addEventListener("click", () => {
  const newTheme = "light";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  noiseSrc.src = "photos/noise6.jpg";
});

document.querySelector('.darkTheme').addEventListener("click", () => {
  const newTheme = "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  noiseSrc.src = "photos/darkNoise.jpg";
});

async function load27Players() {
  const response = await fetch(`data/playerData27.csv`);
  const text = await response.text();

  const lines = text.trim().split("\n");

  const result = lines.slice(1).map(line => {
    const [Player, Rank, Position, School, Logo] = line.split(",");
    return { name: Player, consensus: Number(Rank), position: Position, school: School, schoolLogo: `schoolLogos/${Logo}`};
  });
  
  localStorage.setItem("playerData27", JSON.stringify(result));
}

localStorage.removeItem("playerData27");
load27Players();