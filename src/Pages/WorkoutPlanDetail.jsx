import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from '../Components/NavBar';
import { Calendar, ChevronLeft, ChevronRight, Clock, Dumbbell, ArrowLeft, Info, Edit, Share, Download, X } from 'lucide-react';
import axios from 'axios';

const WorkoutPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeDay, setActiveDay] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchWorkoutPlan();
    }
  }, [token, navigate, id]);

  const fetchWorkoutPlan = async () => {
    setLoading(true);
    try {
      // Ensure token is valid
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(`${API_URL}/api/workout-plans/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPlan(response.data);
    } catch (error) {
      console.error('Error fetching workout plan:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        navigate("/login");
        return;
      } else if (error.response?.status === 404) {
        setError('Workout plan not found.');
      } else {
        setError(error.response?.data?.message || 'Failed to load the workout plan. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousDay = () => {
    if (activeDay > 0) {
      setActiveDay(activeDay - 1);
    }
  };

  const handleNextDay = () => {
    if (plan && activeDay < plan.days.length - 1) {
      setActiveDay(activeDay + 1);
    }
  };

  const getTotalExercises = () => {
    if (!plan) return 0;
    return plan.days.reduce((total, day) => total + day.exercises.length, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
          <button
            onClick={() => navigate('/my-plans')}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to My Plans
          </button>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-md mb-4">
            Workout plan not found.
          </div>
          <button
            onClick={() => navigate('/my-plans')}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to My Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 py-8 sm:py-12 relative z-10">
          <div className="mb-4">
            <button
              onClick={() => navigate('/my-plans')}
              className="flex items-center text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 h-4 sm:h-5 sm:w-5 mr-1" />
              <span className="text-sm sm:text-base">Back to My Plans</span>
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">{plan.name}</h1>
            {plan.description && (
              <p className="text-base sm:text-xl opacity-90 mb-4 sm:mb-6 max-w-3xl">{plan.description}</p>
            )}

            <div className="flex flex-wrap gap-2 sm:gap-4 items-center mt-4 sm:mt-6">
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                <span>{plan.days.length} {plan.days.length === 1 ? 'Day' : 'Days'}</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base">
                <Dumbbell className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                <span>{getTotalExercises()} Exercises</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                <span>Created {new Date(plan.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6 sm:mt-8">
              <button
                onClick={() => navigate(`/edit-plan/${plan._id}`)}
                className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm sm:text-base"
              >
                <Edit className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                Edit Plan
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
              <div className="flex items-center">
                <div className="p-1.5 sm:p-2 rounded-lg bg-blue-100 mr-2 sm:mr-3">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  {plan.days[activeDay].name}
                </h2>
              </div>
              <div className="flex items-center justify-between sm:justify-end space-x-2">
                <button
                  onClick={handlePreviousDay}
                  disabled={activeDay === 0}
                  className={`p-1.5 sm:p-2 rounded-full ${
                    activeDay === 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <span className="text-xs sm:text-sm text-gray-500">
                  Day {activeDay + 1} of {plan.days.length}
                </span>
                <button
                  onClick={handleNextDay}
                  disabled={activeDay === plan.days.length - 1}
                  className={`p-1.5 sm:p-2 rounded-full ${
                    activeDay === plan.days.length - 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {plan.days[activeDay].exercises.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Dumbbell className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm sm:text-base">No exercises for this day.</p>
                <button
                  onClick={() => navigate(`/edit-plan/${plan._id}`)}
                  className="mt-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white text-sm sm:text-base rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add exercises
                </button>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {plan.days[activeDay].exercises.map((exercise, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer group"
                    onClick={() => setSelectedExercise(exercise)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-4">
                        <img
                          src={exercise.gif_url}
                          alt={exercise.name}
                          className="w-16 h-16 object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{exercise.name}</h3>
                        <p className="text-sm text-gray-500">{exercise.muscle}</p>
                        <div className="flex items-center mt-2 space-x-4">
                          <div className="flex items-center text-gray-700">
                            <Dumbbell className="h-4 w-4 mr-1 text-blue-500" />
                            <span>{exercise.sets} sets</span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <Clock className="h-4 w-4 mr-1 text-blue-500" />
                            <span>{exercise.reps} reps</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <Info className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">All Days</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {plan.days.map((day, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-sm p-4 border-l-4 cursor-pointer transition-all duration-200 ${
                activeDay === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
              }`}
              onClick={() => setActiveDay(index)}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-900">{day.name}</h4>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {day.exercises.length} {day.exercises.length === 1 ? 'exercise' : 'exercises'}
                </span>
              </div>
              {day.exercises.length > 0 && (
                <div className="text-sm text-gray-500">
                  {day.exercises.slice(0, 3).map((exercise, i) => (
                    <div key={i} className="flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      <span className="truncate">{exercise.name}</span>
                    </div>
                  ))}
                  {day.exercises.length > 3 && (
                    <div className="text-xs text-blue-500 mt-1">
                      +{day.exercises.length - 3} more exercises
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Exercise Detail Modal */}
      <AnimatePresence>
        {selectedExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              <div className="relative">
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-gray-100 transition-all duration-200"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>

                <div className="flex flex-col lg:flex-row">
                  <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-50 to-sky-50 p-8 flex items-center justify-center">
                    <div className="relative">
                      <img
                        src={selectedExercise.gif_url}
                        className="max-w-full max-h-[50vh] object-contain rounded-xl shadow-lg"
                        alt={selectedExercise.name}
                      />
                    </div>
                  </div>

                  <div className="w-full lg:w-1/2 p-8">
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-blue-100">
                            <Dumbbell className="w-5 h-5 text-blue-600" />
                          </div>
                          <h2 className="text-2xl font-bold text-gray-900">{selectedExercise.name}</h2>
                        </div>
                        <p className="text-gray-600">{selectedExercise.muscle}</p>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <div className="bg-blue-50 px-4 py-2 rounded-lg">
                          <div className="text-sm text-gray-500">Sets</div>
                          <div className="text-xl font-semibold text-blue-600">{selectedExercise.sets}</div>
                        </div>
                        <div className="bg-blue-50 px-4 py-2 rounded-lg">
                          <div className="text-sm text-gray-500">Reps</div>
                          <div className="text-xl font-semibold text-blue-600">{selectedExercise.reps}</div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Instructions</h3>
                        <div className="space-y-2">
                          <p className="text-gray-600">{selectedExercise.description1}</p>
                          <p className="text-gray-600">{selectedExercise.description2}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkoutPlanDetail; 