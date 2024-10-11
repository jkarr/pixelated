import Color from './color.js';

let colors = [
    new Color("Yellow", "#FFFF00", "y", 0),
    new Color("Blue", "#0000FF", "b", 0),
    new Color("Red", "#FF0000", "r", 0),
    new Color("Green", "#008000", "g", 0)
];

let table = [];
let moves = [];

let numberOfRows = 0;
let numberOfColumns = 0;
let gameColor;
let actionTableBuilt = false;
let moveCounter = 0;
let cellCount = 0;
let winnerAnimating = false;

document.getElementById('playButton').addEventListener('click', function () {
    winnerAnimating = false;
    moves = [];
    table = [];
    document.getElementById("table").innerHTML = "";

    numberOfRows = document.getElementById('boardSize').value;
    numberOfColumns = document.getElementById('boardSize').value;

    buildTable();
    displayTable();

    if (!actionTableBuilt)
        buildActionTable();

    gameColor = table[0][0];
    cellCount = numberOfRows * numberOfColumns;
    moves.push(cloneTable());
});

function buildTable() {
    moveCounter = 0;

    for (let r = 0; r < numberOfRows; r++) {
        let columns = [];
        for (let c = 0; c < numberOfColumns; c++) {
            var randomColor = getRandomColor();
            columns[c] = randomColor;
            randomColor.usedCount++;
        }

        table[r] = columns;
    }
}

function buildActionTable() {
    let actionTable = document.getElementById("actionTable");

    for (let c = 0; c < colors.length; c++) {
        const colorDiv = createColoredCell(colors[c].hexValue, 'action-cell');

        colorDiv.addEventListener('click', function () {
            doMove(colors[c]);
        });

        actionTable.appendChild(colorDiv);
    }

    actionTableBuilt = true;
}

function displayTable(board) {
    if (board === undefined)
        board = table;

    let gameBoard = document.getElementById("table");
    gameBoard.innerHTML = "";

    gameBoard.style.gridTemplateColumns = `repeat(${numberOfColumns}, 25px)`;

    for (let r = 0; r < board.length; r++) {
        const gameRow = createRow();

        for (let c = 0; c < board[r].length; c++)
            gameRow.appendChild(createColoredCell(board[r][c].hexValue, 'game-cell'));

        gameBoard.appendChild(gameRow);
    }

    document.getElementById("moveCount").innerHTML = moveCounter;
}

function getRandomColor() {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    let randomIndex = array[0] % colors.length;

    return colors[randomIndex];
}

function doMove(selectedColor) {
    if (selectedColor === gameColor)
        return;

    floodFill(0, 0, gameColor, selectedColor);

    if (isBoardFilled())
        winnerAnimation();

    gameColor = selectedColor;

    moveCounter++;
    moves.push(cloneTable());
    displayTable();
}

function floodFill(row, col, targetColor, replacementColor) {
    if (row < 0 || row >= numberOfRows || col < 0 || col >= numberOfColumns)
        return;

    if (table[row][col] !== targetColor || table[row][col] === replacementColor)
        return;

    targetColor.usedCount--;
    replacementColor.usedCount++;
    table[row][col] = replacementColor;

    // Recursively call floodFill on all adjacent cells (up, down, left, right)
    floodFill(row + 1, col, targetColor, replacementColor);  // Down
    floodFill(row - 1, col, targetColor, replacementColor);  // Up
    floodFill(row, col + 1, targetColor, replacementColor);  // Right
    floodFill(row, col - 1, targetColor, replacementColor);  // Left

    return;
}

function isBoardFilled() {
    for (let c = 0; c < colors.length; c++) {
        if (colors[c].usedCount === 0)
            continue;

        if (colors[c].usedCount < cellCount)
            return false;

        if (colors[c].usedCount == cellCount)
            return true;

        return false;
    }
}

function createRow() {
    const row = document.createElement("div");
    row.className = 'flex-row';

    return row;
}

function createColoredCell(backgroundColor, className) {
    const colorDiv = document.createElement("div");
    colorDiv.className = className;
    colorDiv.style.backgroundColor = backgroundColor;

    return colorDiv;
}

function cloneTable() {
    return table.map(row => row.map(color => color.clone()));
}

async function winnerAnimation() {
    winnerAnimating = true;
    while (winnerAnimating) {
        await rewindBoard(winnerAnimating); // Run rewind
        if (!winnerAnimating) {
            break;  // Exit if animation stopped
        }

        await playBoard(winnerAnimating); // Run play

        if (!winnerAnimating)
            break;  // Exit if animation stopped
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function rewindBoard(winnerAnimating) {
    for (let m = moves.length - 1; m >= 0; m--) {
        if (!winnerAnimating) 
            return;

        displayTable(moves[m]);
        await delay(100);
    }
}

async function playBoard(winnerAnimating) {
    for (let m = 0; m < moves.length; m++) {
        if (!winnerAnimating) 
            return;

        displayTable(moves[m]);
        await delay(100);
    }
}