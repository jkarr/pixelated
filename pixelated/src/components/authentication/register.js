import Navbar from "../navbar/navbar.js";
import { useState } from 'react'
import axios from 'axios'
import { sha1 } from 'js-sha1'
import { useNavigate } from 'react-router-dom';
import { useUserSession } from '../../utils/userSession.js'

import '../../styles/form.css';
import Field from "../form/field.js";

const Register = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const { setUserSession} = useUserSession();
    const navigator = useNavigate();
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
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

        let breachedPasswordCount = await passwordHasPwnd(formData["password"]);

        if (breachedPasswordCount > 0) {
            setErrorMessage(`The password you entered has been found in ${parseInt(breachedPasswordCount).toLocaleString()} known data breaches.  Please choose another password.`);
            return;
        }
        
        axios.post(`${process.env.REACT_APP_REGISTER_USER_API}/Register`, formData)
            .then(function (response) {
                setUserSession(response.data);
                navigator('/play');
            })
            .catch(function (error) {
                if (error.response) {
                    if (error.response.status === 406) {
                        setErrorMessage(error.response.data);
                    }
                } else if (error.request) {
                    setErrorMessage("There was a problem reaching the server. Please try again later.");
                }
            });
    };

    async function passwordHasPwnd(password) {
        let passwordSha = sha1(password).toUpperCase();
        let prefix = passwordSha.substring(0, 5);
        let suffix = passwordSha.substring(5, passwordSha.length);

        try {
            const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
            let hashes = response.data.split('\r\n');

            for (let i = 0; i < hashes.length; i++) {
                let hash = hashes[i];
                let hashSuffix = hash.split(':');

                if (hashSuffix[0] === suffix) {
                    console.log(hashSuffix[1]);
                    return hashSuffix[1];
                }
            }
        } catch (error) {
            // Don't let an error here be a blocker to registration!
            return 0;
        }

        return 0;
    }

    return (
        <>
            <Navbar />
            <hr />
            <main>
                <div className="main-container">
                    <h1>Register Your Pixelated Account</h1>
                    <div className="errorMessageContainer">
                        {errorMessage && (
                            <div className="errorMessage" id="errorMessage">{errorMessage}</div>
                        )}
                    </div>
                    <div className="wrapper">
                        <form onSubmit={handleSubmit}>
                            <Field fieldName="firstName" label="First Name" change={handleChange} />
                            <Field fieldName="lastName" label="Last Name" change={handleChange} fieldRequired={false} />
                            <Field fieldName="email" fieldType="email" label="Email Address" change={handleChange} />
                            <Field fieldName="password" fieldType="password" label="Password" change={handleChange} />
                            <Field fieldName="confirmPassword" fieldType="password" label="Confirm Password" change={handleChange} />
                            <div className="field">
                                <input type="submit" value="Register" />
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Register