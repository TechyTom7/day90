import "../styles/App.css";
import { Link } from "react-router-dom";
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

    const { user } = useContext(appContext)

    return (
        <div id='nav-container'>
            <nav>
                <NavLink route='/' active={current === "home"}>Home</NavLink>
                <NavLink route='/about' active={current === "about"}>About</NavLink>
                <NavLink route='/payments' active={current === "payments"}>Payments</NavLink>
                {user.subscribed ?
                <NavLink route='/planner' active={current === "planner"}>Planner</NavLink>
                : null}
                {user.email ?
                <NavLink route='/profile' active={current === "profile"}>Profile</NavLink>:
                null}


            </nav>
        </div>
    );
}
