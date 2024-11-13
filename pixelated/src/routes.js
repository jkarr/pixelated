import App from './App'
import Play from './pages/Play'
import Login from './components/authentication/login'
import Register from './components/authentication/register'
import Signout from './components/authentication/signout'

const routes = [
    {
        path: '/',
        element: <App />
    },
    {
        path: '/play',
        element: <Play />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/signout',
        element: <Signout />
    }
];

export default routes;