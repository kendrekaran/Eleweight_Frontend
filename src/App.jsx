import React from 'react'
import Register from './Logins/Register'
import SignIn from './Logins/SignIn'
import { Route , Routes } from 'react-router-dom'
import Home from './Components/Home'
import BrowseExercise from './Pages/BrowseExercise'
import MuscleExercises from './Components/Muscles'
import Plans from './Pages/Plans'
import DietPlans from './Pages/DietPlans'
import { LoadingProvider } from './Loaders/LoadingContext'
import WorkoutPlan from './Exercises/WorkoutPlan'
import AllExercises from './Pages/AllExercises'
import CustomPlan from './Pages/CustomPlan'
import MyWorkoutPlans from './Pages/MyWorkoutPlans'
import WorkoutPlanDetail from './Pages/WorkoutPlanDetail'
import EditPlan from './Pages/EditPlan'
import NearbyGymsPage from './Pages/NearbyGymsPage'
import FoodAnalysis from './Pages/FoodAnalysis'
import AITrainerChatbot from './Components/AITrainerChatbot'

const App = () => {

  return (
    <div>
    <LoadingProvider>
      <Routes>
        <Route path="/" element={<SignIn/>} ></Route>
        <Route path="/register" element={<Register/>} ></Route>
        <Route path="/login" element={<SignIn/>} ></Route>
        <Route path="/home" element={<Home/>} ></Route>
        <Route path="/muscle" element={<BrowseExercise/>} ></Route>
        <Route path="/diet" element={<DietPlans/>} ></Route>
        <Route path="/muscle/:muscle" element={<MuscleExercises/>} ></Route>
        <Route path="/plans" element={<Plans />} />
        <Route path="/plans/:plan" element={<WorkoutPlan />} />
        <Route path="/exercises" element={<AllExercises />} />
        <Route path="/create-plan" element={<CustomPlan />} />
        <Route path="/my-plans" element={<MyWorkoutPlans />} />
        <Route path="/workout-plan/:id" element={<WorkoutPlanDetail />} />
        <Route path="/edit-plan/:id" element={<EditPlan />} />
        <Route path="/nearby-gyms" element={<NearbyGymsPage />} />
        <Route path="/food-analysis" element={<FoodAnalysis />} />
      </Routes>
      <AITrainerChatbot />
    </LoadingProvider>
    </div>
  )
}

export default App
