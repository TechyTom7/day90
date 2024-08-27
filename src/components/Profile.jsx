import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { appContext } from "../App"
import consts from "../consts"
import NavBar from "./NavBar"

export default function Profile(props) {

    const { user, setUser } = useContext(appContext)
    const [ popupShowed, setPopupShowed ] = useState(false)

    const navigate = useNavigate()

    const signOutPopup = (
        <div id="signOutPopup-container">
            <div id="signOutPopup">
                <h2>Are you sure you want to sign out?</h2>
                <div id='buttons-container'>
                    <button onClick={() => {
                        localStorage.removeItem('user-token');
                        setUser({});
                        navigate('/');
                    }}>Yes</button>
                    <button onClick={() => setPopupShowed(false)}>No</button>
                </div>
            </div>
        </div>
    )

    return (
        <div id='profile-container'>
            <div id="profile-inner-container">
                <h1>Profile</h1>
                <table>
                    <tbody>
                        <tr>
                            <td>Name</td>
                            <td>{user.name}</td>
                        </tr>
                        <tr>
                            <td>Email</td>
                            <td>{user.email}</td>
                        </tr>
                        { user.payment_dates && user.payment_dates.length > 0 ?
                            <tr>
                                <td>First payment date</td>
                                <td>{[user.payment_dates[0].split(' ')[1],
                                      consts.dateConversions.indexOf(user.payment_dates[0].split(' ')[2]) + 1,
                                      user.payment_dates[0].split(' ')[3]].join('/')}</td>
                            </tr>
                            : null
                        }
                    </tbody>
                </table>
                <button onClick={() => {setPopupShowed(true)}} id="toggle-popup-button">Sign out</button>
            </div>
            {popupShowed && signOutPopup}
        </div>
    )
}
