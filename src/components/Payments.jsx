import NavBar from "./NavBar"
import "../styles/Payments.css"

export default function Payments(props) {
    return (
        <div id="payments-container">
            <NavBar current={"payments"}/>
            <div id="payments-inner-container">
                <h1>Subscribe to our best deal!</h1>
                <div id="monthly-deal-container">
                    <h3>Get access to our EU planner</h3>
                    <p>For a <strong>low</strong> price of <strong>£19.99</strong> per month!</p>
                    <button id="subscribe-button-1">
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
