import { NavLink } from 'react-router-dom';
import { useUserSession } from '../../utils/userSession'

import './navbar.css';

function Navbar() {
    const { isLoggedIn } = useUserSession();

    return (
        <nav className="navbar">
            <NavLink to="/" className="nav-link">How To Play</NavLink>

            {isLoggedIn() &&
                <>
                    <NavLink to="/play" className="nav-link">Play</NavLink>
                    <NavLink to="/signout" className="nav-link">Sign Out</NavLink>
                </>
            }

            {!isLoggedIn() &&
                <NavLink to="/login" className="nav-link">Login / Register</NavLink>
            }
        </nav>
    )
}

export default Navbar