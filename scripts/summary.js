import { nflTeams } from "./nfl-team-data.js";
import { playerData } from "./player-data.js";

let draftee;

document.querySelector(".screenshot-btn-h").addEventListener("click", () => { // add function to download buttons
  html2canvas(document.getElementById("capture"), {
    useCORS: true, // Allows cross-origin images
    allowTaint: true,
    scale: 2, // Increases rendering resolution
    backgroundColor: null // Ensures transparency is preserved
  }).then((canvas) => {
    let image = canvas.toDataURL("image/png"); // Convert canvas to image
    let link = document.createElement("a");
    link.href = image;
    link.download = "my-mock-draft.png"; // Download as PNG
    link.click();
  });
});

document.querySelector(".btnv").addEventListener("click", () => {
  html2canvas(document.getElementById("capture2"), {
    useCORS: true, // Allows cross-origin images
    allowTaint: true,
    scale: 2, // Increases rendering resolution
    backgroundColor: null // Ensures transparency is preserved
  }).then((canvas) => {
    let image = canvas.toDataURL("image/png"); // Convert canvas to image
    let link = document.createElement("a");
    link.href = image;
    link.download = "my-mock-draft.png"; // Download as PNG
    link.click();
  });
});

document.querySelector(".btn2").addEventListener("click", () => {
  html2canvas(document.getElementById("capture3"), {
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

document.querySelector(".btn3").addEventListener("click", () => {
  html2canvas(document.getElementById("capture4"), {
    useCORS: true, // Allows cross-origin images
    allowTaint: true,
    scale: 3.5, // Increases rendering resolution
    backgroundColor: null // Ensures transparency is preserved
  }).then((canvas) => {
    let image = canvas.toDataURL("image/png"); // Convert canvas to image
    let link = document.createElement("a");
    link.href = image;
    link.download = "my-mock-draft.png"; // Download as PNG
    link.click();
  });
});
document.querySelector(".btn4").addEventListener("click", () => {
  html2canvas(document.getElementById("capture5"), {
    useCORS: true, // Allows cross-origin images
    allowTaint: true,
    scale: 4.5, // Increases rendering resolution
    backgroundColor: null // Ensures transparency is preserved
  }).then((canvas) => {
    let image = canvas.toDataURL("image/png"); // Convert canvas to image
    let link = document.createElement("a");
    link.href = image;
    link.download = "my-mock-draft.png"; // Download as PNG
    link.click();
  });
});
document.querySelector(".btn5").addEventListener("click", () => {
  html2canvas(document.getElementById("capture6"), {
    useCORS: true, // Allows cross-origin images
    allowTaint: true,
    scale: 4.5, // Increases rendering resolution
    backgroundColor: null // Ensures transparency is preserved
  }).then((canvas) => {
    let image = canvas.toDataURL("image/png"); // Convert canvas to image
    let link = document.createElement("a");
    link.href = image;
    link.download = "my-mock-draft.png"; // Download as PNG
    link.click();
  });
});
document.querySelector(".btn6").addEventListener("click", () => {
  html2canvas(document.getElementById("capture7"), {
    useCORS: true, // Allows cross-origin images
    allowTaint: true,
    scale: 4.5, // Increases rendering resolution
    backgroundColor: null // Ensures transparency is preserved
  }).then((canvas) => {
    let image = canvas.toDataURL("image/png"); // Convert canvas to image
    let link = document.createElement("a");
    link.href = image;
    link.download = "my-mock-draft.png"; // Download as PNG
    link.click();
  });
});
document.querySelector(".btn7").addEventListener("click", () => {
  html2canvas(document.getElementById("capture8"), {
    useCORS: true, // Allows cross-origin images
    allowTaint: true,
    scale: 4.5, // Increases rendering resolution
    backgroundColor: null // Ensures transparency is preserved
  }).then((canvas) => {
    let image = canvas.toDataURL("image/png"); // Convert canvas to image
    let link = document.createElement("a");
    link.href = image;
    link.download = "my-mock-draft.png"; // Download as PNG
    link.click();
  });
});

document.querySelector('.grid2').innerHTML = ''; // Clear rounds 2 and 3 summaries (will be filled if they were completed)
document.querySelector('.grid3').innerHTML = '';
document.querySelector('.grid4').innerHTML = '';
document.querySelector('.grid5').innerHTML = '';
document.querySelector('.grid6').innerHTML = '';
document.querySelector('.grid7').innerHTML = '';

document.querySelectorAll('.user').forEach((user) => {
  user.innerHTML = JSON.parse(localStorage.getItem("savedName"));
})

localStorage.removeItem("functionExecuted");

window.addEventListener("DOMContentLoaded", (draftee) => {
  const key = "functionExecuted";

  if (!localStorage.getItem(key)) {
      buildSummary(draftee); // Call your function
      localStorage.setItem(key, "true"); // Mark it as executed
  }
});

function buildSummary(draftee) {
  for (let i = 1; i < 33; i++) { // Build first round summaries (horizontal and vertical)
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
  
        document.querySelector('.grid').innerHTML += `
          <div class="pick" style="
            background-color: white;
            box-shadow: inset 0px 0px 50px ${team.color};
          ">
            <div class="summary-pick-number">${i}</div>
            <div class="summary-pick-logo">
              <img src="${team.logo}" class="summary-nfl-pick-image">
            </div>
            <div class="summary-pick-player">
              <div class="pick-name">${draftee.name}</div>
              <div class="summary-pick-info">${draftee.position} ${draftee.school}</div>
            </div>
            <div class="pick-player-logo">
              <img src="${draftee.schoolLogo}" class="summary-pick-image">
            </div>
          </div>
        `;
  
        document.querySelector('.v-grid').innerHTML += `
          <div class="v-pick" style="
            background-color: white;
            box-shadow: inset 0px 0px 50px ${team.color};
          ">
            <div class="summary-pick-number">${i}</div>
            <div class="pick-logo">
              <img src="${team.logo}" class="pick-image">
            </div>
            <div class="summary-pick-player">
              <div class="pick-name">${draftee.name}</div>
              <div class="summary-pick-info">${draftee.position} ${draftee.school}</div>
            </div>
            <div class="pick-player-logo">
              <img src="${draftee.schoolLogo}" class="v-summary-pick-image">
            </div>
          </div>
        `;
      }
    });
  }

  for (let i = 33; i < 65; i++) { // Build second round summary
    nflTeams.forEach((team) => {

      let newTest;
      if (JSON.parse(localStorage.getItem(`${team.name}test`))) {
        newTest = JSON.parse(localStorage.getItem(`${team.name}test`));
      } else {
        newTest = team.test;
      }

      if (newTest.some(obj => obj.n === i)) {
        let example = JSON.parse(localStorage.getItem(`${i}${team.name}`));
        if (example.p === "") { // If there are no second round picks, keep the summary empty
          document.querySelector('.grid2').innerHTML += '';
        } else { // If there are second round picks, add them to the summary
          playerData.forEach((player) => {
            if (example.p === `${player.position} ${player.name}`) {
              draftee = player;
            }
          });
      
          document.querySelector('.grid2').innerHTML += `
            <div class="v-pick" style="
              background-color: white;
              box-shadow: inset 0px 0px 50px ${team.color};
            ">
              <div class="summary-pick-number">${i}</div>
              <div class="pick-logo">
                <img src="${team.logo}" class="pick-image">
              </div>
              <div class="summary-pick-player">
                <div class="pick-name">${draftee.name}</div>
                <div class="summary-pick-info">${draftee.position} ${draftee.school}</div>
              </div>
              <div class="pick-player-logo">
                <img src="${draftee.schoolLogo}" class="v-summary-pick-image">
              </div>
            </div>
          `;
        }
      }
    });
  }

  for (let i = 65; i < 102; i++) { // Build third round summary
    nflTeams.forEach((team) => {
      let newTest;
      if (JSON.parse(localStorage.getItem(`${team.name}test`))) {
        newTest = JSON.parse(localStorage.getItem(`${team.name}test`));
      } else {
        newTest = team.test;
      }
      if (newTest.some(obj => obj.n === i)) {
        let example = JSON.parse(localStorage.getItem(`${i}${team.name}`));
        if (example.p === "") { // If there are no third round picks, keep the summary empty
          document.querySelector('.grid3').innerHTML += '';
        } else { // If there are third round picks, add them to the summary
          playerData.forEach((player) => {
            if (example.p === `${player.position} ${player.name}`) {
              draftee = player;
            }
          });
    
          document.querySelector('.grid3').innerHTML += `
            <div class="v-pick" style="
              background-color: white;
              box-shadow: inset 0px 0px 50px ${team.color};
            ">
              <div class="summary-pick-number">${i}</div>
              <div class="pick-logo">
                <img src="${team.logo}" class="pick-image">
              </div>
              <div class="summary-pick-player">
                <div class="pick-name">${draftee.name}</div>
                <div class="summary-pick-info">${draftee.position} ${draftee.school}</div>
              </div>
              <div class="pick-player-logo">
                <img src="${draftee.schoolLogo}" class="v-summary-pick-image">
              </div>
            </div>
          `;
        }
      }
    });
  }

  for (let i = 102; i < 140; i++) { // Build third round summary
    nflTeams.forEach((team) => {
      let newTest;
      if (JSON.parse(localStorage.getItem(`${team.name}test`))) {
        newTest = JSON.parse(localStorage.getItem(`${team.name}test`));
      } else {
        newTest = team.test;
      }
      if (newTest.some(obj => obj.n === i)) {
        let example = JSON.parse(localStorage.getItem(`${i}${team.name}`));
        if (example.p === "") { // If there are no third round picks, keep the summary empty
          document.querySelector('.grid4').innerHTML += '';
        } else { // If there are third round picks, add them to the summary
          playerData.forEach((player) => {
            if (example.p === `${player.position} ${player.name}`) {
              draftee = player;
            }
          });
    
          document.querySelector('.grid4').innerHTML += `
            <div class="v-pick" style="
              background-color: white;
              box-shadow: inset 0px 0px 50px ${team.color};
            ">
              <div class="summary-pick-number">${i}</div>
              <div class="idaho">
                <img src="${team.logo}" class="pick-image7">
              </div>
              <div class="summary-pick-player">
                <div class="pick-name">${draftee.name}</div>
                <div class="summary-pick-info">${draftee.position} ${draftee.school}</div>
              </div>
              <div class="pick-player-logo">
                <img src="${draftee.schoolLogo}" class="v-summary-pick-image">
              </div>
            </div>
          `;
        }
      }
    });
  }

  for (let i = 140; i < 179; i++) { // Build third round summary
    nflTeams.forEach((team) => {
      let newTest;
      if (JSON.parse(localStorage.getItem(`${team.name}test`))) {
        newTest = JSON.parse(localStorage.getItem(`${team.name}test`));
      } else {
        newTest = team.test;
      }
      if (newTest.some(obj => obj.n === i)) {
        let example = JSON.parse(localStorage.getItem(`${i}${team.name}`));
        if (example.p === "") { // If there are no third round picks, keep the summary empty
          document.querySelector('.grid5').innerHTML += '';
        } else { // If there are third round picks, add them to the summary
          playerData.forEach((player) => {
            if (example.p === `${player.position} ${player.name}`) {
              draftee = player;
            }
          });
    
          document.querySelector('.grid5').innerHTML += `
            <div class="v-pick" style="
              background-color: white;
              box-shadow: inset 0px 0px 50px ${team.color};
            ">
              <div class="summary-pick-number">${i}</div>
              <div class="idaho">
                <img src="${team.logo}" class="pick-image7">
              </div>
              <div class="summary-pick-player">
                <div class="pick-name">${draftee.name}</div>
                <div class="summary-pick-info">${draftee.position} ${draftee.school}</div>
              </div>
              <div class="pick-player-logo">
                <img src="${draftee.schoolLogo}" class="v-summary-pick-image">
              </div>
            </div>
          `;
        }
      }
    });
  }

  for (let i = 179; i < 219; i++) { // Build third round summary
    nflTeams.forEach((team) => {
      let newTest;
      if (JSON.parse(localStorage.getItem(`${team.name}test`))) {
        newTest = JSON.parse(localStorage.getItem(`${team.name}test`));
      } else {
        newTest = team.test;
      }
      if (newTest.some(obj => obj.n === i)) {
        let example = JSON.parse(localStorage.getItem(`${i}${team.name}`));
        if (example.p === "") { // If there are no third round picks, keep the summary empty
          document.querySelector('.grid6').innerHTML += '';
        } else { // If there are third round picks, add them to the summary
          playerData.forEach((player) => {
            if (example.p === `${player.position} ${player.name}`) {
              draftee = player;
            }
          });
    
          document.querySelector('.grid6').innerHTML += `
            <div class="v-pick" style="
              background-color: white;
              box-shadow: inset 0px 0px 50px ${team.color};
            ">
              <div class="summary-pick-number">${i}</div>
              <div class="idaho">
                <img src="${team.logo}" class="pick-image7">
              </div>
              <div class="summary-pick-player">
                <div class="pick-name">${draftee.name}</div>
                <div class="summary-pick-info">${draftee.position} ${draftee.school}</div>
              </div>
              <div class="pick-player-logo">
                <img src="${draftee.schoolLogo}" class="v-summary-pick-image">
              </div>
            </div>
          `;
        }
      }
    });
  }

  for (let i = 219; i < 258; i++) { // Build third round summary
    nflTeams.forEach((team) => {
      let newTest;
      if (JSON.parse(localStorage.getItem(`${team.name}test`))) {
        newTest = JSON.parse(localStorage.getItem(`${team.name}test`));
      } else {
        newTest = team.test;
      }
      if (newTest.some(obj => obj.n === i)) {
        let example = JSON.parse(localStorage.getItem(`${i}${team.name}`));
        if (example.p === "") { // If there are no third round picks, keep the summary empty
          document.querySelector('.grid7').innerHTML += '';
        } else { // If there are third round picks, add them to the summary
          playerData.forEach((player) => {
            if (example.p === `${player.position} ${player.name}`) {
              draftee = player;
            }
          });
    
          document.querySelector('.grid7').innerHTML += `
            <div class="v-pick" style="
              background-color: white;
              box-shadow: inset 0px 0px 50px ${team.color};
            ">
              <div class="summary-pick-number">${i}</div>
              <div class="idaho">
                <img src="${team.logo}" class="pick-image7">
              </div>
              <div class="summary-pick-player">
                <div class="pick-name">${draftee.name}</div>
                <div class="summary-pick-info">${draftee.position} ${draftee.school}</div>
              </div>
              <div class="pick-player-logo">
                <img src="${draftee.schoolLogo}" class="v-summary-pick-image">
              </div>
            </div>
          `;
        }
      }
    });
  }
}






