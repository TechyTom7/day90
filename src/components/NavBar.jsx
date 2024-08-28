import "../styles/App.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { appContext } from "../App";
import consts from "../consts";

function NavLink({ route, active, children }) {
    return (
        <div className="link-container">
            {/* {route != "/payments" ?
                <Link to={route} className={(active) ? "active-link" : "link"}>{children}</Link>
            : <a href="https://day90.eu/subscribe" className={(active) ? "active-link" : "link"}>{children}</a>} */}
            <Link to={route} className={(active) ? "active-link" : "link"}>{children}</Link>
        </div>
    )
}

export default function NavBar({ current }) {

    const { user } = useContext(appContext);
    const navigate = useNavigate();
    return (
        <div id='nav-container'>
            <nav>
                <div id='nav-inner-container' style={{
                    margin: (user.email == null) ? "0 auto" : null,
                    justifyContent: (user.email) ? "center" : null
                }}>
                    <img id='logo-container' src="images/Day90-Logo.png" width="200px" height="50px" onClick={() => {navigate('/')}}></img>

                    <div id='links-container' style={{
                        width: (user.email) ? '80%' : null,
                        justifyContent: (user.email) ? 'space-around' : null
                    }}>
                        <NavLink route='/' active={current === "/"}>Home</NavLink>
                        <NavLink route='/about' active={current === "/about"}>About</NavLink>


                        {user.email ?
                        (<>
                            <NavLink route='https://day90.eu/subscribe' active={current === "/payments"}>Subscribe</NavLink>
                            <NavLink route='/planner' active={current === "/planner"}>Planner</NavLink>
                            <NavLink route='/profile' active={current === "/profile"}>Profile</NavLink>
                        </>):
                        null}

                        {user.email == "tom@day90.eu" ?
                        <NavLink route='/admin' active={current === "/admin"}>Admin Panel</NavLink>
                        : null}
                    </div>

                    { !user.email ?
                        <div id="get-account-btns">
                            <button onClick={() => {navigate('/sign-in')}} className='sign-in-button'>Sign in</button>
                            <button onClick={() => {navigate('/register')}} className='register-button'>Register</button>
                        </div>
                    : null}


                </div>
            </nav>
        </div>
    );
}
