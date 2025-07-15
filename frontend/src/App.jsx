import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Customize from './pages/Customize'
import { userDataContext } from './context/userContext'
import Home from './pages/Home'
import Customize2 from './pages/Customize2'

const App = () => {
  const {userData,setUserData}=useContext(userDataContext)
  return (
    <Routes>
      <Route path="/" element={(userData?.assistantImage && userData?.assistantName) ? <Home /> : <Navigate to={"/customize"} />} />
      <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to={"/customize"} />} />
      <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to={"/"} />} />
      <Route path="/customize" element={userData ? <Customize /> : <Navigate to={"/signup"} />} />
      <Route path="/customize2" element={userData ? <Customize2 /> : <Navigate to={"/signup"} />} />
    </Routes>
  )
}
//if no user data go to signup page
//if user data but no assistant image and name, go to customize page
//if user data with assistant image and name, go to home page
export default App