import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useUserSession } from '../../utils/userSession.js'

const Signout = () => {
    const { signOut } = useUserSession();
    const navigate = useNavigate();

    useEffect(() => {
        signOut();
        navigate('/');
    });
};

export default Signout