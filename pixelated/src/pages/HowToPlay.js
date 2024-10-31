import { Link } from 'react-router-dom';

function HowToPlay() {
    return (
        <>
            <hr />
            <section id="how-to-play">
                <h2>How to Play <em>Pixelated</em></h2>

                <p><strong>Objective:</strong><br />
                    Fill the entire board with a single color to win!</p>
                <br /><br />

                <h3>Setup:</h3>
                <p>At the start of each game, the board is randomly filled with colored cells.</p>
                <br /><br />

                <h3>Game Mechanics:</h3>
                <ol>
                    <li><strong>Board Layout:</strong><br />
                        The game board consists of a grid of cells, each filled with a random color.
                        Your goal is to change the color of the entire board until all cells match.
                    </li>
                    <li><strong>Making Moves:</strong><br />
                        Select a color from the action panel located below the board.
                        When you select a color, all the cells adjacent to the top-left corner of the board (starting point)
                        that match the current top-left cell’s color will change to your chosen color.
                        The colored area grows with each move as you continue matching adjacent cells.
                    </li>
                    <li><strong>Winning the Game:</strong><br />
                        You win once every cell on the board is filled with the same color.
                        Keep an eye on your moves and try to complete the board in as few steps as possible!
                    </li>
                </ol>
                <br /><br />

                <h3>Strategy Tips:</h3>
                <ul>
                    <li>Plan your moves ahead and look for ways to expand the colored area with fewer moves.</li>
                    <li>Larger clusters of the same color can help you clear the board faster.</li>
                </ul>

                <p>Enjoy your game and try to beat your own best score!</p>
                <br /><br /><br /><br />
                <nav>
                    <ul>
                        <li><Link to="/play">Play Game</Link></li>
                    </ul>
                </nav>
            </section>
        </>
    )
}

export default HowToPlay