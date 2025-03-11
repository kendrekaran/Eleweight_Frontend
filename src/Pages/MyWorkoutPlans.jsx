import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from '../Components/NavBar';
import { Calendar, ChevronRight, Plus, Trash2, Edit, AlertCircle, Dumbbell, Clock, Users, Target } from 'lucide-react';
import axios from 'axios';

const MyWorkoutPlans = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchWorkoutPlans();
    }
  }, [token, navigate]);

  const fetchWorkoutPlans = async () => {
    setLoading(true);
    try {
      // Ensure token is valid
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(`${API_URL}/api/workout-plans`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setWorkoutPlans(response.data);
    } catch (error) {
      console.error('Error fetching workout plans:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        navigate("/login");
        return;
      }
      setError(error.response?.data?.message || 'Failed to load your workout plans. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async () => {
    if (!planToDelete) return;
    
    try {
      // Ensure token is valid
      if (!token) {
        setError('You must be logged in to delete a workout plan');
        setDeleteModalOpen(false);
        return;
      }

      await axios.delete(`${API_URL}/api/workout-plans/${planToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Remove the deleted plan from state
      setWorkoutPlans(workoutPlans.filter(plan => plan._id !== planToDelete));
      setDeleteModalOpen(false);
      setPlanToDelete(null);
    } catch (error) {
      console.error('Error deleting workout plan:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        navigate("/login");
        return;
      } else if (error.response?.status === 404) {
        // Plan not found, might have been deleted already
        setWorkoutPlans(workoutPlans.filter(plan => plan._id !== planToDelete));
        setDeleteModalOpen(false);
        setPlanToDelete(null);
      } else {
        setError(error.response?.data?.message || 'Failed to delete the workout plan. Please try again later.');
      }
    }
  };

  const openDeleteModal = (planId, e) => {
    e.stopPropagation();
    setPlanToDelete(planId);
    setDeleteModalOpen(true);
  };

  const navigateToCreatePlan = () => {
    navigate('/create-plan');
  };

  const getRandomGradient = () => {
    const gradients = [
      'from-blue-500 to-indigo-600',
      'from-green-500 to-teal-600',
      'from-purple-500 to-pink-600',
      'from-red-500 to-orange-600',
      'from-yellow-500 to-amber-600',
      'from-indigo-500 to-purple-600',
      'from-teal-500 to-cyan-600',
      'from-pink-500 to-rose-600'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 py-8 sm:py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">My Workout Plans</h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl opacity-90 mb-6 sm:mb-8">
              Manage your custom workout routines and track your fitness journey
            </p>
            <button
              onClick={navigateToCreatePlan}
              className="bg-white text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center text-sm sm:text-base"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              Create New Plan
            </button>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center text-sm sm:text-base">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-8 sm:py-12 md:py-16">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : workoutPlans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-md p-6 sm:p-8 md:p-12 text-center max-w-2xl mx-auto"
          >
            <div className="mb-4 sm:mb-6 flex justify-center">
              <div className="p-3 sm:p-4 bg-blue-100 rounded-full">
                <Calendar className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-blue-500" />
              </div>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2 sm:mb-3">No Workout Plans Yet</h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4 sm:mb-6 md:mb-8 max-w-md mx-auto">
              Create your first custom workout plan to start tracking your fitness journey and achieving your goals.
            </p>
            <button
              onClick={navigateToCreatePlan}
              className="px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center mx-auto text-xs sm:text-sm md:text-base"
            >
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 sm:mr-1.5 md:mr-2" />
              Create Your First Plan
            </button>
          </motion.div>
        ) : (
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Your Workout Plans</h2>
                <p className="text-xs sm:text-sm md:text-base text-gray-600">You have {workoutPlans.length} custom workout {workoutPlans.length === 1 ? 'plan' : 'plans'}</p>
              </div>
              <button
                onClick={navigateToCreatePlan}
                className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs sm:text-sm md:text-base"
              >
                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 sm:mr-1.5 md:mr-2" />
                Create New Plan
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              <AnimatePresence>
                {workoutPlans.map((plan, index) => (
                  <motion.div
                    key={plan._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    onClick={() => navigate(`/workout-plan/${plan._id}`)}
                  >
                    <div className={`h-1.5 sm:h-2 md:h-3 bg-gradient-to-r ${getRandomGradient()}`}></div>
                    <div className="p-3 sm:p-4 md:p-6">
                      <div className="flex justify-between items-start mb-2 sm:mb-3 md:mb-4">
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{plan.name}</h3>
                        <div className="flex space-x-1 sm:space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/edit-plan/${plan._id}`);
                            }}
                            className="p-1 sm:p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                            aria-label="Edit plan"
                          >
                            <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                          </button>
                          <button
                            onClick={(e) => openDeleteModal(plan._id, e)}
                            className="p-1 sm:p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                            aria-label="Delete plan"
                          >
                            <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {plan.description && (
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 md:mb-4 line-clamp-2">{plan.description}</p>
                      )}
                      
                      <div className="flex items-center mb-2 sm:mb-3 md:mb-4 text-gray-500 text-xs sm:text-sm">
                        <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 mr-1 sm:mr-1.5 md:mr-2" />
                        <span>{plan.days.length} {plan.days.length === 1 ? 'day' : 'days'} workout</span>
                        <span className="mx-1 sm:mx-1.5 md:mx-2">•</span>
                        <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 mr-1 sm:mr-1.5 md:mr-2" />
                        <span>{plan.days.reduce((total, day) => total + day.exercises.length, 0)} exercises</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 mb-2 sm:mb-3 md:mb-4">
                        {plan.days.map((day, index) => (
                          <span key={index} className="px-1 sm:px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md">
                            {day.name}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 sm:pt-2.5 md:pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                          Created: {new Date(plan.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex items-center text-blue-500 group-hover:text-blue-700 transition-colors">
                          <span className="text-xs sm:text-sm font-medium">View details</span>
                          <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 ml-0.5 sm:ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
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
              className="bg-white rounded-xl shadow-xl w-full max-w-md p-4 sm:p-5 md:p-6"
            >
              <div className="flex items-center mb-3 sm:mb-4 text-red-500">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-1.5 sm:mr-2" />
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">Delete Workout Plan</h3>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4 sm:mb-5 md:mb-6">
                Are you sure you want to delete this workout plan? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2 sm:space-x-3 md:space-x-4">
                <button
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setPlanToDelete(null);
                  }}
                  className="px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 border border-gray-300 text-gray-700 text-xs sm:text-sm md:text-base rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePlan}
                  className="px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-red-500 text-white text-xs sm:text-sm md:text-base rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyWorkoutPlans; 