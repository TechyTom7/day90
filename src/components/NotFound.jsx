import consts from "../consts";
import "../styles/NotFound.css"
import { Link } from "react-router-dom";

export default function NotFound() {

    return (
        <div id='not-found-container'>
            <h1>404 Page not found</h1>
            <p>Redirect to <Link to="/">Home page</Link> </p>
        </div>
    )
}
