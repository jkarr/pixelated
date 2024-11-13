import { useLocalStorage } from './useLocalStorage'

export function useUserSession() {
    const [userSession, setUserSession, keyExists, deleteKey] = useLocalStorage('Pixelated.UserSession', '');

    const isLoggedIn = () => {
        if (!keyExists())
            return false;

        const currentTime = new Date();
        const expiresTime = new Date(userSession.expires);

        return currentTime < expiresTime;
    };

    const signOut = () => {
        deleteKey();
    }

    return { userSession, setUserSession, isLoggedIn, signOut };
}