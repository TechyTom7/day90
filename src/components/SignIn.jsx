import { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom'
import consts from "../consts";
import { appContext } from "../App";

export default function SignIn(props) {

    const { setUser } = useContext(appContext)

    const [data, setData] = useState(null);
    const navigate = useNavigate();

    const addErrorMsg = msg => {
        const errorContainer = document.getElementById("error-container");
        const newErrorMessage = document.createElement("p");
        newErrorMessage.className = 'errorMsg';
        newErrorMessage.innerHTML = msg;
        errorContainer.appendChild(newErrorMessage);
    }

    const clearErrors = () => {
        const errorContainer = document.getElementById("error-container");
        while (errorContainer.firstChild) {
            errorContainer.removeChild(errorContainer.firstChild);
        }
    }

    const handleSubmit = async (e) => {

        e.preventDefault(); // Prevent the default form submission
        clearErrors();

        // Check if the email matches a regex expressions for email
        const email = e.target.elements.email.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            addErrorMsg("Please enter a valid email address");
            return;
        }

        const existingEmailResponse = await fetch(consts.SERVER_URL + 'check_email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
            }),
        });

        const existingEmailResult = await existingEmailResponse.json();
        if (!existingEmailResult.exists) {
            addErrorMsg("Email doesn't exist");
            return;
        }

        const password = e.target.elements.password.value;

        if (password.length <= 7) {
            addErrorMsg("Password must be at least 8 characters long");
            return;
        }

        // Check if the email already exists in the database

        //const rememberMe = e.target.elements['remember_me'].checked;

        try {
            const response = await fetch(consts.SERVER_URL + 'sign_in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                setUser(result.user);
                localStorage.setItem('user-token', result.user.email)
                console.log(result);
                navigate("/");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <>
            <div className="form-container">
                <form method="post" onSubmit={handleSubmit}>
                    <Link id="back-link" to="/" className="form-link">Back</Link>
                    <h1>Sign in</h1>
                    <div className="email">
                        <input type="text" placeholder="Email" name="email"/>
                    </div>
                    <div className="password">
                        <input type="password" placeholder="Password" name="password"/>
                    </div>
                    {/* <div className="remember-me">
                        <label htmlFor="remember-me">Remember Me: </label>
                        <input type="checkbox" id='remember-me' name='remember_me'/>
                    </div>
                    <div className="forgot-password">
                        <a href="/forgot_password">Forgot Password</a>
                    </div> */}
                    <div className="submit">
                        <input type="submit" value="Sign in" />
                    </div>
                    <p>Don't have an account? <Link to="/register" className="form-link">Register here</Link>!</p>
                    <div id='error-container'>


                    </div>
                </form>
            </div>
        </>
    );
}

