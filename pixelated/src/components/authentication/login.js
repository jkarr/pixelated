import Navbar from "../navbar/navbar.js";
import { useState } from 'react'
import axios from 'axios'

import '../../styles/form.css';
import { NavLink, useNavigate } from 'react-router-dom';
import Field from "../form/field.js";
import { useUserSession } from '../../utils/userSession.js'

const Login = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const { setUserSession} = useUserSession();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setErrorMessage('');

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        axios.post(`${process.env.REACT_APP_REGISTER_USER_API}/Authenticate`, formData)
            .then(function (response) {
                console.log(response.data);
                setUserSession(response.data);
                navigate('/play');
            })
            .catch(function (error) {
                if (error.response) {
                    switch (error.response.status) {
                        case 401:
                            setErrorMessage("Either the email or password you provided is incorrect.");
                            break;
                        case 406:
                            setErrorMessage(error.response.data);
                            break;
                        default:
                            break;
                    }
                } else if (error.request) {
                    setErrorMessage("There was a problem reaching the server. Please try again later.");
                }
            });
    };

    const handleGuest = () => {
      const now = new Date();
      now.setHours(now.getHours() + 1);

        const guestSession = {
          "token": "guestToken",
          "expires": now
      };

      setUserSession(guestSession);
      navigate('/play');
    };

    return (
        <>
            <Navbar />
            <hr />
            <main>
                <div className="main-container">
                    <h1>Login</h1>
                    <div className="errorMessageContainer">
                        {errorMessage && (
                            <div className="errorMessage" id="errorMessage">{errorMessage}</div>
                        )}
                    </div>
                    <div className="wrapper">
                        <form onSubmit={handleSubmit}>
                            <Field fieldName="email" fieldType="email" label="Email Address" change={handleChange} />
                            <Field fieldName="password" fieldType="password" label="Password" change={handleChange} />
                            <div className="content">
                                <div className="pass-link">
                                    <br /><br />
                                    Forgot Password? (Feature coming soon)
                                </div>
                            </div>
                            <div className="field">
                                <input type="submit" value="Login" />
                            </div>
                            <div className="field">
                                <input type="button" value="Continue as Guest" onClick={handleGuest} />
                            </div>
                            <div className="signup-link">
                                Not a member? <NavLink to="/register" className="nav-link">Signup Now For Free!</NavLink>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Login