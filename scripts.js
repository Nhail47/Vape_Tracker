let vapes = [];
let currentVapeIndex = -1;
let defaultVapeIndex = -1; // Default vape index for loading on refresh

// Function to log the usage of a particular vape level
function logUsage(level) {
  if (currentVapeIndex === -1) {
    alert("Please create or select a vape first.");
    return;
  }

  const currentVape = vapes[currentVapeIndex];

  if (level > currentVape.currentLevel) {
    alert("Invalid action. You cannot log a higher level.");
    return;
  }

  const historyList = document.getElementById("history-list");
  const listItem = document.createElement("li");
  const timestamp = new Date().toLocaleString();
  listItem.textContent = `Used Level ${level} at ${timestamp}`;
  historyList.appendChild(listItem);

  currentVape.currentLevel = level;
  document.getElementById("level-display").textContent = `${currentVape.name} - Level ${currentVape.currentLevel}`;
  currentVape.history.push(listItem.textContent);
  saveData();
}

function createNewVape() {
  const name = prompt("Enter a name for your vape:");
  if (!name) {
    alert("Vape creation canceled. Name is required.");
    return;
  }

  const initialLevelSelect = document.getElementById("initial-level");
  const initialLevel = parseInt(initialLevelSelect.value);

  const newVape = {
    id: Date.now(),
    name: name,
    initialLevel: initialLevel,
    currentLevel: initialLevel,
    history: [],
    isEnded: false,
  };

  vapes.push(newVape);
  currentVapeIndex = vapes.length - 1;
  updateVapeDisplay();
  renderVapeList();
  saveData();

  alert(`New vape "${name}" created with initial level ${initialLevel}`);

  if (initialLevel === 6) {
    logUsage(6);
  }
}

function resetVape() {
  if (currentVapeIndex === -1) {
    alert("Please create or select a vape first.");
    return;
  }

  const currentVape = vapes[currentVapeIndex];
  currentVape.currentLevel = 6;
  document.getElementById("level-display").textContent = `${currentVape.name} - Level ${currentVape.currentLevel}`;
  currentVape.history = [];
  document.getElementById("history-list").innerHTML = "";
  saveData();
  alert("Vape reset to level 6");
}

function deleteVape(index) {
  if (confirm("Are you sure you want to delete this vape?")) {
    vapes.splice(index, 1);
    if (vapes.length === 0) {
      currentVapeIndex = -1;
      document.getElementById("level-display").textContent = "";
      document.getElementById("history-list").innerHTML = "";
    } else {
      currentVapeIndex = Math.max(0, currentVapeIndex - 1);
    }
    renderVapeList();
    updateVapeDisplay();
    saveData();
  }
}

function endVape() {
  if (currentVapeIndex === -1) {
    alert("Please create or select a vape first.");
    return;
  }

  const currentVape = vapes[currentVapeIndex];
  currentVape.isEnded = true;
  updateVapeDisplay();
  renderVapeList();
  saveData();
  alert("Vape has been ended.");
}

// Function to set the currently selected vape as the default one
function setAsDefault() {
  if (currentVapeIndex === -1) {
    alert("Please select a vape first.");
    return;
  }
  defaultVapeIndex = currentVapeIndex;
  localStorage.setItem("defaultVapeIndex", defaultVapeIndex); // Save default vape index
  alert(`Vape "${vapes[currentVapeIndex].name}" set as the default vape.`);
}

function saveData() {
  localStorage.setItem("vapeData", JSON.stringify(vapes));
  if (defaultVapeIndex !== -1) {
    localStorage.setItem("defaultVapeIndex", defaultVapeIndex); // Save the default vape index
  }
}

function loadData() {
  const data = localStorage.getItem("vapeData");
  if (data) {
    vapes = JSON.parse(data);
  }

  const savedDefaultVapeIndex = localStorage.getItem("defaultVapeIndex");
  if (savedDefaultVapeIndex !== null) {
    defaultVapeIndex = parseInt(savedDefaultVapeIndex);
    currentVapeIndex = defaultVapeIndex; // Load the default vape
  } else if (vapes.length > 0) {
    currentVapeIndex = vapes.length - 1; // If no default, load the last vape
  }

  if (currentVapeIndex !== -1) {
    updateVapeDisplay();
  }
  renderVapeList();
}

function updateVapeDisplay() {
  if (currentVapeIndex === -1) return;

  const currentVape = vapes[currentVapeIndex];
  const levelDisplay = document.getElementById("level-display");
  const historyList = document.getElementById("history-list");

  if (currentVape.isEnded) {
    levelDisplay.textContent = `${currentVape.name} - Vape Ended`;
    historyList.innerHTML = `<li>This vape has ended.</li>`;
  } else {
    levelDisplay.textContent = `${currentVape.name} - Level ${currentVape.currentLevel}`;
    historyList.innerHTML = "";
    for (let item of currentVape.history) {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      historyList.appendChild(listItem);
    }
  }
}

function switchVape(index) {
  currentVapeIndex = index;
  updateVapeDisplay();
  renderVapeList();
}

function renderVapeList() {
  const vapeList = document.getElementById("vape-list");
  vapeList.innerHTML = "";
  vapes.forEach((vape, index) => {
    const vapeContainer = document.createElement("div");
    vapeContainer.className = "vape-container";

    const button = document.createElement("button");
    button.textContent = `${vape.name} ${vape.isEnded ? "(Ended)" : ""}`;
    button.onclick = () => switchVape(index);
    if (index === currentVapeIndex) {
      button.classList.add("active");
    }

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.onclick = () => deleteVape(index);

    vapeContainer.appendChild(button);
    vapeContainer.appendChild(deleteButton);
    vapeList.appendChild(vapeContainer);
  });

  const setDefaultButton = document.getElementById("set-default-button");
  if (setDefaultButton) {
    setDefaultButton.onclick = setAsDefault;
  }
}

// Event listener to load data and render the vape list once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  loadData();
  renderVapeList();
});
