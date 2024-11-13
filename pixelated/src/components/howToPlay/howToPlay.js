import { Link } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import '../../styles/buttonLink.css';
import './howToPlay.css';

function HowToPlay() {
    return (
        <>
            <Navbar />
            <hr />
            <main>
                <div id="how-to-play" class="main-container">
                    <header>
                        <h1 class="how-to-play-title">How to Play <em>Pixelated</em></h1>
                    </header>

                    <ul class="steps-container">
                        <li class="step">
                            <h3>Step 1: Start the Game</h3>
                            <p>Click the "Play" button to start a new game. The game board will be filled with random colors.</p>
                        </li>
                        <li class="step">
                            <h3>Step 2: Select a Color</h3>
                            <p>Choose a color to flood-fill starting from the top-left cell. This will change the connected cells to the selected color.</p>
                        </li>
                        <li class="step">
                            <h3>Step 3: Fill the Board</h3>
                            <p>Continue selecting colors until the entire board is filled with a single color. The game is won when all cells match.</p>
                        </li>
                        <li class="step">
                            <h3>Step 4: Enjoy your game</h3>
                            <p>Enjoy your game and try to beat your own best score!</p>
                        </li>
                    </ul>

                    <nav>
                        <ul>
                            <li><Link to="/play" className="button-link">Play Game</Link></li>
                        </ul>
                    </nav>
                </div>
            </main>
        </>
    )
}

export default HowToPlay