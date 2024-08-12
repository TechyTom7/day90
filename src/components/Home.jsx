import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import consts from "../consts";

export default function Home(props) {

    const navigate = useNavigate()

    const handleSignInClick = () => {
        navigate("/sign-in");
    }

    const handleRegisterClick = () => {
        navigate("/register");
    }

    useEffect(() => {
        const starsContainer = document.getElementById("stars-container");
        for (let i = 0; i < 10; ++i) {
            const image = document.createElement("img");
            image.src = "/images/eu-star.png";
            image.className = "star";

            image.style.top = Math.floor(Math.random() * window.innerHeight) + "px";
            image.style.left = Math.floor(Math.random() * window.innerWidth) + "px";
            starsContainer.appendChild(image);
        }
    }, [])

    return (
        <div id='home-container'>
            <NavBar current={"home"}/>
            <div id="home-info-container">
                <h1>Want to stay comfortably in EU countries?</h1>
                <h2>Introducing the EU non residency planner!</h2>
                <section id='set-account-section'>
                    <button className='sign-in-button' onClick={handleSignInClick}>Sign in</button>
                    <span>or</span>
                    <button className='register-button' onClick={handleRegisterClick}>Register</button>
                </section>
            </div>
            <div id='stars-container'></div>
        </div>
    )
}
