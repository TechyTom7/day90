import "../styles/App.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { appContext } from "../App";
import consts from "../consts";

function NavLink({ route, active, children }) {
    return (
        <div className="link-container">
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
                    margin: (user.email) ? "0 auto" : null,
                    justifyContent: (user.email) ? "center" : null
                }}>
                    {!user.email ? <div id='nav-filler'></div> : null}

                    <div id='links-container' style={{
                        width: (user.email) ? '80%' : null,
                        justifyContent: (user.email) ? 'space-around' : null
                    }}>
                        <NavLink route='/' active={current === "/"}>Home</NavLink>
                        <NavLink route='/about' active={current === "/about"}>About</NavLink>
                        <NavLink route='/payments' active={current === "/payments"}>Payments</NavLink>


                        {user.subscribed ?
                        <NavLink route='/planner' active={current === "/planner"}>Planner</NavLink>
                        : null}
                        {user.email ?
                        <NavLink route='/profile' active={current === "/profile"}>Profile</NavLink>:
                        null}
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
