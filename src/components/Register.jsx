import { useState, useEffect, useRef, useContext } from "react";
import { appContext } from "../App";
import { Link, useNavigate } from 'react-router-dom'
import consts from "../consts";
import Loading from "./Loading";

export default function Register(props) {

    const [data, setData] = useState(null);
    const [registering, setRegistering] = useState(false)
    const navigate = useNavigate();

    const {setUser} = useContext(appContext)

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

        setRegistering(true);
        const name = e.target.elements.name.value;
        if (name.length < 3) {
            addErrorMsg("Name must contain at least three characters");
            setRegistering(false);
            return;
        }

        // Check if the email matches a regex expressions for email
        const email = e.target.elements.email.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            addErrorMsg("Please enter a valid email address");
            setRegistering(false);
            return;
        }



        const existingUserResponse = await fetch(consts.SERVER_URL + 'check_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
            }),
        });

        const existingUserResult = await existingUserResponse.json();
        if (existingUserResult.exists) {
            addErrorMsg("Email and name already exists");
            setRegistering(false);
            return;
        }

        const password = e.target.elements.password.value;
        const confirmPassword = e.target.elements.confirm_password.value;

        if (password !== confirmPassword) {
            addErrorMsg("Password and confirm password must be equivalent");
            setRegistering(false);
            return;
        }

        if (password.length <= 7) {
            addErrorMsg("Password must be at least 8 characters long");
            setRegistering(false);
            return;
        }

        // Check if the email already exists in the database

        const rememberMe = e.target.elements['remember_me'].checked;
        //console.log("Remembered: ", rememberMe)

        try {
            const response = await fetch(consts.SERVER_URL + 'register', {
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
            const result = await response.json();
            console.log(result)
            setUser(result.user);

            if (rememberMe) {
                localStorage.setItem('user-token', result.user.email)
            }

            navigate("/");
        } catch (error) {
            console.error('Error:', error);
        }
        setRegistering(false);
    }

    return (
        <>
            {(registering ? <Loading>Registering</Loading> : null)}
            <div className="form-container">
                <form method="post" onSubmit={handleSubmit}>
                    <Link id="back-link" to="/" className="form-link">Back</Link>
                    <h1>Register</h1>
                    <div className="name">
                        <input type="text" placeholder="Name" name="name"/>
                    </div>
                    <div className="email">
                        <input type="text" placeholder="Email" name="email"/>
                    </div>
                    <div className="password">
                        <input type="password" placeholder="Password" name="password"/>
                    </div>
                    <div className="confirm-password">
                        <input type="password" placeholder="Confirm Password" name="confirm_password"/>
                    </div>
                    <div className="remember-me">
                        <label htmlFor="remember-me">Remember Me: </label>
                        <input type="checkbox" id='remember-me' name='remember_me' defaultChecked={true}/>
                    </div>
                    <div className="submit">
                        <input type="submit" value="Register" />
                    </div>
                    <p>Already have an account? <Link to="/sign-in" className="form-link">Sign in</Link>!</p>
                    <div id='error-container'></div>
                </form>
            </div>
        </>
    );
}
