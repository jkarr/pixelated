const colors = [
    "#FFFF00",  // Yellow
    "#0000FF",  // Blue
    "#FF0000",  // Red
    "#008000"   // Green
];

let numberOfRows = 0;
let numberOfColumns = 0;

let table = [];

document.getElementById('playButton').addEventListener('click', function() {
    numberOfRows = document.getElementById('numberOfRows').value;
    numberOfColumns = document.getElementById('numberOfColumns').value;

    buildTable();
    displayTable();
});

function buildTable() {
    for (let r = 0; r < numberOfRows; r++) {
        let columns = [];
        for (let c = 0; c < numberOfColumns; c++)
            columns[c] = r + ":" + c;

        table[r] = columns;
    }
}

function displayTable() {
    let html = ""

    for (let r = 0; r < table.length; r++) {
        html += '<div class="flex-row">';
        
        for (let c = 0; c < table[r].length; c++)
            html += '<div class="flex-cell" style="background-color: ' + getRandomColor() + '"></div>';

        html += "</div>"
    }

    document.getElementById("table").innerHTML = html;

}

// function displayTable() {
//     let html = "<table>";

//     for (let r = 0; r < table.length; r++)
//     {
//         html += "<tr>";
//         for (let c = 0; c < table[r].length; c++)
//             html += '<td class="cell" style="background-color: ' + getRandomColor() + ';">' + '</td>';

//         html += "</tr>";
//     }

//     html += "</table>";

//     document.getElementById("table").innerHTML = html;
// }

function getRandomColor() {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    randomIndex = array[0] % colors.length;

    return colors[randomIndex];
}