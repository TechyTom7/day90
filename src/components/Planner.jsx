import { useState, useEffect, useContext } from "react";
import { appContext } from "../App";
import { useNavigate, Link } from "react-router-dom";
import Loading from "./Loading";
import NavBar from "./NavBar";
import consts from "../consts";
import '../styles/Planner.css';

class SelectionState {
    static noneSelected = 0;
    static oneSelected = 1;
    static twoSelected = 2;
    static userSelected = 3;
}

export default function Planner(props) {
    const [availableDates, setAvailableDates] = useState(0); // Amount of days left to schedule
    const [deleteDatesPopupShown, setDeleteDatesPopupShown] = useState(false);
    const [tripInfo, setTripInfo] = useState(false);

    const [yearIter, setYearIter] = useState(0);
    let daysLeftInfo = {};

    const [dates, setDates] = useState([]); // Shows the dates (as objects)

    const { user, setUser, loadUser, getToken } = useContext(appContext)

    const [selectionState, setSelectionState] = useState(SelectionState.noneSelected);
    const [state1Date, setState1Date] = useState(false)
    const [state2Date, setState2Date] = useState(false)

    const [removeFirstDate, setRemoveFirstDate] = useState(false);
    const [removeLastDate, setRemoveLastDate] = useState(false);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate()

    // Create dates within a certain range
    useEffect(() => {
        if (!user) return;

        const oldGetDaysInInputRange = (n1, n2) => {
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

        const getDaysInInputRange = (n1, n2) => {
            let datesObject = {};
            let nowDate = new Date();

            for (let amount = n1; amount <= n2; ++amount) {
                let tempDate = new Date(nowDate);
                tempDate.setDate(nowDate.getDate() + amount);

                const year = tempDate.getFullYear();
                const month = tempDate.getMonth();

                // The primary keys will be the year (in string)
                // Then inside each key will contain an object with keys of month
                // Inside the month key will store each date as an array
                // Check if the year exists
                if (!datesObject[year]) {
                    datesObject[year] = {};
                }

                if (!datesObject[year][month]) {
                    datesObject[year][month] = [];
                    let iterDate = new Date();
                    iterDate.setMonth(month);
                    iterDate.setDate(1);
                    iterDate.setFullYear(year);

                    while (iterDate.getMonth() == month) {
                        datesObject[year][month].push(iterDate.getDate());
                        iterDate.setDate(iterDate.getDate() + 1);
                    }
                }
            }

            return datesObject;
        }
        setDates(getDaysInInputRange(-180, 541));

    }, [user]);

    // Get the updated user
    useEffect(() => {
        loadUser();
    }, [])

    // Checks if a date is equal to a users date
    const isUserDate = (year, month, day) => {

        return user.dates.some((userDateStr) => {
            let formattedDate = userDateStr.split(' ');
            let userYear = Number(formattedDate[3]);
            let userMonth = consts.dateConversions.indexOf(formattedDate[2]);
            let userDay = Number(formattedDate[1]);

            return userYear == year && userMonth == month && userDay == day;
        });
    };

    // Checks if the date given is now
    const isNow = (year, month, day) => {
        let nowDate = new Date();
        return year === nowDate.getFullYear() && month === nowDate.getMonth() && day === nowDate.getDate();
    }

    const setDate = (newYear, newMonth, newDay) => {
        let date = new Date();
        date.setFullYear(newYear);
        date.setMonth(newMonth);
        date.setDate(newDay);
        return date;
    }

    const isSelectedDate = (year, month, day) => {
        if (state1Date && state1Date[0] === year && state1Date[1] === month && state1Date[2] === day) {
            return true;
        }

        if (state2Date && state2Date[0] === year && state2Date[1] === month && state2Date[2] === day) {
            return true;
        }

        if (state1Date && state2Date) {
            let state1DateObject = setDate(state1Date[0], state1Date[1], state1Date[2]);
            let state2DateObject = setDate(state2Date[0], state2Date[1], state2Date[2]);
            let inputDateObject = setDate(year, month, day);

            if (state1DateObject <= inputDateObject && state2DateObject >= inputDateObject) {
                return true;
            }
        }

        return false;
    }

    const isToRemoveDate = (year, month, day) => {
        if (removeFirstDate && removeFirstDate[0] === year && removeFirstDate[1] === month && removeFirstDate[2] === day) {
            return true;
        }

        if (removeLastDate && removeLastDate[0] === year && removeLastDate[1] === month && removeLastDate[2] === day) {
            return true;
        }

        if (removeFirstDate && removeLastDate) {
            let removeFirstDateObject = setDate(removeFirstDate[0], removeFirstDate[1], removeFirstDate[2]);
            let removeLastDateObject = setDate(removeLastDate[0], removeLastDate[1], removeLastDate[2]);
            let inputDateObject = setDate(year, month, day);

            if (removeFirstDateObject <= inputDateObject && removeLastDateObject >= inputDateObject) {
                return true;
            }
        }

        return false;
    }

    const enableUserSelected = (year, month, day, availableDatesTracker) => {
        setSelectionState(SelectionState.userSelected);
        setState1Date(false);
        setState2Date(false);

        let tripLength = 0;
        let firstDateTrip;
        let lastDateTrip;

        let dateObj = setDate(year, month, day);
        while (isUserDate(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate())) {
            ++tripLength;
            dateObj.setDate(dateObj.getDate() - 1);
        }

        dateObj.setDate(dateObj.getDate() + 1);
        setRemoveFirstDate([dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()]);
        firstDateTrip = [dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()];

        dateObj = setDate(year, month, day);

        while (isUserDate(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate())) {
            ++tripLength;
            dateObj.setDate(dateObj.getDate() + 1);
        }

        --tripLength;
        let overstay = daysLeftInfo[`${dateObj.getFullYear()}/${dateObj.getMonth()}/${dateObj.getDate()}`];

        dateObj.setDate(dateObj.getDate() - 1);
        setRemoveLastDate([dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()]);
        lastDateTrip = [dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()];
        setTripInfo(
            <div className="days-info">
                <ul>
                    <li>Entry: {firstDateTrip[2]}/{firstDateTrip[1] + 1}/{firstDateTrip[0]}</li>
                    <li>Exit: {lastDateTrip[2]}/{lastDateTrip[1] + 1}/{lastDateTrip[0]}</li>
                    <li>{tripLength} day{tripLength != 1 ? "s": ""} long</li>
                    {overstay <= 0 ?
                        <li style={{color: 'red'}}>Overstayed {overstay + overstay * -2} day{overstay + overstay * -2 != 1 ? "s": ""} </li>
                    : null}
                </ul>
            </div>)

        //setTripInfo(`Length: ${tripLength} days \n${tripLength > 90 ? `Overstayed ${90 - tripLength} days` : ""}`)
    }

    const selectDate = async (year, month, day, availableDatesTracker) => {

        if (selectionState == SelectionState.userSelected) {
            setRemoveFirstDate(false);
            setRemoveLastDate(false);
            setTripInfo(<></>)
        }

        if (isUserDate(year, month, day)) {
            enableUserSelected(year, month, day, availableDatesTracker);
        } else {
            switch (selectionState) {
                case SelectionState.noneSelected:
                    setSelectionState(SelectionState.oneSelected);
                    setState1Date([year, month, day]);
                    break;

                case SelectionState.oneSelected:
                    if (setDate(year, month, day) < setDate(state1Date[0], state1Date[1], state1Date[2])) {
                        setState1Date([year, month, day]);
                    } else {
                        setSelectionState(SelectionState.twoSelected);
                        setState2Date([year, month, day]);
                    }
                    break;

                case SelectionState.twoSelected:
                case SelectionState.userSelected:
                    setSelectionState(SelectionState.oneSelected);
                    setState1Date([year, month, day]);
                    setState2Date(false);
                    break;

                default:
                    break;
            }
        }
    }

    const setNoneSelectedState = async () => {

        setState1Date(false);
        setState2Date(false);
        setRemoveFirstDate(false);
        setRemoveLastDate(false);

        setTripInfo(false);
        setSelectionState(SelectionState.noneSelected);
    }

    // When called, adds or deletes a date in the server
    const toggleDate = async (year, month, day) => {

        try {
            let response = await fetch(consts.SERVER_URL + "toggle_date", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-token": getToken()
                },

                body: JSON.stringify({
                    year: year,
                    month: parseInt(month) + 1,
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
            //calculateDaysLeft();

        } catch (e) {
            if (e.message === 'User not authorized') {
                navigate('/')
            } else if (e.message === "User not subscribed") {
                navigate('/payments')
            }
            console.log("Something went wrong toggling the date: ", e);
        }

    };



    // Adds a trip to the database
    const addDates = async () => {
        setLoading(true);
        try {
            let response = await fetch(consts.SERVER_URL + "add_dates", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-token": getToken()
                },

                body: JSON.stringify({
                    first_year: state1Date[0],
                    first_month: parseInt(state1Date[1]) + 1,
                    first_day: state1Date[2],
                    last_year: state2Date[0],
                    last_month: parseInt(state2Date[1]) + 1,
                    last_day: state2Date[2]
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

        } catch (e) {
            if (e.message === 'User not authorized') {
                navigate('/')
            } else if (e.message === "User not subscribed") {
                navigate('/payments')
            }
            console.log("Something went wrong toggling the date: ", e);
        }

        setSelectionState(SelectionState.noneSelected);
        setState1Date(false);
        setState2Date(false);
        setLoading(false);
    }

    const removeDates = async () => {
        setLoading(true);
        try {
            let response = await fetch(consts.SERVER_URL + "remove_dates", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-token": getToken()
                },

                body: JSON.stringify({
                    first_year: removeFirstDate[0],
                    first_month: parseInt(removeFirstDate[1]) + 1,
                    first_day: removeFirstDate[2],
                    last_year: removeLastDate[0],
                    last_month: parseInt(removeLastDate[1]) + 1,
                    last_day: removeLastDate[2]
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

        } catch (e) {
            if (e.message === 'User not authorized') {
                navigate('/')
            } else if (e.message === "User not subscribed") {
                navigate('/payments')
            }
            console.log("Something went wrong toggling the date: ", e);
        }

        setSelectionState(SelectionState.noneSelected);
        setRemoveFirstDate(false);
        setRemoveLastDate(false);
        setTripInfo(<></>)
        setLoading(false);
    }

    if (!user.dates) {
        return <h1>Loading</h1>;
    }

    // Check if the user is subscribed or not
    if (!user.subscribed) {
        return (
            <div id="not-subscribed">
                <h1>You are not subscribed right now</h1>
                <h2>But that can change by <Link to='https://day90.eu/subscribe'>subscribing!</Link></h2>
            </div>
        )
    }

    const deleteDatesPopup = (
        <div id="popup-container">
            <div id="popup">
                <h2>Are you sure you want to reset the calendar? This removes all the dates you have added. This cannot be undone!</h2>
                <div id='buttons-container'>
                    <button onClick={() => {
                        setLoading(true);
                        const deleteDates = async () => {

                            try {
                                let response = await fetch(consts.SERVER_URL + "clear_dates", {
                                    method: "DELETE",
                                    headers: {
                                        "x-token": getToken()
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
                        setDeleteDatesPopupShown(false);
                        setLoading(false);
                    }}>Yes</button>
                    <button onClick={() => setDeleteDatesPopupShown(false)}>No</button>
                </div>
            </div>
        </div>
    )

    console.log("Dates:", dates)

    let availableDatesTracker = 90;
    let hadFirstDay = false;
    let streakNotInCountry = 0;
    let state1DateEncountered = false;
    let state2DateEncountered = false;

    const calculateDaysInPast180 = (currentDate, allDates) => {
        let count = 0;
        const startWindow = new Date(currentDate);
        startWindow.setDate(startWindow.getDate() - 180);

        allDates.forEach(date => {
            let dateObj = setDate(date.split(" ")[3], consts.dateConversions.indexOf(date.split(" ")[2]) - 1, date.split(" ")[1]);
            if (dateObj >= startWindow && dateObj <= currentDate) {
                count++;
            }
        });

        return count;
    }


    const calculate = (year, month, day) => {

        if (state2DateEncountered) {
            --availableDatesTracker;
            state2DateEncountered = false;
        }

        if (state1Date[0] == year && state1Date[1] == month && state1Date[2] == day) {
            state1DateEncountered = true;
        }

        if (state2Date[0] == year && state2Date[1] == month && state2Date[2] == day) {
            state1DateEncountered = false;
            streakNotInCountry = 0;
            state2DateEncountered = true;
        }

        if (isUserDate(year, month, day)) {
            state1DateEncountered = false;
            hadFirstDay = true;
            streakNotInCountry = 0;

            daysLeftInfo[`${year}/${month}/${day}`] = availableDatesTracker - 1;
            return availableDatesTracker--;
        } else {
            if (state1DateEncountered) {
                daysLeftInfo[`${year}/${month}/${day}`] = availableDatesTracker - 1;
                return availableDatesTracker--;
            }
            if (++streakNotInCountry > 90) {
                availableDatesTracker = 90;
                hadFirstDay = false;
            }
        }

        daysLeftInfo[`${year}/${month}/${day}`] = availableDatesTracker;
        return availableDatesTracker;
    }

    const betacalculate = (year, month, day) => {
        const currentDate = new Date(year, month - 1, day); // Create a date object for the current day (subtract 1 for month as JS Date uses 0-based months)

        // Calculate days spent in Schengen in the past 180 days
        const daysInPast180 = calculateDaysInPast180(currentDate, user.dates); // userDates is an array of all dates the user has spent in the Schengen area

        // If they've already used 90 days in the past 180 days, no more days are available
        if (daysInPast180 >= 90) {
            availableDatesTracker = 0;
        } else {
            availableDatesTracker = 90 - daysInPast180; // Remaining days allowed
        }

        // Proceed with the rest of your existing logic
        if (state2DateEncountered) {
            --availableDatesTracker;
            state2DateEncountered = false;
        }

        if (state1Date[0] == year && state1Date[1] == month && state1Date[2] == day) {
            state1DateEncountered = true;
        }

        if (state2Date[0] == year && state2Date[1] == month && state2Date[2] == day) {
            state1DateEncountered = false;
            streakNotInCountry = 0;
            state2DateEncountered = true;
        }

        if (isUserDate(year, month, day)) {
            state1DateEncountered = false;
            hadFirstDay = true;
            streakNotInCountry = 0;

            daysLeftInfo[`${year}/${month}/${day}`] = availableDatesTracker - 1;
            return availableDatesTracker--;
        } else {
            if (state1DateEncountered) {
                daysLeftInfo[`${year}/${month}/${day}`] = availableDatesTracker - 1;
                return availableDatesTracker--;
            }
            if (++streakNotInCountry > 90) {
                availableDatesTracker = 90;
                hadFirstDay = false;
            }
        }

        daysLeftInfo[`${year}/${month}/${day}`] = availableDatesTracker;
        return availableDatesTracker;
    }

    // The display starts here

    return (
        <div
            id="planner-container"
            onClick={(e) => {
                // Check if the clicked target or any of its parents is not a "date-button"
                if (!e.target.closest(".date-button")) {
                    setNoneSelectedState();
                }
            }}
        >
            {loading ? <Loading>Updating dates</Loading> : null}
            <div id="planner-body-container">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "90vw" }}>
                    <h1>Planner</h1>
                    <div id="planner-buttons-setting-container">
                        {selectionState === SelectionState.twoSelected ? (
                            <button
                                className="toggle-popup-button"
                                style={{ backgroundColor: "#7f95ba" }}
                                onClick={() => {
                                    addDates();
                                }}
                            >
                                Add trip
                            </button>
                        ) : null}
                        {selectionState === SelectionState.userSelected ? (
                            <button
                                className="toggle-popup-button"
                                style={{ backgroundColor: "#754d4d" }}
                                onClick={() => {
                                    removeDates();
                                }}
                            >
                                Delete trip
                            </button>
                        ) : null}

                        <button
                            className="toggle-popup-button"
                            onClick={() => {
                                setDeleteDatesPopupShown(true);
                            }}
                            style={{ height: "60px" }}
                        >
                            Reset calendar
                        </button>
                    </div>
                </div>
                <span className="days-info">
                    If you are creating a new schedule, input the dates you have been to an EU country
                </span>
                <span className="days-info" style={{ fontSize: "20px" }}>
                    <b>Trip info</b>: {tripInfo ? null : "None selected"}
                </span>
                {tripInfo}
                <div id="calendar-container">
                    {dates
                        ? Object.entries(dates).map(([year, monthDates]) => (
                              <div key={year}>
                                  <h2>{year}</h2>
                                  <div className="months-container">
                                      {Object.entries(monthDates).map(([month, dates]) => (
                                          <div className="month-container" key={month}>
                                              <h3>{consts.Dates[month]}</h3>
                                              <div className="month-days-container">
                                                  {dates.map((day, i) => (
                                                      <div key={i}>
                                                          <button
                                                              className="date-button"
                                                              onClick={(e) => {
                                                                  e.stopPropagation(); // Prevent event bubbling to the parent
                                                                  selectDate(year, month, day, availableDatesTracker);
                                                              }}
                                                              style={{
                                                                  backgroundColor: (() => {
                                                                      const selectedDate = isSelectedDate(year, month, day);
                                                                      if (selectedDate) return "#7f95ba";

                                                                      const toRemoveDate = isToRemoveDate(year, month, day);
                                                                      if (toRemoveDate) return "#6aba72";

                                                                      const userDate = isUserDate(year, month, day);
                                                                      const now = isNow(year, month, day);
                                                                      if (userDate) return now ? "#bfbfbf" : "#ACACAC";
                                                                      return now ? "#d9a5a5" : "#888";
                                                                  })(),
                                                                  border: "0.5px solid black",
                                                              }}
                                                          >
                                                              {day}
                                                          </button>
                                                          <span
                                                              style={{
                                                                  position: "relative",
                                                                  left: "-5px",
                                                                  top: "-5px",
                                                                  fontSize: "0.8rem",
                                                                  color: "black",
                                                                  width: "20px",
                                                                  height: "20px",
                                                                  display: "flex",
                                                                  alignItems: "center",
                                                                  justifyContent: "center",
                                                                  backgroundColor: availableDatesTracker <= 0 ? "#d93f3f" : "#CCC",
                                                                  textAlign: "center",
                                                                  borderRadius: "50%",
                                                              }}
                                                          >
                                                              {/* {calculate(year, month, day)} */}
                                                              {Math.max(calculate(year, month, day), 0)}
                                                          </span>
                                                      </div>
                                                  ))}
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          ))
                        : null}
                </div>
            </div>
            {deleteDatesPopupShown ? deleteDatesPopup : null}
        </div>
    );

}
