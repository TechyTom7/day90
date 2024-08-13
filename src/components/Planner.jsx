import { useState, useEffect, useContext } from "react";
import { appContext } from "../App";
import NavBar from "./NavBar";
import consts from "../consts";
import '../styles/Planner.css';


export default function Planner(props) {
    const [datesInRange, setDatesInRange] = useState([]);
    const [toggled, setToggled] = useState(false);

    const { user, setUser } = useContext(appContext)

    useEffect(() => {
        if (!user) return;

        let datesObject = {};
        let nowDate = new Date();

        for (let amount = -90; amount < 91; ++amount) {
            let itDate = new Date(nowDate);
            itDate.setDate(nowDate.getDate() + amount);
            if (!datesObject[itDate.getMonth()]) {
                datesObject[itDate.getMonth()] = [];
                datesObject[itDate.getMonth()].push(itDate.getFullYear());
            }
            datesObject[itDate.getMonth()].push(itDate.getDate());
        }

        setDatesInRange(datesObject);
        console.log("Completed");

        return () => {
            setToggled(false);
        };
    }, [user]);

    const toggleDate = async (year, month, day) => {
        try {
            let response = await fetch(consts.SERVER_URL + "toggle_date", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-token": user.email
                },

                body: JSON.stringify({
                    year: year,
                    month: month + 1, // Months are 0-indexed in JS, adding 1 to match your server-side logic
                    day: day,
                }),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Response not ok");
            }

            let data = await response.json();

            setUser(data)
            setToggled(true);
        } catch (e) {
            console.log("Something went wrong toggling the date: ", e);
        }
    };

    const isUserDate = (year, month, day) => {
        return user.dates.some((userDateStr) => {
            let formattedDate = userDateStr.split(' ');
            let userYear = Number(formattedDate[3]);
            let userMonth = consts.dateConversions.indexOf(formattedDate[2]);
            let userDay = Number(formattedDate[1]);

            return userYear === year && userMonth === month && userDay === day;
        });
    };

    const isNow = (year, month, day) => {
        let nowDate = new Date();
        return year === nowDate.getFullYear() && month === nowDate.getMonth() && day === nowDate.getDate();
    }

    if (!user.dates) {
        return <h1>Loading</h1>;
    }

    return (
        <div id="planner-container">
            <NavBar current={"planner"} />
            <div id="planner-body-container">
                <h1>Planner</h1>
                <span id="days-info">{(user.dates.length < 90) ?
                "You have " + (90 - user.dates.length) + " days available to plan!":

                (user.dates.length === 90) ? // Check if the user planned 90 days if they don't have less than 90 days
                "You've used up all of your days for planning!":
                "You have " + (user.dates.length - 90) + " too many days. Try rescheduling some dates for more flexibility."
            }</span>
                <div id="dates-container">
                    {datesInRange &&
                        Object.entries(datesInRange).map(([month, value]) => (
                            <div key={month} className="month-container">
                                <h2>
                                    {value[0]} {consts.Dates[month]}
                                </h2>
                                <div className="month-days-container">
                                    {value.slice(1).map((day, i) => (
                                        <button
                                            key={i}
                                            onClick={() => toggleDate(value[0], parseInt(month), day)}
                                            style={{
                                                backgroundColor: isUserDate(value[0], parseInt(month), day)
                                                    ? (isNow(value[0], parseInt(month), day) ? "lightgreen" : "#87b582")
                                                    : (isNow(value[0], parseInt(month), day) ? "#d9a5a5" : "#888"),
                                            }}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
