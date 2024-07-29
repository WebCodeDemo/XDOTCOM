// Game state
let playerUnits = [];
let enemyUnits = [];
let currentTurn = 'player';
let selectedAction = null;

// Initialize game
function initGame() {
    // Create player units
    for (let i = 0; i < 2; i++) {
        playerUnits.push({ health: 100, cover: 3 });
    }
    // Create enemy units
    for (let i = 0; i < 3; i++) {
        enemyUnits.push({ health: 100, cover: 3 });
    }
    updateUI();
}

// Update the UI
function updateUI() {
    document.getElementById('player-units').innerHTML = playerUnits.map((unit, index) => createUnitHTML(unit, index, 'player')).join('');
    document.getElementById('enemy-units').innerHTML = enemyUnits.map((unit, index) => createUnitHTML(unit, index, 'enemy')).join('');
    attachUnitListeners();
}

// Create HTML for a unit
function createUnitHTML(unit, index, type) {
    return `
        <div class="unit ${type}-unit" data-index="${index}">
            <div>Health: ${unit.health}</div>
            <div class="health-bar" style="width: ${unit.health}%;"></div>
            <div>Cover: ${unit.cover}</div>
            <div class="cover-bar" style="width: ${unit.cover * 33.33}%;"></div>
        </div>
    `;
}

// Attach click listeners to units
function attachUnitListeners() {
    document.querySelectorAll('.enemy-unit').forEach(unit => {
        unit.addEventListener('click', () => handleUnitClick('enemy', unit.dataset.index));
    });
    document.querySelectorAll('.player-unit').forEach(unit => {
        unit.addEventListener('click', () => handleUnitClick('player', unit.dataset.index));
    });
}

// Handle unit click
function handleUnitClick(unitType, index) {
    if (currentTurn !== 'player' || !selectedAction) return;

    if (selectedAction === 'attack' && unitType === 'enemy') {
        attackUnit(index);
    } else if ((selectedAction === 'heal' || selectedAction === 'cover') && unitType === 'player') {
        if (selectedAction === 'heal') {
            healUnit(index);
        } else {
            addCoverToUnit(index);
        }
    } else {
        log("Invalid target. Please select a valid unit.");
    }
}

// Set selected action
function setSelectedAction(action) {
    selectedAction = action;
    log(`Selected action: ${action}. Click on a ${action === 'attack' ? 'enemy' : 'player'} unit.`);
}

// Handle attack action
function attackUnit(targetIndex) {
    const target = enemyUnits[targetIndex];
    if (target.cover > 0) {
        target.cover--;
        log(`Player attacked enemy ${targetIndex}. Cover reduced to ${target.cover}.`);
    } else {
        target.health -= 20;
        log(`Player attacked enemy ${targetIndex}. Health reduced to ${target.health}.`);
    }
    endTurn();
}

// Handle heal action
function healUnit(targetIndex) {
    const target = playerUnits[targetIndex];
    target.health = Math.min(target.health + 10, 100);
    log(`Healed player unit ${targetIndex}. Health increased to ${target.health}.`);
    endTurn();
}

// Handle add cover action
function addCoverToUnit(targetIndex) {
    const target = playerUnits[targetIndex];
    target.cover = Math.min(target.cover + 1, 5);
    log(`Added cover to player unit ${targetIndex}. Cover increased to ${target.cover}.`);
    endTurn();
}

// End player's turn and start enemy's turn
function endTurn() {
    currentTurn = 'enemy';
    selectedAction = null;
    updateUI();
    setTimeout(enemyTurn, 1000);
}

// Enemy's turn
function enemyTurn() {
    const targetIndex = Math.floor(Math.random() * playerUnits.length);
    const target = playerUnits[targetIndex];
    if (target.cover > 0) {
        target.cover--;
        log(`Enemy attacked player ${targetIndex}. Cover reduced to ${target.cover}.`);
    } else {
        target.health -= 20;
        log(`Enemy attacked player ${targetIndex}. Health reduced to ${target.health}.`);
    }
    currentTurn = 'player';
    updateUI();
    checkGameOver();
}

// Check if the game is over
function checkGameOver() {
    if (playerUnits.every(unit => unit.health <= 0)) {
        alert("Game Over! You lost.");
        initGame();
    } else if (enemyUnits.every(unit => unit.health <= 0)) {
        alert("Congratulations! You won!");
        initGame();
    }
}

// Log messages
function log(message) {
    const logElement = document.getElementById('message-log');
    logElement.innerHTML += `<div>${message}</div>`;
    logElement.scrollTop = logElement.scrollHeight;
}

// Event listeners
document.getElementById('attack-btn').addEventListener('click', () => setSelectedAction('attack'));
document.getElementById('heal-btn').addEventListener('click', () => setSelectedAction('heal'));
document.getElementById('cover-btn').addEventListener('click', () => setSelectedAction('cover'));

// Initialize the game
initGame();