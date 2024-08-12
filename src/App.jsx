import { useState, useEffect, createContext } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Get the css file
import './styles/App.css'
import './styles/About.css'
import './styles/NavBar.css'
import './styles/Form.css'
import './styles/Home.css'
import './styles/Profile.css'


import Home from './components/Home'
import About from './components/About'
import NotFound from './components/NotFound'
import SignIn from './components/SignIn'
import Register from './components/Register'
import Planner from './components/Planner'
import Payments from './components/Payments'
import consts from './consts'
import Profile from './components/Profile'

export const appContext = createContext({
  user: {},
  setUser: () => {},
})

export default function App() {
  const [user, setUser] = useState({});

  const loadUser = async () => {
    try {
      let response = await fetch(consts.SERVER_URL + "get_user", {
          credentials: "include",
          headers: {
            "x-token": localStorage.getItem('user-token')
          }
      })

      let jsonified = await response.json()
      if (!response.ok) {
          console.log(jsonified.error)
          return;
      }
      console.log("Got user:", jsonified)

      setUser(jsonified)
    } catch (e){
        throw new Error("Something went wrong retrieving the data: ", e)
    }
  }

  useEffect(()=>{
    loadUser()
  }, [])

  useEffect(()=>{
    console.log("User updated:", user)
  }, [user])

  const context = {
    user,
    setUser
  }

  return (
    <BrowserRouter>
      <appContext.Provider value={context}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/payment" element={<Payments />} />
          <Route path="/planner" element={<Planner />}/>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </appContext.Provider>
    </BrowserRouter>
  )
}
