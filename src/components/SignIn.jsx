import { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom'
import consts from "../consts";
import { appContext } from "../App";
import Loading from "./Loading";

export default function SignIn(props) {

    const { setUser } = useContext(appContext)

    const [data, setData] = useState(null);
    const [loadingSignIn, setLoadingSignIn] = useState(false)
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
        setLoadingSignIn(true);

        const name = e.target.elements.name.value;

        if (name.length < 3) {
            addErrorMsg("Name must contain at least three characters");
            setLoadingSignIn(false);
            return;
        }

        // Check if the email matches a regex expressions for email
        const email = e.target.elements.email.value;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            addErrorMsg("Please enter a valid email address");
            setLoadingSignIn(false);
            return;
        }


        const existingUserResponse = await fetch(consts.SERVER_URL + 'check_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                name: name
            }),
        });

        const existingUserResult = await existingUserResponse.json();
        if (!existingUserResult.exists) {
            addErrorMsg("Email or name doesn't exist");
            setLoadingSignIn(false);
            return;
        }

        const password = e.target.elements.password.value;

        if (password.length <= 7) {
            addErrorMsg("Password must be at least 8 characters long");
            setLoadingSignIn(false);
            return;
        }

        // Check if the email already exists in the database

        const rememberMe = e.target.elements['remember_me'].checked;

        try {
            const response = await fetch(consts.SERVER_URL + 'sign_in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                setUser(result.user);
                if (rememberMe) {
                    localStorage.setItem('user-token', result.user.email)
                }
                console.log(result);
                navigate("/");
            } else {
                addErrorMsg("Invalid password")
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setLoadingSignIn(false);
    }


    return (
        <>
            {(loadingSignIn) ? <Loading>Signing in</Loading> : null}
            <div className="form-container">
                <form method="post" onSubmit={handleSubmit}>
                    <Link id="back-link" to="/" className="form-link">Back</Link>
                    <h1>Sign in</h1>
                    <div className="name">
                        <input type="text" placeholder="Name" name="name"/>
                    </div>
                    <div className="email">
                        <input type="text" placeholder="Email" name="email"/>
                    </div>
                    <div className="password">
                        <input type="password" placeholder="Password" name="password"/>
                    </div>
                    <div className="remember-me">
                        <label htmlFor="remember-me">Remember Me: </label>
                        <input
                        type="checkbox"
                        id='remember-me'
                        name='remember_me'
                        defaultChecked={true}/>
                    </div>
                    {/*
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

