import { appContext } from "../App";
import { useContext, useState } from "react";
import { Link } from 'react-router-dom';
import consts from "../consts";

import "../styles/Admin.css"

export default function Admin() {
    const { user } = useContext(appContext);
    const [info, setInfo] = useState("");

    const addIssue = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        // Access the form elements using e.target
        const question = e.target.question.value;
        const solution = e.target.solution.value;

        let response = await fetch(consts.SERVER_URL + "addPopularQuestion",
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                issue: question,
                message: solution,
            })
        })

        if (!response.ok) {
            setInfo("Something went wrong.");
            return;
        }

        let jsonResponse = await response.json();
        setInfo(jsonResponse)
        console.log("Added new!")

        // You can now use question and solution as needed, e.g., send them to a server
    }

    if (user.email !== "tom@day90.eu") {
        return (
            <div id="not-admin">
                <h1>Permitted access to admin panel</h1>
                <h2><Link to='/'>Go back home</Link></h2>
            </div>
        );
    }

    return (
        <div id='admin-container'>
            <div id='admin-inner-container'>
                <h1>Admin Panel</h1>
                <h2>Add question</h2>
                <form method="post" onSubmit={addIssue}>
                    <textarea placeholder="Question/Issue" name="question"></textarea>
                    <textarea placeholder="Solution" name="solution"></textarea>
                    <input type="submit" value={"Post"} />
                </form>
            </div>
        </div>
    );
}
