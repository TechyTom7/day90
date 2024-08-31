import { useState, useEffect, useContext } from "react";
import { appContext } from "../App";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "./NavBar";
import consts from "../consts";
import '../styles/Planner.css';


export default function Planner(props) {
    const [datesInRange, setDatesInRange] = useState([]); // Contains the dates within the 360 day range
    const [datesOutOfRange, setDatesOutOfRange] = useState([]) // Contains the 360 extra days beyond 180 days from now
    const [availableDates, setAvailableDates] = useState(0); // Amount of days left to schedule
    const [atCurrDates, setAtCurrDates] = useState(true); // Determines whether the user sees the days within the 360 day range or not
    const [popupShown, setPopupShown] = useState(false);

    const { user, setUser, loadUser } = useContext(appContext)

    const navigate = useNavigate()

    useEffect(() => {
        if (!user) return;

        const getDaysInInputRange = (n1, n2) => {
            let datesObject = {};
            let nowDate = new Date();

            for (let amount = n1; amount < n2; ++amount) {
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

            return datesObject;
        }

        setDatesInRange(getDaysInInputRange(-180, 181));
        setDatesOutOfRange(getDaysInInputRange(181, 542));

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

    const isDateOutOfRange = (year, month, day) => {
        let thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() + 180);
        let inputDate = new Date(year, month, day);

        return inputDate > thresholdDate;
    };

    const calculateDaysLeft = () => {
        if (!datesInRange && datesInRange.length === 0) return 90;
        setAvailableDates(90 - datesInRange.length);
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
                for (let i = 0; i < user.dates.length; ++i) {
                    if (!isDateOutOfRange(user.dates[i].split(' ')[3],
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

    const outOfRangeDatesCount = user.dates.reduce((count, dateStr) => {
        let year = dateStr.split(' ')[3];
        let monthStr = dateStr.split(' ')[2]
        let day = dateStr.split(' ')[1]
        let month = consts.dateConversions.indexOf(monthStr);
        day = Number(day);
        year = Number(year);

        if (isDateOutOfRange(year, month, day)) {
            return count + 1;
        }
        return count;
    }, 0);

    const popup = (
        <div id="popup-container">
            <div id="popup">
                <h2>Are you sure you want to delete ALL the dates? This cannot be undone!</h2>
                <div id='buttons-container'>
                    <button onClick={() => {
                        const deleteDates = async () => {
                            try {
                                let response = await fetch(consts.SERVER_URL + "clear_dates", {
                                    method: "DELETE",
                                    headers: {
                                        "x-token": user.email
                                    }
                                });

                                if (!response.ok) {
                                    let json = await response.json();
                                    let errorMsg = json.error
                                    throw new Error(errorMsg);
                                }

                                let data = await response.json();

                                setUser(data)
                                calculateDaysLeft();

                            } catch (e) {
                                if (e.message === 'User not authorized') {
                                    navigate('/')
                                } else if (e.message === "User not subscribed") {
                                    navigate('https://day90.eu/subscribe')
                                }
                                console.log("Something went wrong toggling the date: ", e);
                            }
                        }
                        deleteDates();
                        setPopupShown(false);
                    }}>Yes</button>
                    <button onClick={() => setPopupShown(false)}>No</button>
                </div>
            </div>
        </div>
    )



    return (
        <div id="planner-container">

            <div id="planner-body-container">
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", width: "90vw"}}>
                    <h1>Planner</h1>
                    <button className="toggle-popup-button"
                            onClick={() => {setPopupShown(true)}}
                            style={{height: "60px"}}
                            >Clear dates</button>
                </div>
                <span className="days-info">If you are creating a new schedule, input the dates you have been to an EU country</span>
                {atCurrDates ?
                <span className="days-info">{(availableDates > 0) ?
                "You have " + (availableDates) + ` day${availableDates != 1 ? "s" : ""} available to plan! (After you've inputted your dates before today)`:

                (availableDates === 0) ?
                "You've used up all of your days for planning!":
                "You have " + (availableDates * -1) + " too many days. Try rescheduling some dates for more flexibility."
            }   </span>:
                <span>You have planned {outOfRangeDatesCount} day{outOfRangeDatesCount != 1 ? "s" : ""} ahead</span>
                }
                {(atCurrDates) ?
                    <div id='next-section'>
                        <button id="next-btn" onClick={() => {setAtCurrDates(false)}}>{">"}</button>
                    </div>:
                    <div id='prev-section'>
                        <button id="prev-btn" onClick={() => {setAtCurrDates(true)}}>{"<"}</button>
                    </div>
                }
                <div id="dates-container">

                    {atCurrDates ?
                        // Shows the 360 day range
                        datesInRange &&
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
                                                    return isUserDate(value.year, value.month, day)
                                                        ? (isNow(value.year, value.month, day) ? "lightgreen" : "#87b582")
                                                        : (isNow(value.year, value.month, day) ? "#d9a5a5" : "#888");
                                                })()
                                            }}
                                        >
                                            {day}
                                        </button>
                                        ))}
                                    </div>
                                </div>
                            )):

                        datesOutOfRange &&
                            Object.entries(datesOutOfRange).map(([yearMonth, value]) => (
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
                                                    return isUserDate(value.year, value.month, day) ?
                                                        "#73916e" : "#797979";
                                                })()
                                            }}>
                                                {day}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))

                    }

                </div>
            </div>
            {popupShown ? popup : null}
        </div>
    );
}
