import { useState, useEffect, useContext } from "react";
import { appContext } from "../App";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "./NavBar";
import consts from "../consts";
import '../styles/Planner.css';


export default function Planner(props) {
    const [datesInRange, setDatesInRange] = useState([]);
    const [toggled, setToggled] = useState(false);
    const [availableDates, setAvailableDates] = useState(0);

    const { user, setUser, loadUser } = useContext(appContext)

    const navigate = useNavigate()

    useEffect(() => {
        if (!user) return;

        let datesObject = {};
        let nowDate = new Date();

        for (let amount = -180; amount < 271; ++amount) {
            let itDate = new Date(nowDate);
            itDate.setDate(nowDate.getDate() + amount);

            // Get the year and month
            const year = itDate.getFullYear();
            const month = itDate.getMonth();

            // Create a unique key for each year and month
            const yearMonthKey = `${year}-${month}`;

            // If the year-month doesn't exist in the datesObject, initialize it
            if (!datesObject[yearMonthKey]) {
                datesObject[yearMonthKey] = {
                    year: year,
                    month: month,
                    days: []
                };
            }

            // Push the day into the correct year-month key
            datesObject[yearMonthKey].days.push(itDate.getDate());
        }

        setDatesInRange(datesObject);
        console.log("Completed");

        return () => {
            setToggled(false);
        };
    }, [user]);

    useEffect(() => {
        loadUser();
    }, [])

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

    const dateOverlapping = (year, month, day) => {
        let thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() + 180);

        // Create a date object for the input date
        let inputDate = new Date(year, month, day);

        // Check if the input date is beyond the threshold date
        return inputDate > thresholdDate;
    };

    const calculateDaysLeft = () => {
        if (!user.dates && user.dates.length === 0) return 90;

        let counter = 90;
        console.log("First, ", user.dates[0])
        for (let i = 0; i < user.dates.length; ++i) {
            console.log("Date:", user.dates[i])
            if (!dateOverlapping(user.dates[i].split(' ')[3],
                                 consts.dateConversions.indexOf(user.dates[i].split(' ')[2]),
                                 user.dates[i].split(' ')[1])) {
                --counter;
            }
        }
        setAvailableDates(counter)
    };

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
                    month: month + 1,
                    day: day,
                }),
                credentials: "include",
            });

            if (!response.ok) {
                let json = await response.json();
                let errorMsg = json.error
                throw new Error(errorMsg);
            }

            let data = await response.json();

            setUser(data)
            calculateDaysLeft();
            setToggled(true);

        } catch (e) {
            if (e.message === 'User not authorized') {
                navigate('/')
            } else if (e.message === "User not subscribed") {
                navigate('/payments')
            }
            console.log("Something went wrong toggling the date: ", e);
        }

    };

    useEffect(() => {
        if (user.dates) {
            const calculateDaysLeft = () => {
                if (!user.dates && user.dates.length === 0) return 90;

                let counter = 90;
                console.log("First, ", user.dates[0])
                for (let i = 0; i < user.dates.length; ++i) {
                    console.log("Date:", user.dates[i])
                    if (!dateOverlapping(user.dates[i].split(' ')[3],
                                        consts.dateConversions.indexOf(user.dates[i].split(' ')[2]),
                                        user.dates[i].split(' ')[1])) {
                        --counter;
                    }
                }
                return counter;
            };

            setAvailableDates(calculateDaysLeft());
        }
    }, [user.dates]);

    if (!user.dates) {
        return <h1>Loading</h1>;
    }

    if (!user.subscribed) {
        return (
            <div id="not-subscribed">
                <h1>You are not subscribed right now</h1>
                <h2>But that can change by <Link to='https://day90.eu/subscribe'>subscribing!</Link></h2>
            </div>
        )
    }

    return (
        <div id="planner-container">
            {console.log(user.dates)}

            <div id="planner-body-container">
                <h1>Planner</h1>
                <span id="days-info">{(availableDates > 0) ?
                "You have " + (availableDates) + " days available to plan! (After you've inputted your dates before today)":

                (availableDates === 0) ?
                "You've used up all of your days for planning!":
                "You have " + (availableDates * -1) + " too many days. Try rescheduling some dates for more flexibility."
            }</span>
                <div id="dates-container">
                    {datesInRange &&
                        Object.entries(datesInRange).map(([yearMonth, value]) => (
                            <div key={yearMonth} className="month-container">
                                <h2>
                                    {value.year} {consts.Dates[value.month]}
                                </h2>
                                <div className="month-days-container">
                                    {value.days.map((day, i) => (
                                        <button
                                        key={i}
                                        onClick={() => toggleDate(value.year, value.month, day)}
                                        style={{
                                            backgroundColor: (() => {
                                                if (dateOverlapping(value.year, value.month, day)) {
                                                    return isUserDate(value.year, value.month, day) ?
                                                        "#637d5f" : "#696969";
                                                } else {
                                                    return isUserDate(value.year, value.month, day)
                                                        ? (isNow(value.year, value.month, day) ? "lightgreen" : "#87b582")
                                                        : (isNow(value.year, value.month, day) ? "#d9a5a5" : "#888");
                                                }
                                            })()
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
