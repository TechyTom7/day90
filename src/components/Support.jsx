import { useState, useEffect } from "react"
import consts from "../consts"

import "../styles/Support.css"

export default function Support() {

    const [supportShown, setsupportShown] = useState(false)
    const [currTicket, setCurrTicket] = useState(null)
    const [questions, setQuestions] = useState([])

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

    return (
        <>
            <div id="support-container">

                {(supportShown) ?
                    <div id="support-chat-container">
                        <div id="chat-info-container">
                            <h3>Support</h3>
                        </div>
                        <div id="chats-container">
                            {error ? <span>{error}</span> :
                                questions.length != 0 ?
                                questions.map((question, i) => {
                                    return <div class='question-container' key={i}>
                                        <h2>{question.issue}</h2>
                                    </div>
                                })
                                : null
                            }
                        </div>
                        <div id="input-container">
                            <textarea placeholder="Search for your issue"></textarea>
                            <div style={{textAlign: "center"}}>
                                <span style={{fontSize: "0.8rem"}}>Or contact <i style={{fontWeight: 500}}>tom@day90.eu</i> by email if you can't see your issue</span>
                            </div>
                        </div>


                    </div>

                : null}

                <button id="support-btn" onClick={() => {setsupportShown(!supportShown)}}>
                    <img src="/images/Support Logo.png"></img>
                </button>
            </div>
        </>
    )
}
