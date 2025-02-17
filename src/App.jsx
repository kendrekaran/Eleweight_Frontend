import React from 'react'
import Register from './Logins/Register'
import SignIn from './Logins/SignIn'
import { Route , Routes } from 'react-router-dom'
import Home from './Components/Home'
import Profile from './Pages/Profile'
import BrowseExercise from './Pages/BrowseExercise'
import MuscleExercises from './Components/Muscles'
import Plans from './Pages/Plans'
import DietPlans from './Pages/DietPlans'
import { LoadingProvider } from './Loaders/LoadingContext'
import WorkoutPlan from './Exercises/WorkoutPlan'

const App = () => {

  return (
    <div>
    <LoadingProvider>
      <Routes>
        <Route path="/" element={<SignIn/>} ></Route>
        <Route path="/register" element={<Register/>} ></Route>
        <Route path="/login" element={<SignIn/>} ></Route>
        <Route path="/home" element={<Home/>} ></Route>
        <Route path="/profile" element={<Profile/>} ></Route>
        <Route path="/muscle" element={<BrowseExercise/>} ></Route>
        <Route path="/diet" element={<DietPlans/>} ></Route>
        <Route path="/muscle/:muscle" element={<MuscleExercises/>} ></Route>
        <Route path="/plans" element={<Plans />} />
        <Route path="/plans/:plan" element={<WorkoutPlan />} />
      </Routes>
    </LoadingProvider>
    </div>
  )
}

export default App
