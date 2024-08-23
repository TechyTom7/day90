import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import consts from "../consts"

import "../styles/Support.css"

export default function Support() {

    const [supportShown, setsupportShown] = useState(false)
    const [currTicket, setCurrTicket] = useState(null)
    const [questions, setQuestions] = useState([])
    const [currPage, setCurrPage] = useState("popularQuestions")
    const [currIssue, setCurrIssue] = useState({});
    const [issueInput, setIssueInput] = useState("");

    const [error, setError] = useState("")

    useEffect(() => {
        const loadQuestions = async () => {
            try {
                let response = await fetch(consts.SERVER_URL + "getQuestions");
                if (!response.ok) {
                    throw new Error()
                }

                let jsonData = await response.json();

                setQuestions(jsonData.questions);
                console.log(questions)
            } catch (e) {
                setError("Unable to load chats");
            }
        }
        loadQuestions();
    }, [supportShown])

    const handleIssueInputChanged = (e) => {
        setIssueInput(e.target.value);
    }

    const pages = {
        "popularQuestions": {

            "head": (
                <h3>Support</h3>
            ),

            "body": (
                <div> {
                    questions.length != 0 ?
                    questions.map((question, i) => {
                        return question.issue.includes(issueInput) ?
                            <div className='question-container' key={i}>
                                <a onClick={() => {
                                setCurrIssue({issue: question.issue, message: question.message});
                                setCurrPage("issueInfo")}}>
                                    {question.issue}</a>
                            </div> :
                            null
                    }) : null}
                </div>
            ),

            "foot": (
                <>
                    <textarea placeholder="Search for your issue" onChange={handleIssueInputChanged}></textarea>
                    <div style={{textAlign: "center"}}>
                        <span style={{fontSize: "0.8rem"}}>Or contact
                            <i style={{fontWeight: 500}}> tom@day90.eu </i>
                            via email if you can't see your issue
                        </span>
                    </div>
                </>
            )
        },

        "issueInfo": {
            "head": (
                <>
                    <h3>Support</h3>

                </>
            ),
            "body": (
                <div id="issue-info-container">
                    <h2 id='issue-header'>{currIssue.issue}</h2>
                    <hr/>
                    <p>{currIssue.message}</p>
                </div>
            ),
            "foot": (
                <div>
                    <a className='back-link' onClick={e => {
                        setCurrIssue({});
                        setCurrPage("popularQuestions")

                    }}>Back</a>
                </div>
            )
        }
    }

    return (
        <>
            <div id="support-container">

                {(supportShown) ?
                    <div id="support-chat-container">
                        <div id="chat-info-container">
                            {pages[currPage]['head']}
                        </div>
                        <div id="chats-container">
                            {error ? <span>{error}</span> : pages[currPage]['body']}
                        </div>
                        <div id="input-container">
                            {pages[currPage]['foot']}
                        </div>
                    </div>

                : null}

                <button id="support-btn" onClick={() => {setsupportShown(!supportShown)}}>
                    <img src="/images/Support Logo.png" width="20px" height="30px"></img>
                </button>
            </div>
        </>
    )
}
