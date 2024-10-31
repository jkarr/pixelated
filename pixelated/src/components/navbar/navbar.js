import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <div>
            <Link to="/">How To Play</Link> | 
            <Link to="/play">Play</Link>
        </div>
    )
}

export default Navbar