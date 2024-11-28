'use client'

import {useEffect, useRef, useState} from 'react';
import Color from '../../utils/color.js';
import ActionTable from '../actionTable/actionTable';
import GameBoard from '../gameBoard/gameBoard.js';

import styles from '../../App.css';
import '../../styles/form.css';
import pixelatedStyles from './pixelated.module.css'

export default function Pixelated() {
    const [showActionTable, setShowActionTable] = useState(false);
    const [showMoveCounter, setShowMoveCounter] = useState(false);
    const [showMaxMoves, setShowMaxMoves] = useState(false);
    const [maxMoves, setMaxMoves] = useState(0);
    const [difficulty, setDifficulty] = useState('easy');
    const [gameBoard, setGameBoard] = useState([]);
    const [gameBoard2, setGameBoard2] = useState([]);
    const [gameColor, setGameColor] = useState(new Color("", "", "", 0));
    const [cellCount, setCellCount] = useState(0);
    const [boardSize, setBoardSize] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

    const activeGameBoard = useRef(0);
    const winnerAnimating = useRef(false);
    const moves = useRef([]);
    const minimumBoardSize = 5;
    const maximumBoardSize = 25;
    let actionTableBuilt = false;
    let rewinding = true;
    let currentMove = 0;
    let animationInterval;

    const handleEasyClick = () => {
        setDifficulty('easy');
        handlePlayClick();
    }

    const handleMediumClick = () => {
        setDifficulty('medium');
        handlePlayClick();
    }

    const handleHardClick = () => {
        setDifficulty('hard');
        handlePlayClick();
    }

    const handlePlayClick = () => {
        winnerAnimating.current = false;
        clearInterval(animationInterval);
        Color.initColorCounts();
        moves.current = [];
        setGameBoard([]);
        setGameBoard2([]);
        setErrorMessage('');
        // setMaxMoves(0);

        if (activeGameBoard.current === 1)
            activeGameBoard.current = 2;
        else
            activeGameBoard.current = 1;

        if (!validateGameSetup())
            return;

        const size = document.getElementById('boardSize').value;
        setBoardSize(size);
        const newTable = buildTable(size);

        if (!actionTableBuilt)
            buildActionTable();

        setGameColor(newTable[0][0]);
        setCellCount(size * size);
        moves.current = [cloneTable(newTable)];

        setShowMoveCounter(true);
        setShowMaxMoves(true);
        displayTable(newTable);
    }

    // Calculate max moves when the board size or difficulty changes
    useEffect(() => {
        const difficultyMaxMultiplier = {
            easy: 2.2,
            medium: 1.9,
            hard: 1.5
        };

        if (boardSize > 0 && difficulty)
                setMaxMoves(calculateMaxMoves(boardSize));

        function calculateMaxMoves(boardSize) {
            const boardSizeFactor = Math.ceil(Math.log2(boardSize));
            return Math.round(boardSize * difficultyMaxMultiplier[difficulty]) + boardSizeFactor;
        }
    }, [boardSize, difficulty]);

    function validateGameSetup() {
        let size = document.getElementById('boardSize').value;

        if (size < minimumBoardSize || size > maximumBoardSize) {
            setErrorMessage('Board size should be between 5 and 25.');
            return false;
        }

        return true;
    }

    function buildTable(boardSize) {
        const newTable = [];

        for (let r = 0; r < boardSize; r++) {
            let columns = [];
            for (let c = 0; c < boardSize; c++) {
                var randomColor = Color.getRandomColor();
                columns[c] = randomColor;
                Color.increaseColorCount(randomColor.name);
            }

            newTable[r] = columns;
        }

        return newTable;
    }

    function buildActionTable() {
        setShowActionTable(true);
        actionTableBuilt = true;
    }

    function displayTable(board) {
        if (activeGameBoard.current === 1)
            setGameBoard(board);
        else
            setGameBoard2(board);
    }

    function doMove(selectedColor) {
        if (selectedColor.name === gameColor.name)
            return;

        floodFill(0, 0, gameColor, selectedColor);

        if (isBoardFilled())
            winnerAnimation();

        setGameColor(selectedColor);

        let board = [];
        if (activeGameBoard.current === 1)
            board = cloneTable(gameBoard);
        else
            board = cloneTable(gameBoard2);

        moves.current.push(board);
        displayTable(board);
    }

    function floodFill(row, col, targetColor, replacementColor) {
        if (row < 0 || row >= boardSize || col < 0 || col >= boardSize)
            return;

        let board = [];

        if (activeGameBoard.current === 1)
            board = gameBoard;
        else
            board = gameBoard2;

        if (board[row][col].name !== targetColor.name || board[row][col].name === replacementColor.name)
            return;

        Color.decreaseColorCount(targetColor.name);
        Color.increaseColorCount(replacementColor.name);

        board[row][col] = replacementColor;

        // Recursively call floodFill on all adjacent cells (up, down, left, right)
        floodFill(row + 1, col, targetColor, replacementColor);  // Down
        floodFill(row - 1, col, targetColor, replacementColor);  // Up
        floodFill(row, col + 1, targetColor, replacementColor);  // Right
        floodFill(row, col - 1, targetColor, replacementColor);  // Left

        return;
    }

    function isBoardFilled() {
        for (let c = 0; c < Color.colors.length; c++) {
            if (Color.colorCounts[Color.colors[c].name] === 0)
                continue;

            if (Color.colorCounts[Color.colors[c].name] < cellCount)
                return false;

            return Color.colorCounts[Color.colors[c].name] === cellCount;
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

    function winnerAnimation() {
        winnerAnimating.current = true;

        animationInterval = setInterval(() => {
            if (rewinding) {
                if (currentMove < 0) {
                    rewinding = false;
                    currentMove = 0;
                } else {
                    rewindBoardStep();
                    currentMove--;
                }
            } else {
                if (currentMove >= moves.current.length) {
                    rewinding = true;
                    currentMove = moves.current.length - 1;
                } else {
                    playBoardStep();
                    currentMove++;
                }
            }

            if (!winnerAnimating.current) {
                clearInterval(animationInterval);
            }
        }, 100);
    }

    function rewindBoardStep() {
        if (currentMove >= 0 && currentMove < moves.current.length) {
            displayTable(moves.current[currentMove]);
        }
    }

    function playBoardStep() {
        if (currentMove >= 0 && currentMove < moves.current.length) {
            displayTable(moves.current[currentMove]);
        }
    }

    return (
        <main className={styles.main}>
            <div className="main-container">
                <header>
                    <h1>Pixelated</h1>
                </header>

                <section>
                    <div>
                        <label htmlFor="boardSize">Enter your desired board size (a number
                            from {minimumBoardSize} - {maximumBoardSize})</label><br/>
                        <input type="number" id="boardSize"/> &nbsp;
                        <button type="button" id="easyButton" onClick={handleEasyClick}>Easy</button>&nbsp;
                        <button type="button" id="mediumButton" onClick={handleMediumClick}>Medium</button>&nbsp;
                        <button type="button" id="hardButton" onClick={handleHardClick}>Hard</button>&nbsp;
                        {/*<button type="button" id="playButton" onClick={handlePlayClick}>Play</button>*/}
                    </div>

                    <div className="errorMessageContainer">
                        {errorMessage && (
                            <div className="errorMessage" id="errorMessage">{errorMessage}</div>
                        )}
                    </div>

                    {showActionTable && <ActionTable onActionClick={doMove}/>}

                    {showMaxMoves && showMoveCounter && (
                        <div className={pixelatedStyles.moveCounterContainer}>
                            <div id="maxMoves" className={pixelatedStyles.numberOfMoves}>Max Moves: {maxMoves}</div>
                            <div id="numberOfMoves" className={pixelatedStyles.numberOfMoves}>Number of Moves: {moves.current.length - 1}</div>
                        </div>
                    )}
                </section>

                {activeGameBoard.current === 1 && <GameBoard board={gameBoard}
                                                             numberOfColumns={boardSize}/>}

                {activeGameBoard.current === 2 && <GameBoard board={gameBoard2}
                                                             numberOfColumns={boardSize}/>}
            </div>
        </main>
    )
}