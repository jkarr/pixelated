import { NavLink } from 'react-router-dom';
import './navbar.css';

function Navbar() {
    return (
        <nav className="navbar">
            <NavLink to="/" className="nav-link">How To Play</NavLink>
            <NavLink to="/play" className="nav-link">Play</NavLink>
        </nav>
    )
}

export default Navbar