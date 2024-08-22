let vapes = [];
let currentVapeIndex = -1;

function logUsage(level) {
    if (currentVapeIndex === -1) {
        alert('Please create or select a vape first.');
        return;
    }

    const currentVape = vapes[currentVapeIndex];

    if (level > currentVape.currentLevel) {
        alert('Invalid action. You cannot log a higher level.');
        return;
    }

    const historyList = document.getElementById('history-list');
    const listItem = document.createElement('li');
    const timestamp = new Date().toLocaleString();
    listItem.textContent = `Used Level ${level} at ${timestamp}`;
    historyList.appendChild(listItem);

    currentVape.currentLevel = level;
    document.getElementById('level-display').textContent = `Level ${currentVape.currentLevel}`;
    currentVape.history.push(listItem.textContent);
    saveData();
}

function createNewVape() {
    const initialLevelSelect = document.getElementById('initial-level');
    const initialLevel = parseInt(initialLevelSelect.value);
    const newVape = {
        id: Date.now(),
        initialLevel: initialLevel,
        currentLevel: initialLevel,
        history: []
    };

    vapes.push(newVape);
    currentVapeIndex = vapes.length - 1;
    updateVapeDisplay();
    renderVapeList();
    saveData();
    alert('New vape created with initial level ' + initialLevel);
}

function resetVape() {
    if (currentVapeIndex === -1) {
        alert('Please create or select a vape first.');
        return;
    }

    const currentVape = vapes[currentVapeIndex];
    currentVape.currentLevel = 6;  // Reset to level 6
    document.getElementById('level-display').textContent = `Level ${currentVape.currentLevel}`;
    currentVape.history = [];  // Clear the history
    document.getElementById('history-list').innerHTML = '';
    saveData();
    alert('Vape reset to level 6');
}

function deleteVape(index) {
    if (confirm('Are you sure you want to delete this vape?')) {
        vapes.splice(index, 1);
        if (vapes.length === 0) {
            currentVapeIndex = -1;
            document.getElementById('level-display').textContent = '';
            document.getElementById('history-list').innerHTML = '';
        } else {
            currentVapeIndex = Math.max(0, currentVapeIndex - 1);
        }
        renderVapeList();
        updateVapeDisplay();
        saveData();
    }
}

function saveData() {
    localStorage.setItem('vapeData', JSON.stringify(vapes));
}

function loadData() {
    const data = localStorage.getItem('vapeData');
    if (data) {
        vapes = JSON.parse(data);
        if (vapes.length > 0) {
            currentVapeIndex = 0;
            updateVapeDisplay();
            renderVapeList();
        }
    }
}

function updateVapeDisplay() {
    if (currentVapeIndex === -1) return;

    const currentVape = vapes[currentVapeIndex];
    document.getElementById('level-display').textContent = `Level ${currentVape.currentLevel}`;

    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    for (let item of currentVape.history) {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        historyList.appendChild(listItem);
    }
}

function switchVape(index) {
    currentVapeIndex = index;
    updateVapeDisplay();
    renderVapeList();
}

function renderVapeList() {
    const vapeList = document.getElementById('vape-list');
    vapeList.innerHTML = '';
    vapes.forEach((vape, index) => {
        const vapeContainer = document.createElement('div');
        vapeContainer.className = 'vape-container';

        const button = document.createElement('button');
        button.textContent = `Vape ${index + 1}`;
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

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderVapeList();
});
