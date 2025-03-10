import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from '../Components/NavBar';
import { exercises } from '../exercises.json';
import { Plus, Trash2, Save, X, Edit, Calendar, ChevronRight, ChevronDown, ChevronUp, Search, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const EditPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [days, setDays] = useState([{ name: 'Day 1', exercises: [] }]);
  const [activeDay, setActiveDay] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [allExercises, setAllExercises] = useState([]);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchWorkoutPlan();
    }
  }, [token, navigate, id]);

  useEffect(() => {
    // Flatten the exercises object into an array
    const exerciseArray = [];
    Object.entries(exercises).forEach(([muscleGroup, exerciseList]) => {
      exerciseList.forEach(exercise => {
        exerciseArray.push({
          ...exercise,
          muscleGroup
        });
      });
    });
    setAllExercises(exerciseArray);
  }, []);

  const fetchWorkoutPlan = async () => {
    setIsLoading(true);
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
      
      const plan = response.data;
      setPlanName(plan.name);
      setPlanDescription(plan.description || '');
      setDays(plan.days);
      
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
      setIsLoading(false);
    }
  };

  const muscleGroups = Object.keys(exercises);

  const filteredExercises = allExercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscle = selectedMuscle ? exercise.muscleGroup === selectedMuscle : true;
    return matchesSearch && matchesMuscle;
  });

  const addDay = () => {
    setDays([...days, { name: `Day ${days.length + 1}`, exercises: [] }]);
    setActiveDay(days.length);
  };

  const removeDay = (index) => {
    if (days.length > 1) {
      const newDays = days.filter((_, i) => i !== index);
      setDays(newDays);
      if (activeDay >= index && activeDay > 0) {
        setActiveDay(activeDay - 1);
      }
    }
  };

  const addExerciseToDay = (exercise) => {
    const newExercise = {
      ...exercise,
      sets: 3,
      reps: 10
    };
    
    const newDays = [...days];
    newDays[activeDay].exercises.push(newExercise);
    setDays(newDays);
  };

  const removeExerciseFromDay = (dayIndex, exerciseIndex) => {
    const newDays = [...days];
    newDays[dayIndex].exercises.splice(exerciseIndex, 1);
    setDays(newDays);
  };

  const updateExerciseDetails = (dayIndex, exerciseIndex, field, value) => {
    const newDays = [...days];
    newDays[dayIndex].exercises[exerciseIndex][field] = value;
    setDays(newDays);
  };

  const updateDayName = (index, name) => {
    const newDays = [...days];
    newDays[index].name = name;
    setDays(newDays);
  };

  const updatePlan = async () => {
    if (!planName.trim()) {
      setError('Please enter a plan name');
      return;
    }

    if (days.some(day => day.exercises.length === 0)) {
      setError('Each day must have at least one exercise');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      // Ensure token is valid
      if (!token) {
        setError('You must be logged in to update a workout plan');
        setIsSaving(false);
        return;
      }

      const response = await axios.put(
        `${API_URL}/api/workout-plans/${id}`,
        {
          name: planName,
          description: planDescription,
          days
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess('Workout plan updated successfully!');
      setTimeout(() => {
        navigate('/my-plans');
      }, 2000);
    } catch (error) {
      console.error('Error updating workout plan:', error);
      if (error.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = error.response.data.errors;
        const errorMessage = Object.values(validationErrors).join(', ');
        setError(`Validation error: ${errorMessage}`);
      } else {
        setError(error.response?.data?.message || 'Failed to update workout plan');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/my-plans')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span>Back to My Plans</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Workout Plan</h1>
          <p className="text-gray-600">Update your custom workout routine</p>
        </motion.div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {success}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="planName" className="block text-sm font-medium text-gray-700 mb-1">
                Plan Name
              </label>
              <input
                type="text"
                id="planName"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="My Custom Plan"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="planDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <input
                type="text"
                id="planDescription"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="A brief description of your plan"
                value={planDescription}
                onChange={(e) => setPlanDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Workout Days</h2>
            <button
              onClick={addDay}
              className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Day
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {days.map((day, index) => (
              <div
                key={index}
                className={`relative group ${
                  activeDay === index
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                } rounded-lg px-4 py-2 cursor-pointer transition-colors`}
              >
                <div className="flex items-center" onClick={() => setActiveDay(index)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{day.name}</span>
                </div>
                {days.length > 1 && (
                  <button
                    onClick={() => removeDay(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  type="text"
                  value={days[activeDay].name}
                  onChange={(e) => updateDayName(activeDay, e.target.value)}
                  className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                />
                <span className="ml-2 text-gray-500">({days[activeDay].exercises.length} exercises)</span>
              </div>
              <button
                onClick={() => setIsExerciseModalOpen(true)}
                className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Exercise
              </button>
            </div>

            {days[activeDay].exercises.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500">No exercises added to this day yet.</p>
                <button
                  onClick={() => setIsExerciseModalOpen(true)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add your first exercise
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {days[activeDay].exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                      <div className="flex items-center mb-2 sm:mb-0">
                        <img
                          src={exercise.gif_url}
                          alt={exercise.name}
                          className="w-12 h-12 object-cover rounded-md mr-4"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{exercise.name}</h3>
                          <span className="text-sm text-gray-500">{exercise.muscle}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeExerciseFromDay(activeDay, index)}
                        className="self-end sm:self-center text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sets
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={exercise.sets}
                          onChange={(e) => updateExerciseDetails(activeDay, index, 'sets', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reps
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={exercise.reps}
                          onChange={(e) => updateExerciseDetails(activeDay, index, 'reps', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={updatePlan}
              disabled={isSaving}
              className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            >
              {isSaving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Update Plan
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Exercise Selection Modal */}
      {isExerciseModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Add Exercises</h2>
                <button
                  onClick={() => setIsExerciseModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search exercises..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center justify-between w-full md:w-48 px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <div className="flex items-center">
                      <span>{selectedMuscle || 'Filter by muscle'}</span>
                    </div>
                    {isFilterOpen ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  
                  {isFilterOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setSelectedMuscle('');
                            setIsFilterOpen(false);
                          }}
                          className="flex items-center w-full px-3 py-2 text-left rounded-md hover:bg-gray-100"
                        >
                          <span>All muscles</span>
                        </button>
                        {muscleGroups.map((muscle) => (
                          <button
                            key={muscle}
                            onClick={() => {
                              setSelectedMuscle(muscle);
                              setIsFilterOpen(false);
                            }}
                            className="flex items-center w-full px-3 py-2 text-left rounded-md hover:bg-gray-100"
                          >
                            <span>{muscle.charAt(0).toUpperCase() + muscle.slice(1)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[60vh] p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => {
                      addExerciseToDay(exercise);
                      setIsExerciseModalOpen(false);
                    }}
                  >
                    <div className="flex items-center mb-2">
                      <img
                        src={exercise.gif_url}
                        alt={exercise.name}
                        className="w-12 h-12 object-cover rounded-md mr-3"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{exercise.name}</h3>
                        <span className="text-sm text-gray-500">{exercise.muscle}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{exercise.description1}</p>
                  </div>
                ))}
              </div>

              {filteredExercises.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No exercises found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedMuscle('');
                    }}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsExerciseModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors mr-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPlan; 