'use client'

import {useEffect, useRef, useState} from 'react';
import Color from '../../utils/color.js';
import ActionTable from '../actionTable/actionTable';
import GameBoard from '../gameBoard/gameBoard.js';
import {useUserSession} from '../../utils/userSession.js'
import useTimer from '../../utils/timer.js';

import '../../styles/form.css';
import pixelatedStyles from './pixelated.module.css'
import axios from "axios";

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
    const [gameLost, setGameLost] = useState(false);
    const [gameId, setGameId] = useState(0);

    const activeGameBoard = useRef(0);
    const winnerAnimating = useRef(false);
    const moves = useRef([]);
    const minimumBoardSize = 5;
    const maximumBoardSize = 25;
    let actionTableBuilt = false;
    let rewinding = true;
    let currentMove = 0;
    let animationInterval;

    const sadFaceBoard = [
        [Color.colors[1], Color.colors[1], Color.colors[1], Color.colors[1], Color.colors[1], Color.colors[1], Color.colors[1], Color.colors[1], Color.colors[1], Color.colors[1]], // Top border
        [Color.colors[1], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[1]], // Border row
        [Color.colors[1], Color.colors[0], Color.colors[2], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[2], Color.colors[0], Color.colors[1]], // Eyes
        [Color.colors[1], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[1]], // Space between eyes and mouth
        [Color.colors[1], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[1]], // More space
        [Color.colors[1], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[3], Color.colors[3], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[1]], // Mouth curve
        [Color.colors[1], Color.colors[0], Color.colors[0], Color.colors[3], Color.colors[0], Color.colors[0], Color.colors[3], Color.colors[0], Color.colors[0], Color.colors[1]], // Mouth curve continued
        [Color.colors[1], Color.colors[0], Color.colors[3], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[3], Color.colors[0], Color.colors[1]], // Sad mouth
        [Color.colors[1], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[0], Color.colors[1]], // Bottom space
        [Color.colors[1], Color.colors[1], Color.colors[1], Color.colors[1], Color.colors[1], Color.colors[1], Color.colors[1], Color.colors[1], Color.colors[1], Color.colors[1]]  // Bottom border
    ];

    const {sessionId} = useUserSession();

    const {elapsedTime, startTimer, stopTimer, resetTimer} = useTimer();

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
        resetTimer();
        winnerAnimating.current = false;
        clearInterval(animationInterval);
        Color.initColorCounts();
        moves.current = [];
        setGameBoard([]);
        setGameBoard2([]);
        setErrorMessage('');
        setGameLost(false);

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
        startTimer();
        displayTable(newTable);
        recordGame(newTable, boardSize, sessionId());
    }

    // Calculate max moves when the board size or difficulty changes
    useEffect(() => {
        const difficultyMaxMultiplier = {
            easy: 2.2,
            medium: 1.9,
            hard: 1.5
        };

        let maximumMoves = calculateMaxMoves(boardSize);

        if (boardSize > 0 && difficulty)
            setMaxMoves(maximumMoves);

        function calculateMaxMoves(boardSize) {
            const boardSizeFactor = Math.ceil(Math.log2(boardSize));
            return Math.round(boardSize * difficultyMaxMultiplier[difficulty]) + boardSizeFactor;
        }

        if ((moves.current.length - 1) > maximumMoves) {
            stopTimer();
            setGameLost(true);
        } else
            setGameLost(false);

    }, [boardSize, difficulty, maxMoves, moves.current.length, stopTimer]);

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
                let randomColor = Color.getRandomColor();
                columns[c] = randomColor;
                Color.increaseColorCount(randomColor.name);
            }

            newTable[r] = columns;
        }

        return newTable;
    }

    function recordGame(board, boardSize, sessionId) {
        const simpleTable = cloneTableAsSimple(board);

        let gameData = {
            "userSessionToken": sessionId,
            "board": JSON.stringify(simpleTable),
            "boardSize": boardSize,
            "created": new Date().toISOString()
        };

        axios.post(`${process.env.REACT_APP_REGISTER_GAME_API}/Save`, gameData)
            .then(function (response) {
                setGameId(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function submitScore(sessionId) {
        let scoreData = {
            "userSessionToken": sessionId,
            "gameId": gameId.toString(),
            "maxMoves": maxMoves,
            "finishedMoves": moves.current.length,
            "elapsedTime": elapsedTime,
            "difficulty": difficulty
        };

        axios.post(`${process.env.REACT_APP_REGISTER_GAME_API}/Score`, scoreData)
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function cloneTableAsSimple(board) {
        let simpleBoard = [];

        for (let r = 0; r < board.length; r++) {
            for (let c = 0; c < board[r].length; c++) {
                simpleBoard.push(board[r][c].shortCode);
            }
        }

        return simpleBoard;
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
        if (selectedColor.name === gameColor.name || gameLost)
            return;

        floodFill(0, 0, gameColor, selectedColor);

        if (isBoardFilled()) {
            stopTimer();
            winnerAnimation();
            submitScore(sessionId());
        }

        setGameColor(selectedColor);

        let board;
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

        let board;

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
        <main>
            <div className="main-container">
                <header>
                    <h1>Pixelated</h1>
                </header>

                <section>
                    <div>
                        <label htmlFor="boardSize">Enter your desired board size (a number
                            from {minimumBoardSize} - {maximumBoardSize})</label><br/>
                        <input type="number" id="boardSize"/> &nbsp;
                        <button type="button" id="easyButton" onClick={handleEasyClick}>Easy</button>
                        &nbsp;
                        <button type="button" id="mediumButton" onClick={handleMediumClick}>Medium</button>
                        &nbsp;
                        <button type="button" id="hardButton" onClick={handleHardClick}>Hard</button>
                        &nbsp;
                    </div>

                    <div id="timer">{
                        elapsedTime > 0 && formatTime(elapsedTime)
                    }</div>

                    <div className="errorMessageContainer">
                        {errorMessage && (
                            <div className="errorMessage" id="errorMessage">{errorMessage}</div>
                        )}
                    </div>

                    {showActionTable && <ActionTable onActionClick={doMove}/>}

                    {showMaxMoves && showMoveCounter && (
                        <div className={pixelatedStyles.moveCounterContainer}>
                            <div id="maxMoves" className={pixelatedStyles.numberOfMoves}>Max Moves: {maxMoves}</div>
                            <div id="numberOfMoves" className={pixelatedStyles.numberOfMoves}>Number of
                                Moves: {moves.current.length - 1}</div>
                        </div>
                    )}
                </section>

                {gameLost && <GameBoard board={sadFaceBoard} numberOfColumns={10}/>}

                {activeGameBoard.current === 1 && !gameLost && <GameBoard board={gameBoard}
                                                                          numberOfColumns={boardSize}/>}

                {activeGameBoard.current === 2 && !gameLost && <GameBoard board={gameBoard2}
                                                                          numberOfColumns={boardSize}/>}
            </div>
        </main>
    )
}