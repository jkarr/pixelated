import Color from './color.js';

const colors = [
    new Color("Yellow", "#FFFF00", "y"),
    new Color("Blue", "#0000FF", "b"),
    new Color("Red", "#FF0000", "r"),
    new Color("Green", "#008000", "g")
];

let table = [];

let numberOfRows = 0;
let numberOfColumns = 0;
let startingCell;
let actionTableBuilt = false;

document.getElementById('playButton').addEventListener('click', function () {
    table = [];
    document.getElementById("table").innerHTML = "";

    numberOfRows = document.getElementById('numberOfRows').value;
    numberOfColumns = document.getElementById('numberOfColumns').value;

    buildTable();
    displayTable();

    if (!actionTableBuilt)
        buildActionTable();

    startingCell = table[0][0];
});

function buildTable() {
    for (let r = 0; r < numberOfRows; r++) {
        let columns = [];
        for (let c = 0; c < numberOfColumns; c++) {
            columns[c] = getRandomColor();
        }

        table[r] = columns;
    }
}

function buildActionTable() {
    let actionTable = document.getElementById("actionTable");

    for (let c = 0; c < colors.length; c++) {
        const colorDiv = createColoredCell(colors[c].hexValue);

        colorDiv.addEventListener('click', function () {
            doMove(colors[c]);
        });

        actionTable.appendChild(colorDiv);
    }

    actionTableBuilt = true;
}

function displayTable() {
    let gameBoard = document.getElementById("table");
    gameBoard.innerHTML = "";
    
    for (let r = 0; r < table.length; r++) {
        const gameRow = createRow();

        for (let c = 0; c < table[r].length; c++)
            gameRow.appendChild(createColoredCell(table[r][c].hexValue));

        gameBoard.appendChild(gameRow);
    }
}

function getRandomColor() {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    let randomIndex = array[0] % colors.length;

    return colors[randomIndex];
}

function doMove(color) {
    console.log(color);
}

function createRow() {
    const row = document.createElement("div");
    row.className = 'flex-row';

    return row;
}

function createColoredCell(backgroundColor) {
    const colorDiv = document.createElement("div");
    colorDiv.className = 'flex-cell';
    colorDiv.style.backgroundColor = backgroundColor;

    return colorDiv;
}