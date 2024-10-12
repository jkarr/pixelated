'use client'

import { useEffect, useState } from 'react';
import Color from './color.js';
import ActionTable from './components/actionTable/actionTable.js';
import GameBoard from './components/gameBoard/gameBoard.js';

import styles from "./css/page.module.css";
import game from "./css/pixelated.module.css";
import "./css/page.form.css";

export default function Pixelated() {
    const [showActionTable, setShowActionTable] = useState(false);
    const [showGameBoard, setShowGameBoard] = useState(false);
    const [showMoveCounter, setShowMoveCounter] = useState(false);
    const [table, setTable] = useState([]);
    const [numberOfRows, setNumberOfRows] = useState(0);
    const [numberOfColumns, setNumberOfColumns] = useState(0);
    const [moves, setMoves] = useState([]); 
    const [gameBoard, setGameBoard] = useState([]);
    const [gameColor, setGameColor] = useState(new Color("", "", "", 0));
    const [cellCount, setCellCount] = useState(0)



    let actionTableBuilt = false;
    let winnerAnimating = false;

    useEffect(() => {
        const playButton = document.getElementById('playButton');

        if (playButton) {
            playButton.addEventListener('click', function () {
                winnerAnimating = false;
                Color.initColorCounts();
                setMoves([]);
                setTable([]);

                const boardSize = document.getElementById('boardSize').value;
                setNumberOfColumns(boardSize);
                setNumberOfRows(boardSize);

                const newTable = buildTable(boardSize, boardSize);
                setTable(newTable);

                if (!actionTableBuilt)
                    buildActionTable();

                setGameColor(newTable[0][0]);
                setCellCount(boardSize * boardSize);
                setMoves([cloneTable(newTable)]);

                displayTable(newTable);
                setShowMoveCounter(true);
            });
        }

        return () => {
            if (playButton) {
                playButton.removeEventListener('click', null);
            }
        };
    }, []);

    function buildTable(rows, cells) {
        const newTable = [];

        for (let r = 0; r < rows; r++) {
            let columns = [];
            for (let c = 0; c < cells; c++) {
                var randomColor = getRandomColor();
                columns[c] = randomColor;
                Color.increaseColorCount(randomColor.name);
            }

            newTable[r] = columns;
        }

        console.log(Color.colors);

        return newTable;
    }

    function buildActionTable() {
        setShowActionTable(true);
        actionTableBuilt = true;
    }

    function displayTable(board) {
        setGameBoard(board);
        setShowGameBoard(true);
    }

    function getRandomColor() {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        let randomIndex = array[0] % Color.colors.length;

        return Color.colors[randomIndex];
    }

    function doMove(selectedColor) {
        console.log(Color.colors);
        console.log(selectedColor);
        console.log(gameColor);

        if (selectedColor.name === gameColor.name)
            return;

        floodFill(0, 0, gameColor, selectedColor);

        if (isBoardFilled())
            winnerAnimation();

        setGameColor(selectedColor);

        const clonedTable = cloneTable(gameBoard);
        moves.push(clonedTable);
        displayTable(clonedTable);
    }

    function floodFill(row, col, targetColor, replacementColor) {
        if (row < 0 || row >= numberOfRows || col < 0 || col >= numberOfColumns)
            return;

        if (gameBoard[row][col].name !== targetColor.name || gameBoard[row][col].name === replacementColor.name)
            return;

        Color.decreaseColorCount(targetColor.name);
        Color.increaseColorCount(replacementColor.name);
        console.log(Color.colorCounts);

        gameBoard[row][col] = replacementColor;

        // Recursively call floodFill on all adjacent cells (up, down, left, right)
        floodFill(row + 1, col, targetColor, replacementColor);  // Down
        floodFill(row - 1, col, targetColor, replacementColor);  // Up
        floodFill(row, col + 1, targetColor, replacementColor);  // Right
        floodFill(row, col - 1, targetColor, replacementColor);  // Left

        return;
    }

    function isBoardFilled() {
        console.log(Color.colors);
        for (let c = 0; c < Color.colors.length; c++) {
            if (Color.colorCounts[Color.colors[c].name] === 0)
                continue;

            if (Color.colorCounts[Color.colors[c].name] < cellCount)
                return false;

            if (Color.colorCounts[Color.colors[c].name] == cellCount)
                return true;

            return false;
        }
    }

    function cloneTable(table) {
        const newTable = [];
        const numRows = table.length;

        for (let r = 0; r < numRows; r++) {
            const row = [];
            const numCols = table[r].length;

            for (let c = 0; c < numCols; c++) {
                row[c] = table[r][c].clone();
            }

            newTable[r] = row;
        }

        return newTable;
    }

    async function winnerAnimation() {
        console.log("winner")
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

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className={game.gameContainer}>
                    <header>
                        <h1>Pixelated</h1>
                    </header>

                    <section>
                        <div>
                            <label htmlFor="boardSize">Enter your desired board size (a number from 2 - 25)</label>
                            <input type="number" id="boardSize" min="2" max="25" />
                        </div>

                        <button type="button" id="playButton">Play</button>
                        {showActionTable && <ActionTable onActionClick={doMove} />}
                        {showMoveCounter && 
                        <div id="numberOfMoves">Number of Moves: {moves.length - 1}</div>}
                    </section>

                    <div>Game Color: {gameColor.name}</div>

                    {showGameBoard && <GameBoard board={gameBoard} 
                                                numberOfColumns={numberOfColumns} />}
                </div>

            </main>
        </div>
    )
}

