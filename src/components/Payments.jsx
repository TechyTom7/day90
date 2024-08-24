import NavBar from "./NavBar"
import { useNavigate } from "react-router-dom"
import "../styles/Payments.css"

export default function Payments(props) {

    const navigate = useNavigate()

    return (
        <div id="payments-container">
            <div id="payments-inner-container">
                <h1>Subscribe to our best deal!</h1>
                <div id="monthly-deal-container">
                    <h3>Get access to our EU planner</h3>
                    <p>For a <strong>low</strong> price of <strong>£9.99</strong> per month!</p>
                    <button id="subscribe-button-1" onClick={() => navigate("/transaction")}>
                        Subscribe
                        <div className="gradient-2">
                            Subscribe
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}
