import { useState, useEffect, createContext } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
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
import Loading from './components/Loading'
import NavBar from './components/NavBar'

export const appContext = createContext({
  user: {},
  setUser: () => {},
  loadUser: async () => {}
})

export default function App() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState("")
  const location = useLocation()

  const loadUser = async () => {
    setLoading(true)
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

      } else {
          console.log("Got user:", jsonified)
          setUser(jsonified)
      }
    } catch (e){
        throw new Error("Something went wrong retrieving the data: ", e)
    }
    setLoading(false)
  }

  useEffect(()=>{
    loadUser()
    setCurrentPage(window.location.pathname)
  }, [])

  useEffect(()=>{
    console.log("User updated:", user)
  }, [user])

  useEffect(()=>{
    setCurrentPage(window.location.pathname)
  }, [location])

  const context = {
    user,
    setUser,
    loadUser
  }

  // if (loading) {
  //   return <Loading>Setting up page</Loading>
  // }

  return (
    <appContext.Provider value={context}>
      {!(['/sign-in','/register']).includes(location.pathname) && (
        <NavBar current={currentPage} />
      )}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/payment" element={<Payments />} />
          <Route path="/planner" element={<Planner />}/>
          <Route path="/payments" element={<Payments/>}/>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </appContext.Provider>
  )
}
