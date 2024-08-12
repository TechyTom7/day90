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

        // const starsContainer = document.getElementById("stars-container");
        // const numStars = 12; // Number of stars
        // const radius = 150; // Adjust for container's radius

        // // Create and position stars
        // for (let i = 0; i < numStars; ++i) {
        //     const image = document.createElement("img");
        //     image.src = "/images/eu-star.png";
        //     image.className = "star";

        //     // Append the image to the container first
        //     starsContainer.appendChild(image);

        //     // Calculate star position in a circle
        //     const angle = (2 * Math.PI / numStars) * i; // Angle for each star
        //     const centerX = starsContainer.clientWidth / 2;
        //     const centerY = starsContainer.clientHeight / 2;

        //     // Calculate image dimensions
        //     const imageDimensions = image.getBoundingClientRect();
        //     const imageWidth = imageDimensions.width;
        //     const imageHeight = imageDimensions.height;

        //     // Calculate the position within the container
        //     const top = centerY + radius * Math.sin(angle) - (imageHeight / 2);
        //     const left = centerX + radius * Math.cos(angle) - (imageWidth / 2);

        //     // Ensure the star is positioned relative to the container
        //     image.style.position = 'absolute';
        //     image.style.top = `${top}px`;
        //     image.style.left = `${left}px`;
        // }



    }, [window.innerWidth])

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
