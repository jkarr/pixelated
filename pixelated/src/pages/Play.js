import Navbar from '../components/navbar/navbar.js'
import Pixelated from '../components/pixelated/pixelated.js'
import { useNavigate } from 'react-router-dom'
import { useUserSession } from '../utils/userSession.js'
import { useEffect } from 'react'

const Play = () => {
    const { isLoggedIn } = useUserSession();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn())
            navigate('/login');
    });

    return (
        <>
            <Navbar />
            <hr />
            <Pixelated />
        </>
    )
}

export default Play