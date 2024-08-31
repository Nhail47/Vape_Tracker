let vapes = [];
let currentVapeIndex = -1;

// Function to log the usage of a particular vape level
function logUsage(level) {
    if (currentVapeIndex === -1) {
        alert('Please create or select a vape first.');
        return;
    }

    const currentVape = vapes[currentVapeIndex];

    // Ensure the logged level is not higher than the current level
    if (level > currentVape.currentLevel) {
        alert('Invalid action. You cannot log a higher level.');
        return;
    }

    // Update the usage history list in the UI
    const historyList = document.getElementById('history-list');
    const listItem = document.createElement('li');
    const timestamp = new Date().toLocaleString();
    listItem.textContent = `Used Level ${level} at ${timestamp}`;
    historyList.appendChild(listItem);

    // Update the current level and save the history
    currentVape.currentLevel = level;
    document.getElementById('level-display').textContent = `${currentVape.name} - Level ${currentVape.currentLevel}`;
    currentVape.history.push(listItem.textContent);
    saveData();  // Save updated data to localStorage
}

// Function to create a new vape and set its initial level
function createNewVape() {
    const name = prompt('Enter a name for your vape:');
    if (!name) {
        alert('Vape creation canceled. Name is required.');
        return;
    }

    const initialLevelSelect = document.getElementById('initial-level');
    const initialLevel = parseInt(initialLevelSelect.value);

    // Create a new vape object
    const newVape = {
        id: Date.now(),
        name: name,
        initialLevel: initialLevel,
        currentLevel: initialLevel,
        history: [],
        isEnded: false
    };

    // Add the new vape to the list and set it as the current vape
    vapes.push(newVape);
    currentVapeIndex = vapes.length - 1;
    updateVapeDisplay();  // Update the UI to reflect the new vape
    renderVapeList();  // Refresh the list of vapes in the UI
    saveData();  // Save the new vape to localStorage

    alert(`New vape "${name}" created with initial level ${initialLevel}`);

    // Automatically log level 6 if it's the initial level
    if (initialLevel === 6) {
        logUsage(6);
    }
}


// Function to reset the current vape to level 6 and clear its history
function resetVape() {
    if (currentVapeIndex === -1) {
        alert('Please create or select a vape first.');
        return;
    }

    const currentVape = vapes[currentVapeIndex];
    currentVape.currentLevel = 6;  // Reset to level 6
    document.getElementById('level-display').textContent = `${currentVape.name} - Level ${currentVape.currentLevel}`;
    currentVape.history = [];  // Clear the history
    document.getElementById('history-list').innerHTML = '';
    saveData();  // Save the reset data to localStorage
    alert('Vape reset to level 6');
}

// Function to delete a specific vape
function deleteVape(index) {
    if (confirm('Are you sure you want to delete this vape?')) {
        vapes.splice(index, 1);  // Remove the vape from the list
        if (vapes.length === 0) {
            currentVapeIndex = -1;  // If no vapes are left, reset the index
            document.getElementById('level-display').textContent = '';
            document.getElementById('history-list').innerHTML = '';
        } else {
            currentVapeIndex = Math.max(0, currentVapeIndex - 1);  // Update the current vape index
        }
        renderVapeList();  // Refresh the vape list in the UI
        updateVapeDisplay();  // Update the display to reflect changes
        saveData();  // Save changes to localStorage
    }
}

// Function to "end" a vape
function endVape() {
    if (currentVapeIndex === -1) {
        alert('Please create or select a vape first.');
        return;
    }

    const currentVape = vapes[currentVapeIndex];
    currentVape.isEnded = true;  // Mark the vape as ended
    updateVapeDisplay();
    renderVapeList();
    saveData();
    alert('Vape has been ended.');
}

// Function to save the vapes array to localStorage
function saveData() {
    localStorage.setItem('vapeData', JSON.stringify(vapes));
}

// Function to load the vapes array from localStorage
function loadData() {
    const data = localStorage.getItem('vapeData');
    if (data) {
        vapes = JSON.parse(data);  // Parse the JSON data into the vapes array
        if (vapes.length > 0) {
            currentVapeIndex = 0;  // Set the first vape as the current vape
            updateVapeDisplay();  // Update the display to show the current vape
            renderVapeList();  // Render the list of vapes
        }
    }
}

// Function to update the vape display UI with the current vape's information
function updateVapeDisplay() {
    if (currentVapeIndex === -1) return;

    const currentVape = vapes[currentVapeIndex];
    const levelDisplay = document.getElementById('level-display');
    const historyList = document.getElementById('history-list');

    if (currentVape.isEnded) {
        levelDisplay.textContent = `${currentVape.name} - Vape Ended`;
        historyList.innerHTML = `<li>This vape has ended.</li>`;
    } else {
        levelDisplay.textContent = `${currentVape.name} - Level ${currentVape.currentLevel}`;
        historyList.innerHTML = '';
        for (let item of currentVape.history) {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            historyList.appendChild(listItem);
        }
    }
}

// Function to switch the current vape to another vape in the list
function switchVape(index) {
    currentVapeIndex = index;
    updateVapeDisplay();  // Update the display to show the selected vape
    renderVapeList();  // Refresh the vape list to highlight the selected vape
}

// Function to render the list of vapes and their respective buttons in the UI
function renderVapeList() {
    const vapeList = document.getElementById('vape-list');
    vapeList.innerHTML = '';
    vapes.forEach((vape, index) => {
        const vapeContainer = document.createElement('div');
        vapeContainer.className = 'vape-container';

        const button = document.createElement('button');
        button.textContent = `${vape.name} ${vape.isEnded ? '(Ended)' : ''}`;
        button.onclick = () => switchVape(index);
        if (index === currentVapeIndex) {
            button.classList.add('active');
        }

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.onclick = () => deleteVape(index);

        vapeContainer.appendChild(button);
        vapeContainer.appendChild(deleteButton);
        vapeList.appendChild(vapeContainer);
    });
}

// Event listener to load data and render the vape list once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    loadData();  // Load saved data from localStorage
    renderVapeList();  // Render the list of vapes in the UI
});
